import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ResponderDetail from "@/components/WorkflowMonitoring/ResponderDetail";
import ResponderSiderbar from "@/components/WorkflowMonitoring/ResponderSiderbar";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Circle, CircleDot, ClipboardCheck, Contact, FileIcon, MonitorCog, Shield, ShieldUser, UserCog, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function WorkloadMonitoring() {
    const [activeResponder, setActiveResponder] = useState({});
    return (
         <div className='flex flex-col h-full'>
            <div className="overflow-hidden relative flex-1">
                <SidebarProvider className="h-full min-h-0 rounded-md" style={{
                    "--sidebar-width": "350px"
                }}>
                    <ResponderSiderbar activeResponder={activeResponder} setResponder={setActiveResponder}/>
                    <SidebarInset>
                        <ResponderDetail responder={activeResponder}/>
                    </SidebarInset>
                </SidebarProvider>
            </div>
        </div>
    )
}

const AccountRolesStyle = {
        "All" : {
            icon: Contact,
            text: "All Reponders",
            value: "all"
        },
        "Administrator" : {
            icon: ShieldUser,
            text: "Administrator",
            color: "bg-purple-100 text-purple-800",
            value: 2
        },
        "Manager" : {
            icon: MonitorCog,
            text: "Managers",
            color: "bg-blue-100 text-blue-800",
            value: 3
        },
        "Officer" : {
            icon: Wrench,
            text: "Officers",
            color: "bg-green-100 text-green-800",
            value: 4
        },
}

const AccountRoles = [
    {
            icon: Contact,
            text: "All Reponders",
            value: "all"
        },
        {
            icon: ShieldUser,
            text: "Administrators",
            value: 2
        },
        {
            icon: MonitorCog,
            text: "Managers",
            value: 3
        },
        {
            icon: Wrench,
            text: "Officers",
            value: 4
        },
]

const ticketStatus = [
        {
            icon: FileIcon,
            text: "Active Tickets",
            siteHeader : "Active",
            userHeader : "My Active Tickets"
        },
        {
            icon: Wrench,
            text: "Responded Tickets",
            siteHeader : "Responded",
            userHeader : "Responded Tickets"
        },
        {
            icon: ClipboardCheck,
            text: "Resolved Tickets",
            siteHeader : "Resolved",
            userHeader : "Resolved Tickets"
        },
        {
            icon: CircleDot,
            text: "Closed Tickets",
            siteHeader : "Closed",
            userHeader : "Closed Tickets"
        }
    ]
