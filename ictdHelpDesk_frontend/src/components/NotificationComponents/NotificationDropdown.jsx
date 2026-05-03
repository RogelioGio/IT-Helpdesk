import { Bell, BellOffIcon, CheckCheckIcon, Loader } from "lucide-react";
import NotificationItem from "./NotificationItem";
import { ScrollArea } from "../ui/scroll-area";
import { use, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import axiosClient from "@/AxiosClient";
import { useNotification } from "@/hooks/useNotification";
import { Button } from "../ui/button";
import { useNotificationStore } from "@/stores/useNotificationStore";



const NotificationDropdown = () => {
    const {initialLoading, loading, hasMore, notifications, fetchNotifications, readAllNotifications} = useNotificationStore();

    const observerTarget = useRef(null);
    
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting && hasMore && !loading) {
                fetchNotifications();
            }
        },{threshold: 1.0});

        if(observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget, hasMore, loading]);


    return (
        <>
            <div className={`max-w-150 ${notifications.length !== 0 ? 'h-100' : 'h-fit'} flex flex-col overflow-hidden`}>
                <div className="p-4 border-b shrink-0 flex flex-row items-center justify-between gap-4">
                    <div className="flex flex-row items-center gap-4">
                        <div className="size-12 bg-slate-200/80 text-slate-600 rounded-md flex items-center justify-center flex-row">
                            <Bell className="size-6 text-primary"/>
                        </div>
                        <div>
                            <p className="font-medium text-sm">Notifications</p>
                            <p className="text-xs text-gray-500">List of alerts from the system</p>
                        </div>
                    </div>
                    <div>
                        <Button variant="outline" className="flex flex-row" onClick={() => readAllNotifications()}>
                            <CheckCheckIcon className="size-4 mr-2"/>
                            Mark all as read
                        </Button>
                    </div>
                </div>
                <ScrollArea className="h-full flex-1 min-h-0">
                    <div className="flex flex-col"> 
                        {
                            initialLoading ?
                            <div className="flex flex-row p-4 justify-center items-center gap-4 w-150">
                                <div className="flex flex-row items-center justify-center gap-4">
                                    <Loader className="animate-spin h-4 w-4 text-gray-500 mx-auto"/>
                                    <p className="text-center text-sm text-gray-500">Loading notifications...</p>
                                </div>
                            </div>
                            :
                            notifications.length > 0 ?
                            <>
                                {
                                    notifications.map((notification) => (
                                        <NotificationItem key={notification.id} {...notification}/>
                                    ))
                                }
                                <div ref={observerTarget} className="w-full flex items-center justify-center">
                                    {
                                        hasMore ?
                                        <div className="flex flex-row p-4 justify-center items-center gap-4">
                                            <Loader className="animate-spin h-4 w-4 text-gray-500 mx-auto"/>
                                            <p className="text-center text-sm text-gray-500">Loading more...</p>
                                        </div>
                                        : <div className="flex flex-row p-4 justify-center items-center gap-2">
                                                <div className="bg-slate-200 text-slate-600 rounded-md w-10 h-10 flex items-center justify-center flex-row">
                                                    <BellOffIcon className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <p className="font-bold text-gray-500 text-center text-xs">No more notifications!</p>
                                                    <p className="text-xs text-gray-500 text-center">You're all caught up!</p>
                                                </div>
                                        </div>
                                    }
                                </div>
                            </>
                        : 
                        <div className="flex flex-col items-center justify-center gap-2 p-6">
                            <div className="bg-slate-200 text-slate-600 rounded-md w-10 h-10 flex items-center justify-center flex-row">
                                <BellOffIcon className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-500 w-100 text-center">“No alerts, no worries!”</p>
                                <p className="text-xs text-gray-500 text-center">You're all caught up!</p>
                            </div>
                        </div>}
                    </div>
                </ScrollArea>
            </div>
        </>
    )
}

export default NotificationDropdown;