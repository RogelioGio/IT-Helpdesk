import axiosClient from "@/AxiosClient";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "sonner";

const ReportrDialog = ({ open, onOpenChange, selectedRespondent, reportType }) => {
        const handleGenerateReport = () => {
            const api_url = reportType === 'assignment' ? 'api/gen/assignment' : 'api/gen/performance';

            const req = axiosClient.post(api_url, {
                officer_id: selectedRespondent.id
            }, {
                responseType: 'blob'
            })

            toast.promise(req, {
                loading: 'Generating report...',
                success: (res) => {
                    const file = new Blob([res.data], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);

                    window.open(fileURL, '_blank');
                    onOpenChange(false);
                    return "Report generated successfully.";
                },
                error: 'Failed to generate report.'
            })
        }

        const reportContext = {
            performance: {
                title: "Report Officer Performance",
                desc: "Generate a report on the performance of officers based on various metrics such as customer satisfaction. This report can help identify top-performing officers, areas for improvement, and trends in officer performance over time."
            },
            assignment: {
                title: "Report Officer Assignment",
                desc: "Generate a report on the assignment of officers to tickets. This report can help identify patterns in ticket assignments, such as which officers are assigned to certain types of tickets or which officers have a high volume of assignments."
            }
        }



        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <p className="text-lg font-medium">{reportContext[reportType]?.title}</p>
                        </DialogTitle>
                        <DialogDescription>
                            <p>
                                {reportContext[reportType]?.desc}
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" size="lg">Cancel</Button>
                    </DialogClose>
                    <Button variant="default" size="lg" className="" onClick={handleGenerateReport}>Generate Report</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        )   
}
export default ReportrDialog;