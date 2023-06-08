import {Box} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "../component/layout/Header";
import {useState, Suspense, useContext, useEffect} from "react";
import SideBar from "../component/layout/SideBar";
import {Main, DrawerHeader} from "../composable/layout";
import AuthContext from "../context/AuthContext";
import {decodeUserToken} from "../composable/login";
import {useLazyQuery} from "@apollo/client";
import {GET_ARTIST_DATA} from "../gql/art";

const LayoutView = ({children}) => {
    // useContext
    const { setUserId, setArtistId } = useContext(AuthContext);
    // UseState
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    // useLazyQuery
    const [ loadArtist, resultArtist ] = useLazyQuery(GET_ARTIST_DATA);

    // Start UseEffect
    useEffect(() => {
        setLoading(true);
        const userToken = decodeUserToken();
        setUserId(userToken.userID);

        loadArtist({variables: { fk_user_id: userToken.userID}})
    }, [loadArtist])


    useEffect(() => {
        if(resultArtist.data){
            setArtistId(resultArtist.data.artist[0].id);
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
                    <p>Loading...</p>
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
        </>
    )
};

export default LayoutView;