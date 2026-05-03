import { useFormik } from "formik"
// import officeDepartmentDivisionOptions from "../../../src/SampleOfficeDepartmentDivision.json"
import accountRolesOptions from "../../../src/SampleAccountRoles.json"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { Users, User, MonitorCog, Wrench } from "lucide-react"
import { useAddUsersInput } from "@/contexts/AddUsersInputContext"
import { memo, useCallback, useEffect, useState } from "react"
import { Form } from "react-router-dom"
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
            label: "Username",
            required: true,
        },
        {
            formikAccessor: "email",
            label: "Email Address",
            required: true,
        },
        {
            formikAccessor: "password",
            label: "Password",
            required: true,
        }
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
            formikAccessor: "accountroles",
            label: "Account Roles",
            required: true,
            formInput: "select"
        }
    ]
};

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
                    <SelectValue placeholder={placeholder || "Select Office/Department/Division"} />
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

const AdduserForm = ({formik, officeDepartmentDivisionOptions}) => {
    // const [officeDepartmentDivisionOptions, setOfficeDepartmentDivisionOptions] = useState([]);
    
    // useEffect(() => {
    //     axiosClient.get("/api/departments")
    //     .then((response) => {
    //         setOfficeDepartmentDivisionOptions(response.data.data);
    //     })
    //     .catch((error) => {
    //         console.error("Error fetching office/department/division options:", error);
    //     });
    // },[])


    const handleSelectChange = useCallback((value) => {
        formik.setFieldValue("office_department_division_id", parseInt(value, 10));
    },[formik.setFieldValue])

    return (
        <>
            <form onSubmit={formik.handleSubmit} className="space-y-2 p-4 -mx-4 max-h-[80vh] overflow-auto no-scrollbar" >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                    <div className="space-y-6">
                        <div className="border border-gray-300 rounded-lg p-4 space-y-4">
                            <div className="flex flex-row justify-between items-center">
                                <p className="text-sm sm:text-lg font-google font-medium">User Information</p>
                            </div>
                            {
                                formSections.UserInformation.map((field, index) => (
                                    <FormInputs key={index} label={field.label} name={field.formikAccessor} value={formik.values[field.formikAccessor]} onChange={formik.handleChange} required={field.required} placeholder={`Enter ${field.label}`} />
                                ))
                            }
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
                                    options={officeDepartmentDivisionOptions} />
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
                                                            onChange={(value) => formik.setFieldValue('account_role_id', parseInt(value.target.value))}/>
                                                    <div className={option.checkedColor + "  border border-gray-300 rounded-md p-4 w-full h-full hover:cursor-pointer flex-1 hover:border-gray-500 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-blue-500"}>
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
        </>
    )
}

export default AdduserForm


