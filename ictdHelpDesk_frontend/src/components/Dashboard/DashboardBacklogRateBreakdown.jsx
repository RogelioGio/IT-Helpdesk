import { CircleDot, ClipboardCheck, ClockAlertIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { ScrollArea } from "../ui/scroll-area";

const DashboardBacklogRateBreakdown = () => {
    const columns = useMemo(() => [
        {
            id: "department",
            header: "Department",
            cell: ({ row }) => {
                return (
                    <div className="font-medium">
                        {row.original.department}
                    </div>
                )
            }
        },
        {
            accessorKey: "averageResolutionTime",
            header: "Average Resolution Time",
        },
        {
            accessorKey: "averageClosingTime",
            header: "Average Closing Time",
        },
        {
            accessorKey: "backlogRate",
            header: "Backlog Rate",
        }
    ], [])

    const data = useMemo(() => [
        { department: "IT", averageResolutionTime: "2 days", averageClosingTime: "5 days", backlogRate: "20%" },
        { department: "HR", averageResolutionTime: "1 day", averageClosingTime: "3 days", backlogRate: "10%" },
        { department: "Finance", averageResolutionTime: "3 days", averageClosingTime: "7 days", backlogRate: "30%" },
        { department: "Operations", averageResolutionTime: "2.5 days", averageClosingTime: "6 days", backlogRate: "25%" },
        { department: "Customer Service", averageResolutionTime: "1.5 days", averageClosingTime: "4 days", backlogRate: "15%" },
        { department: "Sales", averageResolutionTime: "2 days", averageClosingTime: "5 days", backlogRate: "20%" },
        { department: "Marketing", averageResolutionTime: "1 day", averageClosingTime: "3 days", backlogRate: "10%" },
        { department: "Legal", averageResolutionTime: "3 days", averageClosingTime: "7 days", backlogRate: "30%" },
        { department: "R&D", averageResolutionTime: "2.5 days", averageClosingTime: "6 days", backlogRate: "25%" },
        { department: "Admin", averageResolutionTime: "1.5 days", averageClosingTime: "4 days", backlogRate: "15%" },
        { department: "Admin", averageResolutionTime: "1.5 days", averageClosingTime: "4 days", backlogRate: "15%" },
        { department: "Admin", averageResolutionTime: "1.5 days", averageClosingTime: "4 days", backlogRate: "15%" },
        { department: "Admin", averageResolutionTime: "1.5 days", averageClosingTime: "4 days", backlogRate: "15%" },
        { department: "Admin", averageResolutionTime: "1.5 days", averageClosingTime: "4 days", backlogRate: "15%" },
        { department: "Admin", averageResolutionTime: "1.5 days", averageClosingTime: "4 days", backlogRate: "15%" },
    ], [])

    const table = useReactTable({
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })



    return (
        <div className="border border-slate-200 bg-slate-200/10 rounded-md h-full xl:h-100 overflow-hidden md:col-span-4 col-span-1 flex flex-col @container/ticketServiceSatisfactionBreakdownChart">
            <div className="p-4 px-6 border-b border-slate-200 flex flex-row items-center gap-2">
                <div className="bg-slate-700/10 size-10 rounded-md flex items-center justify-center">
                    <ClockAlertIcon className="size-5" />
                </div>
                <div >
                    <p className="font-bold">Backlog Rate Breakdown</p>
                    <p className="text-xs text-slate-500">List of departments with their respective backlog rates and elapsed closing times </p>
                </div>
            </div>
            <div className="w-full grid grid-cols-1 @xl/ticketServiceSatisfactionBreakdownChart:grid-cols-4 flex-1 min-h-0 overflow-hidden">
                <ScrollArea className="min-h-0 col-span-3 border-r border-slate-200">
                    <Table containerClassName="min-h-0 overflow-visible">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableHeader className="bg-muted sticky top-0 z-10" key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="px-6">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableHeader>
                        ))}
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-6">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
                <div className="flex flex-col"> 
                    <div className="p-6 border-b border-slate-200 flex flex-col gap-4 flex-1">
                        <div>
                            <p className="font-medium m-0"> Current Resolved Tickets</p>
                            <p className="text-xs text-slate-500 m-0">Number of tickets that is currently in resolved status</p>
                        </div>
                        <div className="flex flex-row gap-4 items-center">
                            <div className="bg-emerald-500/20 size-15 rounded-md flex flex-col items-center justify-center shrink-0">
                                <ClipboardCheck className="size-9 text-emerald-700" />
                            </div>
                            <p>
                                <span className="text-3xl font-bold">150</span>
                                <span className="text-sm text-slate-500"> tickets</span>
                            </p>
                        </div>
                    </div>
                    <div className="p-6 border-b border-slate-200 flex flex-col gap-4 flex-1">
                        <div>
                            <p className="font-medium m-0"> Current Closed Tickets</p>
                            <p className="text-xs text-slate-500 m-0">Number of tickets that is currently in closed status</p>
                        </div>
                        <div className="flex flex-row gap-4 items-center">
                            <div className="bg-slate-700/20 size-15 rounded-md flex flex-col items-center justify-center shrink-0">
                                <CircleDot className="size-9 text-slate-700" />
                            </div>
                            <p>
                                <span className="text-3xl font-bold">150</span>
                                <span className="text-sm text-slate-500"> tickets</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardBacklogRateBreakdown;