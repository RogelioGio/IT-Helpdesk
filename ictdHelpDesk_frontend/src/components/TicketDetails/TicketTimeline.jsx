import { CircleDot, CircleMinus, ClipboardCheck, MessageCircle, MessageCircleQuestion, UserCog, UserPlus, Wrench } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Sidebar, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem } from "../ui/sidebar"
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthProvider";
import { useEffect } from "react";

const TicketTimeline = ({ isLoading, ticket, assignee, setOpenAssign, timeline = [], ...props}) => {
    // const activeStatuses = [
    //     { key: "Open", date: ticket?.created_at },
    //     { key: "Assigned", date: ticket?.assignmentDate },
    //     { key: "Responded", date: ticket?.respondedDate },
    //     { key: "Resolved", date: ticket?.dateResolved }, 
    //     { key: "Closed", date: ticket?.dateClosed },
    //     { key: "Cancelled", date: ticket?.dateCancelled }
    // ].filter(s => s.date && s.date !== "N/A");
    
    const statusStyling = {
        Open: {
            color: "",
            bg:"",
            border: "border-slate-300",
            icon: <MessageCircleQuestion strokeWidth={2} className="size-6" data-icon="inline-end"/>,
            text: "Open",
            subtext: "has created the ticket"
        },
        Assigned: {
            color: "",
            bg: "",
            border: "border-slate-300",
            icon: <UserCog strokeWidth={2} className="size-6" data-icon="inline-end"/>,
            text: "Assigned",
            subtext: "assigned the ticket to an officer"
        },
        Responded: {
            color: "text-yellow-700",
            bg: "bg-yellow-200",
            border: "border-yellow-700",
            icon: <Wrench strokeWidth={2} className="size-6" data-icon="inline-end"/>,
            text: "Responded",
            subtext:  "marked the ticket as responded. The assigned officer is now working on it"

        },
        Resolved: {
            color: "text-emerald-700/50",
            bg: "bg-emerald-200",
            border: "border-emerald-700",
            icon: <ClipboardCheck strokeWidth={2} className="size-6" data-icon="inline-end"/>,
            text: "Resolved",
            subtext: "has resolved the ticket and is awaiting confirmation"
        },
        Closed: {
            color: "text-slate-700",
            bg: "bg-slate-200",
            border: "border-slate-700/50",
            icon: <CircleDot strokeWidth={2} className="size-6" data-icon="inline-end"/>,
            text: "Closed",
            subtext: "has closed the ticket after resolution was confirmed"
        },
        Cancelled: {
            color: "",
            bg: "",
            border: "",
            icon: <CircleMinus strokeWidth={2} className="size-6 " data-icon="inline-end"/>,
            text: "Cancelled",
            subtext: "has cancelled the ticket and will not be working on it"
        }
    };

    return (
        <div className="lg:px-6">
            <p className="text-sm text-slate-500 mb-4 font-medium">Ticket Timeline:</p>
            {
                isLoading ? 
                <div className="flex flex-col w-full">
                    {
                        Array(5).fill(0).map((_, index) => (
                            <div key={index} className="flex">
                                <div className="flex flex-col items-center mr-4">
                                    <Skeleton className="size-10 rounded-md"/>
                                    {
                                        index !== 4 && (
                                            <Skeleton className="w-px h-7 bg-slate-300"/>
                                        )
                                    }
                                </div>
                                <div className="flex flex-col items-start w-full">
                                    <Skeleton className="w-3/4 h-4 mb-2"/>
                                    <Skeleton className="w-2/6 h-3"/>
                                </div>
                            </div>
                        ))
                    }
                </div>
                :
                <div className="flex flex-col w-full">
                    {
                        timeline.map((item, index) => {
                            const styling = statusStyling[item.name];
                            if (!styling) return null;
                            return (
                                <div key={index} className="flex">
                                <div className="flex flex-col items-center mr-4">
                                    <div className={`size-12 flex shrink-0 items-center justify-center rounded-md bg-slate-400/5 border`}>
                                        {styling.icon}
                                    </div>
                                    {/* Line only shows if there is a NEXT active status */}
                                    {index !== timeline.length - 1 && (
                                        <div className="w-0.5 lg:h-5 h-7 bg-slate-500/50"/>
                                    )}
                                </div>
                                <div className="flex flex-col items-start w-full mt-1">
                                    <div className="flex flex-row items-center justify-between w-full">
                                        <p className={`font-medium text-xs`}>{styling.text}</p>
                                        <p className="text-xs text-slate-400">{differenceInDays(new Date(), item.created_at) >= 1 ? format(new Date(item.created_at), "MM/dd/yy, h:mm a") : formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</p>
                                    </div>
                                    <p className="text-xs text-slate-500"><span className="font-medium text-black">{item.user.name}</span> {styling.subtext}</p>
                                </div>
                            </div>
                            )
                            })
                    }
                </div>
                // <div className="w-full">
                //     <div className="relative flex items-center justify-between">
                //         {/* <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" /> */}
                //         {
                //             timeline.map((item, index) => {
                //                 const styling = statusStyling[item.name];
                //                 return  (
                //                     <div key={item.id} className="relative flex flex-col flex-1">
                //                         {/* 1. The Line Segment */}
                //                         {/* We only render the line if it's NOT the last item */}
                //                         {index !== timeline.length - 1 && (
                //                             <div className="absolute top-6 w-full h-0.5 bg-slate-200 z-0" />
                //                         )}
                //                         {/* 3. The Dot/Icon */}
                //                         <div className={`${styling.bg} ${styling.border} border size-12 flex shrink-0 items-center justify-center rounded-md z-10`}>
                //                             {styling.icon}
                //                         </div>

                //                         {/* 4. The Label */}
                //                         <div className="mt-2 text-xs">
                //                             <p className="font-medium text-sm"> {item.name} </p>
                //                             <p className="text-xs text-slate-400">{differenceInDays(new Date(), item.created_at) >= 1 ? format(new Date(item.created_at), "MM/dd/yy, h:mm a") : formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</p>
                //                         </div>
                //                     </div>
                //                 )
                //             })
                //         }
                //     </div>
                // </div>
            }
        </div>
    )
}

export default TicketTimeline