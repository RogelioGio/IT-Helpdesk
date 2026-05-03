import { format, formatDistanceToNow } from "date-fns"
import { Skeleton } from "../ui/skeleton"

const TicketSpecificDetails = ({ticket, isLoading}) => {
    return (
        <>
        <div className="flex flex-col gap-5">
            {
                isLoading ?
                <>
                <div>
                    <p className="text-sm text-slate-500 mb-2 font-medium">Service Requester:</p>
                    <Skeleton className="w-70 h-5 mb-2" />
                    <Skeleton className="w-50 h-4" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 mb-2 font-medium">Ticket Created at:</p>
                    <Skeleton className="w-70 h-5 mb-2" />
                    <Skeleton className="w-50 h-4" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 mb-2 font-medium">Asset Number:</p>
                    <Skeleton className="w-70 h-5 mb-2" />
                    <Skeleton className="w-50 h-4" />
                </div>
                </> : <>
                <div>
                    <p className="text-sm text-slate-500 mb-2 font-medium">Service Requester:</p>
                    <h1 className="font-bold text-xl">{ticket.requester?.name}</h1>
                    <p className="text-xs text-slate-500">{ticket.requester?.office_department_division?.name}</p>                                   
                </div>
                <div>
                    <p className="text-sm text-slate-500 mb-2 font-medium">Ticket Created at:</p>
                    <h1 className="font-bold text-xl">{ticket.created_at ? format(new Date(ticket.created_at), "MMM dd yyyy, hh:mma") : "N/A"}</h1>    
                    <p className="text-xs text-slate-500">{ticket.created_at ? formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true }) : "N/A"}</p>                    
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium mb-2">Asset Number:</p>
                    <h1 className="font-bold text-xl">{ticket.assetNumber ? ticket.assetNumber : "N/A"}</h1>                                   
                </div>
                </>
            }
        </div>
        </>
    )
}

export default TicketSpecificDetails
