"use server"
import { JWTPayload, jwtVerify } from "jose"
import { cookies } from "next/headers"
export interface jwtPayload extends JWTPayload{
        _id:string
        email:string,
    }
export const userGetter=async()=>{
    const token=(await cookies()).get("token")?.value || ""
    const secret=new TextEncoder().encode(process.env.JWT_SECRET)
    try {
        const {payload}=await jwtVerify(token,secret)
        return payload as jwtPayload
    } catch (error) {
        return null
    }
}
export const logOutUser=async ()=>{
    try {
        const allCookie=await cookies()
        allCookie.delete("token")
    } catch (error) {
        console.log(error);
    }
}