import { use, useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import axiosClient from "@/AxiosClient";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, ChevronsRight, Contact, LayoutList, MonitorCog, Shield, User, UserCog, Users, Wrench } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const AssignTicket = ({ ticket, fetchTicket, refreshTicket, open, setOpen, assignedOfficer = [], isDialogbox = false }) => {
    const [data, setData] = useState([]);
    const [isloading, setIsLoading] = useState(false);
    const [roleFilter, setRoleFilter] = useState("all-user")
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
        User: {
            text: "User",
            color: "bg-yellow-100 text-yellow-800",
            icon: User
        },
        SystemAdmin: {
            text: "System Admin",
            color: "bg-slate-100 text-slate-800",
            icon: MonitorCog
        }
    }

    const columns = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
                </div>
            )
        },
        {
            accessorKey: "employeeID",
            header: "Employee ID",
        },
        {
            id: "fullname",
            header: "Full Name",
            cell: ({ row }) => {
                const { firstName, middleName, lastName } = row.original;
                const middleInitials = middleName ? `${middleName.charAt(0)}.` : "";
                return `${firstName} ${middleInitials} ${lastName}`;
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
            accessorKey: "accountroles",
            header: "Role",
            cell: ({ cell }) => {
                const { accountroles } = cell.row.original;
                const RoleIcon = roleStyling[accountroles.name]?.icon || User;

                return <Badge variant="outline" className={`${roleStyling[accountroles.name]?.color}`}>
                    <RoleIcon className="w-3 h-3 mr-2" />
                    {accountroles.name}
                </Badge>
            }
        }

    ], [])

     const filterRoles = useMemo(() => {
        if(roleFilter === "all-user") return data;
        return data.filter((user) => user.accountroles.id === parseInt(roleFilter));
    },[roleFilter, data])


    const table = useReactTable({
        data: filterRoles,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
    })

    const getOfficers = () => {
        axiosClient.get('api/responders')
        .then(({data}) => {
            setData(data.data)
            
        })
        .catch((error) => {
            console.error('Error fetching officers:', error);
            toast.error("Failed to fetch officers. Please try again later.")
        })
    }

    useEffect(() => {
        if(Array.isArray(ticket?.assignment) && ticket?.assignment.length > 0) {
            const initialSelection = ticket?.assignment.reduce((acc, row) => {
                acc[row.id] = true;
                return acc;
            }, {})
            table.setRowSelection(initialSelection);
        } else {
            const initialSelection = {};
            table.setRowSelection(initialSelection);
        }

    }, [open])

    useEffect(() => {
        getOfficers();
    },[])

    const handleAssign = () => {
        const assignedIds = table.getSelectedRowModel().rows.map(row => row.original.id);
        const req = axiosClient.patch(`api/tickets/${ticket.id}/assign`, {
                "assigned_to" : assignedIds
            })

        toast.promise( req, {
            loading: "Assigning officers...",
            success: (data) => {
                setOpen(false);
                if (refreshTicket) {
                    refreshTicket(ticket.ticketId);
                } else if (fetchTicket) {
                    fetchTicket(ticket.ticketId);
                }
                return "Officers assigned successfully!";
            },
            error: (error) => {
                console.error("Error assigning officers:", error);
                return "Failed to assign officers.";
            }
        })
    }

    const isNewAssigned = (assignedOfficer) => {
        const old = assignedOfficer.map(officer => officer.id);
        const assignedIds = table.getSelectedRowModel().rows.map(row => row.original.id);
        
        if (old.length !== assignedIds.length) return true;
        const isSame = old.every(id => assignedIds.includes(id));
        
        return !isSame;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-5xl">
                    <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Assign Ticket</DialogTitle>
                            <DialogDescription className="text-sm text-gray-700 hidden lg:flex">
                                    Assign an existing ticket to a user by modifying the form below. Please ensure that all required fields are completed accurately to assign the ticket successfully.
                            </DialogDescription>
                            <DialogDescription className="text-sm text-gray-700 lg:hidden flex sm:text-left text-center">
                                    Assign an existing ticket to a user by modifying the form below.
                            </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-1 flex-col pb-8 h-full">
                    <Tabs defaultValue="all-user"  
                        className="w-full flex-col justify-start gap-6 flex-1"
                        onValueChange={(value) => setRoleFilter(value)} >
                        <div className="flex items-center justify-between" >
                            <div className="flex flex-row gap-2 justify-between items-center w-full">
                                <div>
                                    <label htmlFor="view-selector" className="sr-only">
                                        User Types
                                    </label>
                                    <Select defaultValue="all-user" onValueChange={(value) => setRoleFilter(value)}>
                                        <SelectTrigger className="flex w-fit @4xl/main:hidden"
                                            size="sm"
                                            id="view-selector"
                                        >
                                            <SelectValue placeholder="Select User Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all-user">
                                                <LayoutList className="w-4 h-4" data-icon="inline-start"/>
                                                All Responders
                                            </SelectItem>
                                            <SelectItem value="3">
                                                <Users className="w-4 h-4" data-icon="inline-start"/>
                                                Managers</SelectItem>
                                            <SelectItem value="4">
                                                <Wrench className="w-4 h-4" data-icon="inline-start"/>
                                                Officers</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                                        <TabsTrigger value="all-user" className="hover:cursor-pointer">
                                            <Contact className="w-4 h-4" data-icon="inline-start"/>
                                            All Users</TabsTrigger>
                                        <TabsTrigger value="2" className="hover:cursor-pointer">
                                            <MonitorCog className="w-4 h-4" data-icon="inline-start"/>
                                            Administrator</TabsTrigger>
                                        <TabsTrigger value="3" className="hover:cursor-pointer">
                                            <Users className="w-4 h-4" data-icon="inline-start"/>
                                            Managers</TabsTrigger>
                                        <TabsTrigger value="4" className="hover:cursor-pointer">
                                            <Wrench className="w-4 h-4" data-icon="inline-start"/>
                                            Officers</TabsTrigger>
                                    </TabsList>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex flex-col gap-4 overflow-auto  justify-between h-full">
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
                                                        ))}
                                                </TableRow>
                                            )) : null
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex items-center justify-between">
                            <div className="hidden items-center gap-2 lg:flex">
                                <Select
                                    value={`${table.getState().pagination.pageSize}`}
                                    onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                    }}
                                >
                                    <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                    <SelectValue
                                        placeholder={table.getState().pagination.pageSize}
                                    />
                                    </SelectTrigger>
                                    <SelectContent side="top">
                                    {[10, 20, 30, 40].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <label htmlFor="rows-per-page" className="text-sm font-medium">
                                    Rows per page
                                </label>
                            </div>
                                <div className="flex w-full items-center gap-8 lg:w-fit">
                            <div className="flex w-fit items-center justify-center text-sm font-medium">
                                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                                    {table.getPageCount()}
                                    </div>
                                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                                    <Button
                                        variant="outline"
                                        className="hidden h-8 w-8 p-0 lg:flex"
                                        onClick={() => table.setPageIndex(0)}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <span className="sr-only">Go to first page</span>
                                        <ChevronLeft />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="size-8"
                                        size="icon"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <span className="sr-only">Go to previous page</span>
                                        <ChevronLeft />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="size-8"
                                        size="icon"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <span className="sr-only">Go to next page</span>
                                        <ChevronRight />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="hidden size-8 lg:flex"
                                        size="icon"
                                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <span className="sr-only">Go to last page</span>
                                        <ChevronsRight />
                                    </Button>
                                </div>
                            </div>
                            </div>
                        </div>
                    </Tabs>
                </div>
                <DialogFooter>
                    <div className="flex flex-1 justify-between">
                        <div>
                            <p className="text-sm text-slate-500">{table.getSelectedRowModel().rows.length} selected or assigned officers</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="default" onClick={handleAssign} disabled={!table.getSelectedRowModel().rows.length || !isNewAssigned(assignedOfficer)}>
                                Assign Officer
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        
    )
}

export default AssignTicket;