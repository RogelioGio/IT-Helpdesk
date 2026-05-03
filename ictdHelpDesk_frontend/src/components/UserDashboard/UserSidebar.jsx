import { Bell, CircleDot, CircleMinus, ClipboardCheck, ClipboardList, FileIcon, LogOut, Plus, User, Wrench } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import axiosClient from "@/AxiosClient";
import UserTicketSlot from "../ReviewTicket/UserTIcketSlot";
import { replace, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import UserProfile from "../UserProfile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import { set } from "date-fns";
import { useTicketStore } from "@/stores/useTicketStore";
import NotificationComponent from "../NotificationComponent";
import { useNotificationStore } from "@/stores/useNotificationStore";

const ticketStatus = [
        {
            id: "active",
            icon: FileIcon,
            text: "Active Tickets",
            siteHeader : "Active",
            userHeader : "My Active Tickets",
            noItemText: "No active tickets found."
        },
        {
            id: 3,
            icon: Wrench,
            text: "Responded Tickets",
            siteHeader : "Responded",
            userHeader : "Responded Tickets",
            noItemText: "No responded tickets found."
        },
        {
            id: 4,
            icon: ClipboardCheck,
            text: "Resolved Tickets",
            siteHeader : "Resolved",
            userHeader : "Resolved Tickets",
            noItemText: "No resolved tickets found."
        },
        {
            id: 5,
            icon: CircleDot,
            text: "Closed Tickets",
            siteHeader : "Closed",
            userHeader : "Closed Tickets",
            noItemText: "No closed tickets found."
        },
        {
            id: 6,
            icon: CircleMinus,
            text: "Cancelled Tickets",
            siteHeader: "Cancelled",
            userHeader: "Cancelled Tickets",
            noItemText: "No cancelled tickets found."
        }
    ]
const UserSidebar = ({}) => {
    const {unreadCount} = useNotificationStore();
    const {tickets, loading, setUserSidebarParams, userSidebarParams, fetchUserTickets} = useTicketStore();
    const {isMobile} = useSidebar();
    //const [isLoading, setIsLoading] = useState(true);
    //const [tickets, setTickets] = useState([]);
    const nav = useNavigate();
    const [params, setParams] = useState({
        status_id: "recent"
    })
    const [activeTicketStatus, setActiveTicketStatus] = useState("Create Ticket");
    const isActive = (status) => {
        return status === activeTicketStatus
    }
    const {setAuthState, user} = useAuth();

    useEffect(()=> {
        fetchUserTickets();
    }, [userSidebarParams])

    // useEffect(() => {
    //     let isMounted = true;
    //     if (params.status_id === "recent") {
    //         const recentTickets = () => {
    //             setIsLoading(true);
    //             axiosClient.get('/api/tickets/recent/view')
    //             .then(({data}) => {
    //                     if (!isMounted) return;
    //                     setTickets(data.data);
    //                     setIsLoading(false);
    //             })
    //             .catch(error => {
    //                     console.error("Failed to fetch recent tickets:", error);
    //             });
    //         }
    //         recentTickets();
    //         return () => {
    //             isMounted = false; 
    //         }
    //     }

    //     const fetchTickets = () => {
    //         setIsLoading(true);
    //         axiosClient.get('/api/user/tickets', { params })
    //             .then(({data}) => {
    //                 if (!isMounted) return;
    //                 setTickets(data.data);
    //                 setIsLoading(false);
    //             })
    //             .catch(error => {
    //                 console.error("Failed to fetch tickets:", error);
    //                 setIsLoading(false);
    //             });
    //     }
    //     fetchTickets();

    //     return () => {
    //         isMounted = false; 
    //     }
    // }, [params]);

    // useEffect(() => {
    //     const handleNewCreatedTicket = (event) => {
    //         setTickets(prevTickets => [event.detail, ...prevTickets].slice(0, 4));
    //     }
    //     const handleTicketUpdate = (event) => {
    //         console.log("Received ticket update notification:", event.detail);
    //         const updatedTicket = event.detail;
    //         setTickets(prevTickets => {
    //             const index = prevTickets.findIndex(ticket => ticket.id === updatedTicket.id);
    //             if (index !== -1) {
    //                 const newTickets = [...prevTickets];
    //                 newTickets[index] = updatedTicket;
    //                 return newTickets;
    //             }
    //             return prevTickets;
    //         });
    //     }

    //     window.addEventListener("updated-priority-notification", handleTicketUpdate);
    //     window.addEventListener("recently-viewed-ticket-notification", handleNewCreatedTicket);
    //     window.addEventListener("ticket-responded-notification", handleTicketUpdate);
    //     window.addEventListener("status-updated-notification", handleTicketUpdate);
    //     window.addEventListener("ticket-cancelled-notification", handleTicketUpdate);
    //     window.addEventListener("ticket-closed-notification", handleTicketUpdate);

    //     return () => {
    //         window.removeEventListener("recently-viewed-ticket-notification", handleNewCreatedTicket);
    //         window.removeEventListener("updated-priority-notification", handleTicketUpdate);
    //         window.removeEventListener("status-updated-notification", handleTicketUpdate);
    //         window.removeEventListener("ticket-cancelled-notification", handleTicketUpdate);
    //         window.removeEventListener("ticket-responded-notification", handleTicketUpdate);    
    //         window.removeEventListener("ticket-closed-notification", handleTicketUpdate);
    //     }
    // }, [])

    function handleLogout() {
    const req = axiosClient.post('/api/logout')
    
    toast.promise(req, {
        loading: 'Logging out...',
        success: () => {
            setAuthState(prev => ({ ...prev, user: null, accountRole: null }));
            console.log("Logout successful");
            return 'Logout successful';
        },
        error: 'Logout failed',
    });
    
    }

    return (
       <Sidebar collapsible="icon" className="overflow-hidden *:data-[sidebar=sidebar]:flex-row flex h-full">
            <Sidebar collapsible="none" className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r">
                <SidebarContent>
                    <SidebarGroup>
                       <SidebarGroupContent className="px-1.5 md:px-0">
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        tooltip={{children: "Create Ticket", hidden: isMobile}}
                                        className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground hover:bg-primary-100 transition-colors data-[active=true]:bg-primary-100 data-[active=true]:text-primary-700 hover:text-primary-700"
                                        onClick={() => {setActiveTicketStatus("Create Ticket"), nav("create"), setParams({status_id: "recent"})}} 
                                        isActive={isActive("Create Ticket")}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                {
                                    ticketStatus.map((status, index) => {
                                        return (
                                            <SidebarMenuItem key={index}>
                                                <SidebarMenuButton 
                                                    tooltip={{children: status.text, hidden: isMobile}} 
                                                    className="px-2.5 md:px-2 transition-all ease-in-out cursor-pointer data-[active=true]:bg-white data-[active=true]:shadow-md data-[active=true]:shadow-gray-200"
                                                    onClick={() => {
                                                        setActiveTicketStatus(status.text), 
                                                        setUserSidebarParams({
                                                            status_id: status.text === "Active Tickets" ? "active" : status.id
                                                        }),
                                                        nav(`${status.siteHeader.toLowerCase().replace(/\s/g, '-')}`)
                                                    
                                                    }}
                                                    isActive={isActive(status.text)}
                                                >
                                                    <status.icon className="h-4 w-4" />
                                                    <span>{status.text}</span>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    })
                                }
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarFooter className="mt-auto ">
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
                        <DropdownMenuItem onSelect={handleLogout}>
                                <LogOut />
                                Sign out
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    }
                </SidebarFooter>
                </SidebarContent>
            </Sidebar>
            <Sidebar collapsible="none" className="hidden flex-1 md:flex h-full flex-col overflow-hidden shrink-0">
                <SidebarHeader className="p-4 border-b">
                    <div className="flex flex-row justify-between items-center mb-1 shrink-0">
                        <div className="font-bold">
                            {ticketStatus.find(status => status.text === activeTicketStatus)?.userHeader || "Recent Viewed Tickets"}
                        </div>
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
                            </div>)) 
                        : tickets.length > 0 ?
                        <ScrollArea className="flex-1 min-h-0 shrink-0">
                            {
                                tickets.map((ticket, index) => (
                                    <UserTicketSlot key={index} ticket={ticket} />
                                ))
                            }
                        </ScrollArea> 
                        : <div className="flex-1 h-full flex flex-col gap-2 items-center justify-center p-4 text-sm text-gray-500 ">
                            <ClipboardList className="size-14 text-gray-400" />
                            <div className="text-center">     
                                <p className="font-medium text-lg">
                                    {ticketStatus.find(status => status.text === activeTicketStatus)?.noItemText || "No tickets found."} <br/>
                                </p>
                                <p className="font-google text-xs text-center">
                                    "{activeTicketStatus === "Create Ticket" ? "Click the plus button to create your first ticket." : "Try creating a new ticket or check back later."}"
                                </p>
                            </div>
                        </div>
                    }
                </SidebarGroupContent>
            </Sidebar>
       </Sidebar>
    )
}

export default UserSidebar;