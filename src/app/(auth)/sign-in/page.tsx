'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, toast as useToast } from 'sonner';
import {signInValidation as signInSchema } from '@/schemas/signInValidation';
import axios, { AxiosError } from 'axios';
import { apiResponse } from '@/types/apiResponse';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await axios.post("/api/sign-in",data,{withCredentials:true})
      
      if(!result.data.success)
      {
        toast.error(result.data.message)
      }else{
        toast.success(result.data.message)
        router.replace("/dashboard")
      }
    } catch (error) {
      const axiosError=error as AxiosError<apiResponse>
      toast.error(axiosError.response?.data.message)
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="w-full max-w-sm rounded-2xl bg-[#12151B] p-6 space-y-6">

      {/* Title */}
      <h1 className="text-title text-center">
        Sign in
      </h1>

      {/* Subtitle */}
      <p className="text-meta text-center">
        Welcome back. Please enter your details.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-meta">
                  Email
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    {...field}
                    className="rounded-xl bg-[#1A1D23] border-none
                               text-white placeholder-white/40
                               focus:ring-2 focus:ring-[#5B8CFF]/40"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-meta">
                  Password
                </FormLabel>

                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="rounded-xl bg-[#1A1D23] border-none
                               text-white placeholder-white/40
                               focus:ring-2 focus:ring-[#5B8CFF]/40"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Button */}
          <Button
            type="submit"
            className="w-full rounded-xl bg-[#5B8CFF] py-3
                       font-medium text-white
                       hover:bg-[#4A7AFF]
                       active:scale-[0.98]"
          >
            {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <p className="text-meta text-center">
        Don’t have an account?{" "}
        <Link href={"/sign-up"} className="text-[#5B8CFF] cursor-pointer">
          Sign up
        </Link>
      </p>
    </div>
  </div>
)
}