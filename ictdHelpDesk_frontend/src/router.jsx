import { createBrowserRouter, Navigate } from "react-router-dom";
import GuestLayout from "./layout/GuestLayout";
import LoginForm from "./components/LoginForm";
import LoginRegisterPage from "./views/LoginRegisterPage";
import AuthenticatedLayout from "./layout/AuthenticatedLayout";
import Dashboard from "./views/Dashboard";
import TicketManagement from "./views/TicketManagement";
import SystemReport from "./views/SystemReport";
import { SystemConfiguration } from "./views/SystemConfiguration";
import UserManagement from "./views/UserManagement";
import TicketDetailsPage from "./views/TicketDetailsPage";
import OfficerRedirect from "./views/OfficerRedirect";
import CreateFeedback from "./views/CreateFeedback";
import { OfficerLayout } from "./views/UserReviewTicket";
import WorkloadMonitoring from "./views/WorkloadMonitoring";
import UserTicket from "./views/UserTicket";
import UserRedirect from "./views/UserRedirect";
import CreateTicket from "./components/UserDashboard/CreateTicket";
import RoleRedirect from "./views/RoleRedirectUI";
import Reports from "./views/Reports";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthenticatedLayout/>,
        children: [
            {
                path: "/",
                element: <RoleRedirect/>
            },
            {
                path: "/dashboard",
                element: <Dashboard/>
            },
            {
                path: "usermanagement",
                element: <UserManagement/>,
            },
            {
                path: "workloadmonitoring",
                element: <WorkloadMonitoring/>,
            },
            {
                path: "ticketmanagement",
                element: <TicketManagement/>,
            },
            {
                path: "tickets",
                element: <OfficerRedirect/>,
            },
            {
                //User Route
                path: "app",
                element: <UserTicket/>,
                children: [
                    {
                        path: ":status", 
                        element: <UserRedirect /> 
                    },
                    {
                        path: "create",
                        element: <CreateTicket />
                    },
                    {
                        path: ":ticketId/details",
                        element: <TicketDetailsPage/>
                    },
                    {
                        path: ":ticketId/details/leave_feedback",
                        element: <CreateFeedback/>
                    },
                ]
            },
            {
                //Officer Route
                path: "officer",
                element: <OfficerLayout/>,
                children: [
                    {
                        path: ":status",
                        element: <OfficerRedirect /> 
                    },
                    {
                        path: ":ticketId/details",
                        element: <TicketDetailsPage/>
                    }
                ]
            },
            {
                path: "ticket/:ticketId/details",
                element: <TicketDetailsPage/>
            },
            {
                path: "ticket/:ticketId/details/leave_feedback",
                element: <CreateFeedback/>
            },
            {
                path: "reports",
                element: <Reports/>
            },
            {
                path: "systemconfiguration",
                element: <SystemConfiguration/>
            }
        ]
    },
    {
        path: "/",
        element: <GuestLayout/>,
        children: [
            {
                path: "/login",
                element: <LoginRegisterPage/>
            }
        ]
    },

])

export default router;