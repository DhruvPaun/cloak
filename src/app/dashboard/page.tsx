"use client";
import { Messages } from "@/models/User";
import { userGetter } from "@/lib/userGetter";
import { apiResponse } from "@/types/apiResponse";
import { Switch } from "@/components/ui/switch";
import axios, { AxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Copy, Loader2, Mail, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import Link from "next/link";
import Image from "next/image";
function page() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get("/api/me");
      if (response.data.user) {
        setUser(response.data.user);
        fetchIsAcceptingMessages();
        fetchMessages();
      } else {
        router.replace("/sign-in");
      }
    };
    getUser();
  }, []);

  const newUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  const profileUrl = user ? `${newUrl}/u/${user._id}` : "";
  const { watch, setValue, register } = useForm();
  const [messages, setMessages] = useState<Messages[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const acceptMessages = watch("acceptMessages");
  const fetchIsAcceptingMessages = useCallback(async () => {
    setIsSwitching(true);
    try {
      const response = await axios.get("/api/accepting-message");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsSwitching(false);
    }
  }, [setValue]);
  const handleDeleteMessage = (messageID: string) => {
    setMessages(
      messages.filter((message) => message._id?.toString() !== messageID)
    );
  };
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/get-messages");
        setMessages(response.data.message || []);
        if (refresh) {
          toast.success("Message refreshed");
        }
      } catch (error) {
        const axiosError = error as AxiosError<apiResponse>;
        toast.error(axiosError.response?.data.message);
      } finally {
        setIsLoading(false);
        setIsSwitching(false);
      }
    },
    [setIsLoading, setIsSwitching]
  );
  useCallback(() => {
    fetchMessages();
    fetchIsAcceptingMessages();
  }, [setValue, fetchMessages, fetchIsAcceptingMessages]);
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post("/api/accepting-message", {
        acceptMessages: !acceptMessages,
      });
      if (response.data.success) {
        setValue("acceptMessages", !acceptMessages);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast.error(axiosError.response?.data.message);
    }
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Copied Successfully");
  };
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-[#12151B] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#5B8CFF]" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#12151B] text-white flex flex-col">
      {/* Main content wrapper with top padding to account for the fixed Navbar */}
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section: Clearer hierarchy */}
          <header className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
              User Dashboard
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Manage your anonymous message settings and view your inbox.
            </p>
          </header>

          {/* Profile Link Section: Added a soft glow on hover */}
          <section className="bg-[#1A1D23] p-6 rounded-3xl border border-white/5 shadow-2xl space-y-4 transition-all hover:border-[#5B8CFF]/20">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#5B8CFF]">
              Your Unique Feedback Link
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="w-full bg-[#12151B] border border-white/10 text-slate-300 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5B8CFF]"
                />
              </div>
              <Button
                onClick={copyToClipboard}
                className="bg-[#5B8CFF] hover:bg-[#4A7AFF] text-white rounded-2xl px-6 py-6 h-auto transition-all active:scale-95 flex items-center gap-2 font-bold"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </Button>
            </div>
          </section>

          {/* Controls Section: Better layout for mobile */}
          <section className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1A1D23]/40 p-5 rounded-3xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start bg-[#12151B] px-5 py-3 rounded-2xl border border-white/5">
              <span className="text-sm font-semibold text-slate-300">
                Accepting Messages:
                <span
                  className={`ml-2 ${acceptMessages ? "text-green-400" : "text-red-400"}`}
                >
                  {acceptMessages ? "ON" : "OFF"}
                </span>
              </span>
              <Switch
                disabled={isSwitching}
                onCheckedChange={handleSwitchChange}
                checked={acceptMessages}
                className="data-[state=checked]:bg-green-500"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => fetchMessages(true)}
              disabled={isLoading}
              className="w-full sm:w-auto border-white/10 bg-transparent hover:bg-white/5 text-white rounded-2xl px-6 py-6 h-auto flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <RefreshCcw className="h-5 w-5" />
              )}
              <span className="font-bold">Refresh Feed</span>
            </Button>
          </section>

          {/* Messages Grid: Modern empty state */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold">Your Messages</h2>
              <div className="flex items-center gap-2 bg-[#5B8CFF]/10 text-[#5B8CFF] px-4 py-1 rounded-full border border-[#5B8CFF]/20 text-xs font-bold">
                Total: {messages.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <MessageCard
                    key={message._id?.toString()}
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-24 bg-[#1A1D23]/20 rounded-[2.5rem] border border-dashed border-white/10 transition-all hover:bg-[#1A1D23]/30">
                  <div className="p-4 bg-white/5 rounded-full mb-4">
                    <Mail className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 font-bold text-lg">
                    Your inbox is silent
                  </p>
                  <p className="text-slate-600 text-sm mt-1">
                    Share your link to break the ice!
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer for extra polish */}
      <footer className="py-12 border-t border-white/5 bg-[#12151B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Brand Identity */}
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <Image
                src="/logo.png"
                alt="Cloak Logo"
                width={24}
                height={24}
                className="object-contain grayscale brightness-150"
              />
              <span className="text-sm font-bold tracking-tighter text-white">
                CLOAK
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              <Link
                href="/about"
                className="text-xs text-slate-500 hover:text-blue-400 transition-colors"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-slate-500 hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-slate-500 hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className="text-xs text-slate-500 hover:text-blue-400 transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Social/Copyright */}
            <div className="text-center">
              <p className="text-[10px] text-slate-600 tracking-[0.2em] uppercase">
                © {new Date().getFullYear()} Cloak Anonymous Messaging
              </p>
              <p className="text-[9px] text-slate-700 mt-2">
                Built with privacy in mind.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default page;
