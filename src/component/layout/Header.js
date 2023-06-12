import {MenuItem, Toolbar} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { Typography } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";

import "../../style/layout.css";
import {AppBar} from "../../composable/layout";
import {useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import AlertContext from "../../context/AlertContext";

const Header = ({open, handleDrawerOpen}) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const { showAlert } = useContext(AlertContext);

    // Start Function
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        window.localStorage.removeItem("mulaloggeduser");
        showAlert("Logout Successfully", false);
        navigate("/");
    };
    // End Function

    return(
        <AppBar position="fixed" open={open}>
            <Toolbar className="AppBar">
                <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
                    {open ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
                <Typography variant="h5" sx={{ flexGrow: 3 }}>MULA Artist Dashboard</Typography>

                <div>
                    <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu}>
                        <AccountCircle />
                    </IconButton>

                    <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{vertical: "top", horizontal: "right",}} keepMounted transformOrigin={{vertical: "top", horizontal: "right",}} open={Boolean(anchorEl)} onClose={handleClose}>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    )
};

export default Header;