import { useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { format, formatDistanceToNow } from "date-fns";
import { CircleChevronDown, CircleEqualIcon, Flame, MessageCircleQuestionMark, Octagon, OctagonAlert, UserCog, Wrench } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";


const DeleteTicket = ({ ticket, open, setOpen, fetchTickets }) => {
    const tableData = useMemo(() => (ticket ? [ticket] : []), [ticket]);
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
            cell: ({cell}) => {
                const row = cell.row.original;
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

                return (
                    <div className="flex items-center gap-2">
                        {styling[row.priority.name.trim()]?.icon || ''}
                        <span>{row.priority.name}</span>
                    </div>
                )}
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({cell}) => {
                const status = cell.row.original;
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
                    bg: "bg-slate-700/10"
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
    ], [ticket]); 
    
    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
       <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-7xl">
                <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Delete Ticket</DialogTitle>
                        <DialogDescription className="text-sm text-gray-700 hidden lg:flex">
                                Are you sure you want to delete this ticket? This action cannot be undone. Please confirm your decision by clicking the "Delete" button below.
                        </DialogDescription>
                        <DialogDescription className="text-sm text-gray-700 lg:hidden flex sm:text-left text-center">
                                Are you sure you want to delete this ticket? This action cannot be undone.
                        </DialogDescription>
                </DialogHeader>
                <p className="text-sm text-gray-500">Ticket to be deleted:</p>
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                                {
                                    table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id}>
                                                    {
                                                        header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())
                                                    }
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))
                                }
                            </TableHeader>
                            <TableBody>
                                {
                                    table.getRowModel().rows.length ?
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {
                                                row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    )): null
                                }
                            </TableBody>
                    </Table>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={() => {}}>Delete</Button>
                </DialogFooter>
            </DialogContent>
       </Dialog>
    )
}

export default DeleteTicket;