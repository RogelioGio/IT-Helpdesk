
import axiosClient from "@/AxiosClient";
import DataTables from "@/components/CreateTicketUser/DataTable";
import SiteHeader from "@/components/SiteHeader";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import UserSidebar from "@/components/UserDashboard/UserSidebar";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";



export default function UserTicket() {
    const [loading, setLoading] = useState(false);
    return (
        <SidebarProvider style={{ 
                "--sidebar-width": "25rem", 
                "--sidebar-wrapper-width": "25rem"
        }}>
            <UserSidebar setLoading={setLoading}/>
            <SidebarInset>
                <SiteHeader/>
                <Outlet/>
            </SidebarInset>
        </SidebarProvider>
    )
}