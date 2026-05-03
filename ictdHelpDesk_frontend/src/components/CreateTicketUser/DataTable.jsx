import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { use, useMemo, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "../ui/select";
import { CircleChevronDown, CircleDot, CircleEqual, CircleEqualIcon, Ellipsis, Flame, MessageCircleQuestionMark, Notebook, OctagonAlert, UserCog, Wrench } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

const DataTables = ({data, isLoading}) => {
    const nav = useNavigate();
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
        accessorKey: "priority",
        header: "Priority",
        cell: ({ cell }) => {
            const priority = cell.row.original.priority; 

            const styling = {
                Critical: {
                    name: "Critical",
                    icon: <Flame strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>,
                    color: "text-red-700",
                    bg: "bg-red-700/10"
                },
                High: {
                    name: "High",   
                    icon: <OctagonAlert strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>,
                    color: "text-orange-700",
                    bg: "bg-orange-700/10"
                },
                Medium: {
                    name: "Medium",
                    icon: <CircleEqual strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>,
                    color: "text-yellow-700",
                    bg: "bg-yellow-700/10"
                },
                Low: {
                    name: "Low",
                    icon: <CircleChevronDown strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>,
                    color: "text-green-700",
                    bg: "bg-green-700/10"
                }
                
            };

            return (
                <Badge variant="outline" className={`${styling[priority.name]?.color || ''} ${styling[priority.name]?.bg || ''}`}>
                    <div className="flex items-center gap-2">
                        {styling[priority.name]?.icon || ''}
                        <span>{styling[priority.name]?.name || priority.name}</span>
                    </div>
                </Badge>
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
                        color: "text-emerald-700",
                        bg: "bg-emerald-700/10",
                        icon: <Wrench strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>
                    },
                    Closed: {
                    color: "text-slate-700",
                    bg: "bg-slate-700/10",
                    icon: <CircleDot strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>
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
                            Array.isArray(status.assignment) && status.assignment.length > 0 && (
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
        cell: ({cell}) => {
            const row = cell.row.original;
            return (
                <div className="w-full flex justify-end px-4">
                    <Button variant="ghost" size="icon" onClick={() => nav(`/ticket/${row.ticketId}/details`)}>
                        <Ellipsis className="w-5 h-5"/>
                    </Button>
                </div>
            )
        }
    }
],[])


    // const table = useReactTable({
    //     data: data || [],
    //     columns,
    //     getCoreRowModel: getCoreRowModel(),
    //     getPaginationRowModel: getPaginationRowModel(),
    //     getSortedRowModel: getSortedRowModel()
    // })

    return (
       <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:pb-6 flex-1">
                    <div className="px-4 flex flex-col gap-4 md:px-6 lg:px-8">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Your Recent Tickets</h2>
                            <p className="text-muted-foreground text-sm">Here are the tickets you have submitted recently.</p>
                        </div>
                    </div>
                    <div className="mx-4 grid grid-cols-5 grid-rows-2 gap-4 md:mx-6 lg:mx-8 ">
                        {
                            data ? 
                                data.map((ticket) => (
                                    <RecentTicketCard ticket={ticket} key={ticket.id}/>
                                ))
                            : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DataTables;

const RecentTicketCard = ({ticket}) => {
    const nav = useNavigate();

    const criticalityStyling = {
        Critical: {
            icon: <Flame strokeWidth={2} className="w-6 h-6" data-icon="inline-start"/>,
            color: "text-red-700",
            bg: "bg-red-700/10"
        },
        High: {
            icon: <OctagonAlert strokeWidth={2} className="w-6 h-6" data-icon="inline-start"/>,
            color: "text-orange-700",
            bg: "bg-orange-700/10"
        },
        Medium: {
            icon: <CircleEqualIcon strokeWidth={2} className="w-6 h-6" data-icon="inline-start"/>,
            color: "text-yellow-700",
            bg: "bg-yellow-700/10"
        },
        Low: {
            icon: <CircleChevronDown strokeWidth={2} className="w-6 h-6" data-icon="inline-start"/>,
            color: "text-blue-700",
            bg: "bg-blue-700/10",
        }
    }

    const statusStyling = {
        Open: {
            icon: <MessageCircleQuestionMark strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>,
            color: "text-blue-700",
            bg: "bg-blue-700/10"
        },
        Assigned: {
            icon: <UserCog strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>,
            color: "text-purple-700",
            bg: "bg-purple-700/10"
        },
        Responded: {
            icon: <Wrench strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>,
            color: "text-yellow-700",
            bg: "bg-yellow-700/10"
        },
        Resolved: {
            icon: <CircleEqual strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>,
            color: "text-green-700",
            bg: "bg-green-700/10"
        },
        Closed: {
            icon: <CircleDot strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>,
            color: "text-gray-700",
            bg: "bg-gray-700/10"
        }
    }

    return (
        <Card className="pb-2 flex flex-col justify-between">
            <CardHeader className="">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Badge variant="outline" className={statusStyling[ticket.status.name]?.bg + " " + statusStyling[ticket.status.name]?.color}>
                        <div className="flex items-center gap-2">
                            {statusStyling[ticket.status.name]?.icon}
                            <p>{ticket.status.name}</p>
                        </div>
                    </Badge>
                    <CardDescription>
                        {formatDistanceToNow(new Date(ticket.created_at)) > 1 ? formatDistanceToNow(new Date(ticket.created_at)) : format(new Date(ticket.created_at), 'MMM dd yyyy, hh:mmaa')}
                    </CardDescription>
                </div>
                <div className="flex flex-row items-start gap-2">
                    <div className={criticalityStyling[ticket.priority.name.trim()]?.bg + " " + criticalityStyling[ticket.priority.name.trim()]?.color + " rounded-md p-2 flex items-center justify-center w-10 h-10"}>
                            {criticalityStyling[ticket.priority.name.trim()]?.icon}
                    </div>
                    <div>
                        <p className="font-bold"> {ticket?.activitySpecification?.name}</p>
                        <p className="text-xs text-slate-500"> {ticket?.activity?.name}</p>
                    </div>
                </div>
            </CardHeader>
            {/* <CardContent>
                
            </CardContent> */}
            <CardFooter className="border-t flex flex-row justify-between [.border-t]:pt-2 pr-2">
                <div className="flex flex-row items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center justify-center">
                        <UserCog strokeWidth={2} className="w-4 h-4 inline mr-1" data-icon="inline-start"/>
                        <span className="text-sm">10</span>
                    </div>
                    <div className="flex items-center justify-center">
                        <Notebook strokeWidth={2} className="w-4 h-4 inline mr-1" data-icon="inline-start"/>
                        <span className="text-sm">0</span>
                    </div>
                </div>
                <Button variant="outline" size="icon" onClick={() => nav(`/ticket/${ticket.ticketId}/details`)}>
                    <Ellipsis className="w-5 h-5"/>
                </Button>
            </CardFooter>
        </Card>
    )
}