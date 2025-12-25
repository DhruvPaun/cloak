import { dbConnection } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "@/models/User";
import { userGetter } from "@/lib/userGetter";

export async function POST(request: Request) {
    try {
    await dbConnection()
    const user=await userGetter()
    if (!user) {
        return Response.json({
            message: "Not authenticated",
            success: false
        }, { status: 401 })
    }
    const userId = user._id
    const { acceptMessages } = await request.json()
    const foundUser = await User.findByIdAndUpdate(userId, {
        isAcceptingMessages: acceptMessages,
    })
    console.log(foundUser.isAcceptingMessages);
    
    if (!foundUser) {
        return Response.json({
            message: "Unable to find user",
            success: false
        })
    }
    return Response.json({
        message: "Status updated successfully",
        success: true
    })      
    } catch (error) {
        console.log("Error occured",error);
        return Response.json({
            message:"Server Error",
            success:false
        })
    }
}
export async function GET(request:Request)
{
    try{
    const user=await userGetter()
    if(!user)
    {
        return Response.json({
            message:"User is not authenticated",
            success:false
        })
    }
    const userId=user?._id
    const foundUser=await User.findById(userId)
    if(!foundUser)
    {
        return Response.json({
            message:"Could not find the user",
            success:false
        })
    }
    return Response.json({
        success:true,
        isAcceptingMessages:foundUser.isAcceptingMessages
    })
    }catch(error)
    {
        console.log("Error occured");
        return Response.json({
            message:"Server Error",
            success:false
        })
    }
}