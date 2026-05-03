import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ClipboardCopyIcon, Contact, Ellipsis, EllipsisVertical, Key, MonitorCog, Pencil, Plus, Shield, Trash, User, UserCog, Users, Wrench } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Adduser from "@/components/UserManagement/AddUser";
import EditUser from "@/components/UserManagement/EditUser";
import ResetingPasswordAlert from "@/components/UserManagement/ResetingPasswordAlert";
import DeleteUserAlert from "@/components/UserManagement/DeleteUserAlert";
import { Skeleton } from "../ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useTicketStore } from "@/stores/useTicketStore";
import TicketMasterListReportDialog from "./TicketMasterListReportDialog";

const DataTables = ({columns,act, actspec}) => {
    const {loading, tickets, pagination, setPagination, pageCount} = useTicketStore();
    const table = useReactTable({
        data: tickets,
        columns,
        state: {
            pagination
        },
        pageCount,
        onPaginationChange: setPagination,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel()
    })
    const nav = useNavigate();
    
    const [openReport, setOpenReport] = useState();

    return (    
        <>
        <div className="overflow-hidden rounded-lg border">
            <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                    {
                        table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="px-4">
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
                        loading ? 
                        Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={`skeleton-${i}`}>
                                {table.getVisibleLeafColumns().map((column) => {
                                    const hasAccessor = !!(column.columnDef.accessorKey || column.columnDef.accessorFn);
                                    const isNamedDataColumn = ["fullname", "office/department/division"].includes(column.id);
                                    const isDataColumn = (hasAccessor || isNamedDataColumn) &&
                                                        column.id !== "select" && 
                                                        column.id !== "actions";
                                    return (
                                        <TableCell key={column.id}>
                                            {isDataColumn ? <Skeleton className="h-6 w-full" /> : null}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )) 
                        : table.getRowModel().rows.length ?
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} onClick={() => nav(`/ticket/${row.original.ticketId}/details`)} className="cursor-pointer">
                                {
                                    row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        )):
                        <TableRow>
                            <TableCell colSpan={table.getVisibleLeafColumns().length} className="py-5 text-center">
                                No Ticket given the current filter(s) applied.
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-between px-4">
            {/* <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} Ticket selected.
            </div> */}
            <div>
                <Button variant="outline" size="lg" className="flex items-center gap-2" onClick={() => setOpenReport(true)}>
                    <ClipboardCopyIcon />
                    Export User List
                </Button>
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
                <div className="hidden items-center gap-2 lg:flex">
                    <label htmlFor="rows-per-page" className="text-sm font-medium">
                        Rows per page
                    </label>
                    <Select
                        value={`${pagination.pageSize}`}
                        onValueChange={(value) => {
                            setPagination({...pagination, pageSize: Number(value), pageIndex: 0})
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
                </div>
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
                            <ChevronsLeft />
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
        <TicketMasterListReportDialog open={openReport} onOpenChange={setOpenReport} act={act} actspec={actspec} />
        </>
    )
}

export default DataTables;