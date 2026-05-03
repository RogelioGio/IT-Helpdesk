import { AlertTriangle, Bold, ClipboardEditIcon, ClipboardXIcon, Code, Edit, Ellipsis, Eye, Heading, Info, Italic, Lightbulb, List, ListOrdered, ListTodo, MessageSquareWarningIcon, OctagonAlert, PenBox, Pencil, TextQuote, Trash } from "lucide-react"
import { Button } from "../ui/button"
import axiosClient from "@/AxiosClient"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { differenceInDays, format, formatDistance, formatDistanceToNow, min, set } from "date-fns"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useAuth } from "@/contexts/AuthProvider"
import MDEditor, { commands, getCommands, getExtraCommands, getStateFromTextArea, TextAreaTextApi } from "@uiw/react-md-editor"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Toggle } from "../ui/toggle"
import "@uiw/react-md-editor/markdown-editor.css";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { echoInstance } from "@/echo"
import { useTicketStore } from "@/stores/useTicketStore"

const RemarksComponents = ({}) => {
    const {ticket, addNewRemark, remarks, setRemarks} = useTicketStore()
    const { user } = useAuth();
    // const [remarks, setRemarks] = useState(ticket.remarks || []);
    const [createRemarks, setCreateRemarks] = useState(false);
    const [editRemarks, setEditRemarks] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editing, setEditing] = useState(false);
    const [deleteRemark, setDeleteRemark] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [toBeDeleted, setToBeDeleted] = useState({});

    // useEffect(()=> {
    //     setRemarks(ticket.remarks || []);
    // }, [ticket.remarks])

    useEffect(() => {
        if(!ticket?.id) return;
        const handleNewRemarkNotification = (event) => {
            const newRemark = event.detail;
            setRemarks(prevRemarks => [...prevRemarks, newRemark]);
        }
        const handleUpdatedRemarkNotification = (event) => {
            const updatedRemark = event.remark;
            setRemarks(remarks.map(r => r.id === updatedRemark.id ? updatedRemark : r));
        }
        const handleDeletedRemarkNotification = (event) => {
            const deletedRemark = event.remark.id;
            setRemarks(remarks.filter(r => r.id !== deletedRemark));

        }

        const channel = `ticket.${ticket.id}.remarks`;

        echoInstance.private(channel)
        .listen(".remark.deleted", (e) => {handleDeletedRemarkNotification(e)})
        .listen(".remark.updated", (e) => {handleUpdatedRemarkNotification(e)})


    

        return () => {
            echoInstance.leave(channel);
        }

    }, [ticket])
        
    const HandlePostgRemarks = (remarksPayload, setRemarkPayload) => {
        setSubmitting(true);
        const req = axiosClient.post("api/remarks", {
            body: remarksPayload,
            remarkable_id: ticket.id,
            remarkable_type: "ticket"
        })

        toast.promise(req, {
            loading: "Adding remark...",
            success: ({data}) => {
                setSubmitting(false);
                addNewRemark(data.data);
                setRemarkPayload("");
                return "Remark added successfully"
            },
            error: (err) => {
                setSubmitting(false);
                console.error(err);
                return "Failed to add remark. Please try again."
            }
        })
    }
    const handleEditRemarks = (remarksId,remarksPayload, setRemarkPayload) => {
        setEditing(true)
        const req = axiosClient.put(`api/remarks/${remarksId}`, {
            body: remarksPayload,
        })

        toast.promise(req, {
            loading: "Saving changes...",
            success: ({data}) => {
                setEditing(false);
                setEditRemarks(false)

                const updatedRemark = data.data
                setRemarks(remarks.map(r => r.id === updatedRemark.id ? updatedRemark : r));


                return "Remark updated successfully"
            },
            error: (err) => {
                setEditing(false);
                console.error(err);
                return "Failed to save changes. Please try again."
            }});
    }
    const handleDeleteRemarks = (remarksId) => {
        setDeleting(true)
        const req = axiosClient.delete(`api/remarks/${remarksId}`)
        toast.promise(req, {
            loading: "Deleting remark...",
            success: ({data}) => {
                setDeleting(false);
                setDeleteRemark(false);
                setRemarks(remarks.filter(r => r.id !== remarksId));
                return "Remark deleted successfully"
            },error: (err) => {                
                setDeleting(false);
                console.error(err);
                return "Failed to delete remark. Please try again."
            }
        })

    }

    return (
        <>
            <div className="pr-6">
                <div className="border rounded-md overflow-hidden flex flex-col">
                    <div className="px-6 py-4 bg-muted flex flex-row items-center justify-between">
                        <div>
                            <p className="flex items-center font-medium text-sm"><span className="mr-2"><ClipboardEditIcon /></span>Remarks <span><Badge className="ml-2">{remarks.length}</Badge></span></p>
                        </div>
                        {
                            !createRemarks && ticket?.remarks?.length === 0 &&
                            <Button onClick={() => setCreateRemarks(true)} >
                                <Pencil className="mr-2" size={16} />
                                Add Remark
                            </Button>
                        }
                    </div>
                    <div className="flex flex-col flex-1 [&>*:first-child]:pt-10 [&>*:last-child]:pb-5">
                        {
                            ticket?.remarks?.length === 0 && remarks.length === 0 && !createRemarks ? 
                            <div className="p-6 flex flex-col items-center justify-center gap-4">
                                <div className="bg-slate-200/50 size-12 rounded-md flex items-center justify-center">
                                    <ClipboardXIcon className="size-6 text-slate-700" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-slate-700">No Remarks Yet</p>
                                    <p className="text-xs text-slate-700">Create one to give more information about the ticket</p>
                                </div>
                            </div> : 
                            <>
                            {
                                remarks && remarks.length > 0 ? 
                                remarks.map((remark, index) => (
                                    <>
                                        <RemarkItem key={index} remark={remark} editState={editRemarks} setEditState={setEditRemarks} handleEdit={handleEditRemarks} deleteState={deleteRemark} setDeleteState={setDeleteRemark} setToBeDeleted={setToBeDeleted}/>
                                        {
                                            index !== remarks.length - 1 && 
                                            <div className="px-7 flex flex-row gap-4">
                                                <div className="size-10 h-4"/>
                                                <div className="px-6">
                                                    <div className="bg-slate-300 w-0.5 h-4"/>
                                                </div>
                                            </div>
                                        }
                                    </>
                                )) : null
                            }
                            <div className="p-6 flex flex-row items-start gap-4">
                                <Avatar className="size-10 rounded-lg">
                                    <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.username || 'User'}`} alt="User Profile" />
                                    <AvatarFallback>{user?.username ? user.username.charAt(0) : "U"}</AvatarFallback>
                                </Avatar> 
                                <div className="flex-1 flex flex-col gap-4">
                                    <div className="size-10 w-full flex items-center">
                                        <p className="text-lg font-bold">{remarks.length === 0 ? "Create Remarks" : "Add Remarks"}</p>
                                    </div>
                                    <CreateRemarkComponent action="create" toggleCreate={setCreateRemarks} submit={HandlePostgRemarks} submitting={submitting} />
                                </div>
                            </div>
                            </>
                        }
                    </div>
                </div>
            </div>
            <DeleteRemark open={deleteRemark} setOpen={setDeleteRemark} remark={toBeDeleted} handleDeleteRemarks={handleDeleteRemarks}/>
        </>
    )
}

export default RemarksComponents

const CreateRemarkComponent = ({action, ...handleActions}) => {
    const [remarks, setRemarks] = useState();
    const [isActiveMode, setIsActiveMode] = useState("write");
    const toolbarCommands = [
        [
            {
                name: 'heading3',
                icon: Heading,
                tooltip: "Heading",
            },
            {
                name: "bold",
                icon: Bold,
                tooltip: "Bold",
            },
            {
                name: "italic",
                icon: Italic,
                tooltip: "Italic",
            },
            {
                name: "quote",
                icon: TextQuote,
                tooltip: "Quote",
            },
            {
                name: "code",
                icon: Code,
                tooltip: "Code"
            },
        ],
        [
            {
                name: 'unordered-list',
                icon: List,
                tooltip: "Unordered List",
            },
            {
                name: 'ordered-list',
                icon: ListOrdered,
                tooltip: "Numbered List",
            },
            {
                name: 'checked-list',
                icon: ListTodo,
                tooltip: "Task List"
            }
        ],
        [
            {
                name: 'caution-alert',
                icon: OctagonAlert, // Import from lucide
                tooltip: "Add Caution Alert",
                execute: (state, api) => {
                    const newText = `> [!CAUTION]\n> ${state.selectedText || ""}`;
                    api.replaceSelection(newText);
                }
            },
            {
                name: 'warning-alert',
                icon: AlertTriangle,
                tooltip: "Add Warning Alert",
                execute: (state, api) => {
                    const selected = state.selectedText || "";
                    api.replaceSelection(`> [!WARNING]\n> ${selected}`);
                }
            },
            {
                name: 'important-alert',
                icon: MessageSquareWarningIcon, // or MessageSquare
                tooltip: "Add Important Alert",
                execute: (state, api) => {
                    const selected = state.selectedText || "";
                    api.replaceSelection(`> [!IMPORTANT]\n> ${selected}`);
                }
            },
            {
                name: 'tip-alert',
                icon: Lightbulb, 
                tooltip: "Add Tips Alert",
                execute: (state, api) => {
                    const selected = state.selectedText || "";
                    api.replaceSelection(`> [!TIP]\n> ${selected}`);
                }
            },
            {
                name: 'note-alert',
                icon: Info, 
                tooltip: "Add Note Alert",
                execute: (state, api) => {
                    const selected = state.selectedText || "";
                    api.replaceSelection(`> [!NOTE]\n> ${selected}`);
                }
            }
        
        ]
    ]

    const handleToolbarCommand = (commandName) => {
        const flatCommands = toolbarCommands.flat(); 
        const customCommand = flatCommands.find(c => c.name === commandName);

        const textArea = document.querySelector(".w-md-editor-text-input");
        if (!textArea) return;

        const api = new TextAreaTextApi(textArea);
        const textState = getStateFromTextArea(textArea);

        if (customCommand && customCommand.execute) {
            customCommand.execute(textState, api);
            
            setRemarks(textArea.value);
            textArea.focus();
            return; 
        }

        const allLibraryCommands = commands.getCommands();
        let libraryCmd = allLibraryCommands.find(cmd => cmd.name === commandName);

        if (!libraryCmd) {
            allLibraryCommands.forEach(group => {
                if (group.children) {
                    const match = group.children.find(child => child.name === commandName);
                    if (match) libraryCmd = match;
                }
            });
        }

        if (libraryCmd) {
            libraryCmd.execute({ ...textState, command: libraryCmd }, api);
            setRemarks(textArea.value);
            textArea.focus();
        }
    };

    useEffect(() => {
        if(handleActions?.editBody !== undefined) {
            setRemarks(handleActions?.editBody);
        }
    },[handleActions?.editBody])

    return (
        <>
            <div className="flex-1 border rounded-md overflow-hidden flex flex-col min-h-50">
            {/* Toolbar */}
            <div className="bg-muted rounded-t-md flex flex-row items-stretch justify-between">
                <div className="flex flex-row">
                    <div className={`p-4 cursor-pointer ${isActiveMode === "write" ? "bg-white border-r rounded-t-md" : "border-b bg-secondary text-muted-foreground"} text-sm flex flex-row items-center`} onClick={() => setIsActiveMode("write")}>
                        <Pencil className="mr-2" size={16} />
                        <p>Write</p>
                </div >
                    <div className={`p-4 cursor-pointer ${isActiveMode === "preview" ? "bg-white border-l  border-r rounded-t-md" : " border-b bg-secondary text-muted-foreground"} text-sm flex flex-row items-center`} onClick={() => setIsActiveMode("preview")}>
                        <Eye className="mr-2" size={16} />
                        <p>Preview</p>
                    </div>
                </div>
                <div className="border-b flex-1 flex flex-row items-center justify-end gap-2 ">
                    <div className="flex flex-row">
                        {
                            isActiveMode === "write" && 
                            toolbarCommands.map((group, index) => (
                                <div key={`section-${index}`} className="flex items-center gap-1 pr-2 border-r last:border-r-0 border-border">
                                {
                                    group.map((command) => {
                                        const CommandIcon = command.icon;

                                        return (<Tooltip key={command.name}>
                                                <TooltipTrigger asChild>
                                                    <Toggle aria-label="Toggle bookmark" size="sm" variant="ghost" onClick={() => handleToolbarCommand(command.name)}>
                                                        <CommandIcon  />
                                                    </Toggle>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{command.tooltip}</p>
                                                </TooltipContent>   
                                                </Tooltip>)
                                    })
                                }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            {/* Canvas */}
            <div data-color-mode="light" className="h-full">
            {
                isActiveMode == "preview" ? 
                    <MDEditor.Markdown source={remarks} className="p-10 prose max-w-none" />
                : 
                <div className="flex flex-col overflow-y-auto max-h-100">
                    <MDEditor
                    value={remarks}
                    onChange={setRemarks}
                    preview="edit"
                    autoFocusEnd={true}
                    visibleDragbar={false} // Allows the user to manually resize if they want
                    height="100%"
                    enableScroll={true}   // Ensure internal scrolling is active (default is true)
                    hideToolbar={true}
                    textareaProps={{
                        placeholder: "Enter ticket remarks here...",
                    }}
                    />
                </div>
            }
            </div>
        </div>
        {/* Footer */}
        <div className="flex flex-row flex-1 h-full items-center justify-end gap-2 pb-4">
            <Button size="sm" variant="outline" onClick={() => {action !== "create" ? handleActions.handleCancel() : handleActions.toggleCreate(false)}}>
                Cancel
            </Button>
            <Button size="sm" onClick={()=>{action === "create" ? handleActions.submit(remarks, setRemarks) : handleActions.submit(handleActions.remarkId, remarks, setRemarks)}} disabled={handleActions.submitting}>
                {action === "edit" ? "Save Changes" : "Add Remark"}
            </Button>
        </div>
        </>
    )
}

const RemarkItem = ({remark, ...context}) => {
    const remarkBy = remark.remarkBy || {}
    const {user} = useAuth();
    const [editState, setEditState] = useState(false);
    return ( 
        <div className="px-6 flex flex-row items-start gap-4">
            <Avatar className="size-10 rounded-lg">
                <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${remarkBy?.username || 'User'}`} alt="User Profile" />
                <AvatarFallback>{remarkBy?.username ? remarkBy.username.charAt(0) : "U"}</AvatarFallback>
            </Avatar> 
            <div className="flex-1 border min-h-40 rounded-md overflow-hidden flex flex-col">
                {/* Toolbar */}
                <div className="bg-muted rounded-t-md flex flex-row items-stretch justify-between p-4">
                    <div className="flex flex-row gap-2 items-center">
                        <p className="text-sm font-medium">{remarkBy.firstName} {remarkBy.middleName ? remarkBy.middleName.charAt(0).toUpperCase() + "." : ''} {remarkBy.lastName}</p>
                        <p className="text-xs text-muted-foreground">{remark.created_at ? (differenceInDays(new Date(), remark.created_at) > 1 ? format(remark.created_at, "MMM dd yyy") : formatDistanceToNow(remark.created_at, {addSuffix: true})) : 'Unknown'}</p>
                    </div>
                    {
                        user && remarkBy && user.id === remarkBy.id &&
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="size-8 p-0">
                                    <Ellipsis className="size-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => {setEditState(true)}}>
                                    <PenBox/>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem variant="destructive" onClick={() => {context.setDeleteState(true), context.setToBeDeleted(remark)}}>
                                    <Trash/>
                                    Remove
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    }
                </div>
                {/* Content */}
                {
                    !editState ?  
                    <div data-color-mode="light" className="h-full">
                        <MDEditor.Markdown source={remark.body} className="p-10 prose max-w-none font-google! text-sm!" />
                    </div>
                    : 
                    // submit={HandlePostgRemarks} 
                    // submitting={submitting}
                    <div className="p-2 flex flex-col gap-4">
                        <CreateRemarkComponent action="edit" toggleCreate={context.setEditState} editBody={remark.body} remarkId={remark.id} submit={context.handleEdit} handleCancel={() => setEditState(false)}/>
                    </div>
                }
            </div>
        </div> )
}

const DeleteRemark = ({remark, open, setOpen, handleDeleteRemarks}) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Delete Remark
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-700 hidden lg:flex">
                        Are you sure you want to delete this remark? This action cannot be undone. Please confirm your decision by clicking the "Delete" button below.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={() => {
                        handleDeleteRemarks(remark.id);
                    }}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}