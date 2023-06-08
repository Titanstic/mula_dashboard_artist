import {createContext, useState} from "react";

const AlertContext = createContext();

const AlertContextProvider = ({children}) => {
    const [alert, setAlert] = useState("");
    const [alertError, setAlertError] = useState(false);

    // Start Useful Function
    const showAlert = (message, bool) => {
        setAlert(message);
        setAlertError(bool);
        setTimeout(() => {
            setAlert("");
            setAlertError(false);
        }, 3000);
    };
    // End Useful Function

    return (
        <AlertContext.Provider value={{alert, setAlert, alertError, setAlertError, showAlert}}>
            {children}
        </AlertContext.Provider>
    )
}
export default AlertContext;
export {AlertContextProvider};
