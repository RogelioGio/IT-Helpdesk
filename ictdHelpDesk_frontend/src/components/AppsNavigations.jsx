import { Bell, ChevronRight, Cog, Contact, FileChartColumn, FileSliders, Flag, LayoutDashboard, List, MessageCircleWarning, Monitor, MonitorCog, ShieldUser, Sticker, Table, User, UserCog, UserStar, Workflow, Wrench } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarMenuSub
} from "./ui/sidebar";
import UserProfile from "./UserProfile";
import { useAuth } from "@/contexts/AuthProvider";
import { useNavigation } from "@/contexts/NavigationProvider";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import NotificationComponent from "./NotificationComponent";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { Badge } from "./ui/badge"; 

export const navigationItems = {
    SystemAdmin: [
            // {
            //     title: "Dashboard",
            //     icon: <LayoutDashboard/>,
            //     isActive: false ,
            //     url: "/dashboard"
            // },
            {
                title: "User Management",
                icon: <UserCog/>,
                isActive: false,
                url: "/usermanagement"
            },
            {
                title: "Ticket Management",
                icon: <MessageCircleWarning/>,
                isActive: false,
                url: "/ticketmanagement"
            },
            {
                title: "Workload Monitoring",
                url: "/workloadmonitoring",
                icon: <Workflow/>,
                isActive: false,
            },   
            {
                title: "Reports",
                icon: <FileChartColumn/>,
                isActive: false,
                url: "/reports"
            }
            // {
            //     title: "System Configuration",
            //     icon: <Cog/>,
            //     isActive: false,
            //     url: "/systemconfiguration"
            // },
           
    ],
    SystemAdminReport: [
        // {
        //     title: "User Master List",
        //     icon: Contact
        // },
        // {
        //     title: "User Activity",
        //     icon: ShieldUser
        // },
        // {
        //     title: "Officer Performance",
        //     icon: FileSliders
        // },
        // {
        //     title: "Ticket Summary",
        //     icon: FileChartColumn,
        //     url: "/ticketsummaryreport"
        // },
        // {
        //     title: "Ticket Status",
        //     icon: MessageCircleWarning
        // },
        // {
        //     title: "Service Statisfaction",
        //     icon: Sticker
        // },
        // {
        //     title: "Incident Volume",
        //     icon: Table
        // }
    ],
    Administrator: [
        // {
        //     title: "Dashboard",
        //     icon: <LayoutDashboard/>,
        //     isActive: false ,
        //     url: "/dashboard"
        // },
        {
            title: "User Management",
            icon: <UserCog/>,
            isActive: false,
            url: "/usermanagement"
        },
        {
            title: "Ticket Management",
            icon: <MessageCircleWarning/>,
            isActive: false,
            url: "/ticketmanagement"
        },
    ],
    AdministratorReport: [
        {
            title: "User Master List",
            icon: Contact
        },
        {
            title: "User Activity",
            icon: ShieldUser
        },
        {
            title: "Officer Performance",
            icon: FileSliders
        },
        {
            title: "Ticket Summary",
            icon: FileChartColumn
        },
    ],
    Manager:
    [
        // {
        //     title: "Dashboard",
        //     icon: <LayoutDashboard/>,
        //     isActive: false ,
        //     url: "/dashboard"
        // },
        {
            title: "Ticket Management",
            icon: <MessageCircleWarning/>,
            isActive: false,
            url: "/ticketmanagement"
        },
        {
            title: "Workload Monitoring",
            url: "/workloadmonitoring",
            icon: <Workflow/>,
            isActive: false,
        },   
    ],
    ManagerReport: [
        {
            title: "Ticket Summary",
            icon: FileChartColumn
        },
        {
            title: "Ticket Status",
            icon: Flag
        },
        {
            title: "Service Statisfaction",
            icon: Sticker
        },
        {
            title: "Incident Volume",
            icon: Table
        }
    ]
}

const loginAs = [
    {
        title: "Admin",
        icon: <UserCog/>,
        isActive: false,
        url: "#"
    },
    {
        title: "IT Personnel",
        icon: <MonitorCog/>,
        isActive: false,
        url: "#"
    },
    {
        title: "End User",
        icon: <User/>,
        isActive: false,
        url: "#"
    }
]

const NavigationGroups = ({items, userRole}) => {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {   
                        items[userRole]?.map((item, index) => (
                            <SidebarMenuItem key={index}>
                                <NavLink to={item.url}>
                                    {
                                        ({isActive}) => (
                                            <SidebarMenuButton 
                                                tooltip={item.title} 
                                                isActive={isActive}
                                                className="transition-all ease-in-out cursor-pointer data-[active=true]:bg-white data-[active=true]:shadow-md data-[active=true]:shadow-gray-200 data-[active=true]:font-medium">
                                                {item.icon}
                                                <span className="ml-2">{item.title}</span>
                                            </SidebarMenuButton>
                                        )
                                    }
                                </NavLink>
                            </SidebarMenuItem>
                        ))
                    }
                    
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

const ReportNavigation = ({items, accountRole}) => {
    if (!items[`${accountRole}Report`]) return null;

    return (
        <SidebarGroup >
            <SidebarGroupLabel>{accountRole} Reports</SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {
                        items[`${accountRole}Report`] ? 
                        items[`${accountRole}Report`]?.map((item, index) => (
                            <SidebarMenuItem key={index}>
                                <NavLink to={item.url}>
                                    <SidebarMenuButton tooltip={item.title}
                                        className="transition-all ease-in-out cursor-pointer data-[active=true]:bg-white data-[active=true]:shadow-md data-[active=true]:shadow-gray-200 data-[active=true]:font-medium">
                                        <item.icon className="h-4 w-4"/>
                                        <span className="ml-2">{item.title}</span>
                                    </SidebarMenuButton>
                                </NavLink>
                            </SidebarMenuItem>
                        )) : null
                    }
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

const AppsNavigations = ({ ...props }) => {
    const {user, accountRole} = useAuth();
    const {unreadCount} = useNotificationStore();
    return (
        // collapsible="offcanvas"
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {/* Header Logo */}
                        <SidebarMenuButton  className="data-[slot=sidebar-menu-button]:p-1.5! h-fit hover:bg-transparent hover:text-primary/90 active:bg-transparent active:text-primary/90">
                            <div className="rounded-md bg-gray-200/80 p-2 aspect-square flex items-center justify-center">
                                <Wrench className="h-6 w-6"/>
                            </div>
                            <div>
                                <h1 className=" truncate font-google font-bold text-lg">IT Helpdesk</h1>
                                <p className="truncate text-xs font-normal font-google">IT Ticketing System</p>
                            </div>
                        </SidebarMenuButton>
                </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavigationGroups items={navigationItems} userRole={accountRole}/>
                {/* <ReportNavigation items={navigationItems} accountRole={accountRole}/> */}
                <NotificationComponent>
                    <SidebarMenuButton tooltip="Notifications" className="transition-all ease-in-out cursor-pointer data-[active=true]:bg-white data-[active=true]:shadow-md data-[active=true]:shadow-gray-200 data-[active=true]:font-medium flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center">
                            <Bell className="h-4 w-4"/>
                            <span className="ml-2">Notifications</span>
                        </div>
                        {unreadCount > 0 && (
                            <Badge>
                                {unreadCount}
                            </Badge>
                        )}
                    </SidebarMenuButton>
                </NotificationComponent>
            </SidebarContent>
            <SidebarFooter>
                <UserProfile data={user}/>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppsNavigations
