import axiosClient from '@/AxiosClient';
import { set } from 'date-fns';
import { createContext, useContext, useEffect, useState } from 'react';

const AddTicketInputContext = createContext({
    activityOptions: '',
    activitySpecificationOptions: '',
    setActivityOptions: () => {},
    setActivitySpecificationOptions: () => {}
})

export const AddTicketInputProvider = ({ children }) => {
    const [activityOptions, _setActivityOptions] = useState([]);
    const [activitySpecificationOptions, _setActivitySpecificationOptions] = useState([]);

    const setActivityOptions = () => {
        const options = ['Hardware Issue', 'Software Issue', 'Network Issue'];
        _setActivityOptions(options);
    }
    const setActivitySpecificationOptions = (newActivitySpecificationOptions) => {
        _setActivitySpecificationOptions(newActivitySpecificationOptions);
    }
    useEffect(() => {
        setActivityOptions();
    }, []);
    return (
        <AddTicketInputContext.Provider value={{
            activityOptions,
            activitySpecificationOptions,
            setActivityOptions,
            setActivitySpecificationOptions
        }}>
            {children}
        </AddTicketInputContext.Provider>
    )
}

export const useAddTicketInput = () => useContext(AddTicketInputContext);