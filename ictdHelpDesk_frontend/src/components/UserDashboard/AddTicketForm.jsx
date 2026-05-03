import { useFormik } from "formik";
import { Fragment, memo, use, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "../ui/button";
import axiosClient from "@/AxiosClient";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

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
            placeholder: "Model Number/Serial Number/Property Number",
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


const AddTicketForm = () => {
    const {user} = useAuth();
    const nav = useNavigate();
    const [options, setOptions] = useState({})
    const [submitting, setSubmitting] = useState(false);

    useEffect(()=>{
        function fetchActivityOptions() {
            axiosClient.get('api/activities').then(({data}) => {
                setOptions((prev) => ({...prev, "activity" : data.data}))
            }).catch((error) => {});
        }
        function fetchActivitySpecificationOptions() {
            axiosClient.get('api/activitiesSpecifications').then(({data}) => {
                setOptions((prev) => ({...prev, "activitySpecification" : data.data}))
            }).catch((error) => {});
        }

        fetchActivityOptions();
        fetchActivitySpecificationOptions();
    },[])

    const formik = useFormik({
        initialValues: {
            'activity_id': '',
            'activitySpecification_id': '',
            'assetSerialNumber': '',
            'description': '',
            'status_id': '1',
            'requester_id': user?.id,
        },
        validationSchema: new Yup.object({
            activity_id: Yup.string().required('Activity is required'),
            activitySpecification_id: Yup.string().required('Activity Specification is required'),
            assetSerialNumber: Yup.string().required('Asset Serial Number is required'),
            description: Yup.string().required('Description is required'),
        }),
        onSubmit: (values) => {
            submitting ? null : setSubmitting(true);
            toast.promise(
                axiosClient.post('/api/tickets', values),
                {
                    loading: 'Creating ticket...',
                    success: (value) => {
                        setSubmitting(false);
                        formik.resetForm();
                        nav(`/app/${value.data.data.ticketId}/details`);
                        return 'Ticket created successfully!';
                    },
                    error: 'Failed to create ticket. Please try again.',
                })
        }}
    );

    return (
        <form onSubmit={formik.handleSubmit} className="w-xl flex flex-col gap-6">
            <div className="flex flex-col space-y-4">
                {
                    formSection.ticketinformation.map((field, index) => {
                        const placeholder = {
                            'activity_id': 'e.g. Repair, Maintenance, Installation',
                            'activitySpecification_id': 'e.g. Reformatted hard drive, Replace broken screen, Set up new workstation',
                            'assetSerialNumber': 'Model Number/Serial Number/Property Number',
                        }
                        const noActivitySelected = !formik.values.activity_id;
                        return (
                            <Fragment key={index}>
                                {
                                    field.formikAccessor === "assetSerialNumber" ? 
                                    <FormInputs key={index} 
                                                    label={field.label} name={field.formikAccessor} 
                                                    onChange={formik.handleChange} 
                                                    placeholder={placeholder[field.formikAccessor]} 
                                                    required={field.required} 
                                                    value={formik.values[field.formikAccessor]} 
                                                    formik={formik}
                                                    />
                                    :
                                    <SelectInput key={index}
                                        label={field.label}
                                        name={field.formikAccessor}
                                        value={formik.values[field.formikAccessor]}
                                        onChange={(value) => {
                                            formik.setFieldValue(field.formikAccessor, value)
                                            
                                            if (field.formikAccessor === 'activity_id') {
                                                formik.setFieldValue('activitySpecification_id', '');
                                            }
                                        }}
                                        placeholder={placeholder[field.formikAccessor]}
                                        required={field.require}
                                        options= {field.formikAccessor === 'activity_id' ? options.activity : field.formikAccessor === 'activitySpecification_id' ? options.activitySpecification?.filter(opt => opt.related_activity.id == formik.values.activity_id) : []}
                                        loading={field.loading}
                                        disabled={field.formikAccessor === 'activitySpecification_id' && noActivitySelected}
                                        formik={formik}
                                    />
                                }
                            </Fragment>
                        )
                    })
                }
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
                                        <textarea
                                            id={field.formikAccessor}
                                            name={field.formikAccessor}
                                            value={formik.values[field.formikAccessor]}
                                            onChange={formik.handleChange}
                                            className="border border-gray-300 rounded-md px-3 py-2 w-full h-35 resize-none"
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
            <div>
                <Button type="submit" variant="default" size="lg" className="w-full font-medium">Submit Ticket</Button>
            </div>
        </form>
    )
}

export default AddTicketForm;