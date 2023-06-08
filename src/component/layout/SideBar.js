import Drawer from "@mui/material/Drawer";
import { drawerWidth, DrawerHeader} from "../../composable/layout";
import { Box } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import BrushIcon from "@mui/icons-material/Brush";
import {Link} from "react-router-dom";

import mulalogo from "../../assets/icons/mulalogo.png";
import "../../style/layout.css";
import {useContext} from "react";
import NavContext from "../../context/NavContext";

const SideBar = ({open}) => {
    const {nav, setNav} = useContext(NavContext);

    return(
        <Drawer sx={{width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": {width: drawerWidth, boxSizing: "border-box", backgroundColor: "#f7f7f7",},}} variant="persistent" anchor="left" open={open}>
            <DrawerHeader>
                <Box sx={{display: "flex", justifyContent: "center", width: "50px", margin: "auto", mt: 1, mb: 1.5}}>
                    <img src={mulalogo} alt="mula" />
                </Box>
            </DrawerHeader>
            <List className="nav-list">
                    <Link to="/art" onClick={() => setNav("art")} className="nav-link">
                        <ListItem className={`nav-btn ${nav === "art" && "active"}`}><ListItemIcon><BrushIcon className="nav-link-icon"/></ListItemIcon>Art</ListItem>
                    </Link>
            </List>
        </Drawer>
    )
};

export default SideBar;