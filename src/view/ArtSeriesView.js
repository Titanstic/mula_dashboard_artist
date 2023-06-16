import LayoutView from "./LayoutView"
import {useContext, useEffect, useState} from "react";
import NavContext from "../context/NavContext";
import {
    Breadcrumbs, Button,
    Paper
} from "@mui/material";
import {Link} from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Divider from "@mui/material/Divider";
import DirectionsIcon from "@mui/icons-material/Directions";
import InputBase from "@mui/material/InputBase";
import CreateArtSeries from "../component/artSeries/CreateArtSeries";
import ArtSeriesData from "../component/artSeries/ArtSeriesData";
import GqlContext from "../context/GqlContext";
import EditArtSeries from "../component/artSeries/EditArtSeries";

const ArtSeriesView = () => {
    // useConstext
    const { setNav } = useContext(NavContext);
    const { loadArtSeriesArtist, resultArtSeriesArtist } = useContext(GqlContext);
    // useState
    const [ showCreate, setShowCreate ] = useState(false);
    const [ showEdit, setShowEdit ] = useState(false);
    const [ tempData, setTempData ] = useState(null);

    //Start UseEffect
    useEffect(() => {
        setNav("series");
    })
    // End UserEffect


    // Start Function
    const createHandle = () => {
        setShowCreate(!showCreate);
    };

    const editHandle = (data) => {
        console.log(data);
        setShowEdit(!showEdit);
        setTempData(data);
    }
    // End Function

    return(
        <LayoutView>
            <>
                {/*Start Nav*/}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem"}}>
                    <Breadcrumbs aria-label="breadcrumb" fontWeight="bold" fontSize="1.2rem">
                        <Link to="/" className="dashboard">Dashboard</Link>
                        <span style={{ color: "blue"}}>ArtSeries</span>
                    </Breadcrumbs>

                    {/*Start Search*/}
                    <div style={{ display: "flex" }}>
                        <Button variant="contained" sx={{ width: 90, height: 60, p: 1, mr: 2, fontWeight: "bold"}} color="secondary" onClick={createHandle}>Add</Button>

                        <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 350}}>
                            <InputBase id="search-by-artid" sx={{ ml: 1, flex: 1 }} placeholder="Search By Art Id" type="search" />
                            <IconButton type="button" sx={{ p: "10px" }} aria-label="search"><SearchIcon/></IconButton>
                            <Divider sx={{height: 28, m: 0.5 }} orientation="vertical"/>
                            <IconButton sx={{ p: "10px" }} aria-label="directions"><DirectionsIcon/></IconButton>
                        </Paper>
                    </div>
                    {/*End Search*/}
                </div>
                {/*End Nav*/}

                {/* Start Art Series Data */}
                <ArtSeriesData loadArtSeriesArtist={loadArtSeriesArtist} resultArtSeriesArtist={resultArtSeriesArtist} editHandle={editHandle}/>
                {/* End Art Series Data */}

                {
                    showCreate && <CreateArtSeries showCreate={showCreate} createHandle={createHandle} resultArtSeriesArtist={resultArtSeriesArtist}/>
                }

                {
                    showEdit && <EditArtSeries showEdit={showEdit} editHandle={editHandle} resultArtSeriesArtist={resultArtSeriesArtist} tempData={tempData}/>
                }
            </>
        </LayoutView>
    )
};

export default ArtSeriesView;