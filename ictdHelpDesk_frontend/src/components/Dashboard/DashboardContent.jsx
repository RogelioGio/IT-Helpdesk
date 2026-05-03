import { ChevronDown, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Pie, PieChart } from "recharts";
import DashboardTicketVolumeChart from "./DashboardTicketVolumeChart";
import DashboardTicketBreakdownChart from "./DashboardTicketBreakdownChart";
import DashboardServiceStatisfactionBreakdown from "./DashbaordServiceStatisfactionBreakdown";
import DashboardBacklogRateBreakdown from "./DashboardBacklogRateBreakdown";
import DashboardTopCancellationReasons from "./DashboardTopCancellationReasons";
import DashboardTopDepartmentCancellations from "./DashboardTopDepartmentCancellations";


const Tickets = [
  { id: "1", header: "Fix Navbar Bug", type: "Development", status: "Done" },
  { id: "2", header: "Design New Logo", type: "Marketing", status: "In Progress" },
  { id: "3", header: "Update API Docs", type: "Backend", status: "Open" }
]

const columns = [
    {
        accessorKey: "header",
        header: "Header",
        cell: ({ row }) => {
            return (
                <div className="font-medium">
                    {row.getValue("header")}
                </div>
            )
        }
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("type");
            let variant = "default";
            if (type === "Development") variant = "primary";
            else if (type === "Marketing") variant = "secondary";
            else if (type === "Backend") variant = "success";
            return <Badge variant={variant}>{type}</Badge>;
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status");
            let variant = "default";
            if (status === "Done") variant = "success";
            else if (status === "In Progress") variant = "warning";
            else if (status === "Open") variant = "destructive";
            return <Badge variant={variant}>{status}</Badge>;
        }
    }
]

const pieChartColors = {
    Open: {
        label: "Open",
        color: "#fffff",
    },
    Assigned: {
        label: "Assigned",
        color: "#fbbf24",
    },
    "In Progress": {
        label: "In Progress",
        color: "#60a5fa",
    }
}

const chartData = [
    {status: "Open", count: 10, color: pieChartColors.Open.color},
    {status: "Assigned", count: 5, color: pieChartColors.Assigned.color},
    {status: "In Progress", count: 3, color: pieChartColors["In Progress"].color},
]


const DashboardContent = () => {
    return (
       <div className="grid grid-cols-1 gap-4 flex-1 @5xl/main:px-6 px-4 @5xl/main:grid-cols-4">
            {/* Total Tickets Breakdown */}
            <DashboardTicketVolumeChart />
            <DashboardTicketBreakdownChart />

            {/* Service Satisfaction */}
            <DashboardServiceStatisfactionBreakdown/>

            {/* Backlog */}
            <DashboardBacklogRateBreakdown/>
            {/* Cancellation */}
            <DashboardTopCancellationReasons/>
            <DashboardTopDepartmentCancellations/>
       </div>
    )
}

export default DashboardContent;


