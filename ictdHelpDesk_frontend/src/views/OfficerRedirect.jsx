import axiosClient from "@/AxiosClient";
import { Loader, Wrench } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import bgImage from "../assets/LoginRegistrationImage.jpg"; 
import { useAuth } from "@/contexts/AuthProvider";

export default function OfficerRedirect() {
    const nav = useNavigate();
    const {accountRole} = useAuth();
    const {status} = useParams();

    return (
        <div className="flex flex-col items-center gap-2 text-center w-full justify-center flex-1">
            <div className="flex flex-col justify-between items-center gap-5">
                    <Wrench className="h-16 w-16 text-gray-700"/>
                <div>
                    <p className="text-lg font-medium">Select a Ticket to View Details</p>
                    <p className="text-sm text-slate-500">Review ticket information by selecting an item from the sidebar.</p>
                </div>
            </div>
        </div>
    )
}