"use client"
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, signUpValidations } from "@/schemas/signUpValidation";
import { useDebounceCallback } from "usehooks-ts";
import axios, { Axios, AxiosError } from "axios";
import { useRouter } from "next/navigation";
import z from "zod";
import { toast } from "sonner";
import { apiResponse } from "@/types/apiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
function page() {
  const form = useForm<z.infer<typeof signUpValidations>>({
    resolver: zodResolver(signUpValidations),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const debounced = useDebounceCallback(setUsername, 500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const checkIsUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/unique-username-check?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<apiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message || "username is not valid"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkIsUsernameUnique();
  }, [username]);
  const onSubmit = async (data: z.infer<typeof signUpValidations>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/signup", data);
      toast.success(response.data.message);
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
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
      <h1 className="text-title text-center">
        Create account
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Username */}
          <FormField
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-meta">
                  Username
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="anonymous_fox"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      debounced(e.target.value)
                    }}
                    className="rounded-xl bg-[#1A1D23] border-none
                               text-white placeholder-white/40
                               focus:ring-2 focus:ring-[#5B8CFF]/40"
                  />
                </FormControl>

                {/* Username check */}
                {isCheckingUsername && (
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking username…
                  </div>
                )}

                {!isCheckingUsername && usernameMessage && (
                  <p
                    className={`text-sm ${
                      usernameMessage === "Username is Available"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                )}

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
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
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#5B8CFF] py-3
                       font-medium text-white
                       hover:bg-[#4A7AFF]
                       active:scale-[0.98]"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait
              </span>
            ) : (
              "Sign up"
            )}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <p className="text-meta text-center">
        Already have an account?{" "}
        <Link href={"/sign-in"} className="text-[#5B8CFF] cursor-pointer">
          Sign in
        </Link>
      </p>
    </div>
  </div>
)
}
export default page;
