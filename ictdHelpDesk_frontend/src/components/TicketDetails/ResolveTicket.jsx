import { CircleChevronDown, CircleDot, CircleEqualIcon, CircleMinus, ClipboardCheck, Flame, MessageCircleQuestionMark, OctagonAlert, UserCog, Wrench } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useFormik } from "formik";
import ResolveTicketForm from "./ResolveTicketForm";
import { useState } from "react";
import { toast } from "sonner";
import axiosClient from "@/AxiosClient";

const ResolveTicket = ({open, setOpen, ticket, getTicket}) => {
    const [submitting, setSubmitting] = useState(false);
    const Criticality = {
        Critical: {
            icon: <Flame strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>,
            bigIcon: <Flame strokeWidth={2} className="w-6 h-6" data-icon="inline-end"/>,
            color: "text-red-500",
            bg: "bg-red-500/10",
            border: "border-red-500"
        },
        High: {
            icon: <OctagonAlert strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>,
            bigIcon: <OctagonAlert strokeWidth={2} className="w-6 h-6" data-icon="inline-end"/>,
            color: "text-orange-600",
            bg: "bg-orange-600/10",
            border: "border-orange-600"
        },
        Medium: {
            icon: <CircleEqualIcon strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>,
            bigIcon: <CircleEqualIcon strokeWidth={2} className="w-6 h-6" data-icon="inline-end"/>,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            border: "border-yellow-500"
        },
        Low: {
            icon: <CircleChevronDown strokeWidth={2} className="w-4 h-4" data-icon="inline-start"/>,
            bigIcon: <CircleChevronDown strokeWidth={2} className="w-6 h-6" data-icon="inline-end"/>,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
                border: "border-blue-500"

        }
    };
    const Status = {
                    Open: {
                        color: "text-blue-700",
                        bg:"bg-blue-700/10",
                        icon: <MessageCircleQuestionMark strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>
                    },
                    Assigned: {
                        color: "text-purple-700",
                        bg: "bg-purple-700/10",
                        icon: <UserCog strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>
                    },
                    Responded: {
                        color: "text-yellow-700",
                        bg: "bg-yellow-700/10",
                        icon: <Wrench strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>
                    },
                    Resolved: {
                        color: "text-emerald-700",
                        bg: "bg-emerald-700/10",
                        icon: <ClipboardCheck strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>
                    },
                    Closed: {
                        color: "text-slate-700",
                        bg: "bg-slate-700/10",
                        icon: <CircleDot strokeWidth={2} className="w-4 h-4" data-icon="inline-end"/>
                    },
                    Cancelled: {
                        color: "text-red-700",
                        bg: "bg-red-700/10",
                        icon: <CircleMinus strokeWidth={2} className="w-4 h-4 text-red-700" data-icon="inline-end"/>
                    }
                };
    
     const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
                findings: "",
                resolution: "",
        },
        onSubmit: (values) => {
            if(submitting) return;
            setSubmitting(true);

            toast.promise(
                axiosClient.patch(`/api/tickets/${ticket?.id}/resolve`, values),
                {
                    loading: "Resolving ticket...",
                    success: () => {
                        setOpen(false);
                        formik.resetForm();
                        getTicket(ticket?.ticketId);
                        return "Ticket resolved successfully!";
                    },
                     error: (err) => {
                        setSubmitting(false);
                        return err.response?.data?.message || "Failed to create user.";
                    }
                }
            ).finally(() => {
                setSubmitting(false);
            });
        }
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Resolve Ticket</DialogTitle>
                        <DialogDescription className="text-sm text-gray-700 hidden lg:flex">
                            Complete the field to resolve the given ticket.
                        </DialogDescription>
                    </DialogHeader>
                    <p className="text-xs text-gray-500">Ticket to be Resolve:</p>
                    <div className="flex-row flex gap-2">
                        <div className={`rounded-md aspect-square flex items-center justify-center ${Criticality[ticket?.priority?.name]?.bg} ${Criticality[ticket?.priority?.name]?.color} ${Criticality[ticket?.priority?.name]?.border} border`}>
                            {Criticality[ticket?.priority?.name]?.bigIcon || <CircleEqualIcon strokeWidth={2} className="w-6 h-6" data-icon="inline-end"/>}
                        </div>
                        <div>
                            <div className="flex flex-row gap-1 items-center">
                                <p className="font-bold text-2xl">{ticket?.activitySpecification?.name}</p>
                                <p className="text-sm text-slate-500">- {ticket?.activity?.name}</p>
                            </div>
                            <p className="text-xs text-slate-500">#{ticket.ticketId}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Ticket Description:</p>
                        <p className="text-sm text-gray-700">{ticket?.description}</p>
                    </div>
                    <ResolveTicketForm formik={formik}/>
                    <DialogFooter className="flex justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline" size="lg">
                                Cancel
                            </Button>
                        </DialogClose>
                         <Button
                            disabled={submitting || !formik.values.findings || !formik.values.resolution}
                            type="submit"
                            variant="default"
                            size="lg"
                            className=""
                            onClick={() => formik.handleSubmit()}>
                            Mark as Resolved
                        </Button>
                    </DialogFooter>
                </DialogContent>
        </Dialog>
    )
}

export default ResolveTicket;
