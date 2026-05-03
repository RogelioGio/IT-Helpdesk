import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { TableHead, TableHeader, TableRow, Table, TableBody, TableCell } from "../ui/table"
import { Skeleton } from "../ui/skeleton"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Circle, CircleChevronDown, CircleDot, CircleEqual, ClipboardCheck, ClipboardCopy, FileIcon, Flame, OctagonAlert, Ticket, Wrench } from "lucide-react"
import { Badge } from "../ui/badge"
import { differenceInDays, format, formatDistanceToNow } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import ResponderDetail from "./ResponderDetail"
import ReportrDialog from "./ReportrDialog"

const DataTable = ({assignedTickets, responder, isloading}) => {
    const [open, setOpen] = useState(false);    
   
    const column = useMemo(() => [
        {
            accessorKey: "ticketId",
            header: "Tickets",
            cell: ({row}) => {
                const priority = row.original.priority.name;
                const priorityInfo = ticketPriority[priority];
                return (
                    <div className="flex flex-row gap-2">
                        <div className="flex flex-col">
                            <p className="text-sm font-medium">#{row.original.ticketId}</p>
                            <p className="text-xs text-slate-500">{row.original.activitySpecification.name} - {row.original.activity.name}</p>
                        </div>
                        <div>
                            <Badge variant="outline" size="lg" className={`${priorityInfo.color} ${priorityInfo.border} border ${priorityInfo.textColor}`}>
                                <priorityInfo.icon data-icon="inline-start"/>
                                {priority}
                            </Badge>
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'latestTimelineStatus',
            header: "Current Status",
            cell: ({row}) => {
                const status = row.original.latestTimelineStatus?.name;
                const statusInfo = ticketStatus[status] || {
                    icon: Circle,
                    text: "Unknown Status",
                    created_at: row.original.latestTimelineStatus?.created_at || "N/A",
                }
                return (
                    <div className="flex gap-2 items-center">
                        <div className={`size-10 rounded-md flex items-center justify-center ${statusInfo.color} ${statusInfo.border} border`}>
                            <statusInfo.icon className={`size-5 ${statusInfo.textColor}`}/>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500">{statusInfo.text}:</p>
                            {/* <p className="text-sm font-bold">{formatDistanceToNow(row.original.latestTimelineStatus?.timestamp) || "No description available"}</p> */}
                            {row.original.latestTimelineStatus?.created_at ? 
                                <p className="text-sm font-bold">{differenceInDays(new Date(), new Date(row.original.latestTimelineStatus.created_at)) > 1 ? format(new Date(row.original.latestTimelineStatus.created_at), "MMM dd, yyyy") 
                                    : formatDistanceToNow(new Date(row.original.latestTimelineStatus.created_at), { addSuffix: true })}</p> 
                                : <p className="text-sm font-bold">No description available</p>}
                        </div>
                    </div>
                )
            }
        }
    ],[])

    const table = useReactTable({
        data: assignedTickets || [],
        columns: column,
        getCoreRowModel: getCoreRowModel()

    })

    useEffect(() => {
        console.log(assignedTickets)
    }, [assignedTickets])
    
    
    return (
        <div className="flex flex-col flex-1 h-full justify-between">
            <div className="overflow-hidden rounded-lg border flex flex-col h-full">
                <div className="p-4 bg-accent/10 border-b flex flex-row gap-2 items-center justify-between">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="size-12 rounded-md bg-slate-200 flex items-center justify-center">
                            <Ticket />
                        </div>
                        <div>
                            <p className="font-bold">Ticket List</p>
                            <p className="text-xs text-slate-500">List of all assigned tickets and their statuses that they are involved</p>
                        </div>
                    </div>
                    <div>
                        <Button variant="ghost" className="text-xs py-2" onClick={() => setOpen(true)}>
                            <ClipboardCopy className="size-4"/>
                            Export Assignment List
                        </Button>
                    </div>
                </div>
                <ScrollArea className=" flex-1">
                    <div className="max-h-0">
                       {
                            assignedTickets?.length === 0 ? null :
                            assignedTickets?.map((ticket, i) => {
                                const Icon = ticketPriority[ticket.priority.name]?.icon;
                                const StatusIcon = ticketStatus[ticket.latestTimelineStatus?.name]?.icon 
                                const ticketPriorityStyling = ticketPriority[ticket.priority.name]; 
                                const ticketStatusInfo = ticketStatus[ticket.latestTimelineStatus?.name];
                                
                                return ( <div className="p-4 border-b flex flex-row justify-between" key={i}>
                                    <div className="flex flex-row gap-4 items-center">
                                        <div className={`size-12 rounded-md flex items-center justify-center ${ticketPriorityStyling.color} ${ticketPriorityStyling.border} border ${ticketPriorityStyling.textColor}`}>
                                           <Icon className="size-6"/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500"># {ticket.ticketId}</p>
                                            <p className="text-lg font-bold">{ticket.activitySpecification.name} <span className="text-xs text-slate-500 font-thin">- {ticket.activity.name}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-10 items-center ">
                                        <div className="text-right h-full flex flex-col justify-center gap-1">
                                                <p className="text-xs text-slate-500">Ticket Created</p>
                                                <p className="font-medium">{ticket.created_at ? format(new Date(ticket.created_at), "MMMM dd yyyy") : "N/A"}</p>
                                        </div>
                                        <div className="text-right h-full flex flex-col justify-center gap-1">
                                                <p className="text-xs text-slate-500">Last Updated</p>
                                                <p className="font-medium">{ticket.updated_at ? format(new Date(ticket.updated_at), "MMMM dd yyyy") : "N/A"}</p>
                                        </div>
                                        <div className="text-right h-full flex flex-col justify-center">
                                            <Badge variant="outline" size="lg" className={ticketStatusInfo ? `${ticketStatusInfo.color} ${ticketStatusInfo.textColor}` : "text-slate-800"}>
                                                {StatusIcon && <StatusIcon className="size-4 mr-2" />}
                                                {ticket.latestTimelineStatus?.name}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>)
                            })
                           
                       }
                    </div>
                </ScrollArea>
            </div>
            <ReportrDialog open={open} onOpenChange={setOpen} selectedRespondent={responder} reportType="assignment" />
        </div>
    )
}

export default DataTable;

const ticketPriority = {
    "Critical" : {
        icon: Flame,
        title: "Critical",
        color: "bg-red-500/30",
        textColor: "text-red-800",
        border: "border-red-500"
    },
    "High" : {
        icon: OctagonAlert,
        title: "High",
        color: "bg-orange-500/30",
        textColor: "text-orange-800",
        border: "border-orange-500"
    },
    "Medium" : {
        icon: CircleEqual,
        title: "Medium",
        color: "bg-yellow-500/30",
        textColor: "text-yellow-800",
        border: "border-yellow-500"
    },
    "Low" : {
        icon: CircleChevronDown,
        title: "Low",
        color: "bg-green-500/30",
        textColor: "text-green-800",
        border: "border-green-500"

    }
}


const ticketStatus = {
        "Assigned" : {
            icon: FileIcon,
            text: "Assigned",
            color: "bg-purple-500/20",
            textColor: "text-purple-800",
            border: "border-purple-500",
        },
        "Responded" : {
            icon: Wrench,
            text: "Ticket Responded",
            siteHeader : "Responded",
            userHeader : "Responded Tickets",
            color: "bg-green-500/20",
            textColor: "text-green-800",
            border: "border-green-500",
        },
        "Resolved" : {
            icon: ClipboardCheck,
            text: "Ticket Resolved",
            siteHeader : "Resolved",
            userHeader : "Resolved Tickets",
            color: "bg-yellow-500/20",
            textColor: "text-yellow-800 ",
            border: "border-yellow-500",
        },
        "Closed" : {
            icon: Circle,
            text: "Ticket Closed",
            siteHeader : "Closed",
            userHeader : "Closed Tickets",
            color: "bg-slate-500/20",
            textColor: "text-slate-800",
            border: "border-slate-500",
        }
}

{/* <div key={i} className="p-4 border-b flex flex-row justify-between">
                                    <div className="flex flex-row gap-4 items-center">
                                        <div className="bg-slate-500/20 size-12 rounded-md flex items-center justify-center">
                                            <Ticket className="size-6"/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">#{assignedTickets.ticketId}</p>
                                            <p className="text-lg font-medium">Sample Ticket <span className="text-xs text-slate-500 font-thin">- Sample Activity</span></p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-10 items-center ">
                                        <div className="text-right h-full flex flex-col justify-center gap-1">
                                             <p className="text-xs text-slate-500">Ticket Created</p>
                                             <p className="font-medium">In Progress</p>
                                        </div>
                                        <div className="text-right h-full flex flex-col justify-center gap-1">
                                             <p className="text-xs text-slate-500">Last Updated</p>
                                             <p className="font-medium">In Progress</p>
                                        </div>
                                        <div className="text-right h-full flex flex-col justify-center">
                                            <Badge variant="outline" size="lg" className={`bg-green-500/30 border-green-500 text-green-800`}>
                                                <CircleEqual data-icon="inline-start"/>
                                                Medium
                                            </Badge>
                                        </div>
                                    </div> */}