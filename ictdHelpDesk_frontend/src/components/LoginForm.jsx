import axiosClient from "@/AxiosClient";
import { useAuth } from "@/contexts/AuthProvider";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from 'yup';

const LoginForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [cokinized, setCokinized] = useState(false);
    const nav = useNavigate();
    const {setAuthState} = useAuth();

    useEffect(() => {
        axiosClient.get('/sanctum/csrf-cookie').
        then(() => {
            setCokinized(true);
        }).catch(() => {
            toast.error('Failed to initialize login. Please refresh the page and try again.');
        });
    },[])

    const formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        validationSchema: Yup.object({
            username: Yup.string()
                // .min(5, "Username must be at least 5 characters")
                .max(50, "Username must be less than 50 characters")
                .required("Username is required"),
            password: Yup.string()
                // .min(5, "Password must be at least 5 characters")
                .max(50, "Password must be less than 50 characters")
                .required("Password is required")
        }),
        onSubmit: async (values) => {
            if (!cokinized) {
                toast.error('Login is not ready yet. Please wait a moment and try again.');
                return;
            } 
            await toast.promise(axiosClient.post('/api/login', values), {
                loading: 'Logging in...',
                success: ({data}) => {
                    const roleMapping = {
                        1: "SystemAdmin",
                        2: "Administrator",
                        3: "Manager",
                        4: "Officer",
                        5: "User"
                    }

                    setAuthState({
                        user: data.user,
                        accountRole: roleMapping[data.user.account_role_id] || null,
                        loading: false,
                    });
                    
                    if (data.user.account_role_id === 5) {
                        nav('/app/create');
                    }else if (data.user.account_role_id === 4) {
                        nav('/officer');
                    } else {
                        nav('/');
                    }
                    return 'Login successful';
                },
                error: (err) => err.response?.data?.message || 'Login failed',
            });
            
        }
    })



    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-3xl font-bold">Login to IT Helpdesk</h1>
                <p className="text-muted-foreground text-lg text-balance">
                    Enter your account detail to login
                </p>
            </div>
            {/* Form Items */}
            <div>
                <div className='flex flex-row justify-between'>
                    <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="username">Username</label>
                </div>
                <div className="flex flex-col gap-1">
                    <input
                        className='border bg-gray-100 text-black border-gray-300 rounded-md p-2 w-full text-sm focus:outline-1 focus:outline-white focus:ring-3 focus:ring-gray-600 focus:border-transparent transition-all duration-200 ease-in-out'
                        id="username"
                        name="username"
                        type="text"
                        placeholder='Account Username'
                        maxLength="50"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.username}
                    />
                    {formik.touched.username && formik.errors.username ? (
                        <p className="text-sm text-red-600">{formik.errors.username}</p>
                    ) : null}
                </div>
            </div>
            <div>
                <div className='flex flex-row justify-between'>
                    <label className='font-text block text-sm font-medium text-gray-700 text-left mb-2' htmlFor="password">Password</label>
                </div>
                <div className="flex flex-col gap-1">
                    <input
                        className='border bg-gray-100 text-black border-gray-300 rounded-md p-2 w-full text-sm focus:outline-1 focus:outline-white focus:ring-3 focus:ring-gray-600 focus:border-transparent transition-all duration-200 ease-in-out'
                        id="password"
                        name="password"
                        type="password"
                        placeholder='Account Password'
                        maxLength="50"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <p className="text-sm text-red-600">{formik.errors.password}</p>
                    ) : null}
                </div>
            </div>
            <button type="submit" className="bg-gray-800 text-white rounded-md py-2 font-medium hover:bg-gray-700 transition-colors duration-200 ease-in-out cursor-pointer">
                Login
            </button>
        </form>
    )
}

export default LoginForm;