import axiosClient from "@/AxiosClient";
import { createContext, useContext, useEffect, useState } from "react";

const AddUsersInputContext = createContext({
    officeDepartmentDivisionOptions: [],
    setOfficeDepartmentDivisionOptions: () => {},
});

export const AddUsersInputProvider = ({ children }) => {
    const [officeDepartmentDivisionOptions, _setOfficeDepartmentDivisionOptions] = useState([]);

    const setOfficeDepartmentDivisionOptions = () => {
        axiosClient.get('api/departments')
        .then(({data}) => {
        _setOfficeDepartmentDivisionOptions(data.data);
        })
        .catch((error) => {
        console.error('Error fetching office/department/division options:', error);
        });
    };

    useEffect(() => {
        setOfficeDepartmentDivisionOptions();
    }, []);

    return (
        <AddUsersInputContext.Provider value={{
            officeDepartmentDivisionOptions,
            setOfficeDepartmentDivisionOptions
        }}>
            {children}
        </AddUsersInputContext.Provider>
    );
}

export const useAddUsersInput = () => useContext(AddUsersInputContext); 