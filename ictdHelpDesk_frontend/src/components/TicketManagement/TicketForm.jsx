import axiosClient from "@/AxiosClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Fragment, memo, use, useEffect, useState } from "react";

    const SelectInput = memo(({label, name, value, onChange, placeholder, required, options, loading, disabled, formik}) => {
        return (
        <div className="w-full font-google flex flex-col gap-1">
            <div className="flex justify-between">
                <label htmlFor={name} className="font-medium text-sm">{label}</label>
                {
                    required && <p className="text-xs">Required</p>
                }
            </div>
            <Select value={value} onValueChange={onChange} disabled={loading || disabled}>
                <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-5 text-base">
                    <SelectValue placeholder={placeholder || "Select Office/Department/Division"} />
                </SelectTrigger>
                <SelectContent>
                    {
                        options?.map((option) => (
                            <SelectItem key={option.id} value={option.id.toString()}>{option.name}</SelectItem>
                        ))
                    }
                </SelectContent>
            </Select> 
            {
                formik && formik.touched[name] && formik.errors[name] && (
                    <p className="text-xs text-red-500 mt-1">{formik.errors[name]}</p>
                )
            }
        </div>
        )
    })

    const FormInputs = memo(({label, name, value, onChange, placeholder, required, formik}) => {
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

            {
                formik && formik.touched[name] && formik.errors[name] && (
                    <p className="text-xs text-red-500 mt-1">{formik.errors[name]}</p>
                )
            }
        </div>
        )
    })
    FormInputs.displayName = "FormInputs";





const TicketForm = ({formik, activityOptions, activitySpecificationOptions}) => {
    // const [activityOptions, setActivityOptions] = useState([]);
    // const [activitySpecificationOptions, setActivitySpecificationOptions] = useState([]);
    

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-2 p-4 -mx-4 max-h-[80vh] overflow-auto no-scrollbar" >
            <div className="flex flex-col space-y-4">
                <div className="border border-gray-300 rounded-lg p-4 space-y-4">
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-sm sm:text-lg font-google font-medium">Ticket Information</p>
                    </div>

                    <div className="flex flex-col space-y-4">
                        {
                            formSection.ticketinformation.map((field, index) => {
                                const placeholder = {
                                    'activity_id': 'e.g. Repair, Maintenance, Installation',
                                    'activitySpecification_id': 'e.g. Reformatted hard drive, Replace broken screen, Set up new workstation',
                                    'assetSerialNumber': 'e.g. ASSET-12345',
                                }
                                const noActivitySelected = !formik.values.activity_id;
                                return (
                                    <Fragment key={index}>{
                                                field.formikAccessor === 'assetSerialNumber' ? 
                                                <FormInputs key={index} 
                                                    label={field.label} name={field.formikAccessor} 
                                                    onChange={formik.handleChange} 
                                                    placeholder={placeholder[field.formikAccessor]} 
                                                    required={field.required} 
                                                    value={formik.values[field.formikAccessor]} 
                                                    formik={formik}/>
                                                : 
                                                <SelectInput key={index}
                                                    label={field.label} name={field.formikAccessor} 
                                                    onChange={(value) => {
                                                        formik.setFieldValue(field.formikAccessor, value);
                                                        
                                                        if (field.formikAccessor === 'activity_id') {
                                                            formik.setFieldValue('activitySpecification_id', '');
                                                        }
                                                    }} 
                                                    options={field.formikAccessor === 'activity_id' ? activityOptions : field.formikAccessor === 'activitySpecification_id' ? activitySpecificationOptions.filter(opt => opt.related_activity.id == formik.values.activity_id) : []}
                                                    placeholder={placeholder[field.formikAccessor]}
                                                    required={field.required} 
                                                    disabled={field.formikAccessor === 'activitySpecification_id' && noActivitySelected}
                                                    value={formik.values[field.formikAccessor]}
                                                    formik={formik}
                                                    />
                                            }
                                    </Fragment>
                                )
                                
                            })
                        }
                    </div>
                </div>
                <div className="border border-gray-300 rounded-lg p-4 space-y-4">
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-sm sm:text-lg font-google font-medium">Additional Details</p>
                    </div>

                    <div className="flex flex-col space-y-4">
                        {
                            formSection.additionaldetails.map((field, index) => {
                                const placeholder = {
                                    'description': 'e.g. The user is experiencing issues with their laptop not turning on.',
                                }
                                return (
                                        <div  key={index} className="w-full font-google flex flex-col gap-1">
                                                <div className="flex justify-between">
                                                    <label htmlFor={field.formikAccessor} className="font-medium text-sm">{field.label}</label>
                                                    {
                                                        field.required && <p className="text-xs">Required</p>
                                                    }

                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        id={field.formikAccessor}
                                                        name={field.formikAccessor}
                                                        value={formik.values[field.formikAccessor]}
                                                        onChange={formik.handleChange}
                                                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                                                        placeholder={placeholder[field.formikAccessor]}
                                                        maxLength={255}
                                                    />
                                                </div>
                                                {
                                                    formik.touched[field.formikAccessor] && formik.errors[field.formikAccessor] && (
                                                        <p className="text-xs text-red-500 mt-1">{formik.errors[field.formikAccessor]}</p>
                                                    )
                                                }
                                        </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </form>
    )
} 
export default TicketForm;

const formSection = {
    ticketinformation: [
        {
            formikAccessor: "activity_id",
            label: "Ticket Activity",
            require: true,
            placeholder: "e.g. Hardware Issue, Software Issue, Network Issue",
        },
        {
            formikAccessor: "activitySpecification_id",
            label: "Activity Specification",
            require: true,
            placeholder: "e.g. Laptop not turning on, Unable to connect to Wi-Fi",
        },
        {
            formikAccessor: "assetSerialNumber",
            label: "Asset Serial Number",
            require: true,
        },
    ],
    additionaldetails: [
        {
            formikAccessor: "description",
            label: "Description",
            require: false,
        }
    ],
}

