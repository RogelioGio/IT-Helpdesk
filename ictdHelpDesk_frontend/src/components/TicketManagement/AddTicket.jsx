import { Dialog } from "radix-ui";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useFormik } from "formik";
import TicketForm from "./TicketForm";
import { AddTicketInputProvider } from "@/contexts/AddTicketInputContext";
import axiosClient from "@/AxiosClient";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import * as Yup from "yup";

const AddTicket = ({setOpen, fetchTickets, activityOption}) => {
    const {user} = useAuth();
    const [submitting, setSubmitting] = useState(false);
    
    useEffect(()=>{
        if (activityOption.activityOption.length > 0 && activityOption.activitySpecificationOption.length > 0) return;
        function fetchActivityOptions() {
            axiosClient.get('api/activities').then(({data}) => {
                setActivityOptions((prev) => ({...prev, "activityOption" : data.data}))
            }).catch((error) => {});
        }
        function fetchActivitySpecificationOptions() {
            axiosClient.get('api/activitiesSpecifications').then(({data}) => {
                setActivityOptions((prev) => ({...prev, "activitySpecificationOption" : data.data}))
            }).catch((error) => {});
        }

        fetchActivityOptions();
        fetchActivitySpecificationOptions();
    }, [])




    const formik = useFormik({
        initialValues: {
            'activity_id': '',
            'activitySpecification_id': '',
            'assetSerialNumber': '',
            'description': '',
            'status_id': '1',
            'requester_id': user?.id,
        },
        validationSchema: new Yup.object({
            activity_id: Yup.string().required('Activity is required'),
            activitySpecification_id: Yup.string().required('Activity Specification is required'),
            assetSerialNumber: Yup.string().required('Asset Serial Number is required'),
            description: Yup.string().required('Description is required'),
        }),
        onSubmit: (values) => {
            submitting ? null : setSubmitting(true);
            toast.promise(
                axiosClient.post('/api/tickets', values),
                {
                    loading: 'Creating ticket...',
                    success: () => {
                        setSubmitting(false);
                        setOpen(false);
                        fetchTickets();
                        return 'Ticket created successfully!';
                    },
                    error: 'Failed to create ticket. Please try again.',
                })
        }
    });
    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Add Ticket</DialogTitle>
                <DialogDescription className="text-sm text-gray-700 hidden lg:flex">
                    Fill in the details below to open a new support ticket. Specify the activity type, and asset number to get started.
                </DialogDescription>
            </DialogHeader>
                <TicketForm formik={formik} activityOptions={activityOption.activityOption} activitySpecificationOptions={activityOption.activitySpecificationOption} />
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" size="lg">
                        Cancel
                    </Button>
                </DialogClose>
                <Button 
                        type="submit"
                        variant="default"
                        size="lg"
                        className=""
                        onClick={() => formik.handleSubmit()}
                    >
                        Create Ticket
                </Button>
            </DialogFooter>
        </>
    )
}

export default AddTicket;