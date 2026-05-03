import { useAuth } from "@/contexts/AuthProvider"
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/LoginRegistrationImage.jpg";
import { Loader, Wrench } from "lucide-react";
import { useEffect } from "react";

export default function RoleRedirect() {
    const {accountRole} = useAuth();
    const nav = useNavigate();

    useEffect(() => {
        let isMounted = true;
        if(accountRole == "Manager"){
            nav("/ticketmanagement");
        }
        if (accountRole === "Officer") {
            nav("/officer/active");
        } else if (accountRole === "User") {
            nav("/app/create");
        } else if (accountRole === "SystemAdmin" || accountRole === "Admininistrator") {
            nav("/usermanagement");
        }

        return () => {
            isMounted = false;
        }
    },[accountRole])



    return (
        <div className="flex flex-col items-center gap-2 text-center w-full h-screen justify-center">
            {
                accountRole === "Officer" || accountRole === "User" ? 
                <>
                    <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
                        <div className="absolute w-full h-screen flex flex-col justify-center items-center bg-gray-900/70 backdrop-blur-sm p-10"> 
                            <div className="w-fit h-screen flex flex-col gap-5">
                                <div className="flex flex-row gap-3 items-center flex-1">
                                    <Loader className="animate-spin text-white" size={60}/>
                                    <div className="flex flex-col items-start md:gap-2">
                                        <p className="md:text-5xl font-bold font-google text-white">Loading your account</p>
                                        <p className="font-google font-regular text-gray-400 md:text-base text-xs">If this takes too long, please refresh the page.</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-center items-center">
                                    <div className="rounded-md bg-gray-200/10 border border-white p-2 aspect-square flex items-center justify-center">
                                            <Wrench className="h-6 w-6 " color="white"/>
                                    </div>
                                    <div>
                                        <p className="text-xs font-normal font-google text-white">Land Registration Authority</p>
                                        <h1 className="font-google font-bold text-xl text-white">IT Service Desk</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                </>
                :
                <div className="w-fit h-screen flex flex-col gap-5">
                    <div className="flex flex-row gap-3 items-center flex-1">
                        <Loader className="animate-spin" size={60}/>
                        <div className="flex flex-col items-start md:gap-2">
                            <p className="md:text-5xl font-bold font-google">Loading your account</p>
                            <p className="font-google font-regular text-slate-400 md:text-base text-xs">If this takes too long, please refresh the page.</p>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-center items-center">
                        <div className="rounded-md bg-gray-200/10 border border-white p-2 aspect-square flex items-center justify-center">
                                <Wrench className="h-6 w-6 " color="white"/>
                        </div>
                        <div>
                            <p className="text-xs font-normal font-google text-white">Land Registration Authority</p>
                            <h1 className="font-google font-bold text-xl text-white">IT Service Desk</h1>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
    

}