import { create } from "zustand";

export const useUserStore = create((set, get) => ({
    params: {
        office_department_division_id: "",
        account_role_id: "",
        reportScope: "",
        search: ""
    },

    setParams: (newParams) => {
        set((state) => ({
            params: {
                ...state.params,
                ...newParams
            }
        }))
        // console.log("Updated params:", get().params);
    }
}))