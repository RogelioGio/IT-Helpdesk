import axiosClient from "@/AxiosClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Circle, CircleDot, ClipboardCheck, Contact, FileIcon, MonitorCog, Shield, ShieldUser, UserCog, Users, Wrench } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Skeleton } from "../ui/skeleton";

const ResponderSiderbar = ({activeResponder, setResponder}) => {
    const [isloading, setLoading] = useState()
    const [responders, setResponders] = useState([])
    const [params, setParams] = useState({
        account_role_id: "all"
    })

    const fetchResponders = useCallback(() =>{
        setLoading(true);
        axiosClient.get("api/responders", {
            params: params
        })
            .then((response) => {
                setResponders(response.data.data);
                setResponder(response.data.data[0]);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching responders:", error);
                setLoading(false);
            });
    }, [params])

    useEffect(() => {
        fetchResponders();
    }, [fetchResponders])

    
    return (
        <Sidebar className="absolute top-0 left-0 bg-gray-100 rounded-bl-md h-full min-w-0">
             <SidebarHeader className="p-4 border-b" asChild >
                <div>
                    <p className="text-xs font-medium text-slate-500">Reponders</p>
                    <Select className="w-full bg-white" defaultValue="all" onValueChange={(value) => setParams((prev) => ({...prev, account_role_id: value}))}>
                        <SelectTrigger className="w-full bg-white" disabled={false}>
                            <SelectValue placeholder="Select Responder" />
                        </SelectTrigger>
                        <SelectContent>
                            {AccountRoles.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                    <div className="flex items-center gap-2">
                                        <role.icon className="h-4 w-4" />
                                        {role.text}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </SidebarHeader>
            <ScrollArea className="flex-1 h-full min-h-0">
            {
                isloading ?  Array(5).fill(0).map((_, index) => (
                    <div className="flex flex-col items-start gap-3 border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" key={index}>
                        <Skeleton className="w-20 h-4"/>
                         <div className="flex flex-row gap-2">
                            <Skeleton className="size-12 rounded-md"/>
                            <div>
                                <Skeleton className="w-24 h-3 mt-2"/>
                                <Skeleton className="w-32 h-3 mt-1"/>
                            </div>
                        </div>
                    </div>
                )) :
                <>
                    {
                        responders?.map((responder, index) => {
                            const Icon = AccountRolesStyle[responder.accountroles.name]?.icon;
                            return (
                                <div className={`flex flex-col items-start gap-3 border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full ${activeResponder?.id === responder.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`} key={index} onClick={() => setResponder(responder)}>
                                    <div className="flex flex-row w-full justify-between items-center">
                                        <Badge variant="outline" className={`${AccountRolesStyle[responder?.accountroles?.name]?.color || ''} text-xs`}>
                                            <Icon className="mr-1 h-3 w-3" />
                                            {AccountRolesStyle[responder?.accountroles?.name]?.text || 'Unknown Role'}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <div>
                                            <Avatar className="size-9 border rounded-md grayscale">
                                                <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${responder.firstName} ${responder.lastName}`} alt="User Profile" />
                                                <AvatarFallback>{responder.username.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col min-w-0 flex-1 gap-1">
                                            <p className="font-medium truncate">{responder.firstName} {responder.middleName ? `${responder.middleName.charAt(0)}. ` : ''}{responder.lastName}</p>
                                            <p className="text-xs text-slate-700 truncate">{responder.designation}</p>
                                            <p className="text-xs text-slate-500">{responder.office_department_division?.name} - {responder.office_department_division?.officeCode}</p>
                                        </div>
                                    </div>
                                    
                                </div>
                            )
                        })
                    }
                </>
            }
            </ScrollArea>
        </Sidebar>
    )   
}

export default ResponderSiderbar

const AccountRoles = [
        {
            icon: Contact,
            text: "All Reponders",
            value: "all"
        },
        {
            icon: Users,
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

    
const AccountRolesStyle = {
        "All" : {
            icon: Contact,
            text: "All Reponders",
            value: "all"
        },
        "Manager" : {
            icon: Users,
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