import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Bell, Circle, CircleChevronDown, CircleDot, CircleEqualIcon, CircleMinus, CircleQuestionMark, ClipboardCheck, EllipsisVertical, Eye, File, Flame, MessageCircle, MessageCircleQuestionMark, OctagonAlert, Pencil, Plus, Search, SquareMenu, Ticket, Trash, UserCog, Wrench } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTables from "@/components/TicketManagement/DataTables";
import { Checkbox } from "@/components/ui/checkbox";
import { format, addDays, formatDistanceToNow, set } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarProvider } from "@/components/ui/sidebar";
import AddTicket from "@/components/TicketManagement/AddTicket";
import { memo, use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import axiosClient from "@/AxiosClient";
import { toast } from "sonner";
import AssignTicket from "@/components/TicketManagement/AssignTicket";
import DeleteTicket from "@/components/TicketManagement/DeleteTicket";
import { useNavigate } from "react-router-dom";
import { useTicketStore } from "@/stores/useTicketStore";

export default function TicketManagement() {
    const {fetchTickets, setParams, params, updateTicket, ticket, setTicket} = useTicketStore();
    // const [ticket, setTicket] = useState(null);
    const [openAssign, setOpenAssign] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activityOptions, setActivityOptions] = useState({});
    const nav = useNavigate();

    useEffect(()=>{
        Promise.all([
            axiosClient.get('api/activities'),
            axiosClient.get('api/activitiesSpecifications')
        ]).then(([activities, specs]) => {
            setActivityOptions({
                activityOption: activities.data.data,
                activitySpecificationOption: specs.data.data
            });
        });

        const handleLiveUpdate = (event) => {
            const newTicket = event.detail;
            setTickets((prev) => {
                if (prev.find(t => t.id === newTicket.id)) return prev;
                return [newTicket, ...prev];
            });
        }
        const handleTicketUpdate = (event) => {
            const updatedTicket = event.detail;
            setTickets((prev) => {
                const index = prev.findIndex(ticket => ticket.id === updatedTicket.id);
                if (index !== -1) {
                    const newTickets = [...prev];
                    newTickets[index] = updatedTicket;
                    return newTickets;
                }
                return prev;
            });
        }
        window.addEventListener("status-updated-notification", handleTicketUpdate);
        window.addEventListener("updated-priority-notification", handleTicketUpdate);
        window.addEventListener("ticket-cancelled-notification", handleTicketUpdate);
        window.addEventListener("new-ticket-notification", handleLiveUpdate);

        return () => {
            window.removeEventListener("new-ticket-notification", handleLiveUpdate);
            window.removeEventListener("status-updated-notification", handleTicketUpdate);
            window.removeEventListener("updated-priority-notification", handleTicketUpdate);
            window.removeEventListener("ticket-cancelled-notification", handleTicketUpdate);
        };


    }, [])

    useEffect(() => {
        fetchTickets();
    },[])

    const updateTicketCriticalLevel = useCallback((ticket, criticalLevel) => {
        
        const updatedTicket = {...ticket, priority: {...ticket.priority, id: Number(criticalLevel) }};
        updateTicket(updatedTicket);
        

        axiosClient.patch(`api/tickets/${ticket.id}/priority`, { priority_id: criticalLevel })
            .catch(error => {
                setTickets(snapshot);
                console.error('Error. Rolling back to snapshot...', error);
                toast.error("Failed to update critical level. Please try again.");
            });
    }, [])

    
    const columns = useMemo(() => [
    {
        accessorKey: "activitySpecification",
        header: "Activity Specification",
        cell: ({cell}) => {
            const row = cell.row.original;  
            return(
                <div>
                    <p>{row.activitySpecification.name}</p>
                    <p className="text-xs text-gray-400">{row.activity.name}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "requester",
        header: "Service Requester",
        cell: ({cell}) => {
            const row = cell.row.original;
            return (
                <div>
                    <p key={row.requester.id}>{row.requester.name}</p>
                    <p key={row.requester.office_department_division.id} className="text-xs text-gray-400">{row.requester.office_department_division.name}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ cell }) => {
            const currentStatus = [3, 4, 5, 6].includes(cell.row.original.status.id);
            const styling = {
                Critical: {
                icon: <Flame strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>
                },
                High: {
                icon: <OctagonAlert strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>
                },
                Medium: {
                icon: <CircleEqualIcon strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>
                },
                Low: {
                icon: <CircleChevronDown strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>
                }
            };

            const handleChange = (newValue) => {
                requestAnimationFrame(() => {
                    const numericValue = Number(newValue);
                    updateTicketCriticalLevel(cell.row.original, numericValue);
                });
            }

            if(currentStatus) {
                return (
                    <div className="flex flex-row gap-2">
                        {styling[cell.row.original.priority.name.trim()]?.icon}
                        <p>{cell.row.original.priority.name}</p>
                    </div>
                )
            }
            return (
                <>
                <Select onValueChange={handleChange} value={cell.row.original?.priority?.id?.toString() || undefined} disabled={currentStatus}>
                    <SelectTrigger className="flex flex-row w-50" size="sm">
                        <SelectValue placeholder="Assign Priority Level" className="flex flex-row"/>
                    </SelectTrigger>
                    <SelectContent align="end">
                        <SelectGroup>
                            <SelectLabel>Set Priority</SelectLabel>
                            <SelectItem value="1"> 
                                {styling["Critical"].icon}
                                Critical
                                </SelectItem>
                            <SelectItem value="2">
                                {styling["High"].icon}
                                High
                                </SelectItem>
                            <SelectItem value="3">
                                {styling["Medium"].icon}
                                Medium
                                </SelectItem>
                            <SelectItem value="4">
                                {styling["Low"].icon}
                                Low
                                </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                </>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ cell }) => {
            const status = cell.row.original; // Get the value (e.g., "Critical")
            const styling = {
                    Open: {
                        color: "text-blue-700",
                        bg:"bg-blue-700/10",
                        icon: <MessageCircleQuestionMark strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>
                    },
                    Assigned: {
                        color: "text-purple-700",
                        bg: "bg-purple-700/10",
                        icon: <UserCog strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>
                    },
                    Responded: {
                        color: "text-yellow-700",
                        bg: "bg-yellow-700/10",
                        icon: <Wrench strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>
                    },
                    Resolved: {
                        color: "text-emerald-700",
                        bg: "bg-emerald-700/10",
                        icon: <ClipboardCheck strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>
                    },
                    Closed: {
                        color: "text-zinc-950",
                        bg: "bg-zinc-950/10",
                        icon: <CircleDot strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>
                    },
                    Cancelled: {
                        color: "text-slate-700",
                        bg: "bg-slate-700/10",
                        icon: <CircleMinus strokeWidth={2} className="w-4 h-4 text-slate-700" data-icon="inline-end"/>
                    }
                };
            return (
                <>
                    <div className="space-x-2 flex items-center">
                        <Badge variant="outline" className={`${styling[status.status.name]?.color || ''} ${styling[status.status.name]?.bg || ''}`}>
                            <div className="flex items-center gap-2">
                                {styling[status.status.name]?.icon || ''}
                                <span>{status.status.name}</span>
                            </div>
                        </Badge>
                        {
                            Array.isArray(status.assignment) && status.assignment.length > 0 && status.status.id === 2 && (
                                <Badge variant="outline">
                                    <span className="bg-slate-300 w-4 h-4 rounded-full text-xs text-center">{status.assignment.length}</span>
                                    <span>{status.status.name}</span>
                                    
                                </Badge>
                            )
                        }
                    </div>
                </>
            )
        }
    },
    {
        accessorKey: "created_at",
        header: "Ticket Created At",
        cell: ({cell}) => {
            const row = cell.row.original;
            const date = format(new Date(row.created_at), 'MMM dd yyyy, hh:mmaa');
            return (
                <div>
                    <p>{date}</p>
                    <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(row.created_at), { addSuffix: true })}</p>
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({row}) => {
            const ticket = row.original;
            return (
                <ActionCell ticket={ticket} nav={nav} setTicket={setTicket} setOpenAssign={setOpenAssign} setDeleteOpen={setDeleteOpen} />
            )
        }
    }
    ], []);

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 flex-1">
                <div className="px-6 flex justify-between items-center">
                    <SearchInput setLoading={setIsLoading} className="w-2xl"/>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                                <Button className="flex items-center gap-2 hover:cursor-pointer" size="sm">
                                    <Plus className="w-4 h-4" />
                                    <span className="hidden @4xl/main:inline">Add Ticket</span>
                                </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-5xl">
                            <AddTicket setOpen={setOpen} fetchTickets={fetchTickets} activityOption={activityOptions}/>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="flex lg:flex-row flex-col px-6 justify-between gap-5 w-full">
                    <div className="flex-row flex gap-3 items-center w-full">
                        <div className="flex-col flex gap-2 w-full">
                            <label htmlFor="ticket-activity" className="font-medium text-xs text-slate-500">
                                Activity
                            </label>
                            <Select defaultValue="all" onValueChange={(value) => {
                                if(params.activitySpecification_id !== "all") {
                                    setParams({activitySpecification_id: "all", activity_id: value});
                                }
                                setParams({activity_id: value});
                            }} >
                                <SelectTrigger className="flex w-full"
                                    size="lg"
                                    id="ticket-activity"
                                >
                                    <SelectValue placeholder="Select Activity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key="all" value="all">
                                        All Activities
                                    </SelectItem>
                                    {
                                        activityOptions?.activityOption?.map((option) => (
                                            <SelectItem key={option.id} value={option.id.toString()}>{option.name}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-col flex gap-2 w-full">
                            <label htmlFor="ticket-specification" className="font-medium text-xs text-slate-500">
                                Activity Specification
                            </label>
                            <Select value={params.activitySpecification_id  } defaultValue="all" onValueChange={(value) => setParams({activitySpecification_id: value})} >
                                <SelectTrigger className="flex w-full"
                                    size="lg"
                                    id="ticket-specification"
                                >
                                    <SelectValue placeholder="Select Activity Specification" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Activity Specification
                                    </SelectItem>
                                    {
                                        params.activity_id == "all" ? 
                                        activityOptions.activitySpecificationOption?.map((option) => (
                                            <SelectItem key={option.id} value={option.id.toString()}>{option.name}</SelectItem>
                                        )) : (
                                            activityOptions?.activitySpecificationOption?.filter((option) => option.related_activity.id == params.activity_id).map((option) => (
                                                <SelectItem key={option.id} value={option.id.toString()}>{option.name}</SelectItem>
                                            ))
                                        )

                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-col flex gap-2 w-full">
                            <label htmlFor="Account-roles-selector" className="font-medium text-xs text-slate-500">
                                Priority
                            </label>
                            <Select defaultValue="all" onValueChange={(value) => setParams({priority_id: value})}>
                                <SelectTrigger className="flex w-full"
                                    size="lg"
                                    id="ticket-specification"
                                >
                                    <SelectValue placeholder="Select Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        Priority.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>
                                                <option.icon strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>
                                                {option.name}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-col flex gap-2 w-full">
                            <label htmlFor="Account-roles-selector" className="font-medium text-xs text-slate-500">
                                Status
                            </label>
                            <Select defaultValue="all" onValueChange={(value) => setParams({status_id: value})}>
                                <SelectTrigger className="flex w-full"
                                    size="lg"
                                    id="ticket-specification"
                                >
                                    <SelectValue placeholder="Select Activity Specification" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        Status.map((option) => (
                                            <SelectItem key={option.id} value={option.id.toString()}>
                                                <option.icon strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>
                                                {option.name}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        
                    </div>
                </div>
                <div className="h-full relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 justify-between">
                    <DataTables columns={columns} act={activityOptions.activityOption} actspec={activityOptions.activitySpecificationOption} />
                </div>
                </div>
            </div>
            <DeleteTicket open={deleteOpen} setOpen={setDeleteOpen} ticket={ticket} fetchTickets={fetchTickets}/>
            <AssignTicket open={openAssign} setOpen={setOpenAssign} ticket={ticket} fetchTicket={fetchTickets} assignedOfficer={ticket?.assigment} isDialogbox={true} />
        </div>
    )
}

const Priority = [
    {
        id: "all",
        name: "All Priorities",
        icon: SquareMenu
    },
    {
        id: 1,
        name: "Critical",
        icon: Flame
    },
    {
        id: 2,
        name: "High",
        icon: OctagonAlert
    },
    {
        id: 3,
        name: "Medium",
        icon: CircleEqualIcon,
    },
    {
        id: 4,
        name: "Low",
        icon: CircleChevronDown
    },
    {
        id: 5,
        name: "No Priority",
        icon: Circle
    }
]

const Status = [
    {
        id: "all",
        name: "All Statuses",
        icon: SquareMenu
    },
    {
        id: 1,
        name: "Open",
        icon: MessageCircleQuestionMark
    },
    {
        id: 2,
        name: "Assigned",
        icon: UserCog
    },
    {
        id: 3,
        name: "Responded",
        icon: Wrench
    },
    {
        id: 4,
        name: "Resolved",
        icon: ClipboardCheck
    },
    {
        id: 5,
        name: "Closed",
        icon: CircleDot
    }
]

const SearchInput = ({className}) => {
    const {setParams, setLoading} = useTicketStore();
    const [localValue, setLocalValue] = useState("");
    const isFirstRender = useRef(true);
    
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            setParams({ search: localValue });
        }, 500);
        return () => clearTimeout(timer);
    }, [localValue, setParams])

    return (
        <div className={className}>
            <label htmlFor="Account-roles-selector" className="font-medium text-xs text-slate-500">
                Search Ticket
            </label>
            <input 
                type="text" 
                placeholder="Enter ticket details..." 
                value={localValue}
                onChange={(e) => {
                    setLocalValue(e.target.value);
                    setLoading(true);
                }} 
                className={`w-full text-sm border border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:ring-2 focus:ring-slate-500`}
            >
            </input>
        </div>
    )
}

const ActionCell = memo(({ ticket, nav, setTicket, setOpenAssign, setDeleteOpen }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild >
                <Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" size="icon" onClick={(e) => e.stopPropagation()}>
                    <EllipsisVertical/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => nav(`/ticket/${ticket.ticketId}/details`)} onClick={(e) => e.stopPropagation()}>
                    <Eye className="w-4 h-4" data-icon="inline-start"/>
                    Details
                </DropdownMenuItem>
                {
                    [3, 4, 5, 6].includes(ticket.status.id) ?
                    null : 
                    <DropdownMenuItem onSelect={() => {
                        setTicket(ticket);
                        setOpenAssign(true);
                        
                    }}
                        onClick={(e) => e.stopPropagation()}>
                        <UserCog className="w-4 h-4" data-icon="inline-start"/>
                        Assign
                    </DropdownMenuItem>
                }
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive"
                    onClick={(e) => e.stopPropagation()}
                    onSelect={() => {
                        setTicket(ticket);
                        setDeleteOpen(true);
                    }}>
                    <Trash className="w-4 h-4" data-icon="inline-start"/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
    </DropdownMenu>
    )
})