import { useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import axiosClient from "@/AxiosClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

const CancelTicket = ({open, onOpenChange, ticket, getTicket }) => {
    const [reasons, setReasons] = useState([]);
    const [selectedReason, setSelectedReason] = useState("");

    const getReasonsOptions = () => {
        axiosClient.get("/api/cancel-reasons")
        .then(response => {
            setReasons(response.data.data);
        })
        .catch(error => {
            console.error("Failed to fetch cancellation reasons:", error);
        });
    }

    const formik = useFormik({
        initialValues: {
            cancel_reason_id: undefined,
            custom_reason: ""
        },
        validationSchema: Yup.object().shape({
            cancel_reason_id: Yup.number().required("Please select a cancellation reason"),
            custom_reason: Yup.string().when("cancel_reason_id", {
                    is: 0,
                    then: (schema) => schema.required("Please specify the cancellation reason"),
                    otherwise: (schema) => schema.notRequired(),
                })
            }),
        onSubmit: (values) => {
            const req = axiosClient.patch(`/api/tickets/${ticket?.id}/cancel`, values);
            toast.promise(req, {
                loading: "Cancelling ticket...",
                success: () => {
                    getTicket(ticket.ticketId);
                    onOpenChange(false)
                    return "Ticket cancelled successfully!"
                },
                error: "Failed to cancel ticket."
            });
        }
    });

    useEffect(() => {
        if (open) {
            getReasonsOptions();
        }
    }, [open])


        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Cancel Ticket</DialogTitle>
                        <DialogDescription className="text-sm text-gray-700 hidden lg:flex">
                            Please confirm if you want to cancel this ticket. Once cancelled, the ticket will be closed and cannot be re-opened. If you wish to proceed, please provide an explanation and click the "Confirm Cancellation" button below.
                        </DialogDescription>
                        <DialogDescription className="text-sm text-gray-700 lg:hidden flex sm:text-left text-center">
                            Please confirm if you want to cancel this ticket. Once cancelled, the ticket will be closed and cannot be re-opened.
                        </DialogDescription>
                    </DialogHeader>
                    {/* Reason Selection */}
                    <form onSubmit={()=>formik.handleSubmit()} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <p className="font-medium text-slate-500 text-xs">Please select a reason for cancellation:</p>
                            <Select className="w-full" value={formik.values.cancel_reason_id} onValueChange={(value) => formik.setFieldValue("cancel_reason_id", parseInt(value))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a reason for cancellation" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    {
                                        reasons.map((reason, index) => (
                                            <SelectItem key={reason.id} value={reason.id}>
                                                {reason.reason}
                                            </SelectItem>
                                        ))
                                    }
                                    <SelectItem key="other" value={0}>
                                        Other Reason
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {
                                formik.touched.cancel_reason_id && formik.errors.cancel_reason_id ? (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.cancel_reason_id}</p>
                                ) : null
                            }
                        </div>
                        {
                            formik.values.cancel_reason_id === 0 ?
                            <div className="flex flex-col gap-2">
                                <p className="font-medium text-slate-500 text-xs">Specify Other Reason:</p>
                                <input type="text" 
                                    name="custom_reason"
                                    value={formik.values.custom_reason}
                                    onChange={formik.handleChange}
                                    placeholder="Enter reason for cancellation" 
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"/>
                                {
                                    formik.touched.custom_reason && formik.errors.custom_reason ? (
                                        <p className="text-red-500 text-xs mt-1">{formik.errors.custom_reason}</p>
                                    ) : null
                                }
                            </div> : null
                        }
                    </form>
                    <DialogFooter>
                        {/* Cancel and Confirm Buttons */}
                        <DialogClose asChild>
                            <Button variant="outline" size="lg">Cancel</Button>
                        </DialogClose>
                        <Button 
                            disabled={false}
                            type="submit"
                            variant="default"
                            size="lg"
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                            onClick={() => formik.handleSubmit()}>
                            Confirm Cancellation
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
}

export default CancelTicket;