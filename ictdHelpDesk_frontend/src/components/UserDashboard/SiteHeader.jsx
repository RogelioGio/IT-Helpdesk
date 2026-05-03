const { Sidebar, SidebarTrigger } = require("../ui/sidebar")

const SiteHeader = () => {
    return (
        <>
            <SidebarTrigger className="lg:hidden" />
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Create Ticket</h1>
                <p className="text-sm text-muted-foreground">
                    Create a new ticket to report an issue or request assistance.
                </p>
            </div>
        </>
    )
}