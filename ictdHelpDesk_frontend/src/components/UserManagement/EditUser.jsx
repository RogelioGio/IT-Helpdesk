import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { useFormik } from "formik"
import EditUserForm from "./EditUserForm"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import axiosClient from "@/AxiosClient"

const EditUser = ({user, fetchUser, open, setOpen, office_department_division}) => {

    const [submitting, setSubmitting] = useState(false);
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            employeeID: user?.employeeID || "",
            firstName: user?.firstName || "",
            middleName:user?.middleName || "",
            lastName: user?.lastName || "",
            username: user?.username || "",
            email: user?.email || "",
            designation: user?.designation || "",
            office_department_division_id: user?.office_department_division?.id || "",
            account_role_id: user?.accountroles?.id || "",
        },
        onSubmit: (values) => {
            if (submitting) return;
            setSubmitting(true);
            toast.promise(
            axiosClient.patch(`/api/users/${user.id}`, values),
            {
            loading: "Updating user...",
            success: () => {
                setSubmitting(false);
                setOpen(false);
                fetchUser();
                return "User updated successfully!";
            },
            error: (err) => {
                setSubmitting(false);
                return err.response?.data?.message || "Failed to update user.";
            }
            }
        )
        }
    })
    
    
    return (
        <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-5xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Edit User</DialogTitle>
                    <DialogDescription className="text-sm text-gray-700 hidden lg:flex">
                            Edit an existing user in the system by modifying the form below. Please ensure that all required fields are completed accurately to update the user account successfully.
                    </DialogDescription>
                    <DialogDescription className="text-sm text-gray-700 lg:hidden flex sm:text-left text-center">
                            Edit an existing user in the system by modifying the form below.
                    </DialogDescription>
                </DialogHeader>
                <EditUserForm formik={formik} office_department_division={office_department_division}/>
                <DialogFooter className="flex justify-end space-x-2 pt-4">
                        <DialogClose asChild>
                            <Button variant="outline" size="lg">Cancel</Button>
                        </DialogClose>
                        <Button   
                            disabled={submitting}
                            type="submit"
                            variant="default"
                            size="lg"
                            className="" onClick={() => formik.handleSubmit()}>Edit User</Button>
                </DialogFooter>
             </DialogContent>
        </Dialog>
        </>
    )
}

export default EditUser

