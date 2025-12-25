import { User } from "@/models/User"
import { dbConnection } from "@/lib/dbConnect"

export async function POST(request:Request)
{
    try {
        await dbConnection()
        const {id,content}=await request.json()
        const getUser=await User.findOne({_id:id})
        console.log(getUser);
        
        if(!getUser)
        {
            return Response.json({
                message:"Could not find user",
                success:false
            })
        }
        if(!getUser.isAcceptingMessages)
        {
            return Response.json({
                message:"User is not accepting messages",
                success:false
            })
        }
        const newMessage={messages:content,createdAt:new Date()}
        getUser.messages.push(newMessage)
        await getUser.save()
        return Response.json({
            message:"Message Sended successfully",
            success:true
        })
    } catch (error) {
        console.log(error);
        
        return Response.json({
            message:"could not Send message",
            success:true
        })
    }
}