import { useFormik } from "formik"
import TicketForm from "../TicketManagement/TicketForm"
import AddTicketForm from "./AddTicketForm"

const CreateTicket = () => {
    return (
         <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2 overflow-hidden">
                    <div className="flex flex-col h-full py-12">
                        <div className="w-full flex-1 justify-center items-center flex flex-col gap-10">
                            <div className="px-6 w-full flex flex-col justify-center items-center gap-4">
                                <div className="flex flex-col items-center">
                                    <h1 className="text-6xl font-bold">Tech Trouble?</h1>
                                    <h1 className="text-6xl font-bold">We’ve Got Your Back.</h1>
                                </div>
                                <h1 className="text-xs">Submit a Request • Track Progress • Find Answers</h1>
                            </div>
                            <div className="w-full flex flex-col justify-center items-center gap-4">
                                <AddTicketForm/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default CreateTicket
