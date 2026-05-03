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
import { Key, Trash } from "lucide-react"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { useState } from "react"
import { toast } from "sonner"
import axiosClient from "@/AxiosClient"
import { set } from "date-fns"

const DeleteUserAlert = ({user, setOpen, fetchUser, open}) => {
    const [deleting, setDeleting] = useState(false);
    
    const handleDelete = () => {
        if (deleting) return;
        setDeleting(true);        
        toast.promise(axiosClient.delete(`api/users/${user.id}`), {
            loading: "Deleting user account...",
            success: (data) => {
                setDeleting(false);
                fetchUser();
                setOpen(false);
                return "User account deleted successfully!";
            },
            error: (err) => {
                setDeleting(false);
                return err.response?.data?.message || "Failed to delete user account.";
            }
        });
    }


    return (
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirming Delete User "{user?.username}" ?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete the user account of "{user?.username}". This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={deleting} variant="destructive" onClick={handleDelete}>Delete User</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
}

export default DeleteUserAlert;