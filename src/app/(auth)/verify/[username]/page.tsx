"use client";
import { userVerification } from "@/schemas/userVerification";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import z from "zod";
import axios, { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiResponse } from "@/types/apiResponse";
function page() {
  const form = useForm<z.infer<typeof userVerification>>({
    resolver: zodResolver(userVerification),
    defaultValues:{
        otp:""
    }
  });
  const router = useRouter();
  const urlParams = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const username = urlParams.username as string;
  const onSubmit = async (data: z.infer<typeof userVerification>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/verifyEmail`, {
        username,
        otp: data,
      });
      
      if(!response.data.status)
      {
        toast.error(response.data.message)
        setIsSubmitting(false);
      }else{
      toast.success(response.data.message);
      setIsSubmitting(false);
      router.replace("/");
      }
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast.error(axiosError.response?.data.message);
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#12151B] p-6 space-y-6">
        {/* Title */}
        <h1 className="text-title text-center">Verify your account</h1>

        {/* Subtitle */}
        <p className="text-meta text-center">
          Enter the verification code sent to <br />
          <span className="text-white font-medium">{username}</span>
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* OTP Field */}
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-meta">Verification code</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter OTP"
                      {...field}
                      className="rounded-xl bg-[#1A1D23] border-none
                               text-white placeholder-white/40
                               text-center tracking-widest
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
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#5B8CFF] py-3
                       font-medium text-white
                       hover:bg-[#4A7AFF]
                       active:scale-[0.98]"
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <p className="text-meta text-center">
          Didn’t receive the code?{" "}
          <span className="text-[#5B8CFF] cursor-pointer">Resend</span>
        </p>
      </div>
    </div>
  );
}

export default page;
