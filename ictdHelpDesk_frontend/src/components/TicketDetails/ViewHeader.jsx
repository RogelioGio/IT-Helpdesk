import { useNavigate } from "react-router-dom";
import axiosClient from "@/AxiosClient"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Archive, ArrowLeft, ArrowUpFromLine, CircleChevronDown, CircleDot, CircleEqualIcon, CircleMinus, ClipboardCheck, EllipsisVertical, FileCheck, Flame, MessageCircle, MessageCircleQuestion, OctagonAlert, Pencil, Ticket, Trash, UserCog, Wrench } from "lucide-react"
import { use, useEffect, useState } from "react"
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthProvider";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import TicketDropdownActions from "./TicketDropdownActions";
import CancelTicket from "./CancelTicket";

const ViewHeader = ({id, ticket, updateCriticality, isLoading, getTicket, openResolve}) => {
    const nav = useNavigate();
    const {user, accountRole} = useAuth();
    const [responding, setResponding] = useState(false);
    const [resolving, setResolving] = useState(false);
    const [closing, setClosing] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);

    const handleChange = (value) => {
        const normalizedValue = Number(value);
        requestAnimationFrame(() => {
            updateCriticality(ticket, normalizedValue);
        });
    }

    const backNavigation = {
        SystemAdmin: {
            fromTicketDetails: "/ticketmanagement",
        },
        Manager: -1,
        Officer: -1,
        User: "/ticket"
    }

    const handleResponded = (id) => {
        setResponding(true)
        toast.promise(axiosClient.patch(`api/tickets/${id}/responded`) , {
            loading: "Updating ticket status...",
            success: () => {
                setResponding(false)
                getTicket(ticket.ticketId)
                return "Ticket marked as responded."
            },
            error: "Failed to update ticket status. Please try again."
        })
    }

    const handleResolving = (id) => {
        setResolving(true)

        toast.promise(axiosClient.patch(`api/tickets/${id}/resolve`) , {
            loading: "Updating ticket status...",
            success: () => {                
                setResolving(false)
                getTicket(ticket.ticketId)
                return "Ticket marked as resolved."
            },
            error: "Failed to update ticket status. Please try again."
        })
    }

    const handleExportTicket = () => {
        const req = axiosClient.get(`api/gen/ticket/single-ticket/${ticket.id}`,{responseType: "blob"})

        toast.promise(req, {
            loading: "Generating ...",
            success: (res) => {
                const file = new Blob([res.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);

                window.open(fileURL, '_blank');
                return "Ticket Export Succesfully.";
            },
            error: "Export Ticket Failed."
        })
    }

   

    const statusStyling = {
        Open: {
            color: "text-blue-700",
            bg:"bg-blue-700/10",
            border: "border-blue-700",
            icon: <MessageCircleQuestion strokeWidth={2} className="w-24 h-24" data-icon="inline-end"/>
        },
        Assigned: {
            color: "text-purple-700",
            bg: "bg-purple-700/10",
            border: "border-purple-700",
            icon: <UserCog strokeWidth={2} className="w-24 h-24" data-icon="inline-end"/>
        },
        Responded: {
            color: "text-yellow-700",
            bg: "bg-yellow-700/10",
            border: "border-yellow-700",
            icon: <Wrench strokeWidth={2} className="w-24 h-24" data-icon="inline-end"/>
        },
        Resolved: {
            color: "text-emerald-700",
            bg: "bg-emerald-700/10",
            border: "border-emerald-700",
            icon: <ClipboardCheck strokeWidth={2} className="w-24 h-24" data-icon="inline-end"/>
        },
        Closed: {
            color: "text-zinc-950",
            border: "border-zinc-950",
            icon: <CircleDot strokeWidth={2} className="w-24 h-24" data-icon="inline-end"/>,
            bg: "bg-slate-700/10"
        },
        Cancelled: {
            color: "text-slate-700",
            border: "border-slate-700",
            icon: <CircleMinus strokeWidth={2} className="w-24 h-24" data-icon="inline-end"/>,
            bg: "bg-slate-700/10"
        }
    }; 
    const Criticality = {
            Critical: {
                icon: <Flame strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>,
                bigIcon: <Flame strokeWidth={2} className="w-6 h-6" data-icon="inline-end"/>,
                color: "text-red-600",
                bg: "bg-red-600/10",
                border: "border-red-600"
            },
            High: {
                icon: <OctagonAlert strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>,
                bigIcon: <OctagonAlert strokeWidth={2} className="w-6 h-6" data-icon="inline-end"/>,
                color: "text-orange-600",
                bg: "bg-orange-600/10",
                border: "border-orange-600"
            },
            Medium: {
                icon: <CircleEqualIcon strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>,
                bigIcon: <CircleEqualIcon strokeWidth={2} className="w-6 h-6" data-icon="inline-end"/>,
                color: "text-yellow-500",
                bg: "bg-yellow-500/10",
                border: "border-yellow-500"
            },
            Low: {
                icon: <CircleChevronDown strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>,
                bigIcon: <CircleChevronDown strokeWidth={2} className="w-6 h-6" data-icon="inline-end"/>,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
                border: "border-blue-500"

            }
        };
    return (
        <div className="flex flex-row px-4">
                {
                    accountRole === "User" || accountRole === "Officer" ? null : 
                    <Button variant="outline" size="icon" onClick={() => nav(backNavigation[accountRole]?.fromTicketDetails || -1)}>
                        <ArrowLeft className="w-4 h-4" data-icon="inline-start"/>
                    </Button>
                }
                <div className="pl-4 flex flex-row justify-between flex-1 mb-4">
                    {
                        isLoading ? 
                        <div className="space-y-1.5">
                            <div className="flex flex-row gap-1.5 items-center">
                                <Skeleton className="w-xl h-8" />
                            </div>
                            <Skeleton className="w-48 h-4" />
                        </div>
                        : <>
                        <div className="flex lg:flex-row flex-col justify-between w-full lg:items-center gap-y-5">
                            <div className="flex flex-col xl:flex-row gap-5 justify-between w-full xl:w-fit xl:items-center items-left">
                                <div>
                                    <div className="flex flex-row gap-2 items-center">
                                            <div className="flex flex-row gap-1 items-center">
                                                <p className="font-bold text-2xl">{ticket?.activitySpecification?.name}</p>
                                                <p className="text-sm text-slate-500">- {ticket?.activity?.name}</p>
                                            </div>
                                            <div className={`gap-1 flex flex-row`}>
                                                <Badge variant="outline" className={`${statusStyling[ticket?.status?.name]?.bg || "bg-slate-700/10"} ${statusStyling[ticket?.status?.name]?.color || "text-slate-700"}`}>
                                                {statusStyling[ticket?.status?.name]?.icon}
                                                {ticket?.status?.name}
                                                </Badge>
                                            </div>
                                    </div>
                                    <p className="text-xs text-slate-500">#{ticket?.ticketId}</p>
                                </div>
                                {
                                    ticket?.status?.name === "Responded" || ticket?.status?.name === "Resolved" ?
                                        <div className="xl:hidden flex flex-row gap-20 items-center">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm text-slate-500">Priority Level:</p>
                                                <div className="flex flex-row gap-2 items-center text-lg font-bold">
                                                    {Criticality[ticket.priority.name]?. bigIcon}
                                                    <p>{ticket?.priority?.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm text-slate-500">Response Time:</p>
                                                <div className="flex flex-row gap-2 items-center text-lg font-bold">
                                                    <Wrench className="w-6 h-6" data-icon="inline-end"/>
                                                    <p className="font-bold">{
                                                        differenceInDays(new Date(), new Date(ticket?.timeline.find(item => item.name === "Responded")?.created_at || null)) > 0 ?
                                                        format(new Date(ticket?.timeline.find(item => item.name === "Responded")?.created_at || null), "MMMM dd yyyy") :
                                                        formatDistanceToNow(new Date(ticket?.timeline.find(item => item.name === "Responded")?.created_at || null), { addSuffix: true })
                                                    }
                                                    </p>
                                                </div>
                                            </div>
                                        </div> : null
                                }
                                <div className="xl:hidden flex flex-row-reverse lg:flex-row :justify-start gap-2 items-center justify-end">
                                    {
                                        ticket?.status?.name === "Assigned" ?
                                        <Button size="sm" onClick={() => handleResponded(ticket?.id)} disabled={responding}>
                                            <Wrench className=""/>
                                            Responded
                                        </Button>
                                        : null
                                    }
                                    {
                                        ticket?.status?.name === "Open" ||  ticket?.status?.name === "Assigned" ?
                                        <TicketPriority handleChange={handleChange} ticket={ticket} Criticality={Criticality}/>
                                        : null
                                    }
                                    <ActionButtons ticket={ticket} openResolve={openResolve} resolving={resolving} nav={nav} getTicket={getTicket}/>
                                    <TicketDropdownActions accountrole={accountRole} onExport={handleExportTicket}/> 
                                </div>
                            </div>
                            <div className="flex-row gap-2 items-center hidden xl:flex">
                                {
                                    accountRole === "SystemAdmin" ?
                                        <>
                                            {
                                                ticket?.status?.name === "Assigned" ?
                                                <Button variant="outline" size="lg" onClick={() => handleResponded(ticket?.id)} disabled={responding}>
                                                    <Wrench className=""/>
                                                    Mark as Responded
                                                </Button>
                                                : ticket?.status?.name === "Responded" ?
                                                <div className="px-4 flex flex-row gap-5">
                                                    <div className="flex flex-col justify-end items-end">
                                                        <p className="text-sm text-slate-500 font-medium">Reponse Time</p>
                                                        <p className="font-bold">{
                                                            differenceInDays(new Date(), new Date(ticket?.timeline.find(item => item.name === "Responded")?.created_at || null)) > 0 ?
                                                            format(new Date(ticket?.timeline.find(item => item.name === "Responded")?.created_at || null), "MMMM dd yyyy") :
                                                            formatDistanceToNow(new Date(ticket?.timeline.find(item => item.name === "Responded")?.created_at || null), { addSuffix: true })
                                                        }
                                                        </p>
                                                    </div>
                                                    <div className={`border ${statusStyling["Responded"].border} ${statusStyling["Responded"]?.bg || "bg-slate-700/10"} ${statusStyling["Responded"]?.color || "text-slate-700 border "} w-12 h-12 rounded-md flex items-center justify-center`}>
                                                        <Wrench className="w-6 h-6" data-icon="inline-end"/>
                                                    </div>      
                                                </div> : null
                                            }
                                            {
                                                ticket?.status?.name === "Open" ||  ticket?.status?.name === "Assigned" ?
                                                <TicketPriority handleChange={handleChange} ticket={ticket} Criticality={Criticality}/>
                                                :
                                                <div className="px-4 flex xl:flex-row flex-row-reverse gap-5">
                                                    <div className="flex flex-col justify-end items-end">
                                                        <p className="text-sm text-slate-500 font-medium">Ticket Priority</p>
                                                        <p className="font-bold">{ticket.priority?.name}</p>
                                                    </div>
                                                    <div className={`${Criticality[ticket.priority.name]?.bg || "bg-slate-700/10"} ${Criticality[ticket.priority.name]?.color || "text-slate-700"} w-12 h-12 rounded-md flex items-center justify-center border ${Criticality[ticket.priority.name]?.border || "border-slate-700"}`}>
                                                        {Criticality[ticket.priority.name]?.bigIcon}
                                                    </div>      
                                                </div>
                                            }
                                            <ActionButtons ticket={ticket} openResolve={openResolve} resolving={resolving} nav={nav} getTicket={getTicket}/>
                                            <TicketDropdownActions accountrole={accountRole} ticketStatus={ticket?.status?.name} onCancel={() => setOpenCancel(true)} onExport={()=>handleExportTicket()}/> 
                                        </>
                                    :accountRole === "Manager" ?
                                    <>
                                        {
                                            ticket?.status?.name === "Assigned" && ticket?.requester?.id == user.id ?
                                            <Button variant="outline" size="lg" onClick={() => handleResponded(ticket?.id)} disabled={responding}>
                                                <Wrench className=""/>
                                                Mark as Responded
                                            </Button>
                                            : ticket?.status?.name === "Responded" ?
                                            <div className="px-4 flex flex-row gap-5">
                                                <div className="flex flex-col justify-end items-end">
                                                    <p className="text-sm text-slate-500 font-medium">Reponse Time</p>
                                                    <p className="font-bold">{
                                                        differenceInDays(new Date(), new Date(ticket?.timeline.find(item => item.name === "Responded")?.created_at || null)) > 0 ?
                                                        format(new Date(ticket?.timeline.find(item => item.name === "Responded")?.created_at || null), "MMMM dd yyyy") :
                                                        formatDistanceToNow(new Date(ticket?.timeline.find(item => item.name === "Responded")?.created_at || null), { addSuffix: true })
                                                    }
                                                    </p>
                                                </div>
                                                <div className={`border ${statusStyling["Responded"].border} ${statusStyling["Responded"]?.bg || "bg-slate-700/10"} ${statusStyling["Responded"]?.color || "text-slate-700 border "} w-12 h-12 rounded-md flex items-center justify-center`}>
                                                    <Wrench className="w-6 h-6" data-icon="inline-end"/>
                                                </div>      
                                            </div> : null
                                        }
                                        {
                                            ticket?.status?.name === "Open" ||  ticket?.status?.name === "Assigned" ?
                                            <TicketPriority handleChange={handleChange} ticket={ticket} Criticality={Criticality}/>
                                            : ticket.priority.id !== null ?
                                            <div className="px-4 flex xl:flex-row flex-row-reverse gap-5">
                                                <div className="flex flex-col justify-end items-end">
                                                    <p className="text-sm text-slate-500 font-medium">Ticket Priority</p>
                                                    <p className="font-bold">{ticket.priority.name}</p>
                                                </div>
                                                <div className={`${Criticality[ticket.priority.name]?.bg || "bg-slate-700/10"} ${Criticality[ticket.priority.name]?.color || "text-slate-700"} w-12 h-12 rounded-md flex items-center justify-center border ${Criticality[ticket.priority.name]?.border || "border-slate-700"}`}>
                                                    {Criticality[ticket.priority.name]?.bigIcon}
                                                </div>      
                                            </div> : null
                                        }
                                        <ActionButtons ticket={ticket} openResolve={openResolve} resolving={resolving} nav={nav} getTicket={getTicket}/>
                                        <TicketDropdownActions accountrole={accountRole} ticketStatus={ticket?.status?.name} onCancel={() => setOpenCancel(true)}/> 
                                    </>
                                    : accountRole === "Officer" ? <>
                                        {
                                            ticket?.status?.name === "Responded" ?
                                            <div className="px-4 flex flex-row gap-5">
                                                <div className="flex flex-col justify-end items-end">
                                                    <p className="text-sm text-slate-500 font-medium">Reponse Time</p>
                                                    <p className="font-bold">{
                                                        differenceInDays(new Date(), new Date(ticket?.timeline.find(item => item.name === "Responded")?.created_at || null)) > 0 ?
                                                        format(new Date(ticket?.timeline.find(item => item.name === "Responded")?.created_at || null), "MMMM dd yyyy") :
                                                        formatDistanceToNow(new Date(ticket?.timeline.find(item => item.name === "Responded")?.created_at || null), { addSuffix: true })
                                                    }
                                                    </p>
                                                </div>
                                                <div className={`border ${statusStyling["Responded"].border} ${statusStyling["Responded"]?.bg || "bg-slate-700/10"} ${statusStyling["Responded"]?.color || "text-slate-700 border "} w-12 h-12 rounded-md flex items-center justify-center`}>
                                                    <Wrench className="w-6 h-6" data-icon="inline-end"/>
                                                </div>      
                                            </div> :null
                                        }
                                        {
                                            ticket.priority ? 
                                            <div className="px-4 flex xl:flex-row flex-row-reverse gap-5">
                                                <div className="flex flex-col justify-end items-end">
                                                    <p className="text-sm text-slate-500 font-medium">Ticket Priority</p>
                                                    <p className="font-bold">{ticket.priority.name}</p>
                                                </div>
                                                <div className={`${Criticality[ticket.priority.name]?.bg || "bg-slate-700/10"} ${Criticality[ticket.priority.name]?.color || "text-slate-700"} w-12 h-12 rounded-md flex items-center justify-center border ${Criticality[ticket.priority.name]?.border || "border-slate-700"}`}>
                                                    {Criticality[ticket.priority.name]?.bigIcon}
                                                </div>      
                                            </div> : null
                                        }
                                        <ActionButtons ticket={ticket} openResolve={openResolve} resolving={resolving} nav={nav} getTicket={getTicket}/>
                                        <TicketDropdownActions accountrole={accountRole} ticketStatus={ticket?.status?.name} onCancel={() => setOpenCancel(true)} onExport={()=>handleExportTicket()}/> 
                                    </>
                                    :  accountRole === "User" ? 
                                    <>
                                        {
                                            ticket.priority.name !== "No Critical Level" ? 
                                            <div className="px-4 flex xl:flex-row flex-row-reverse gap-5">
                                                <div className="flex flex-col justify-end items-end">
                                                    <p className="text-sm text-slate-500 font-medium">Ticket Priority</p>
                                                    <p className="font-bold">{ticket.priority.name}</p>
                                                </div>
                                                <div className={`${Criticality[ticket.priority.name]?.bg || "bg-slate-700/10"} ${Criticality[ticket.priority.name]?.color || "text-slate-700"} w-12 h-12 rounded-md flex items-center justify-center border ${Criticality[ticket.priority.name]?.border || "border-slate-700"}`}>
                                                    {Criticality[ticket.priority.name]?.bigIcon}
                                                </div>      
                                            </div> : null
                                        }
                                        {
                                            ticket?.status?.name === "Assigned" ?
                                            <Button variant="outline" size="lg" onClick={() => handleResponded(ticket?.id)} disabled={responding}>
                                                <Wrench className=""/>
                                                Mark as Responded
                                            </Button>
                                            : ticket?.status?.name === "Responded" ?
                                            <div className="px-4 flex flex-row gap-5">
                                                <div className="flex flex-col justify-end items-end">
                                                    <p className="text-sm text-slate-500 font-medium">Reponse Time</p>
                                                    <p className="font-bold">{
                                                        differenceInDays(new Date(), new Date(ticket?.timeline.find(item => item.name === "Responded")?.created_at || null)) > 0 ?
                                                        format(new Date(ticket?.timeline.find(item => item.name === "Responded")?.created_at || null), "MMMM dd yyyy") :
                                                        formatDistanceToNow(new Date(ticket?.timeline.find(item => item.name === "Responded")?.created_at || null), { addSuffix: true })
                                                    }
                                                    </p>
                                                </div>
                                                <div className={`border ${statusStyling["Responded"].border} ${statusStyling["Responded"]?.bg || "bg-slate-700/10"} ${statusStyling["Responded"]?.color || "text-slate-700 border "} w-12 h-12 rounded-md flex items-center justify-center`}>
                                                    <Wrench className="w-6 h-6" data-icon="inline-end"/>
                                                </div>      
                                            </div> : null
                                        }
                                        <ActionButtons ticket={ticket} openResolve={openResolve} resolving={resolving} nav={nav} getTicket={getTicket}/>
                                        <TicketDropdownActions accountrole={accountRole} ticketStatus={ticket?.status?.name} onCancel={() => setOpenCancel(true)} onExport={()=>handleExportTicket()}/> 
                                    </> : null

                                }
                            </div>
                        </div>
                        </>
                    }
                </div>
                {
                    openCancel ? <CancelTicket  open={openCancel} onOpenChange={() => setOpenCancel(false)} ticket={ticket} getTicket={getTicket}/> : null
                }
            </div>
    );
}

export default ViewHeader;

const StatusBadge = ({status}) => {
    return
}

const TicketPriority = ({handleChange, ticket, Criticality}) => {
    return (
        <>
        <p></p>
        <Select onValueChange={handleChange} value={ticket?.priority?.id?.toString() || undefined}>
            <SelectTrigger className="flex flex-row w-50 p-2">
                <SelectValue placeholder="Assign Priority Level" className="flex flex-row"/>
            </SelectTrigger>
            <SelectContent align="end">
            <SelectGroup>
                <SelectLabel>Set Priority</SelectLabel>
                <SelectItem value={"1"}> 
                    {Criticality["Critical"].icon}
                    Critical
                    </SelectItem>
                <SelectItem value={"2"}>
                    {Criticality["High"].icon}
                    High
                    </SelectItem>
                <SelectItem value={"3"}>
                    {Criticality["Medium"].icon}
                    Medium
                    </SelectItem>
                <SelectItem value={"4"}>
                    {Criticality["Low"].icon}
                    Low
                    </SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
        </>
    )
}

const ActionButtons = ({ticket, openResolve, resolving, nav, getTicket}) => {
    const {user, accountRole} = useAuth();
    const [Closing, setClosing] = useState(false)

    const handleClose = (id) => {
        setClosing(true)
        toast.promise(axiosClient.patch(`api/tickets/${id}/close`) , {
            loading: "Updating ticket status...",
            success: () => {
                setClosing(false)
                getTicket(ticket.ticketId)
                return "Ticket closed successfully."
            },
            error: () => {
                setClosing(false)
                return "Failed to update ticket status. Please try again."
            }
        })
    }
    
    const ClosingUrls = {
        User: `/app/${ticket?.ticketId}/details/leave_feedback`,
        Officer: `/officer/${ticket?.ticketId}/details/leave_feedback`,
        Manager: `/ticket/${ticket?.ticketId}/details/leave_feedback`,
        SystemAdmin: `/ticket/${ticket?.ticketId}/details/leave_feedback`,
        Administrator: `/ticket/${ticket?.ticketId}/details/leave_feedback`,
    }

    return <>
        {
            ticket?.status?.name === "Responded" && ticket.assignment.some(a => a.id === user.id) ?
            <Button variant="outline" size="lg" onClick={() => openResolve(true)} disabled={resolving}>
                <ClipboardCheck className=""/>
                Mark as Resolved
            </Button>
            : ticket?.status?.name === "Resolved" && ticket?.requester?.id === user.id ?
            <Button variant="outline" size="lg" onClick={() => {ticket?.feedback.id ? handleClose(ticket.id) : nav(ClosingUrls[accountRole])}} disabled={resolving || Closing}>
                <CircleDot className=""/>
                Close Ticket
            </Button> : null
        }
    </>
}
