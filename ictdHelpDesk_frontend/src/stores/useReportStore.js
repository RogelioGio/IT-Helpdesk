import { create } from "zustand";

export const useReportStore = create((set) => ({
    params: {
        period: "All Time",
        startDate: null,
        endDate: null,
    },
    context: {},

    setContext: (newContext) => set((state) => ({
        context: {
            ...newContext,
        }
     })),

    setParams: (newParams) => set((state) => ({
        params: {
            ...state.params,
            ...newParams,
        }
     }))
}));