import {useContext} from "react";
import AlertContext from "../../context/AlertContext";
import { Alert } from "@mui/material";

const ShowAlert = () => {
    const {alert, alertError} = useContext(AlertContext);

    return (
        <Alert sx={{ position: "absolute", bottom: "4em", right: "2em" }} severity={alertError ? "warning" : "success"}>
            {alert}
        </Alert>
    )
};

export default ShowAlert;