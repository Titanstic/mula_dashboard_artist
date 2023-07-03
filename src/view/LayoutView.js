import {Box, Typography} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "../component/layout/Header";
import {useState, Suspense, useContext, useEffect} from "react";
import SideBar from "../component/layout/SideBar";
import {Main, DrawerHeader} from "../composable/layout";
import AuthContext from "../context/AuthContext";
import {decodeUserToken} from "../composable/login";
import {useLazyQuery} from "@apollo/client";
import {GET_ARTIST_DATA} from "../gql/art";
import NavContext from "../context/NavContext";
import AlertContext from "../context/AlertContext";
import { useNavigate } from "react-router-dom";
import ShowAlert from "../component/alert/ShowAlert";
import loadingImage from "../assets/image/loading.gif";


const LayoutView = ({children}) => {
    // useContext
    const { setUserId, setArtistId } = useContext(AuthContext);
    const { setNav } = useContext(NavContext);
    const { alert, showAlert } = useContext(AlertContext);
    // useNavigate
    const navigate = useNavigate();
    // UseState
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    // useLazyQuery
    const [ loadArtist, resultArtist ] = useLazyQuery(GET_ARTIST_DATA);

    // Start UseEffect
    useEffect(() => {
        setLoading(true);
        const userToken = decodeUserToken();

        if(userToken){
            setUserId(userToken.userID);
            loadArtist({variables: { fk_user_id: userToken.userID}})
        }else{
            window.localStorage.removeItem("mulaloggeduser");
            showAlert("Please Login First", true);
            navigate("/");
        }
    }, [loadArtist])


    useEffect(() => {
        if(resultArtist.data){
            if(resultArtist.data.artist){
                setArtistId(resultArtist.data.artist[0].id);
            }else{
                window.localStorage.removeItem("mulaloggeduser");
                setNav("");
                setUserId(null);
                setArtistId(null);
                navigate("/");
                showAlert("Session Timeout! Please Login again", false);
            }
            setLoading(false);
        }
    }, [resultArtist])
    // End UseEffect


    // Start Function
    const handleDrawer = () => {
        setOpen(!open);
    };

    // End Function

    return(
        <>
            {
                loading ?
                    <Box role="presentation" sx={{height: "97vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <img src={loadingImage} width="50px"/>
                        <Typography fontWeight="bold" variant="h4" sx={{ ml: 2 }}>Loading ...</Typography>
                    </Box>
                    :
                    <Box sx={{display: "flex", background: "#F7F7F7", minHeight: "100vh"}}>
                        <CssBaseline/>
                        <Header open={open} handleDrawerOpen={handleDrawer}/>
                        <SideBar open={open}/>
                        <Main open={open}>
                            <DrawerHeader />
                            <Suspense fallback={<div>Loading...</div>}>
                                {children}
                            </Suspense>
                        </Main>
                    </Box>
            }

            {
                alert && <ShowAlert/>
            }
        </>
    )
};

export default LayoutView;