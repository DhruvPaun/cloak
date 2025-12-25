import {z} from "zod"

export const signInValidation=z.object({
    email:z.email({message:"email should be a valid"}),
    password:z.string()
    .min(8,"Password should at least contains 8 characters")
    .max(20,"Password should not exceed 20 characters"),
})