import axiosClient from "@/AxiosClient";
import { useAuth } from "@/contexts/AuthProvider";
import { use, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import bgImage from "../assets/LoginRegistrationImage.jpg";
import { Loader, Scroll, Wrench } from "lucide-react";
import AppsNavigations from "@/components/AppsNavigations";
import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Database, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import { NavigationProvider } from "@/contexts/NavigationProvider";
import ActiveTicketSidebar from "@/components/ActiveTicketSidebar";
import TicketDetailsPage from "@/views/TicketDetailsPage";
import { echoInstance } from "@/echo";
import { useNotification } from "@/hooks/useNotification";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function AuthenticatedLayout() {
    const {user, accountRole, loading} = useAuth();
    const nav = useNavigate();

    useNotification({user, account_role: accountRole});


    if(loading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login"/>
    }

    const isOfficer = user?.account_role_id == 4;
    const handleSidebar =  "250px";

    return (
        <SidebarProvider
                style={{ 
                    "--sidebar-width": handleSidebar, 
                    "--sidebar-wrapper-width": handleSidebar 
                }}
            > 
                {
                    accountRole === "Officer" || accountRole === "User" ? null :
                    <AppsNavigations variant="inset" /> 
                }
                <SidebarInset>
                    {
                        accountRole === "Officer" || accountRole === "User" ? null : <SiteHeader /> 
                    }
                    <Outlet />
                </SidebarInset>
        </SidebarProvider>
    )
}
