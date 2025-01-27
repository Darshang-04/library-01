// src/context/NotificationContext.js
import { createContext, useContext, useState } from "react";

const NotificationContext = createContext(); // Create context

export const NotificationProvider = ({ children }) => {
    const [hasNewRequest, setHasNewRequest] = useState(false);

    return (
        <NotificationContext.Provider value={{ hasNewRequest: hasNewRequest, setHasNewRequest }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};

export default NotificationProvider; // Added default export here
