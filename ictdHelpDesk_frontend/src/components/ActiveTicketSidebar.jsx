import { BadgeCheck, Bell, CircleCheck, CircleChevronDown, CircleDot, CircleEqual, CircleMinus, ClipboardCheck, Command, FileIcon, FileOutput, FileStack, Flame, Icon, icons, LogOut, MessageCircle, MessageCircleQuestionMark, OctagonAlert, Plus, User, UserCog, Wrench } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";
import { format, formatDistanceToNow, isMonday, set } from "date-fns";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import axiosClient from "@/AxiosClient";
import { useAuth } from "@/contexts/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import UserProfile from "./UserProfile";
import UserTicketSlot from "./ReviewTicket/UserTIcketSlot";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";
import { useTicketStore } from "@/stores/useTicketStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import NotificationComponent from "./NotificationComponent";

const ActiveTicketSidebar = ({...props}) => {
    const {unreadCount} = useNotificationStore();
    const {loading, tickets, fetchOfficerTickets, officerSidebarParams, setOfficerSidebarParams} = useTicketStore();
    const nav = useNavigate();
    const { ticketId } = useParams()
    const {setAuthState, user, accountRole} = useAuth();
    const {isMobile} = useSidebar();
    const [activeTicketStatus, setActiveTicketStatus] = useState("Active Tickets");
    const [isAssigned, setIsAssigned] = useState(true)
    const [assignedTickets, setAssignedTickets] = useState([])
    const isActive = (status) => {
        return status === activeTicketStatus
    }

    useEffect(() => {
        fetchOfficerTickets();
    }, [officerSidebarParams])

    const filterActiveTickets = () => {
        if(!tickets) return
        const isFiltered = tickets.filter(t => {
            const mine = t.assignment.some(responder => responder?.id === user?.id) 
            const isUnassigned = t.assignment.length === 0;

            return mine
        })

        if(isAssigned) {
            return setAssignedTickets(isFiltered)
        } else {
            return setAssignedTickets(tickets)
        }
    }

    useEffect(()=>{
        filterActiveTickets()
    },[isAssigned, tickets])
    

    const ticketStatus = [
        {
            id: "active",
            icon: <FileIcon className=""/>,
            text: "Active Tickets",
            siteHeader : "Active",
            userHeader : "My Active Tickets"
        },
        {
            id: 3,
            icon: <Wrench className=""/>,
            text: "Responded Tickets",
            siteHeader : "Responded",
            userHeader : "Responded Tickets"
        },
        {
            id: 4,
            icon: <ClipboardCheck className=""/>,
            text: "Resolved Tickets",
            siteHeader : "Resolved",
            userHeader : "Resolved Tickets"
        },
        {
            id: 5,
            icon: <CircleDot className=""/>,
            text: "Closed Tickets",
            siteHeader : "Closed",
            userHeader : "Closed Tickets"
        },
        {
            id: 6,
            icon: <CircleMinus className=""/>,
            text: "Cancelled Tickets",
            siteHeader: "Cancelled",
            userHeader: "Cancelled Tickets"
        }
    ]
    const OfficerReport = [
        {
            icon: FileStack,
            text: "Ticket Assignment History"
        },
        {
            icon: FileOutput,
            text: "Request History"
        }
    ]


    const priorityColors = {
        1: "bg-red-500/10 text-red-500",
        2: "bg-yellow-500/10 text-yellow-500",
        3: "bg-green-500/10 text-green-500"
    }

    function handleLogout() {
        const req = axiosClient.post('/api/logout')
    
        toast.promise(req, {
            loading: 'Logging out...',
            success: () => {
                setAuthState(prev => ({ ...prev, user: null, accountRole: null }));
                return 'Logout successful';
            },
            error: 'Logout failed',
        });
    }


    return (
        <Sidebar 
            collapsible="icon"
            className="overflow-hidden *:data-[sidebar=sidebar]:flex-row flex h-full"
        >
            <Sidebar collapsible="none" className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" className="md:h-8 md:p-0" asChild tooltip={{children: "Create Ticket", hidden: isMobile}}>
                                {
                                    accountRole === "Officer"? 
                                    <div className="flex flex-row">
                                        <div className="rounded-md bg-gray-200/80 p-2 flex items-center justify-center size-10">
                                            <Wrench className={`h-4 w-4 ${isMobile ? 'size-4' : ''}`} />
                                        </div>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate text-xs font-normal font-google">Land Registration Authority</span>
                                            <span className=" truncate font-google font-bold text-lg">IT Service Desk</span>
                                        </div>
                                    </div> :
                                    <a href="#">
                                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                            <Plus className="size-4" />
                                        </div>
                                    </a>
                                }
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="px-1.5 md:px-0">
                            <SidebarMenu>
                                {
                                    isMobile ? 
                                    <SidebarMenuItem>
                                        <SidebarMenuButton 
                                            className="px-2.5 md:px-2 transition-all ease-in-out cursor-pointer hover:bg-primary hover:text-white bg-primary text-white"
                                        >
                                            <Plus className="size-4" />
                                            <span>Create Ticket</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    : null
                                }
                                {
                                    ticketStatus.map((item, index) => (
                                        <SidebarMenuItem key={index}>
                                            <SidebarMenuButton 
                                                tooltip={{children: item.text, hidden: isMobile}} 
                                                className="px-2.5 md:px-2 transition-all ease-in-out cursor-pointer data-[active=true]:bg-white data-[active=true]:shadow-md data-[active=true]:shadow-gray-200"
                                                onClick={() => {
                                                    setActiveTicketStatus(item.text), 
                                                    setOfficerSidebarParams({status_id: item.text === "Active Tickets" ? "active" : item.id}),
                                                    nav(`${item.siteHeader.toLowerCase().replace(/\s/g, '-')}`)
                                                }}
                                                isActive={isActive(item.text)}
                                            >
                                                {item.icon}
                                                <span>{item.text}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))
                                }
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup className="mt-auto">
                        <SidebarGroupContent className="px-1.5 md:px-0">
                            <SidebarMenu>
                                {/* {
                                    accountRole === "Officer" &&
                                    OfficerReport.map((item, index) => (
                                        <SidebarMenuItem key={index}>
                                            <SidebarMenuButton
                                                tooltip={{children: item.text, hidden:false}}
                                                className="px-2.5 md:px-2 transition-all ease-in-out cursor-pointer data-[active=true]:bg-white data-[active=true]:shadow-md data-[active=true]:shadow-gray-200"
                                                onClick={() => setActiveTicketStatus(item.text)}
                                                isActive={isActive(item.text)}
                                            >
                                                <item.icon className="h-4 w-4"/>
                                                <span>{item.text}</span>
                                            </SidebarMenuButton>    
                                        </SidebarMenuItem>
                                    ))
                                } */}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <NotificationComponent>
                        <div className="relative">    
                            <div className="flex items-center justify-center">
                                <Bell className="size-4" />
                            </div>
                            {
                                unreadCount > 0 && (
                                    <div className="absolute -top-1 right-0 bg-primary rounded-full w-2 h-2 flex items-center">
                                    </div>
                                )
                            }
                        </div>
                    </NotificationComponent>
                </SidebarContent>
                <SidebarFooter>
                    {
                        isMobile ? 
                        <UserProfile  data={user}/> :
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar className="w-8 h-8 rounded-lg grayscale">
                                    <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.username || 'User'}`} alt="User Profile" />
                                    <AvatarFallback>{user?.username ? user.username.charAt(0) : "U"}</AvatarFallback>
                                </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                        >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="w-8 h-8 rounded-lg">
                                    <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.username || 'User'}`} alt="User Profile" />
                                    <AvatarFallback>{user?.username ? user.username.charAt(0) : "U"}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user?.username?.charAt(0).toUpperCase() + user?.username.slice(1) || "User Name"}</span>
                                <span className="text-muted-foreground truncate text-xs">
                                    {user?.email || "No email provided"}
                                </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                            </DropdownMenuGroup>
                        <DropdownMenuSeparator /> */}

                        <DropdownMenuItem onSelect={() => handleLogout()}>
                                <LogOut />
                                Sign out
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    }
                </SidebarFooter>
            </Sidebar>

            <Sidebar collapsible="none" className="hidden flex-1 md:flex h-full flex-col overflow-hidden">
                <SidebarHeader className="p-4 border-b shrink-0">
                    <div className="flex flex-row justify-between items-center mb-1">
                        <div className="font-bold">
                            <p>{
                                accountRole === "Officer" ? 
                                ticketStatus.find(status => status.text === activeTicketStatus)?.siteHeader 
                                : ticketStatus.find(status => status.text === activeTicketStatus)?.userHeader    
                            }</p>
                        </div>
                        {
                            activeTicketStatus == "Active Tickets" && accountRole === "Officer" ? 
                            <div className="flex gap-2 items-center">
                                <label htmlFor="isAssigned" className="text-sm text-slate-500">Assigned</label>
                                <Switch id="isAssigned" checked={isAssigned} onCheckedChange={setIsAssigned}/>
                            </div>
                            : null
                        }
                    </div>
                    <div>
                        <input type="text" placeholder="Search tickets..." className="border border-gray-300 rounded-md px-3 py-1 w-full text-sm bg-slate-100" />
                    </div>
                </SidebarHeader>
                <SidebarGroupContent className="flex-1 h-full flex flex-col min-h-0">
                        {
                            loading ? 
                            Array.from({length: 5}).map((_, index) => (
                            <div key={index} className="flex flex-col items-start gap-3 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                <div className="flex flex-row gap-2">
                                    <Skeleton className="size-10" />
                                    <div>
                                        <Skeleton className="w-32 h-3 mt-1" />
                                        <Skeleton className="w-24 h-3 mt-2" />
                                    </div>
                                </div>
                                <Skeleton className="w-65 h-3" />
                                <Skeleton className="w-30 h-3" />
                            </div>)) : 
                            tickets.length === 0 ?
                            <div className="flex flex-col items-center gap-10 text-center w-full justify-center flex-1 ">
                                <Wrench className="size-14 text-slate-400"/>
                                <div>
                                    <p className="text-sm text-slate-400 font-medium">
                                        No {ticketStatus.find(status => status.text === activeTicketStatus)?.siteHeader.toLowerCase()} tickets 
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Select a different filter or check back <br/> later for updates.
                                    </p>
                                </div>
                            </div> :
                            activeTicketStatus == "Active Tickets" ?  
                            <ScrollArea className="flex-1 min-h-0 h-full">
                                {
                                    assignedTickets?.map((ticket, index) => (
                                        <UserTicketSlot key={index} ticket={ticket} />
                                    )) 
                                }
                            </ScrollArea>
                            :
                            <ScrollArea className="flex-1 min-h-0 h-full">
                                {
                                    tickets.map((ticket, index) => (
                                        <UserTicketSlot key={index} ticket={ticket} />
                                    ))
                                }
                            </ScrollArea>
                        }
                </SidebarGroupContent>
            </Sidebar>
        </Sidebar>
    );
}

export default ActiveTicketSidebar;

