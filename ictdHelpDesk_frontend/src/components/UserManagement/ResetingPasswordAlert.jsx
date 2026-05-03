import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Key } from "lucide-react"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { useState } from "react"
import { toast } from "sonner"
import axiosClient from "@/AxiosClient"

const ResetingPasswordAlert = ({user, open, setOpen, fetchUser}) => {
    const [reseting, setReseting] = useState(false);
    const handleReset = () => {
        if (reseting) return;
        setReseting(true);
        // Implement the logic to reset the user's password here
        toast.promise(axiosClient.post(`api/users/${user.id}/reset-password`), {
            loading: "Resetting user password...",
            success: (data) => {
                setReseting(false);
                setOpen(false);
                fetchUser();
                return "User password reset successfully!"},
            error: (err) => {
                setReseting(false);
                return err.response?.data?.message || "Failed to reset user password.";
            }
        })
    };

        return (
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirming Reset Password for "{user?.username}" ?</AlertDialogTitle>
                        <AlertDialogDescription>This will invalidate the current password and set a default password for the given account of " {user?.username} ". only the user can change it after logging in.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={reseting} onClick={handleReset}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }
export default ResetingPasswordAlert