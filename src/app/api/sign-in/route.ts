import { dbConnection } from "@/lib/dbConnect"
import { User } from "@/models/User"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { SignJWT } from "jose"

export async function POST(req: Request) {
    await dbConnection()
    const { email, password } = await req.json()
    
    try {
        const user = await User.findOne({ email })
        
        // 1. Safety check: does user exist?
        if (!user) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 })
        }

        // 2. Password check
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return NextResponse.json({
                message: "Invalid Password",
                success: false
            }, { status: 401 })
        }

        // 3. Verification check
        if (!user.isVerified) {
            return NextResponse.json({
                message: "Please verify your email",
                success: false
            }, { status: 403 })
        }

        const secretStr = process.env.JWT_SECRET
        if (!secretStr) throw new Error("JWT_SECRET is not defined")

        // 4. SIGNING WITH JOSE
        const secret = new TextEncoder().encode(secretStr)
        const token = await new SignJWT({ _id: user._id.toString(), email: user.email })
            .setProtectedHeader({ alg: "HS256" }) // Standard algorithm
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(secret)

        const response = NextResponse.json({
            message: "Sign in successful",
            success: true
        })

        // 5. Setting the cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in prod
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        return response
    } catch (error) {
        console.error("Login Error:", error)
        return NextResponse.json({
            message: "Internal server error",
            success: false
        }, { status: 500 })
    }
}