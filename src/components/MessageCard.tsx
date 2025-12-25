import { Messages } from "@/models/User"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import axios, { AxiosDefaults, AxiosError } from "axios"
import { toast } from "sonner"
import { ObjectId } from "mongoose"
import { apiResponse } from "@/types/apiResponse"
type messageProps={
    message:Messages,
    onMessageDelete:(messageId : string)=>void
}
function MessageCard({message,onMessageDelete}:messageProps) {
    const handleDeleteConfirm=async ()=>{
        try {
            const data=await axios.delete(`/api/delete-message/${message._id}`)
            if(data.data.success){
            toast.success(data.data.message)  
            onMessageDelete(String(message._id))  
            }else{
              toast.error("Could not delete")
            }
        } catch (error) {
            const axiosError=error as AxiosError<apiResponse>
            toast.error(axiosError.response?.data.message)
        }
    }
  return (
  <Card className="bg-[#1A1D23] border-white/5 hover:border-white/10 transition-all duration-200">
    <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0">
      <div className="space-y-1 pr-4">
        <CardTitle className="text-base font-medium text-white break-words">
          {message.messages}
        </CardTitle>
        <CardDescription className="text-xs text-slate-400">
          {new Date(message.createdAt).toLocaleDateString()}
        </CardDescription>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-400/10 shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#12151B] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription className="text-slate-400">
              This action cannot be undone. This will permanently delete this message from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
               <Button variant="ghost" className="text-slate-300 hover:bg-white/5">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardHeader>
  </Card>
);
}

export default MessageCard
