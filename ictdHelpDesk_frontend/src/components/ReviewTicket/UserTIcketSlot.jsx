import { Circle, CircleChevronDown, CircleDot, CircleEqual, CircleMinus, ClipboardCheck, Flame, MessageCircle, MessageCircleQuestionMark, Notebook, OctagonAlert, UserCog, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthProvider";

const UserTicketSlot = ({ loading, ticket, setTicketId, ...props }) => {
    const {accountRole} = useAuth();
     const ticketStatusStyling = {
        Open: {
            color: "text-blue-700",
            bg:"bg-blue-700/10",
            icon: MessageCircleQuestionMark
        },
        Assigned: {
            color: "text-purple-700",
            bg: "bg-purple-700/10",
            icon: UserCog
        },
        Responded: {
            color: "text-yellow-700",
            bg: "bg-yellow-700/10",
            icon: Wrench
        },
        Resolved: {
            color: "text-emerald-700",
            bg: "bg-emerald-700/10",
            icon: ClipboardCheck
        },
        Closed: {
            color: "text-slate-950",
            bg: "bg-slate-950/10",
            icon: CircleDot
        },
        Cancelled : {
            color: "text-slate-700",
            bg: "bg-slate-700/10",
            icon: CircleMinus
        }
    };

    const priorityStyling = {
        Critical: {
            icon: Flame,
            bg: "bg-red-700/10",
            color: "text-red-700"
        },
        High: {
            icon: OctagonAlert,
            bg: "bg-orange-700/10",
            color: "text-orange-700"
        },
        Medium: {
            icon: CircleEqual,
            bg: "bg-yellow-500/10",
            color: "text-yellow-500"
        },
        Low: {
            icon: CircleChevronDown,
            bg: "bg-blue-500/10",
            color: "text-blue-500"
        }
    }

    const nav = useNavigate()
    if(!ticket) return null;
    

    const statusStyle = ticketStatusStyling[ticket.status?.name];
    const priorityStyle = priorityStyling[ticket.priority?.name];

    const handleLinks = () => {
        return accountRole === "Officer" ? `/officer/${ticket.ticketId}/details` : `/app/${ticket.ticketId}/details`;
    }

    return (
        <div className="flex flex-col items-start gap-3 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={()=> nav(handleLinks())}>
            <div className="flex flex-row w-full justify-between items-center">
                    <Badge variant="outline" className={`${statusStyle?.color || ''} ${statusStyle?.bg || ''}`}>
                        <statusStyle.icon className="mr-1 h-3 w-3" />
                    {ticket.status?.name}
                </Badge>
                <p className="text-xs text-slate-500">{differenceInDays(new Date(), new Date(ticket.created_at)) > 1 ? format(new Date(ticket.created_at), "MMM dd, yyyy - hh:mm a") : formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</p>
            </div>
            <div className="flex flex-row items-center gap-2">
                {
                    ticket.priority.id !== null ?
                    <div>
                        <div className={`flex items-center justify-center rounded-md ${priorityStyle.bg} ${priorityStyle.color} size-10`}>
                            <priorityStyle.icon className="h-5 w-5" />
                        </div>
                    </div>
                    : null
                }
                <div>
                        <p className="font-medium">{ticket.activitySpecification?.name}</p>
                        <p className="font-light text-slate-500">{ticket.activity?.name}</p>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <div>
                    {
                        accountRole === "Officer" ? 
                        <p className="font-medium text-slate-500 text-xs">Service Requester:  <span className="text-xs font-thin text-primary">{ticket.requester.name}</span> </p>
                        : <p className="font-medium text-slate-500 text-xs">Asset Number:  <span className="text-xs font-thin text-primary">{ticket.assetNumber}</span> </p>
                    }
                </div>
                <p className="text-slate-500 text-xs">{ticket.description?.length > 50 ? ticket.description.substring(0, 50) + "..." : ticket.description}</p>
            </div>
        </div>
    )
}

export default UserTicketSlot;  