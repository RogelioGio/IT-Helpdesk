import { useFormik } from "formik";

const ResolveTicketForm = ({formik}) => {
    const formSections = [
        {
            formikAccessor: "findings",
            label: "Findings",
            required: true,
        },
        {
            formikAccessor: "resolution",
            label: "Resolution",
            required: true,
        }
    ]
    
    return (
        <form onSubmit={formik.handleSubmit} className="space-y-2 p-4 -mx-4 max-h-[80vh] overflow-auto no-scrollbar" >
            {
                formSections.map((section, index) => {
                    const value = formik.values[section.formikAccessor] || "";

                    return (
                        <div key={index} className="w-full font-google flex flex-col gap-1">
                        <div className="flex justify-between">
                                <label htmlFor={section.formikAccessor} className="font-medium text-sm">{section.label}</label>
                                {
                                    section.required && <p className="text-xs">Required</p>
                                }
                            </div>
                            <div className="relative">
                                <textarea
                                    id={section.formikAccessor}
                                    name={section.formikAccessor}
                                    value={formik.values[section.formikAccessor] || ""}
                                    onChange={formik.handleChange}
                                    className="border border-gray-300 rounded-md p-4 w-full h-32 resize-none text-xs"
                                    placeholder={section.placeholder || ""}
                                    maxLength={255}
                                />
                                <span className="absolute bottom-4 right-4 text-xs text-gray-500">{value.length}/255</span>
                            </div>
                        </div>
                    )
                })
            }
        </form>
    )
}

export default ResolveTicketForm;