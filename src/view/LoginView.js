import {Box, Container, CssBaseline, FormControl, TextField, Typography} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import mulalogo from "../assets/icons/mulalogo.png";

import "../style/login.css";
import {useContext, useEffect, useState} from "react";
import {LoadingButton} from "@mui/lab";
import {checkLoginInput, checkUserToken, generateUserToken} from "../composable/login";
import {useMutation} from "@apollo/client";
import {ADMIN_LOGIN} from "../gql/login";
import {useNavigate} from "react-router-dom";
import AlertContext from "../context/AlertContext";
import ShowAlert from "../component/alert/ShowAlert";
import NavContext from "../context/NavContext";

const LoginView = () => {
    const [formData, setFormData] = useState({
        showPassword: false
    });
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    // useNavigate
    const navigate = useNavigate();
    // useContext
    const { alert, showAlert } = useContext(AlertContext);
    const { setNav } = useContext(NavContext);

    // Start useEffect
    useEffect(() => {
        const userData = checkUserToken();

        if(userData){
            navigate("/art");
        }
    })
    // End useEffect

    // Start Mutation
    const [adminLogin] = useMutation(ADMIN_LOGIN,{
        onError: (error) => {
            console.log(error);
            showAlert("Something Wrong! Please Try again", true);
        },
        onCompleted: (result) => {
            if(result.AdminLogIn.error){
                showAlert(result.AdminLogIn.message, true);
            }

            if(result.AdminLogIn.accessToken){
                setError({});
                setFormData({});

                generateUserToken(result);

                showAlert("login successfully", false);
                setNav("nav")
                navigate("/art");
            }
            setLoading(false);
        }
    });
    // End Mutation

    // Start Function
    const handleChange = (prop) => (event) => {
        setFormData({ ...formData, [prop]: event.target.value});

        if(error[prop]){
            delete error[prop];
            setError(error);
        }
    };

    // => for password eye icon
    const handleClickShowPassword = () => {
        setFormData({
            ...formData,
            showPassword: !formData.showPassword,
        });
    };

    // => for password eye icon
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = async () => {
        const {errorExist, tempErrors} = checkLoginInput(formData);

        if(errorExist){
            setError(tempErrors);
        }else{
            setLoading(true);
            await adminLogin({variables: formData});
        }
    }
    // End Function

    return(
        <>
            <CssBaseline/>

            <Container maxWidth="sm">
                <Box sx={{height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", color: "#000",}}>
                    <Box>
                        <FormControl sx={{ width: "130px"}}>
                            <img src={mulalogo} alt="mula"/>
                        </FormControl>

                        <Typography variant="h4" fontWeight="bold" component="p" className="typo logo_font">MULA Artist Panel</Typography>
                        <Typography variant="subtitle1" component="p" sx={{ mb: 2 }}>Enter your credentials to continue</Typography>
                    </Box>

                    {/*Start Login Form*/}
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <FormControl style={{ borderRadius: "3px" }} sx={{ m: 2, width: "300px" }}>
                            <TextField id="phone" label="Phone Number" size="large" variant="outlined" onChange={handleChange("phone")} error={error.phone ? true : false} helperText={error.phone}/>
                        </FormControl>


                        <FormControl style={{ borderRadius: "3px" }} sx={{ m: 2, width: "300px", backgroundColor: "#fff" }}>
                            <TextField id="password" size="large" variant="outlined" type={formData.showPassword ? "text" : "password"} onChange={handleChange("password")}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                                {formData.showPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                label="Password" error={error.password ? true : false} helperText={error.password}/>
                        </FormControl>

                        <FormControl sx={{ width: "130px", margin: "auto", mt: 2 }}>
                            <LoadingButton onClick={handleLogin}  loading={loading} size="large" variant="outlined" className="login_btn">Login</LoadingButton>
                        </FormControl>
                    </Box>
                    {/*End Login Form*/}
                </Box>

                {
                    alert && <ShowAlert/>
                }
            </Container>
        </>
    )
};

export default LoginView;