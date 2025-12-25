import { User } from "@/models/User";
import { dbConnection } from "@/lib/dbConnect";
import { signUpValidations } from "@/schemas/signUpValidation";
export async function GET(request:Request)
{
    try{
    const usernameSchema=signUpValidations.shape.username
    const {searchParams}=new URL(request.url)
    const queryparams = searchParams.get("username")
    const result=usernameSchema.safeParse(queryparams)
    if(!result.success)
    {
        const usernameError=result.error.issues[0]?.message || "Username is not valid"
        return Response.json({
            success:false,
            message:usernameError
        },{status:400})
    }
    await dbConnection()
    const username=result.data
    const user=await User.findOne({
        username,isVerified:true
    })
    if(user)
    {
        return Response.json({
            message:"Username already taken",
            success:false
        })
    }
    return Response.json({
        message:"Username is Available",
        success:true
    },{status:200})
}
catch(error){
    console.log(error);
    return Response.json({
        message:"Error occured",
        success:false
    },{status:500})
}
}