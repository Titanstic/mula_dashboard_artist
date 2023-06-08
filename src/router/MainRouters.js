import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginView from "../view/LoginView";
import NotFoundView from "../view/NotFoundView";

const MainRouters = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginView/>}/>

                <Route path="*" element={<NotFoundView/>}/>
            </Routes>
        </BrowserRouter>
    )
};

export default MainRouters;