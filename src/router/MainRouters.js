import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginView from "../view/LoginView";
import NotFoundView from "../view/NotFoundView";
import ArtView from "../view/ArtView";
import ArtSeriesView from "../view/ArtSeriesView";

const MainRouters = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginView/>}/>
                <Route path="/art" element={<ArtView/>}/>
                <Route path="/artseries" element={<ArtSeriesView/>}/>

                <Route path="*" element={<NotFoundView/>}/>
            </Routes>
        </BrowserRouter>
    )
};

export default MainRouters;