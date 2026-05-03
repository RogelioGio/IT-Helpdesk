import axiosClient from "@/AxiosClient";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, FileHeart, Pencil } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { set } from "date-fns";

const FeedbackForm = ({ ticket, setDone }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [start, setStart] = useState(false);
  const [dimensions, setDimensions] = useState([]);
  const [dimensionReponse, setDimensionReponse] = useState([]);
  const nav = useNavigate();


  const formik = useFormik({
    initialValues: {
      suggestion: "",
      commedation: "",
      complaint: "",
    },
    onSubmit: (values) => {
      const payload = {
        response: dimensionReponse,
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
          error: "Failed to submit feedback. Please try again.",
        },
      );
    },
  });

  const getDimensions = () => {
    setLoading(true);
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

  const handleDimensionResponse = (dimension_id, rating) => {
    const intRating = parseInt(rating);
    const isRated = dimensionReponse.find(
      (response) => response?.dimension_id === dimension_id,
    );

    if (isRated) {
      setDimensionReponse((prev) =>
        prev.map((response) => {
          if (response?.dimension_id === dimension_id) {
            return {
              ...response,
              dimension_value: intRating,
            };
          }
        }),
      );
    } else {
      setDimensionReponse((prev) => [
        ...prev,
        { dimension_id, dimension_value: intRating },
      ]);
    }
  };

  useEffect(() => {
    getDimensions();
  }, []);

  useEffect(() => {
    console.log(dimensionReponse);
  }, [dimensionReponse]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center ">
      {!start ? (
        <>
          <div className="flex flex-col items-center gap-5">
             <p className="text-sm text-slate-800">
              Before Closing your ticket, we would like to ask for your feedback regarding the service you received.
            </p>
            <p className="font-bold text-4xl">
              Help us build the service you actually want to use.
            </p>
            <p className="text-sm text-slate-800">
              Please answer the following question on rating the service
              provided.
            </p>
          </div>
          <div>
            <Button
              size="lg"
              className={"mt-10"}
              onClick={() => {
                setStart(true);
              }}
            >
              <Pencil className="mr-1" />
              Create Feedback
            </Button>
          </div>
        </>
      ) : (
        <FeedbackDimensionQuestion
          key={dimensions[step - 1]?.id}
          dimension={dimensions[step - 1]}
          step={step}
          setStep={setStep}
          currentRating={dimensionReponse}
          setRating={handleDimensionResponse}
          formik={formik}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default FeedbackForm;

const FeedbackDimensionQuestion = ({
  dimension,
  step,
  setStep,
  currentRating,
  setRating,
  formik,
  submitting,
}) => {
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

  const activeValue = currentRating.find(
    (response) => response?.dimension_id === dimension?.id,
  )?.dimension_value;
  const selectedValue = activeValue ? String(activeValue) : null;

  return (
    <div className="flex flex-col gap-4 items-center w-xl">
      {step < 7 ? (
        <>
          <div className="flex gap-2 w-full">
            <div>
              <p className="font-bold text-2xl">
                {dimension.name}{" "}
                <span className="ml-1 text-slate-500/50 font-regular text-sm">
                  {dimension.id}/7
                </span>
              </p>
              <p className="text-sm text-slate-800">{dimension.description}</p>
            </div>
          </div>
          <RadioGroup
            value={selectedValue}
            onValueChange={(val) => setRating(dimension.id, val)}
            className="grid gap-2"
          >
            {ratings.map((rating) => (
              <label
                className={`flex flex-row justify-between w-md h-fit p-4 border border-slate-500/50 rounded-md hover:cursor-pointer hover:bg-slate-200/20 transition-all ease-in-out data-[state=checked]:border-slate-500 ${selectedValue === String(rating.value) ? "border-slate-500 bg-slate-200/50" : "border-slate-500/50"
                  }`}
                htmlFor={rating.value}
                key={rating.value}
              >
                <div>
                  <p className="font-medium">{rating.label}</p>
                  <p className="text-sm text-slate-700">{rating.description}</p>
                </div>
                <RadioGroupItem
                  value={String(rating.value)}
                  id={`${rating.value}`}
                />
              </label>
            ))}
          </RadioGroup>
        </>
      ) : (
        <>
          <div className="flex gap-2 w-full">
            <div>
              <p className="font-bold text-2xl">
                Comments and Suggestionss{" "}
                <span className="ml-1 text-slate-500/50 font-regular text-sm">
                  {step}/7
                </span>
              </p>
              <p className="text-sm text-slate-800">
                Please take some time to fill out the given fields
              </p>
            </div>
          </div>
          {fields.map((field, index) => {
            const value = formik.values[field.formikAccessor] || "";

            return (
              <div
                key={index}
                className="w-full font-google flex flex-col gap-1"
              >
                <div className="flex justify-between">
                  <label
                    htmlFor={field.formikAccessor}
                    className="font-medium text-sm"
                  >
                    {field.label}
                  </label>
                  <p className="text-xs text-slate-800">{field.subText}</p>
                </div>
                <div className="relative">
                  <textarea
                    id={field.formikAccessor}
                    name={field.formikAccessor}
                    value={formik.values[field.formikAccessor] || ""}
                    onChange={formik.handleChange}
                    className="border border-gray-300 rounded-md p-4 w-full h-32 resize-none text-xs"
                    placeholder={field.placeholder || ""}
                    maxLength={255}
                  />
                  <span className="absolute bottom-4 right-4 text-xs text-gray-500">
                    {value.length}/255
                  </span>
                </div>
              </div>
            );
          })}
        </>
      )}
      <div className="flex gap-2 w-full mt-1">
        {step > 1 ? (
          <Button
            className="flex-1"
            size="lg"
            variant="outline"
            onClick={() => setStep(step - 1)}
          >
            <ChevronLeft />
            Back
          </Button>
        ) : null}
        <Button
          className="flex-1"
          size="lg"
          onClick={() => {
            if (step !== 7) {
              setStep(step + 1);
            } else {
              formik.handleSubmit();
            }
          }}
          disabled={(!selectedValue && step !== 7) || submitting}
        >
          {step < 7 ? (
            <>
              Next
              <ChevronRight />
            </>
          ) : (
            <>
              Submit
              <FileHeart />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
