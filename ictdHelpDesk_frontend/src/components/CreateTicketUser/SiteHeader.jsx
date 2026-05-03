import { Bell, LogOut, User, UserCog, Wrench } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AvatarFallback, AvatarImage, Avatar} from "../ui/avatar";
import { useAuth } from "@/contexts/AuthProvider";
import { useSidebar } from "../ui/sidebar";
import axiosClient from "@/AxiosClient";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SiteHeader = () => {
    const {user, setUser} = useAuth();
    const {isMobile} = useSidebar();
    const nav = useNavigate();

    function handleLogout() {
        const req = axiosClient.post('/api/logout')
        
        toast.promise(req, {
            loading: 'Logging out...',
            success: () => {
                setUser(null);
                nav('/login');
                return 'Logout successful';
            },
            error: 'Logout failed',
    });
}



    return (
        <div className="px-4 flex flex-row justify-between items-center w-full">
            <div className="flex flex-row gap-2">
                <div className="rounded-md bg-gray-200/80 p-2 size-10  flex items-center justify-center">
                    <Wrench className="w-5 aspect-square"/>
                </div>
                <div>
                    <p className="truncate text-xs font-normal font-google">Land Registration Authority</p>
                    <h1 className=" truncate font-google font-bold text-lg">IT Service Desk</h1>
                </div>
            </div>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button>
                            <div className="flex flex-row gap-4 items-center">
                                <div className="grid flex-1 leading-tight text-right">
                                    <span className="truncate font-medium">{user?.username?.charAt(0).toUpperCase() + user?.username.slice(1) || "U"}</span>
                                    <span className="text-xs text-muted-foreground">{user?.email || "No email provided"}</span>
                                </div>
                                <Avatar className="size-12 rounded-lg grayscale">
                                    <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.username || 'User'}`} alt={user?.username || "User Profile"} />
                                    <AvatarFallback>{user?.username ? user.username.charAt(0) : "U"}</AvatarFallback>
                                </Avatar>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "bottom"}
                        align="end"
                        sideOffset={4}
                    >
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.username || 'User'}`} alt={user?.username || "User Profile"} />
                                <AvatarFallback className="rounded-lg">{user?.username ? user.username.charAt(0) : "U"}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : "User Name"}</span>
                            <span className="text-muted-foreground truncate text-xs">
                                {user?.email || "No email provided"}
                            </span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Bell />
                            Notifications
                        </DropdownMenuItem>
                        </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout}>
                            <LogOut />
                            Sign out
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default SiteHeader;