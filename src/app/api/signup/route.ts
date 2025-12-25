import { dbConnection } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { sendEmail } from "@/helper/emailVerification";
import bcrypt from "bcrypt"
import crypto from "crypto"
export async function POST(request: Request) {
    try {
        const verificationCode = crypto.randomInt(100000, 999999).toString()
        await dbConnection()
        const { username, email, password } = await request.json()
        //Check if user exist
        const foundedUser = await User.findOne({ email })
        if (foundedUser) {
            //user is verifed already
            if (foundedUser.isVerified) {
                return Response.json({
                    message: "User Already Exist Please Login"
                }, {
                    status: 409
                })
            }
            //if user exist but is not verified
            await sendEmail(foundedUser.email, foundedUser.username, verificationCode)
            foundedUser.verificationCode=verificationCode
            foundedUser.verificationCodeExpiry=new Date(Date.now()+600000)
            await foundedUser.save()
            return Response.json({
                message: "Email sended successfully"
            }, {
                status: 200
            })
        }
        //if user is not verified
        //register the new user
        const hashedPassword=await bcrypt.hash(password,10)
        const user=await new User({
            username,email,password:hashedPassword
        })
        await sendEmail(email,username,verificationCode)
        user.verificationCode=verificationCode
        user.verificationCodeExpiry=new Date(Date.now()+600000)
        await user.save()
        return Response.json({
            message: "Email Send Success"
        }, {
            status: 200
        })
    } catch (error) {
        console.log("Error occured in Server",error);
        return Response.json({
            message: "Internal Server error"
        }, {
            status: 500
        })
    }
}