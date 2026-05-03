import { useReportStore } from "@/stores/useReportStore";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import axiosClient from "@/AxiosClient";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";
import { set } from "date-fns";

const ReportDialog = ({ open, setOpen }) => {
    const {context, params, setParams} = useReportStore();
    
    const handleExport = () => {
        let payload = {...params};

        if(selectedCategory){
            const [key, value] = selectedCategory.split(": ");
            payload = {
                ...payload,
                [key]: value,
            }
        }
        
        const req = axiosClient.post(context.url, payload, { responseType: 'blob' })

        toast.promise(req, {
            loading: "Generating report...",
            success: (res) => {
                const file = new Blob([res.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);

                window.open(fileURL, '_blank');
                setOpen(false);
                setSelectedCategory(undefined);
                return "Report generated successfully.";
            },
            error: "Failed to generate report.",
        })
    }

    const dataCategories = {
        cancellationRatio : [
            {
                label: "Cancellation Reason Statistics",
                value: "cancellation_report: cancellation_reason"
            },
            {
                label: "Cancellation Frequency by Department",
                value: "cancellation_report: cancellation_department"
            },
            {
                label: "Cancellation Frequency by Activity Specifications",
                value: "cancellation_report: cancellation_activity_specification"
            }
        ],
        ticketSummary : [
            {
                label: "Ticket Summary by Priority",
                value: "ticketvolume_report: priority"
            },
            {
                label: "Ticket Summary by Status",
                value: "ticketvolume_report: status"
            }
        ],
        service: [
            {
                label: "Service Satisfaction by Activity",
                value: "service_report: activity"
            },
            {
                label:  "Service Satisfaction by Activity Specification",
                value: "service_report: activity_specification"
            },
            {
                label: "Service Satisfaction by Department",
                value: "service_report: department"
            }
        ]
    }
    const [selectedCategory, setSelectedCategory] = useState();

    const isDisabled = () => {
        if(context.value === "cancellationRatio" || context.value === "ticketSummary" || context.value === "service"){
            return !selectedCategory;
        }
    }

    useEffect(() => {
        return () => setSelectedCategory(undefined);
    }, [context])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Export {context?.reportName} Report</DialogTitle>
                    <DialogDescription>
                        {context?.description}
                    </DialogDescription>
                </DialogHeader>
                {
                    context?.value === "cancellationRatio" || context?.value === "ticketSummary" || context?.value === "service" ? 
                    <div className="flex flex-col gap-2">
                        <p className="text-xs m">Data Category</p>
                        <Select value={selectedCategory} onValueChange={(value) => {setSelectedCategory(value)}}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Report Scope" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                dataCategories[context.value].map((category) => (
                                    <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    </div>
                    : null
                }
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" size="lg">Cancel</Button>
                    </DialogClose>
                    <Button variant="default" size="lg" className="" onClick={handleExport} disabled={isDisabled()}>Generate Report</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ReportDialog;