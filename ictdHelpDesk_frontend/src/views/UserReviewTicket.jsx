import ActiveTicketSidebar from "@/components/ActiveTicketSidebar";
import SiteHeader from "@/components/SiteHeader";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export function OfficerLayout() {
    return (
        <SidebarProvider
            style={{ 
                "--sidebar-width": "25rem", 
                "--sidebar-wrapper-width": "25rem"
        }}>
            <ActiveTicketSidebar/>
            <SidebarInset>
                <SiteHeader/>
                <Outlet/>
            </SidebarInset>
        </SidebarProvider>
    )
}

