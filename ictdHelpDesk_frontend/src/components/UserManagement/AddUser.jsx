import { Dialog } from "radix-ui";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import AdduserForm from "./AddUserForm";
import { Button } from "../ui/button";
import { useFormik } from "formik";
import { useAddUsersInput } from "@/contexts/AddUsersInputContext";
import { use, useEffect, useState } from "react";
import axiosClient from "@/AxiosClient";
import { toast } from "sonner";
import { set } from "date-fns";

const AddUser = ({ setOpen, fetchUsers, officeDepartmentDivisionOptions}) => {
  const [submitting, setSubmitting] = useState(false);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      employeeID: "",
      firstName: "",
      middleName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      designation: "",
      office_department_division_id: "",
      account_role_id: "",
    },
    onSubmit: (values) => {
      if (submitting) return;
      setSubmitting(true);  
      toast.promise(
        axiosClient.post("/api/users", values),
        {
          loading: "Creating user...",
          success: () => {
            setSubmitting(false);
            setOpen(false);
            formik.resetForm();
            fetchUsers();
            return "User created successfully!";
          },
          error: (err) => {
            setSubmitting(false);
            return err.response?.data?.message || "Failed to create user.";
          }
        }
      )
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Add User</DialogTitle>
        <DialogDescription className="text-sm text-gray-700 hidden lg:flex">
          Add a new user to the system by filling out the form below. Please
          ensure that all required fields are completed accurately to create the
          user account successfully.
        </DialogDescription>
        <DialogDescription className="text-sm text-gray-700 lg:hidden flex sm:text-left text-center">
          Add a new user to the system by filling out the form below.
        </DialogDescription>
        <AdduserForm formik={formik} officeDepartmentDivisionOptions={officeDepartmentDivisionOptions}/>
        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline" size="lg">
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={submitting}
            type="submit"
            variant="default"
            size="lg"
            className=""
            onClick={() => formik.handleSubmit()}
          >
            Create User
          </Button>
        </DialogFooter>
      </DialogHeader>
    </>
  );
};

export default AddUser;
