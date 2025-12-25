import { z } from 'zod'

export const signUpValidations = z.object({
  username: z
    .string({ message: 'Username must be a string' })
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters'),

  email: z
    .string()
    .email('Email must be valid'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must not exceed 20 characters'),
})

export type SignUpSchema = z.infer<typeof signUpValidations>
