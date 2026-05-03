import { Skeleton } from "../ui/skeleton";
import TicketTimeline from "./TicketTimeline";

const TicketSidebarContent = ({ ticket, isLoading }) => {
    return (
        <div className="lg:py-6 lg:border-l h-full flex flex-col gap-10 px-0">
            <div className="lg:ml-6 flex flex-col gap-2">
                <p className="text-sm font-medium text-slate-500">Description:</p>
                {
                    isLoading ? (
                        <Skeleton className="w-full h-20" />
                    )
                    : ticket.description ? (
                        <p>{ticket.description}</p>
                    ) : (
                        <p className="text-sm text-slate-500">No description available.</p>
                    )
                }
            </div>
            <TicketTimeline ticketId={ticket.id} isLoading={isLoading} timeline={ticket.timeline}/>
        </div>
    );
}

export default TicketSidebarContent