import { User } from "@/models/User"
import { userVerification } from "@/schemas/userVerification"
export async function POST(request:Request)
{
    try {
    const {username,otp}=await request.json()
    const result=userVerification.safeParse(otp)
    if(!result.success)
    {
        return Response.json({
            message:result.error.issues[0]?.message || "invalid otp",
            success:false
        })
    }
    const user=await User.findOne({username})
    console.log(user.verificationCode);
    console.log(result.data.otp)
    if(user.verificationCode!=result.data.otp)
    {
        return Response.json({
            message:"OTP is not correct",
            success:false
        })
    }
    const isOTPNotExpired=new Date(user.verificationCodeExpiry)>new Date()
    if(!isOTPNotExpired)
    {
        return Response.json({
            message:"OTP Expired",
            success:false
        })
    }
    user.verificationCodeExpiry=null
    user.verificationCode=null
    user.isVerified=true
    await user.save()
    return Response.json({
        message:"User Verified Successfully",
        status:true
    })
    } catch (error) {
      return Response.json({
        message:"Error Occured",
        status:false
    })  
    }
}