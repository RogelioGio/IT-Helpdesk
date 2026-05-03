import { ArrowUpFromLine, CircleMinusIcon, Ellipsis, EllipsisVertical, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

const TicketDropdownActions = ({accountrole, ticketStatus, onCancel, onExport}) => {
    const dropdDownContents = {
        SystemAdmin: [
            {
                title: "Archive Ticket",
                icon: Trash,
                destructive: true,
                seperator: true
            }   
        ]
    }




    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <EllipsisVertical className="w-4 h-4" data-icon="inline-start"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem  className="px-4" onClick={onExport}>
                    <ArrowUpFromLine className="w-4 h-4" data-icon="inline-start"/>
                    Export
                </DropdownMenuItem>
                {
                    ticketStatus === "Assigned" || ticketStatus === "Open" ?
                    <DropdownMenuItem variant="destructive" className="px-4" onSelect={onCancel}>
                        <CircleMinusIcon className="w-4 h-4" data-icon="inline-start"/>
                        Cancel Ticket
                    </DropdownMenuItem> : null
                }
                {
                    dropdDownContents[accountrole]?.map((item, index) => (
                        <>
                            {
                                (ticketStatus === "Assigned" || ticketStatus === "Open") && item.seperator ? 
                                <DropdownMenuSeparator key={index}/> : null
                            }
                            <DropdownMenuItem key={item.title} variant={item.destructive ? "destructive" : "default"} className="px-4">
                                <item.icon className="w-4 h-4" data-icon="inline-start"/>
                                {item.title}
                            </DropdownMenuItem>
                        </>
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export default TicketDropdownActions;