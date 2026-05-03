import axiosClient from "@/AxiosClient";
import { createContext, use, useContext, useEffect, useState } from "react";
import bgImage from "../assets/LoginRegistrationImage.jpg";
import { Loader, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";
import { toast } from "sonner";
const AuthContext = createContext({
    authState: {
        user: null,
        accountRole: null,
        loading: true,
    },
    setAuthState: () => {},
});

export const AuthContextProvider = ({ children }) => {
    const roleMapping = {
        1: "SystemAdmin",
        2: "Administrator",
        3: "Manager",
        4: "Officer",
        5: "User"
    }

    // const [user, setUser] = useState(null);
    // const [accountRole , setAccountRole] = useState(null);
    // const [loading, setLoading] = useState(true);

    const [authState, setAuthState] = useState({
        user: null,
        accountRole: null,
        loading: true,
    });

    useEffect(() => {
        const controller = new AbortController();
        
        axiosClient.get('/api/user', { signal: controller.signal })
        .then(({ data }) => {
            setAuthState({
                    user: data,
                    accountRole: roleMapping[data.account_role_id] || "User",
                    loading: false,
                });
        })
        .catch(error => {
            if (error.name === 'CanceledError' || error.message === 'canceled') return;
            setAuthState({ user: null, accountRole: null, loading: false });
        })
        return () => {
            controller.abort();
        }
    }, [])
    
    if(authState.loading)
    {
        return (
            <div className="flex flex-col items-center gap-2 text-center w-full h-screen justify-center">
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
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{
            setAuthState,
            ...authState,
        }}>
            {children}
        </AuthContext.Provider>


    )
};
 

export const useAuth = () => useContext(AuthContext);