import { set } from "date-fns"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { toast } from "sonner"
import axiosClient from "@/AxiosClient"
import { useState } from "react"

const RequestTicketAssignment = ({open, setOpen, ticket, getTicket}) => {
    const [isRequesting, setIsRequesting] = useState(false)
    const handleRequestAssignment = () => {
        setIsRequesting(true);
        const req = axiosClient.post(`/api/tickets/${ticket.id}/request`);
        toast.promise(req, {
            loading: "Sending assignment request...",
            success: () => {
                setOpen(false);
                getTicket(ticket.ticketId);
                setIsRequesting(false);
                return "Assignment request sent successfully!"
            },
            error: "Failed to send assignment request."
        });
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex flex-col gap-5">
                <DialogHeader>
                    <DialogTitle>Request Ticket Assignment</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to request assignment for this ticket? This will notify the managers to review your request.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                            <Button variant="outline" size="lg">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleRequestAssignment} variant="default" size="lg">
                        Create Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RequestTicketAssignment