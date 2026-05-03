import LoginForm from "../components/LoginForm";
import LoginRegistrationFormPage from "../assets/LoginRegistrationImage.jpg";
import { GalleryVerticalEnd, Wrench } from "lucide-react"

export default function LoginRegisterPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-4 md:justify-start">
                    <div className="rounded-md bg-gray-200 p-2 aspect-square flex items-center justify-center">
                        <Wrench className="h-6 w-6 text-primary"/>
                    </div>
                    <div>
                        <h1 className="font-google font-bold text-xl">Information Technology Helpdesk</h1>
                        <p className="text-xs font-google">Information Technology Ticketing System</p>
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <LoginForm/>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block h-screen">
                <img src={LoginRegistrationFormPage} alt="Login Registration Form" className="w-full h-full object-cover object-left"/>
            </div>
        </div>
    )   
}