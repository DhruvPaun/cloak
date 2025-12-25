import mongoose,{Schema,Document, Mongoose} from "mongoose";

export interface IUser extends Document{
    username:string;
    email:string;
    password:string;
    isVerified:Boolean;
    verificationCode:string;
    verificationCodeExpiry:Date;
    isAcceptingMessages:Boolean;
    messages:[];
}
const MessageSchema:Schema<Messages>=new Schema({
    messages:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const UserSchema : Schema<IUser>=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationCode:{
        type:String,
    },
    verificationCodeExpiry:{
        type:Date,
        default:Date.now()
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
})
export interface Messages extends Document{
    messages:string,
    createdAt:Date
}

export const User=(mongoose.models.User)||(mongoose.model("User",UserSchema))