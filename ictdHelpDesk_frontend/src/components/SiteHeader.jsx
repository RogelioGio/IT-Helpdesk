import { useNavigation } from "@/contexts/NavigationProvider";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { navigationItems } from "./AppsNavigations";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";


const SiteHeader = () => {
    const { activeTab } = useNavigation();
    const location = useLocation();
    const {ticketId} = useParams()
    
  
    
    const siteTitle = useMemo(() => {
        const allNavLinks = [
        ...navigationItems.SystemAdmin,
        ...navigationItems.SystemAdminReport,
            {
                url: `/ticket/${ticketId}/details`,
                title: `Ticket Details`
            },
            {
                url: `/ticket/${ticketId}/details/leave_feedback`,
                title: `Closing Ticket #${ticketId}`
            }
        ]
        return allNavLinks.find(link => link.url === location.pathname)?.title || "ICTD Service Desk";
    }, [location.pathname, ticketId]);

    useEffect(()=>{
        document.title = `${siteTitle} - ICTD Service Desk`;
    },[siteTitle])

    return (
        <header className="flex h-10 items-center px-4 border-b">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4"/>
            <div className=" text-google-sans font-medium flex items-center gap-2 text-sm justify-between">
                <p>{siteTitle}</p>
            </div>
        </header>
    )
}

export default SiteHeader;