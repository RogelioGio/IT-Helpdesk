import axiosClient from "@/AxiosClient";
import FeedbackForm from "@/components/CreateFeedback/FeedbackForm";
import FeedbackHeader from "@/components/CreateFeedback/FeedbackHeader";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthProvider";
import { useFormik } from "formik";
import { Check, CheckCircle2, CheckCircleIcon, CircleDot, FileCheck, Loader, Loader2 } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";

export default function CreateFeedback({}) {
    const {accountRole} = useAuth()
    const {ticketId} = useParams()
    const [ticket, setTicket] = useState({})
    const [closing, setClosing] = useState(true)
    const [done, setDone] = useState(false)
    const [dimensions, setDimensions] = useState([])
    const [dimensionResponses, setDimensionResponses] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const nav = useNavigate();

    const getTicket = (ticketId) => {
        if(ticketId === "null") return
        axiosClient.get(`api/tickets/${ticketId}`)
        .then(({data}) => {
            setTicket(data.data)
        })
        .catch((error) => {
            console.error('Error fetching ticket:', error);
            toast.error("Failed to fetch ticket details. Please try again later.")
        })}

    const handleClose = (id) => {
        setClosing(true)
        toast.promise(axiosClient.patch(`api/tickets/${id}/close`) , {
            loading: "Updating ticket status...",
            success: () => {
                // getTicket(ticketId)
                setClosing(false)
                
                if(accountRole === "User") {
                    nav(`/app/${ticketId}/details`)
                } 
                else {
                    nav(`/ticket/${ticketId}/details`)
                }
                
                return "Ticket closed successfully."
            },
            error: "Failed to update ticket status. Please try again."
        })
    }

    useEffect(() => {
        getTicket(ticketId)
        const getDimensions = () => {
            axiosClient
            .get("api/feedback/dimensions")
            .then(({ data }) => {
                setDimensions(data);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
        };
        getDimensions()
    }, [])

    

    const ratings = [
    {
      label: "Very Satisfied",
      description: "Higit na nasiyahan",
      value: 5,
    },
    {
      label: "Satisfied",
      description: "Nasiyahan",
      value: 4,
    },
    {
      label: "Neutral",
      description: "Nasa gitna",
      value: 3,
    },
    {
      label: "Dissatisfied",
      description: "Hindi nasiyahan",
      value: 2,
    },
    {
      label: "Very Dissatisfied",
      description: "Higit na hindi nasiyahan",
      value: 1,
    },
    ];
    const fields = [
    {
      formikAccessor: "suggestion",
      label: "Suggestions",
      subText:
        "Ibahagi ang iyong mga mungkahi para sa ikabubuti ng aming serbisyo.",
    },
    {
      formikAccessor: "Commendation",
      label: "Commendation",
      subText: "Iparating ang iyong papuri o positibong karanasan sa amin.",
    },
    {
      formikAccessor: "complaint",
      label: "Complaint",
      subText:
        "Ipaalam sa amin ang anumang reklamo o hindi magandang karanasan.",
    },
  ];

   const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
        response: dimensions.map((dimension) => ({
            dimension_id: dimension.id,
            dimension_value: null,
        })),
        suggestion: "",
        commedation: "",
        complaint: "",
        },
        validationSchema: new Yup.object({
            response: Yup.array().of(Yup.object().shape({
                dimension_id: Yup.number().required(),
                dimension_value: Yup.number()
                .max(5, "Rating cannot be more than 5.")
                .min(1, "Rating must be at least 1.")
                .typeError("Please provide a valid rating for this dimension.")
                .required("Please provide a rating for this dimension."),
            }))
        }),
        onSubmit: (values) => {
        const payload = {
            response: dimensionResponses,
            ...values,
        };

        setSubmitting(true);
        toast.promise(
            axiosClient.post(`api/tickets/${ticket.id}/feedback`, payload),
            {
            loading: "Submitting your feedback...",
            success: () => {
                setSubmitting(false);
                setDone(true);
                return "Feedback submitted successfully!";
            },
            error: () => {
                setSubmitting(false);
                return "Failed to submit feedback. Please try again.";
            }
            },
        );
        },
    });

    const handleDimensionResponse = useCallback((dimension_id, rating) => {
        const intRating = parseInt(rating, 10);
        // setDimensionResponses((prevResponses) => {
        //     const isRated = prevResponses.some((r) => r.dimension_id === dimension_id);
        //     if (isRated) {
        //         return prevResponses.map((r) =>
        //             r.dimension_id === dimension_id ? { ...r, dimension_value: intRating } : r
        //         );
        //     }
        //     return [...prevResponses, { dimension_id, dimension_value: intRating }];
        // });

        const index = formik.values.response.findIndex((r) => r.dimension_id === dimension_id);
        console.log(formik.values)
        console.log("Index found:", index, "for dimension_id:", dimension_id);
        if (index !== -1) {
            formik.setFieldValue(`response[${index}].dimension_value`, intRating);
        }
    }, [formik.values.response, formik.setFieldValue, formik.setFieldTouched]);


    if(ticket?.feedback?.id || done){
        return(
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2 overflow-hidden">
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col gap-5 items-center justify-center">
                            <div className="flex items-center justify-center size-24 rounded-md bg-slate-200">
                                <FileCheck className="size-14 text-primary"/>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-3xl">Feedback Submitted</p>
                                <p className="text-xs text-slate-700">Your feedback is succesfully heard, you may close the ticket.</p>
                            </div>
                            <Button onClick={() => handleClose(ticket.id)} className="">
                                <CircleDot className="size-4 mr-2"/>
                                Close Ticket
                            </Button>   
                        </div>
                    </div>
                </div>
            </div>
        )
    } else if(loading) {
        return (
            <div className="flex items-center justify-center h-full gap-3">
                <Loader className="size-12 animate-spin"/>
                <div>
                    <p className="font-bold text-xl">Finalizing your ticket...</p>
                    <p className="text-xs text-slate-500">Please wait while we process your request.</p>
                </div>
            </div>
        )
    }

    return (
    //    <div className="flex flex-1 flex-col">
    //         <div className="@container/main flex flex-1 flex-col gap-2 overflow-hidden">
    //             <div className="flex flex-col pt-4 md:pt-6 flex-1">
    //                 <FeedbackHeader ticket={ticket}/>
    //                 <FeedbackForm ticket={ticket} setDone={setDone}/>
    //             </div>
    //         </div>
    //     </div>
         <div className={`flex flex-col ${accountRole !== "Officer" && accountRole !== "User" ? "h-[calc(100dvh-56px)]" : "h-[calc(100dvh-40px)]"} rounded-md`}>
           <div className="overflow-hidden relative flex-1">
                <div className="h-full min-h-0 rounded-md">
                    <ScrollArea className="flex-1 h-full w-full flex justify-center items-end">
                       <div className="w-full flex flex-col justify-center items-center py-10 ">
                            <div className="w-6xl flex flex-col gap-5 rounded-md">
                                <FeedbackHeader ticket={ticket}/>
                                {/* Feedback Matrix */}
                                <div className="grid grid-cols-6 w-full">
                                    <div>
                                    </div>
                                    {
                                        ratings.map((rating, index) => (
                                            <div className="text-center" key={index}>
                                                <p className="font-medium text-sm">{rating.label}</p>
                                                <p className="text-xs">{rating.description}</p>
                                            </div>
                                        ))
                                    }
                                    {
                                        dimensions.map((dimension, index) => (
                                            <DimensionRow 
                                                key={dimension.id} 
                                                dimension={dimension} 
                                                ratings={ratings} 
                                                onResponse={handleDimensionResponse} 
                                                formik={formik}
                                            />
                                        ))
                                    }
                                </div>
                                {/* Textarea Fields */}
                                <div className="flex flex-col gap-4"> 
                                    {
                                        // fields.map((field, index) => {
                                        //     const value = formik.values[field.formikAccessor] || "";
                                        //     return (
                                        //         <div className="flex flex-col gap-2" key={index}>
                                        //             <div>
                                        //                 <label htmlFor={field.formikAccessor} className="font-bold">{field.label}</label>
                                        //                 <p className="text-xs text-slate-800">{field.subText}</p>
                                        //             </div>
                                        //             <div className="relative">
                                        //             <textarea
                                        //                 id={field.formikAccessor}
                                        //                 name={field.formikAccessor}
                                        //                 value={formik.values[field.formikAccessor] || ""}
                                        //                 onChange={formik.handleChange}
                                        //                 className="border border-gray-300 rounded-md p-4 w-full h-32 resize-none text-xs"
                                        //                 placeholder={field.placeholder || ""}
                                        //                 maxLength={255}
                                        //             />
                                        //             <span className="absolute bottom-4 right-4 text-xs text-gray-500">
                                        //                 {value.length}/255
                                        //             </span>
                                        //             </div>
                                        //         </div>
                                                
                                        //     )
                                        // })
                                        
                                    }
                                    {fields.map((field, index) => (
                                        <FeedbackTextArea 
                                            key={index}
                                            field={field}
                                            value={formik.values[field.formikAccessor] || ""}
                                            onChange={formik.handleChange}
                                        />
                                        ))}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button onClick={() => nav(-1)} variant="outline" disabled={submitting}>
                                        Cancel
                                    </Button>
                                    <Button onClick={formik.handleSubmit}  disabled={submitting} className="bg-primary hover:bg-primary/90 text-white">
                                        {
                                            submitting ? (
                                                <>
                                                    <Loader2 className="size-4 mr-2 animate-spin"/>
                                                    Submitting...
                                                </>
                                            ) : "Submit Feedback"
                                        }
                                    </Button>
                                    
                                </div>
                            </div>
                       </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}

