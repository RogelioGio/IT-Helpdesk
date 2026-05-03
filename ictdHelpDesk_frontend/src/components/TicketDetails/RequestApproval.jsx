import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { use, useEffect, useState } from "react"
import { CircleCheck, CircleX, MonitorCog, Users, UserStar, Wrench } from "lucide-react"
import { Badge } from "../ui/badge"
import axiosClient from "@/AxiosClient"
import { toast } from "sonner"
import { useTicketStore } from "@/stores/useTicketStore"

const RequestApproval = ({ open, setOpen }) => {
        const {ticket} = useTicketStore() 
        const [requests, setRequests] = useState([])
        useEffect(() => {
            if (ticket?.assignmentRequests) {
                setRequests(ticket.assignmentRequests);
            }           
        }, [ticket])


        const coloumns = [
            {
                accessorKey: "user",
                id: "Requester",
                header: "Requester",
                cell: ({ cell }) => {
                    const user = cell.getValue();
                    return <div className="flex flex-col gap-1">
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.designation}</p>
                    </div>
                }
                
            },
            {
                id: "Office/Department/Division",
                header: "Office/Department/Division",
                cell: ({ cell }) => {
                    const row  = cell.row.original;
                    return row?.user.office_department_division?.name || 'N/A'
                }
            },
            {
                id: "Role",
                header: "Role",
                cell: ({ cell }) => {``
                    const row  = cell.row.original;
                    const roleStyle = roleStyling[row?.user.accountRole?.replace(/\s+/g, '')];
                    return <Badge variant="outline" className={`${roleStyle?.color || 'bg-gray-100 text-gray-800'}`}>
                        <roleStyle.icon/>
                        {roleStyle?.text || row?.user.accountRole || 'N/A'}
                    </Badge>
                }
            },
            {
                id: "Actions",
                cell: ({cell}) => {
                    const row  = cell.row.original;
                    return (
                        <div className="w-full flex flex-row gap-2 justify-end items-end pr-6">
                            <Button size="sm" variant="destructive" onClick={() => {handleDescision(row.id, 'rejected')}}>
                                <CircleX className="w-4 h-4 mr-1"/>
                                Reject</Button>
                            <Button size="sm" onClick={() => {handleDescision(row.id, 'approved')}}>
                                <CircleCheck className="w-4 h-4 mr-1"/>
                                Approve</Button>
                        </div>
                    )
                }
            }
        ]

        const table = useReactTable({
            data: requests || [],
            columns: coloumns,
            getCoreRowModel: getCoreRowModel(),
            getRowId: (row) => row.id,
        })

        const handleDescision = (requestId, decision) => {
            const backup = [...requests];
            console.log(requestId, decision)
            
            // Make API call to update request status
            // If API call fails, revert to backup
            // setRequests(backup);

            var request
            decision === 'approved' ?
            request = axiosClient.post(`api/assignments/${requestId}/accept`)
            :
            request = axiosClient.post(`api/assignments/${requestId}/reject`)


            toast.promise(request, {
                loading: 'Processing request...',
                success: () => {
                    setRequests(requests.filter(request => request.id !== requestId));
                    return `Request ${decision} successfully.`
                },
                error: 'Failed to process request.'
            });
        }

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-7xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Manage Request Assignments</DialogTitle>
                        <DialogDescription className="text-sm text-gray-700 hidden lg:flex">
                                View and manage all assignment requests for this ticket. Approve or reject pending requests, and communicate with officers regarding their assignments.
                        </DialogDescription>
                        <DialogDescription className="text-sm text-gray-700 lg:hidden flex sm:text-left text-center">
                                View and manage all assignment requests for this ticket. Approve or reject pending requests, and communicate with officers regarding their assignments.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="overflow-hidden rounded-lg border">
                        <Table>
                            <TableHeader className="bg-muted sticky top-0 z-10">
                                {
                                    table.getHeaderGroups().map(headerGroup => (
                                        <TableRow key={headerGroup.id}>
                                            {
                                                headerGroup.headers.map(header => (
                                                    <TableHead key={header.id} className="pl-6">
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                    </TableHead>
                                                ))
                                            }
                                        </TableRow> 
                                    ))
                                }
                            </TableHeader>
                            <TableBody>
                                {
                                    table.getRowModel().rows.length > 0 ?
                                    table.getRowModel().rows.map(row => (
                                        <TableRow key={row.id}>
                                            {
                                                row.getVisibleCells().map(cell => (
                                                    <TableCell key={cell.id} className="py-4 pl-6">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    ))
                                    :
                                    <TableRow>
                                        <TableCell colSpan={coloumns.length} className="text-center py-4">
                                            No pending requests for this ticket.
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
}


export default RequestApproval

const roleStyling = {
        Administrator: {
            text: "Administrator",
            color: "bg-purple-100 text-purple-800",
            icon: MonitorCog
        },
        Manager: {  
            text: "Manager",
            color: "bg-blue-100 text-blue-800",
            icon: Users
        },
        Officer: {
            text: "Officer",
            color: "bg-green-100 text-green-800",
            icon: Wrench
        },
        SystemAdmin: {
            text: "System Admin",
            color: "bg-slate-100 text-slate-800",
            icon: UserStar
        }
    }