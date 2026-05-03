import { ClipboardCheck, FilePen, Pen } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";



const TicketFindingsResolutions = ({isLoading ,ticket}) => {
    return (
        <>
            {
                isLoading ? 
                <Skeleton className=" h-50 rounded-md mr-6 hidden md:flex" /> 
                :  
                <div className="mr-6 flex-col gap-4 hidden md:flex">
                    <div className="overflow-hidden rounded-lg border">
                        <div className="flex w-full justify-between items-center px-6 py-4 bg-muted border-b">
                            <div className="flex flex-row gap-2 items-center ">
                                <ClipboardCheck strokeWidth={2} className="w-6 h-6 mr-2" data-icon="inline-start"/>
                                <p className="font-medium text-sm">Findings & Resolution</p>
                            </div>
                            <div>
                                <Button variant="ghost" size="icon" className="hover:bg-slate-700/10" tooltip="Edit Findings & Resolution">
                                    <Pen strokeWidth={2} className="size-5" data-icon="inline-start"/>
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6 px-6 py-4">
                            <div>
                                <p className="text-xs font-medium text-slate-500">Findings:</p>
                                {ticket.findings !== "N/A" ? ticket.findings : "No findings provided."}
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500">Resolution:</p>
                                {ticket.resolution !== "N/A" ? ticket.resolution : "No resolution provided."}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}
export default TicketFindingsResolutions;