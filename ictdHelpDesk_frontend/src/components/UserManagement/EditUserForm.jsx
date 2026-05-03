
import accountRolesOptions from "../../../src/SampleAccountRoles.json"
import { useFormik } from "formik"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { Users, User, MonitorCog, Wrench } from "lucide-react"
import { memo, useCallback, useEffect, useState } from "react"
import { useAddUsersInput } from "@/contexts/AddUsersInputContext"
import axiosClient from "@/AxiosClient"


const formSections = {
        "UserInformation": [
            {
                formikAccessor: "employeeID",
                label: "Employee ID",
                required: true,
            },
            {
                formikAccessor: "firstName",
                label: "First Name",
                required: true,
            },
            {
                formikAccessor: "middleName",
                label: "Middle Name",
                required: false,
            },
            {
                formikAccessor: "lastName",
                label: "Last Name",
                required: true,
            },
        ],
        accountCredentials: [
            {
                formikAccessor: "username",
                label: "LRA ONE Username",
                required: true,
            },
            {
                formikAccessor: "email",
                label: "LRA ONE Email Address",
                required: true,
            },
        ],
        accountdesignations: [
            {
                
                formikAccessor: "designation",
                label: "Designation",
                required: true,
            },
            {
                formikAccessor: "office_department_division_id",
                label: "Office/Department/Division",
                required: true,
                formInput: "select"
            },
            {
                formikAccessor: "account_role_id",
                label: "Account Roles",
                required: true,
                formInput: "select"
            }
        ]
    }

const FormInputs = memo(({label, name, value, onChange, placeholder, required}) => {
    return (
        <div className="w-full font-google flex flex-col gap-1">
            <div className="flex justify-between">
                <label htmlFor={name} className="font-medium text-sm">{label}</label>
                {
                    required && <p className="text-xs">Required</p>
                }

            </div>
            <div>
                <input
                    type="text"
                    id={name}
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    placeholder={placeholder || ""}
                />
            </div>
        </div>
    )
})
FormInputs.displayName = "FormInputs";

const SelectInput = memo(({label, name, value, onChange, placeholder, required, options, loading}) => {
    return (
        <div className="w-full font-google flex flex-col gap-1">
            <div className="flex justify-between">
                <label htmlFor={name} className="font-medium text-sm">{label}</label>
                {
                    required && <p className="text-xs">Required</p>
                }
            </div>
            <Select value={value} onValueChange={onChange} disabled={loading}>
                <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-5 text-base">
                    <SelectValue placeholder={loading ? "Loading..." : placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {
                        options?.map((option, index) => (
                            <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                        ))
                    }
                </SelectContent>
            </Select> 
        </div>
    )
})
SelectInput.displayName = "SelectInput";


const EditUserForm = ({ formik, office_department_division }) => {
    const [officeDepartmentDivisionOptions, setOfficeDepartmentDivisionOptions] = useState(office_department_division);
    const [loading, setLoading] = useState(false);
    
    // useEffect(() => {
    //     setLoading(true);
    //     axiosClient.get("/api/departments")
    //     .then((response) => {
    //         setOfficeDepartmentDivisionOptions(response.data.data);
    //         setLoading(false);
    //     })
    //     .catch((error) => {
    //         console.error("Error fetching office/department/division options:", error);
    //         setLoading(false);
    //     });
    // },[])
    
    const handleSelectChange = useCallback((value) => {
            formik.setFieldValue("office_department_division_id", parseInt(value, 10));
        },[formik.setFieldValue])
   
    return(
        <form onSubmit={formik.handleSubmit} className="space-y-2 p-4 -mx-4 max-h-[80vh] overflow-auto no-scrollbar" >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <div className="space-y-6">
                        <div className="border border-gray-300 rounded-lg p-4 space-y-4">
                            <div className="flex flex-row justify-between items-center">
                                <p className="text-sm sm:text-lg font-google font-medium">User Information</p>
                            </div>
                            
                            <div className="flex flex-col space-y-4">
                                {
                                    formSections.UserInformation.map((field, index) => (
                                        <FormInputs key={index} label={field.label} name={field.formikAccessor} value={formik.values[field.formikAccessor]} onChange={formik.handleChange} required={field.required} placeholder={`Enter ${field.label}`} />
                                    ))
                                }
                            </div>
                        </div>
                        <div className="border border-gray-300 rounded-lg p-4 space-y-4">
                            <div className="flex flex-row justify-between items-center">
                                <p className="text-sm sm:text-lg font-google font-medium">Account Credentials</p>
                            </div>
                            <div className="flex flex-col space-y-4">
                                {
                                    formSections.accountCredentials.map((field, index) => (
                                        <FormInputs key={index} label={field.label} name={field.formikAccessor} value={formik.values[field.formikAccessor]} onChange={formik.handleChange} required={field.required} placeholder={`Enter ${field.label}`} />
                                    ))
                                }
                            </div>
                        </div>
                </div>
                <div className="space-y-6">
                        <div className="border border-gray-300 rounded-lg p-4 space-y-4 row-span-2">
                            <div className="flex flex-row justify-between items-center">
                                <p className="text-sm sm:text-lg font-google font-medium">Account Designation</p>
                            </div>
                            <div className="flex flex-col space-y-4">
                                <SelectInput 
                                    label="Office/Department/Division" 
                                    name="office_department_division_id" 
                                    value={formik.values.office_department_division_id} 
                                    onChange={handleSelectChange} 
                                    placeholder="Select Office/Department/Division" 
                                    required={true} 
                                    options={officeDepartmentDivisionOptions} 
                                    loading={loading} />
                                <FormInputs label="Designation" name="designation" value={formik.values.designation} onChange={formik.handleChange} required={true} placeholder="Enter Designation" />
                                <div className="w-full font-google flex flex-col gap-1">
                                    <div className="flex justify-between">
                                        <label htmlFor="account_role_id" className="font-medium text-sm">Account Role</label>
                                        <p className="text-xs">Required</p>
                                    </div>
                                    <p className="text-xs mb-2 text-gray-500">Select one role or access level of the user</p>
                                    <div className="grid sm:grid-cols-1 grid-cols-1 gap-2 items-stretch">
                                        {
                                            accountRolesOptions.map((option, index) => {
                                                const ICON_MAP = {
                                                        User: User,
                                                        Users: Users,
                                                        Wrench: Wrench,
                                                        MonitorCog: MonitorCog
                                                    }
                                                const Icon = ICON_MAP[option.icon] || User;
                                                return(
                                                    <label key={index} className="flex items-center h-full">
                                                    <input type="radio" 
                                                            id={option.name} 
                                                            name="account_role_id" 
                                                            value={option.id || ""} 
                                                            className="sr-only peer"
                                                            checked={formik.values.account_role_id === option.id}
                                                            onChange={(e) => formik.setFieldValue("account_role_id", parseInt(e.target.value))}/>
                                                    <div className={option.checkedColor + "  border border-gray-300 rounded-md p-4 w-full h-full hover:cursor-pointer flex-1"}>
                                                        <div className="flex flex-row gap-2 items-center justify-center sm:justify-start"> 
                                                            <Icon className="h-5 w-5" size={20}/>
                                                            <p className="font-medium text-lg">{option.name}</p>
                                                        </div>
                                                        <p className="text-gray-700 text-sm">{option.description}</p>
                                                    </div>
                                                </label>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </form>
    )
}

export default EditUserForm
