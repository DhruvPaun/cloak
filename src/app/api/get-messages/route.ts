import { dbConnection } from "@/lib/dbConnect";
import mongoose from "mongoose";
import { userGetter } from "@/lib/userGetter";
import { User } from "@/models/User";
export async function GET(request : Request) {
    try {
    await dbConnection()
    const user=await userGetter()
    if(!user)
    {
        return Response.json({
            message:"Invalid User",
            success:false
        })
    }
    console.log(user);
    
    const userID=new mongoose.Types.ObjectId(user._id);
    const userMessages=await User.aggregate([
        {$match:{_id:userID}},
        {$unwind:"$messages"},
        {$sort:{"messages.createdAt":-1}},
        {$group:{_id:"$_id",messages:{$push:"$messages"}}},
    ]).exec();
    console.log(userMessages[0].messages);
    if(!userMessages || userMessages.length===0)
    {
        return Response.json({
            message:"No messages found",
            success:false,
        })
    }
    console.log(userMessages[0].messages);
    
    return Response.json({
        message:userMessages[0].messages,
        status:200
    })
    } catch (error) {
        return Response.json({
            message:"Error occured",
            success:false
        },{status:500})
    }
}