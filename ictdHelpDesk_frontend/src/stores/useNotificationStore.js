import axiosClient from "@/AxiosClient";
import { create } from "zustand";

export const useNotificationStore = create((set, get) => ({
    initialLoading: true,
    loading: false,
    hasMore: true,
    unreadCount: 0,
    notifications: [],
    page: 1,

    reset: () => set({
        initialLoading: true,
        loading: false,
        hasMore: true,
        unreadCount: 0,
        notifications: [],
        page: 1,
    }),

    fetchNotifications: () => {
        const { page, notifications, loading, hasMore } = get();
        
        if (loading || (!hasMore && page !== 1)) return;

        set({ loading: true });

        axiosClient.get('api/notifications', {
            params: {
                page: page,
            }
        }).then(({ data }) => {
            set({
                notifications: page === 1 ? data.data : [...notifications, ...data.data],
                hasMore: data.meta.current_page < data.meta.last_page,
                page: data.meta.current_page + 1,
                unreadCount: data.unread_count,
            })
        }).catch((error) => {
            console.error("Error fetching notifications:", error);
        }).finally(() => {            
            set({ 
                initialLoading: false,
                loading: false,
            });
        });
    },

    appendNotifications: (newNotification) => {
        console.log("Appending new notification:", newNotification);
        set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }))
    },

    readAllNotifications: () => {
        axiosClient.post(`api/notifications/read`)
        .then(({ data }) => {
            const updatedItems = data.data;
            set((state) => ({
                notifications: state.notifications.map((item) => {
                    const updatedVersion = updatedItems.find((u) => u.id === item.id);
                    return updatedVersion ? updatedVersion : item;
                }),
                unreadCount: 0,
            }));
        }).catch((error) => {
            console.error("Error marking notifications as read:", error);
        });
    }


}))