import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ClipboardCopy, Contact, Ellipsis, EllipsisVertical, Key, MonitorCog, Pencil, Plus, Shield, ShieldUser, Trash, User, UserCog, Users, UserStarIcon, Wrench } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import sampleUsers from "../SampleUsers.json";
import DataTables from "@/components/UserManagement/TableContents";
import { memo, use, useCallback, useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Adduser from "@/components/UserManagement/AddUser";
import EditUser from "@/components/UserManagement/EditUser";
import ResetingPasswordAlert from "@/components/UserManagement/ResetingPasswordAlert";
import DeleteUserAlert from "@/components/UserManagement/DeleteUserAlert";
import axiosClient from "@/AxiosClient";
import { set } from "date-fns";
import { AddUsersInputProvider } from "@/contexts/AddUsersInputContext";
import { useUserStore } from "@/stores/userUserStore";
import { toast } from "sonner";

export default function UserManagement() {
    const [allUsers, setAllUsers] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openResetPassword, setOpenResetPassword] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [activeRoleFilter, setActiveRoleFilter] = useState("all-user");
    const [officeDepartmentDivisionOptions, setOfficeDepartmentDivisionOptions] = useState([]);
    // const [params, setParams] = useState({
    //     office_department_division_id: "",
    //     account_role_id: "",
    //     search: ""
    // })
    const {params, setParams} = useUserStore()
    const [searchTerm, setSearchTerm] = useState("");
    const [visibleColumns, setVisibleColumns] = useState({})
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [pageCount, setPageCount] = useState(0);

    // const filterRoles = useMemo(() => {
    //     if(activeRoleFilter === "all-user") return allUsers;
    //     return allUsers.filter((user) => user.accountroles.id === parseInt(activeRoleFilter));
    // },[activeRoleFilter, allUsers])

    const HandleEdit = useCallback((user) => {
        setSelectedUser(user);
        setOpenEdit(true);
    }, [])

    const HandleResetPassword = useCallback((user) => {
        setSelectedUser(user);
        setOpenResetPassword(true);
    }, [])

    const HandleDelete = useCallback((user) => {
        setSelectedUser(user);
        setOpenDelete(true);
    }, [])  

    const HandleAuditrail = useCallback((user) => {
        const req = axiosClient.post(`/api/gen/audit`, {
            "user_id": user.id
        }, {responseType: "blob"})

        toast.promise(req, {
            loading: "Generating audit trail report...",
            success: (res) => {
                const file = new Blob([res.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);

                window.open(fileURL, '_blank');
                return "Report generated successfully.";
            },
            error: "Failed to generate audit trail report."
        })
    })


    const columns = useMemo(() => [
    {
        accessorKey: "employeeID",
        header: "Employee ID",
    },
    {
        id: "fullname",
        header: "Full Name",
        cell: ({ row }) => {
            const { firstName, middleName, lastName } = row.original;
            const middleInitials = middleName ? `${middleName.charAt(0)}.` : "";
            return `${firstName} ${middleInitials} ${lastName}`;
        }
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "designation",
        header: "Designation",
    },
    {
        accessorKey: "office/department/division",
        header: "Office/Department/Division",
        cell: ({ row }) => {
            const officeDeptDiv = row.original["office_department_division"];
            return officeDeptDiv ? `${officeDeptDiv.name}` : "N/A";
        }
    },
    {
        accessorKey: "accountroles",
        header: "Role",
        cell: ({ row }) => {
            const role = row.original.accountroles;
            const badgeColor = {
                2: "bg-purple-100 text-purple-800",
                3: "bg-blue-100 text-blue-800",
                4: "bg-green-100 text-green-800",
                5: "bg-yellow-100 text-yellow-800",
            }
            return (
                <Badge variant="outline" className={badgeColor[role.id] || "bg-gray-100 text-gray-800"}>
                    {
                        role.id === 2 ? <MonitorCog className="w-4 h-4 mr-2" data-icon="inline-start"/> : 
                        role.id === 3 ? <Users className="w-4 h-4 mr-2" data-icon="inline-start"/> :
                        role.id === 4 ? <Wrench className="w-4 h-4 mr-2" data-icon="inline-start"/> :
                        role.id === 5 ? <User className="w-4 h-4 mr-2" data-icon="inline-start"/> : 
                        <UserStarIcon className="w-4 h-4 mr-2" data-icon="inline-start"/>
                    }
                    {role.name}
                </Badge>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <UserAction 
                    user={user} 
                    onEdit={HandleEdit}
                    onReset={HandleResetPassword}
                    onDelete={HandleDelete}
                    onAuditTrail={HandleAuditrail}
                />
            )
        }
    }
    ], [HandleDelete, HandleEdit, HandleResetPassword])

    const fetchUsers = useCallback(() => {
        setLoading(true)
        axiosClient.get('api/users', { params: {
            ...params,
            page: pagination.pageIndex + 1,
            per_page: pagination.pageSize
        } })
            .then(({data}) => {
                const isLastpage = Array.isArray(data.meta.last_page) ? data.meta.last_page[0] : data.meta.last_page;
                setAllUsers(data.data);
                setLoading(false);
                setPageCount(isLastpage);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
                setLoading(false);
            }).finally(() => {
                setLoading(false);
            });
    }, [params, pagination])

    useEffect(() => {fetchUsers()}, [fetchUsers])

    const AccountRolesStyle = [
        {
            icon: Contact,
            text: "All Users",
            value: "all"
        },
        {
            icon: ShieldUser,
            text: "Administrators",
            value: 2
        },
        {
            icon: MonitorCog,
            text: "Managers",
            value: 3
        },
        {
            icon: Wrench,
            text: "Officers",
            value: 4
        },
        {
            icon: User,
            text: "Users",
            value: 5
        }
    ]

    useEffect(() => {
        axiosClient.get("/api/departments")
        .then((response) => {
            setOfficeDepartmentDivisionOptions(response.data.data);
        })
        .catch((error) => {
            console.error("Error fetching office/department/division options:", error);
        });
    },[])

    useEffect(() => {
        setParams({search: searchTerm})
    }, [searchTerm]);

    // useEffect(() => {
    //     setParams({
    //         account_role_name: AccountRolesStyle.find(role => role.value === params.account_role_id)?.text || "",
    //         office_department_division_name: officeDepartmentDivisionOptions.find(option => option.id === params.office_department_division_id)?.name || ""
    //     })
    // }, [params])

    
    return (
        <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 flex-1">
                        <div className="flex lg:flex-row flex-col px-6 justify-between gap-5">
                            <SearchInput onSearchChange={setSearchTerm} setLoading={setLoading} className={'w-full lg:hidden flex-col gap-2'}/>
                            <div className="flex-row flex gap-5 items-center">
                                <SearchInput onSearchChange={setSearchTerm} setLoading={setLoading} className={'w-lg lg:flex hidden flex-col gap-2'}/>
                                <div className="flex-col flex gap-2">
                                    <label htmlFor="Account-roles-selector" className="font-medium text-xs text-slate-500">
                                        Account Roles
                                    </label>
                                    <Select defaultValue="all" onValueChange={(value) => setParams({account_role_id: value})}>
                                        <SelectTrigger className="flex"
                                            size="lg"
                                            id="Account-roles-selector"
                                        >
                                            <SelectValue placeholder="Select User Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                AccountRolesStyle.map((role) => (
                                                    <SelectItem key={role.text} value={role.value}>
                                                        <role.icon className="w-4 h-4" data-icon="inline-start"/>
                                                        {role.text}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-col flex gap-2">
                                    <label htmlFor="view-selector" className="font-medium text-xs text-slate-500">
                                        Office/Department/Division
                                    </label>
                                    <Select defaultValue="all" onValueChange={(value) => setParams({office_department_division_id: value })}>
                                        <SelectTrigger className="flex"
                                            size="lg"
                                            id="view-selector"
                                        >
                                            <SelectValue placeholder="Select Office/Department/Division" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem key="all" value="all">
                                                All Office/Department/Division
                                            </SelectItem>
                                            {
                                                officeDepartmentDivisionOptions.map((option) => (
                                                    <SelectItem key={option.id} value={option.id}>
                                                        {option.name}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-2 items-end lg:w-fit w-full justify-between">
                                <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline">
                                                <span>Toggle Columns</span>
                                                <ChevronDown className="size-4 ml-1"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-auto min-w-40 p-2">
                                            {
                                                columns.filter((col) => col.id !== "select" && col.id !== "actions").map((col) => {
                                                return (
                                                        <DropdownMenuCheckboxItem 
                                                            key={col.id} 
                                                            className="capitalize" 
                                                            checked={visibleColumns[col.id || col.accessorKey] ?? true}
                                                            onCheckedChange={(checked) => {
                                                                setVisibleColumns((prev) => ({
                                                                    ...prev,
                                                                    [col.id || col.accessorKey]: checked
                                                                }))
                                                            }}>
                                                                {col.header}   
                                                        </DropdownMenuCheckboxItem>
                                                    )
                                                })
                                            }
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                            <Button className="flex items-center gap-2 hover:cursor-pointer" size="sm">
                                                <Plus className="w-4 h-4" />
                                                <span className="hidden @4xl/main:inline">Add User</span>
                                            </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-5xl">
                                            <Adduser setOpen={setOpen} fetchUsers={fetchUsers} officeDepartmentDivisionOptions={officeDepartmentDivisionOptions} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div className="px-6 h-full flex flex-col justify-between">
                            <DataTables data={allUsers} columns={columns} columnVisibility={visibleColumns} isLoading={loading} pagination={pagination} setPagination={setPagination} pageCount={pageCount} dept={officeDepartmentDivisionOptions} />
                        </div>
                    </div>
                </div>


            {
                openEdit && <EditUser fetchUser={fetchUsers} open={openEdit} setOpen={setOpenEdit} user={selectedUser} office_department_division={officeDepartmentDivisionOptions} />
            }
            {
                openResetPassword && <ResetingPasswordAlert user={selectedUser} fetchUser={fetchUsers} open={openResetPassword} setOpen={setOpenResetPassword}/>
            }
            {
                openDelete && <DeleteUserAlert user={selectedUser} setOpen={setOpenDelete} fetchUser={fetchUsers} open={openDelete}/>
            }
        </div>
    );
}

const SearchInput = ({onSearchChange, className, setLoading}) => {
    const [localValue, setLocalValue] = useState("");
    
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(localValue);
        }, 500);
        return () => clearTimeout(timer);
    }, [localValue, onSearchChange])

    return (
        <div className={className}>
            <label htmlFor="Account-roles-selector" className="font-medium text-xs text-slate-500">
                Search Employee
            </label>
            <input 
                type="text" 
                placeholder="Enter employee name..." 
                value={localValue}
                onChange={(e) => {
                    setLocalValue(e.target.value);
                    setLoading(true);
                }} 
                className={`w-full text-sm border border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:ring-2 focus:ring-slate-500`}
            />
        </div>
    )
}

const UserAction = memo(({user, onEdit, onReset, onDelete, onAuditTrail}) => {
    return (
        <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" size="icon">
                        <EllipsisVertical/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-fit hover:cursor-pointer">
                    <DropdownMenuItem onSelect={() => {
                        onEdit(user);
                    }}>
                        <Pencil className="w-4 h-4" data-icon="inline-start"/>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => {
                        onReset(user);
                    }}>
                        <Key className="w-4 h-4" data-icon="inline-start"/>
                        Reset Password
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => {
                        onAuditTrail(user);
                    }}>
                        <ClipboardCopy className="w-4 h-4" data-icon="inline-start"/>
                        View Audit Trail
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem variant="destructive" onSelect={() => {
                        onDelete(user);
                    }}>
                        <Trash className="w-4 h-4" data-icon="inline-start"/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
        </DropdownMenu>
    )
}, (prevProps, nextProps) => prevProps.user.id === nextProps.user.id)

