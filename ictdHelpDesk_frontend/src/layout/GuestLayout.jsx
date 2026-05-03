import axiosClient from "@/AxiosClient";
import { useAuth } from "@/contexts/AuthProvider";
import axios from "axios";
import { use, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function GuestLayout(){
    const nav = useNavigate();
    const { user } = useAuth();

    if(user) {
        if (user.account_role_id === 5) {
            return <Navigate to="app/create" replace />;
        } else if (user.account_role_id === 4) {
            return <Navigate to="/officer/active" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return(
        <Outlet/>
    )
}