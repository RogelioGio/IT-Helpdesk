import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from "./ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Bell, EllipsisVertical, LogOut, User, User2Icon, UserCog } from "lucide-react";
import axiosClient from "@/AxiosClient";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
const UserProfile = ({data}) => {
    const nav = useNavigate();
    const {isMobile} = useSidebar();
    const {setAuthState} = useAuth();

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
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <Avatar className="w-8 h-8 rounded-lg grayscale">
                                <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${data?.username || 'User'}`} alt="User Profile" />
                                <AvatarFallback>{data?.username ? data.username.charAt(0) : "U"}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{data?.username?.charAt(0).toUpperCase() + data?.username.slice(1) || "User Name"}</span>
                                <span className="text-xs text-muted-foreground">{data?.email || "No email provided"}</span>
                            </div>
                            <EllipsisVertical/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${data?.username || 'User'}`} alt={data?.username || "User Profile"} />
                            <AvatarFallback className="rounded-lg">{data?.username ? data.username.charAt(0) : "U"}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{data?.username?.charAt(0).toUpperCase() + data?.username.slice(1) || "User Name"}</span>
                            <span className="text-muted-foreground truncate text-xs">
                                {data?.email || "No email provided"}
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
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default UserProfile

