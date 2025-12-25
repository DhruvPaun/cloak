import {z} from "zod"

export const userVerification=z.object({
    otp:z.string().length(6,"Code should be equal to 6 characters only")
})
