"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { messageValidation } from "@/schemas/messageValidation";
import z from "zod";
import { toast } from "sonner";
import { apiResponse } from "@/types/apiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
function page() {
  const [messageSuggestions,setMessageSuggestions]=useState([])
  const [aiLoadingMessages,setAiLoadingMessages]=useState(false)
  const suggestMessages=async()=>{
    setAiLoadingMessages(true)
    try {
      const response=await axios.post("/api/suggest-messages")
      
      setMessageSuggestions(response.data.suggestions)
      toast.success("message fetched successfully")
    } catch (error) {
      console.log(error);
      toast.error("Error in suggestin messsages")
    }finally{
      setAiLoadingMessages(false)
    }
  }
  const form = useForm<z.infer<typeof messageValidation>>({
    resolver: zodResolver(messageValidation),
    defaultValues: {
      message: "",
    },
  });
  const params = useParams();
  const userID = params.userID;
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmitMessage = async (
    data: z.infer<typeof messageValidation>
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/send-messages",{
        id:userID,
        content:data.message
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast.error(axiosError.response?.data.message);
    }
  };
  return (
  <div className="min-h-screen bg-[#12151B] text-white flex flex-col">
    {/* pt-24 ensures it doesn't hide behind your navbar */}
    <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4 md:px-8">
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            Send a Whisper
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto">
            Share your honest thoughts. Your identity is protected and will never be revealed.
          </p>
        </div>

        {/* Form Container */}
        <section className="bg-[#1A1D23] p-6 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#5B8CFF]/10 blur-[100px] rounded-full" />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitMessage)} className="space-y-8 relative z-10">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-bold uppercase tracking-widest text-xs">
                      Your Anonymous Message
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="What's on your mind? Don't be shy..." 
                        {...field} 
                        className="bg-[#12151B] border-white/10 text-white rounded-2xl py-8 px-6 focus:ring-2 focus:ring-[#5B8CFF]/50 focus:border-[#5B8CFF] transition-all placeholder:text-slate-600"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 font-medium" />
                  </FormItem>
                )}
              />

              <Button 
                disabled={form.formState.isSubmitting} 
                className="w-full bg-[#5B8CFF] hover:bg-[#4A7AFF] text-white font-bold py-7 rounded-2xl text-lg transition-all active:scale-[0.98] shadow-lg shadow-[#5B8CFF]/20 flex items-center justify-center gap-3"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending Whisper...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </Form>

          {/* AI Suggestions Section */}
          <div className="mt-10 pt-8 border-t border-white/5 space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                AI Suggestions
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={suggestMessages}
                disabled={aiLoadingMessages}
                className="text-[#5B8CFF] hover:bg-[#5B8CFF]/10 hover:text-[#5B8CFF] rounded-full text-xs"
              >
                {aiLoadingMessages ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                {aiLoadingMessages ? "Thinking..." : "Get Ideas"}
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              {messageSuggestions.length > 0 ? (
                messageSuggestions.map((message, index) => (
                  <button
                    key={index}
                    onClick={() => form.setValue("message", message)}
                    className="text-left p-4 rounded-2xl bg-[#12151B] border border-white/5 text-sm text-slate-300 hover:border-[#5B8CFF]/40 hover:text-white transition-all animate-in fade-in slide-in-from-left-2 duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {message}
                  </button>
                ))
              ) : (
                <p className="text-center py-4 text-slate-600 text-xs italic">
                  Tap "Get Ideas" to generate anonymous message starters.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Footer info */}
        <div className="text-center">
          <p className="text-slate-600 text-xs font-medium tracking-tighter uppercase">
            Processed through end-to-end encrypted servers
          </p>
        </div>
      </div>
    </main>
  </div>
);
}

export default page;
