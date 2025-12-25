import { userGetter } from "@/lib/userGetter"
import { User } from "@/models/User"
import axios from "axios"
import mongoose from "mongoose";

export async function DELETE(req:Request,{params}:{params:Promise<{messageID:string}>})
{
    const user=await userGetter()
    
    if(!user)
    {
        return Response.json({
            message:"Unauthenticated User",
            success:false
        })
    }
    const userData=user
    try {
        const {messageID}=await params
        
        const messageToDelete=await User.updateOne({_id:userData._id},{
            $pull:{messages:{_id:new mongoose.Types.ObjectId(messageID)}}
        })  
        
        if(messageToDelete.modifiedCount===0)
        {
            return Response.json({
                message:"Could not delete message",
                success:false
            })
        }
        return Response.json({
            message:"Message deleted successfully",
            success:true
        })
    } catch (error) {
        return Response.json({
            message:"Error occured in deleting message",
            success:false
        })
    }
    
}