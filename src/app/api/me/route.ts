import { userGetter } from "@/lib/userGetter";
import { NextResponse } from "next/server";

export async function GET() {
    try {
    const user=await userGetter()
    if(!user)
    {
        return NextResponse.json({
            user:null
        })
    }
    return NextResponse.json({
        user:user
    })
    } catch (error) {
        
    }
}