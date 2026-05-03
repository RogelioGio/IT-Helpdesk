import { CircleCheck, File, MonitorCog, UserCog, Users, UserStar, UserX, Wrench } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useEffect, useMemo, useState } from "react"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../ui/table"
import { Skeleton } from "../ui/skeleton"
import RequestTicketAssignment from "./RequestTicketAssignment"
import { useAuth } from "@/contexts/AuthProvider"
import RequestApproval from "./RequestApproval"
import AssignTicket from "../TicketManagement/AssignTicket"

const TicketAssignedOfficers = ({ assignedOfficers, isLoading, ticket, getTicket }) => {
    const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
    const [isRequestApprovalOpen, setIsRequestApprovalOpen] = useState(false)
    const [openAssign, setOpenAssign] = useState(false)
    const {user, accountRole} = useAuth();

    const isAssigned = assignedOfficers?.some(officer => officer.id === user?.id);
    const hasRequestedAssignment = ticket?.assignmentRequests?.some(r => r?.user?.id === user?.id);

    
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


const columns = useMemo(() => [
    {
        id:"fullename",
        header: "Officer",
        cell: ({row}) => {;
            return <div>
                <p className="font-medium text-sm">{row.original.name}</p>
                <p className="text-xs text-muted-foreground">{row.original.designation}</p>
            </div>;
        }
    },
    {
        accessorKey: "office_department_division",
        header: "Office/Department/Division",
        cell: ({ cell }) => {
            const row  = cell.row.original;
            return row.office_department_division.name
        }
    },
    {
        accessorKey: "accountrole",
        header: "Role",
        cell: ({ cell }) => {
            const { accountRole } = cell.row.original;
            const RoleIcon = roleStyling[accountRole]?.icon || UserStar;

            return <Badge variant="outline" className={`${roleStyling[accountRole]?.color}`}>
                <RoleIcon className="w-3 h-3 mr-2" />
                {accountRole}
            </Badge>
        }
    }
    ],[]);


    const table = useReactTable({
        data: assignedOfficers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
    })


    return (
        <>
            {
                isLoading ? 
                <Skeleton className=" h-50 rounded-md mr-6 hidden md:flex" /> :
                <>
                <div className="mr-6 flex-col gap-4 hidden md:flex">
                    <div className="overflow-hidden rounded-lg border">
                        <div className="flex w-full justify-between items-center px-6 py-4 bg-muted border-b">
                            <div className="flex flex-row items-center">
                                <Wrench strokeWidth={2} className="w-6 h-6 mr-2" data-icon="inline-start"/>
                                <p className="font-medium text-sm">Assigned Officers</p>
                                <Badge className="ml-2">{assignedOfficers.length}</Badge>
                            </div>
                            <div className="flex flex-row gap-2">
                                {
                                    ticket.assignmentRequests?.length > 0 && (accountRole === "Manager" || accountRole === "SystemAdmin" || accountRole === "Administrator") &&
                                    <Button variant="outline" onClick={() => setIsRequestApprovalOpen(true)}>
                                        <File strokeWidth={2} className="w-4 h-4 mr-2" data-icon="inline-start"/>
                                        Requests
                                        <Badge className="ml-2">{ticket.assignmentRequests.length}</Badge>
                                    </Button>
                                }
                                {
                                    ticket.status?.name === "Open" && (accountRole !== "User") ?
                                    <Button onClick={() => setIsRequestDialogOpen(true)} disabled={(isAssigned || hasRequestedAssignment) || ticket.priority?.id == null ? true : false} variant={isAssigned || hasRequestedAssignment ? "outline" : "default"}>
                                        {
                                            isAssigned || hasRequestedAssignment ?
                                            <>
                                                <CircleCheck strokeWidth={2} className="w-4 h-4 mr-2" data-icon="inline-start"/>
                                                {hasRequestedAssignment ? "Request Sent" : "Already Assigned"}
                                            </>
                                            :
                                            <>
                                                <UserStar strokeWidth={2} className="w-4 h-4 mr-2" data-icon="inline-start"/>
                                                Request Assignment
                                            </>
                                        }
                                    </Button> : null
                                }
                                {
                                    (ticket.status?.name === "Open" || ticket.status?.name === "Assigned") && (accountRole === "Manager" || accountRole === "SystemAdmin" || accountRole === "Administrator")?
                                    <Button onClick={() => setOpenAssign(true)} disabled={ticket.priority?.id == null ? true : false} variant={ticket.priority?.id == null ? "outline" : "default"} >
                                        <UserCog strokeWidth={2} className="w-4 h-4 mr-2" data-icon="inline-start"/>
                                        Assign Officer
                                    </Button> : null
                                }
                            </div>
                        </div>
                        <Table>
                            <TableHeader className="bg-muted sticky top-0 z-10">
                                {
                                    table.getHeaderGroups().map(headerGroup => (
                                        <TableRow key={headerGroup.id}>
                                            {
                                                headerGroup.headers.map(header => (
                                                    <TableHead key={header.id} className="pl-6">
                                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                    </TableHead>
                                                ))
                                            }
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
                                                <TableCell key={cell.id} className="pl-6">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                    </TableRow>
                                )) : 
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center py-4">
                                        <div className="p-6 flex flex-col items-center justify-center gap-4">
                                            <div className="bg-slate-200/50 size-12 rounded-md flex items-center justify-center">
                                                <UserX className="size-6 text-slate-700" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-slate-700">No Assigned Officers</p>
                                                <p className="text-xs text-slate-700">Assign an officer to this ticket</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                    </div>
                </div>
                
                <RequestTicketAssignment open={isRequestDialogOpen} setOpen={setIsRequestDialogOpen} ticket={ticket} getTicket={getTicket}/>
                <RequestApproval open={isRequestApprovalOpen} setOpen={setIsRequestApprovalOpen} />
                <AssignTicket open={openAssign} setOpen={setOpenAssign} ticket={ticket} fetchTicket={getTicket} assignedOfficer={ticket?.assigment} isDialogbox={true} />
                </>
            }
    </>
    )
}

export default TicketAssignedOfficers

