import { createContext, useContext, useState } from "react";

const NavigationContext = createContext({
    activeTab: null,
    setActiveTab: () => {}
});

export const NavigationProvider = ({ children }) => {
    const [activeTab, _setActiveTab] = useState(null);

    function setActiveTab(tab) {
        document.title = `LRA | ITSD- ${tab?.title || 'Portal'}`;
        _setActiveTab(tab);
    }

    return (
        <NavigationContext.Provider value={{
            activeTab,
            setActiveTab
        }}>
            {children}
        </NavigationContext.Provider>
    )
}

export const useNavigation = () => useContext(NavigationContext);