const DimensionRow = memo(({ dimension, ratings, onResponse, formik }) => {
    const index = formik.values.response.findIndex((r) => r.dimension_id === dimension.id);
    const error = formik.errors.response?.[index]?.dimension_value;
    const isTouched = formik.touched.response?.[index]?.dimension_value;

  return (
    <>
      <div className="py-4 border-b">
        <div>
            <p className="font-bold">{dimension.name}</p>
            <p className="text-xs text-slate-700">{dimension.description}</p>
        </div>
        {
            isTouched && error && (
                <p className="text-xs text-red-500 mt-1">
                    {error}
                </p>
            )
        }
      </div>
      <RadioGroup 
        className="place-items-center border-b py-6 col-span-5 grid grid-cols-5" 
        onValueChange={(value) => onResponse(dimension.id, value)}
      >
        {ratings.map((rating) => {
          const uniqueId = `dimension-${dimension.id}-option-${rating.value}`;
          return (
            <div key={uniqueId}>
              <RadioGroupItem value={rating.value} className="peer sr-only" id={uniqueId} />
              <label htmlFor={uniqueId} className="border border-slate-300 rounded-full size-10 items-center justify-center flex bg-transparent peer-data-[state=checked]:bg-primary cursor-pointer group">
                <CheckCircleIcon className="size-6 opacity-0 transition-opacity group-peer-data-[state=checked]:opacity-100 text-white"/>
              </label>
            </div>
          );
        })}
      </RadioGroup>
    </>
  );
});

const FeedbackTextArea = memo(({ field, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <label htmlFor={field.formikAccessor} className="font-bold">{field.label}</label>
        <p className="text-xs text-slate-800">{field.subText}</p>
      </div>
      <div className="relative">
        <textarea
          id={field.formikAccessor}
          name={field.formikAccessor}
          value={value}
          onChange={onChange}
          className="border border-gray-300 rounded-md p-4 w-full h-32 resize-none text-xs focus:ring-2 focus:ring-primary outline-none"
          maxLength={255}
        />
        <span className={`absolute bottom-4 right-4 text-xs ${value.length >= 250 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
          {value.length}/255
        </span>
      </div>
    </div>
  );
});