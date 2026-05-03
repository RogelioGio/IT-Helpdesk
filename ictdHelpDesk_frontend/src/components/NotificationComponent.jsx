import { Bell } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import NotificationDropdown from "./NotificationComponents/NotificationDropdown";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { Badge } from "./ui/badge";

const NotificationComponent = ({children}) => {
    const {unreadCount} = useNotificationStore();
    return (
        <SidebarGroup className="mt-auto">
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                {/*  */}
                                {children}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" sideOffset={4} side="right" className="p-0">
                                <NotificationDropdown/>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

export default NotificationComponent;

