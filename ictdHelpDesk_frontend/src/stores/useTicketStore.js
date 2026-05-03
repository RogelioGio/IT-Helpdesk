import axiosClient from "@/AxiosClient";
import { create } from "zustand";


export const useTicketStore = create((set, get) => ({
    tickets: [],
    ticket: {},
    loading: false,
    pageCount: 0,
    remarks: [],

    userSidebarParams: {
        status_id: "recent"
    },

    officerSidebarParams: {
        status_id: "active"
    },

    params: {
        activity_id: "all",
        activitySpecification_id: "all",
        priority_id: "all",
        status_id: "all",
        search: ""
    },

    pagination: {
        pageIndex: 0,
        pageSize: 10,
    },

    setLoading: (bool) => set({ loading: bool }),

    setParams: (newParams) => {
        set((state) => ({
            params: {
                ...state.params,
                ...newParams
            },
            pagination: {...state.pagination, pageIndex: 0}
        }))
        get().fetchTickets()
    },

    setPagination: (updater) => {
        const nextPagination = typeof updater === 'function' 
            ? updater(get().pagination) 
            : updater;

        set({ pagination: nextPagination });
        get().fetchTickets();
    },


    fetchTickets: () => {
        const {params, pagination} = get();
        set({ loading: true });

        axiosClient.get('api/tickets', {
            params: {
                ...params,
                page: pagination.pageIndex + 1,
                per_page: pagination.pageSize,
            }
        }).then(({ data }) => {
            const isLastPage =  Array.isArray(data.meta.last_page) ?  data.meta.last_page[0] : data.meta.last_page;

            set({ 
                tickets: data.data,
                pageCount: isLastPage
            });

        }).catch((error) => {
            console.error("Error fetching tickets:", error);
        }).finally(() => {
            set({ loading: false });
        });
    },

    addTicket: (ticket) => {
        const {pagination, tickets} = get();
        if (pagination.pageIndex === 0) {
            set({
                tickets: [ticket, ...tickets].slice(0, pagination.pageSize) 
            });
        }
    },

    updateTicket: (updatedTicket) => {
        set((state) => ({
            tickets: state.tickets.map((t) => 
                t.id === updatedTicket.id ? updatedTicket : t
            )
        }));
    },

    setTicket: (newticket) => {
        set({ ticket: {...newticket} });
        set({ remarks: newticket.remarks });
    },

    addNewRemark: (remark) => {
        set((state) => ({
            remarks: [...state.remarks, remark]
        }));
    },

    setRemarks: (remarks) => {
        set({ remarks: remarks });
    },

    setOfficerSidebarParams: (newParams) => {
        set((state) => ({
            officerSidebarParams: {
                ...state.officerSidebarParams,
                ...newParams
            }
        }));
    },

    fetchOfficerTickets: () => {
        const {officerSidebarParams} = get();
        set({ loading: true });

        axiosClient.get('api/officer/tickets', {
            params: {
                ...officerSidebarParams,
            }
        }).then(({ data }) => {
            set({ 
                tickets: data.data,
            });
        }).catch((error) => {
            console.error("Error fetching officer sidebar tickets:", error);
        }).finally(() => {
            set({ loading: false });
        });
    },

    setUserSidebarParams: (newParams) => {
        set((state) => ({
            userSidebarParams: {
                ...state.userSidebarParams,
                ...newParams
            }
        }));
    },

    fetchUserTickets: () => {
        const {userSidebarParams} = get();
        set({ loading: true });
        if (userSidebarParams.status_id === "recent") {
            axiosClient.get('/api/tickets/recent/view')
                .then(({data}) => {
                    set({ tickets: data.data });
                })
                .catch(error => {
                        console.error("Failed to fetch recent tickets:", error);
                }).finally(() => {                
                    set({ loading: false });
                });
        } else {
            axiosClient.get('/api/user/tickets', { 
                params: {
                    ...userSidebarParams
                }
             })
                .then(({data}) => {
                    set({ tickets: data.data });
                })
                .catch(error => {
                    console.error("Failed to fetch tickets:", error);
                }).finally(() => {
                    set({ loading: false });
                });
        }
    },
    
    addRecentTicket: (ticket) => {
        set((state) => ({
            tickets: [
                ticket, 
                ...state.tickets.filter(t => t.id !== ticket.id)
            ].slice(0, 5)
        }));
    }



}));