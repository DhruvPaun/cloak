"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import messages from "@/demoMessage.json"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Mail } from "lucide-react"
export default function Home() {
 return (
    // Added pt-20 to push content below fixed navbar
    // Use min-h-screen to ensure the background covers everything
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 pt-20 pb-12 bg-[#12151B] text-white min-h-screen">
      
      {/* Container to center content visually without the Navbar overlapping */}
      <div className="flex flex-col items-center justify-center w-full max-w-7xl">
        
        {/* Hero Section */}
        <section className="text-center mb-10 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            The Future of Anonymous Feedback
          </h1>
          <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto">
            Whisper — Secure, private, and completely anonymous. Share your thoughts without revealing your identity.
          </p>
        </section>

        {/* Carousel Section */}
        <div className="w-full max-w-lg">
          <Carousel
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="bg-[#1A1D23] border-white/5 shadow-2xl rounded-3xl overflow-hidden transition-all hover:border-[#5B8CFF]/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#5B8CFF]/10 rounded-lg">
                          <Mail className="w-4 h-4 text-[#5B8CFF]" />
                        </div>
                        <CardTitle className="text-sm font-bold text-slate-200">
                          {message.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="min-h-[140px] flex flex-col justify-center">
                      <p className="text-lg md:text-xl font-medium text-white italic leading-relaxed">
                        "{message.content}"
                      </p>
                    </CardContent>
                    <div className="px-6 py-3 bg-white/5 flex justify-between items-center">
                       <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                          Anonymous
                       </span>
                       <span className="text-[10px] text-[#5B8CFF] font-mono">
                          {message.received}
                       </span>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </main>
  )
}
