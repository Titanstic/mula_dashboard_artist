import LayoutView from "./LayoutView";
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
import ArtData from "../component/art/ArtData";
import CreateArt from "../component/art/CreateArt";
import {useLazyQuery} from "@apollo/client";
import {GET_TRADITIONAL_ARTWORK_BY_ARITSTID} from "../gql/art";
import ShowOrNotArt from "../component/art/ShowOrNotArt";
import EditArt from "../component/art/EditArt";
import {GET_ART_SERIES_BY_ARTIST, GET_ARTWORK_DIMENSION, GET_ARTWORK_MEDIUM_TYPE} from "../gql/art";
import DetailArt from "../component/art/DetailArt";
import AuthContext from "../context/AuthContext";


const ArtView = () => {
    // useContext
    const { artistId } = useContext(AuthContext);
    const { setNav } = useContext(NavContext);
    // useState 
    const [ searchName, setSearchName ] = useState("");
    const [ searchBtn, setSearchBtn ] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDisable, setShowDisable] = useState(false);
    const [tempArtData, setTempArtData] = useState(null);
    const [dimension, setDimension] = useState(null);
    const [ artSeries, setArtSeries ] = useState(null);
    const [artType, setArtType] = useState(null);
    // useLazyQuery
    const [ loadArtSeries, resultArtSeries ] = useLazyQuery(GET_ART_SERIES_BY_ARTIST);
    const [ loadTraditionalArt, resultTraditionalArt ] = useLazyQuery(GET_TRADITIONAL_ARTWORK_BY_ARITSTID);
    const [ loadArtType, resultArtType ] = useLazyQuery(GET_ARTWORK_MEDIUM_TYPE);
    const [ loadDimension, resultDimension ] = useLazyQuery(GET_ARTWORK_DIMENSION);
    
    // Start UseEffect
    useEffect(() => {
        setNav("art");
    })

    // For Art Type
    useEffect(() => {
        loadArtType();
    }, [loadArtType])

    useEffect(() => {
        if(resultArtType.data){
            setArtType(resultArtType.data.artwork_medium_type);
        }
    }, [resultArtType])

    // For Art Series
    useEffect(() => {
        loadArtSeries({ variables: { fk_artist_id: artistId }})
    }, [loadArtSeries, artistId])

    useEffect(() => {
        if(resultArtSeries.data){
            setArtSeries(resultArtSeries.data.art_series);
        }
    }, [resultArtSeries])

    // For Art Dimension
    useEffect(() => {
        loadDimension();
    }, [loadDimension])

    useEffect(() => {
        if(resultDimension.data){
            setDimension(resultDimension.data.artwork_dimensions);
        }
    }, [resultDimension])
    // End UseEffect

    // Start Function
    // => For Create Handle
    const createHandle = () => {
        setShowCreate(!showCreate);
    };

    const detailHandle = (data) => {
        setShowDetail(!showDetail);
        setTempArtData(data);
    };

    const editHandle = (data) => {
        setShowEdit(!showEdit);
        setTempArtData(data);
    }

    const disableHandle = (data) => {
        setShowDisable(!showDisable);
        setTempArtData(data);
    };

    const searchHandle = (e) => {
        if(e.target.value === ""){
            setSearchBtn(!searchBtn);
        }
        setSearchName(e.target.value);
    };

    const searchDataHandle = () => {
        if(searchName !== ""){
            setSearchBtn(!searchBtn);
        }
    }
    // End Function

    return (
        <LayoutView>
            <>
                {/*Start Nav*/}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem"}}>
                    <Breadcrumbs aria-label="breadcrumb" fontWeight="bold" fontSize="1.2rem">
                        <Link to="/" className="dashboard">Dashboard</Link>
                        <span style={{ color: "blue"}}>Art</span>
                    </Breadcrumbs>

                    {/*Start Search*/}
                    <div style={{ display: "flex" }}>
                        <Button variant="contained" sx={{ width: 90, height: 60, p: 1, mr: 2, fontWeight: "bold"}} color="secondary" onClick={createHandle}>Add</Button>

                        <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 350}}>
                            <InputBase id="search-by-artid" sx={{ ml: 1, flex: 1 }} onChange={searchHandle} placeholder="Search By Art Name" type="search" />
                            <IconButton type="button" sx={{ p: "10px" }} aria-label="search" onClick={searchDataHandle}><SearchIcon/></IconButton>
                            <Divider sx={{height: 28, m: 0.5 }} orientation="vertical"/>
                            <IconButton sx={{ p: "10px" }} aria-label="directions"><DirectionsIcon/></IconButton>
                        </Paper>
                    </div>
                    {/*End Search*/}
                </div>
                {/*End Nav*/}

                {/*Start Art Data*/}
                <ArtData detailHandle={detailHandle} editHandle={editHandle} disableHandle={disableHandle} loadTraditionalArt={loadTraditionalArt} resultTraditionalArt={resultTraditionalArt} searchName={searchName} searchBtn={searchBtn}/>
                {/*End Art Data*/}

                {
                    showCreate && <CreateArt showCreate={showCreate} createHandle={createHandle} resultTraditionalArt={resultTraditionalArt} dimension={dimension} artSeries={artSeries} artType={artType}/>
                }

                {
                    showDetail && <DetailArt detailHandle={detailHandle} showDetail={showDetail} tempArtData={tempArtData}/>
                }

                {
                    showEdit && <EditArt resultTraditionalArt={resultTraditionalArt} editHandle={editHandle} showEdit={showEdit} tempArtData={tempArtData} dimension={dimension} artSeries={artSeries} artType={artType}/>
                }

                {
                    showDisable && <ShowOrNotArt resultTraditionalArt={resultTraditionalArt} disableHandle={disableHandle} showDisable={showDisable} tempArtData={tempArtData} />
                }

            </>
        </LayoutView>
    )
};

export default ArtView;