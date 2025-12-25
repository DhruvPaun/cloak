import {z} from "zod"

export const messageValidation=z.object({
    message: z.string({message:"Please enter valid message"}).min(10,{message:"Message should be greater then 10 characters"}).max(300,{message:"Message length should not exceed more then 300 characters"})
})