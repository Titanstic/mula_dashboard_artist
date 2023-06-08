import * as jose from "jose";

const decodeUserToken = () => {
    let userToken = window.localStorage.getItem("mulaloggeduser");

    if(userToken){
        return JSON.parse(userToken);
    }
};

const checkLoginInput = (data) => {
    let errorExist = false;
    const tempErrors = {};

    if (!data.phone) {
        tempErrors.phone = "Phone Number is required.";
        errorExist = true;
    }
    if (!data.password) {
        tempErrors.password = "Password field is required.";
        errorExist = true;
    }

    return { errorExist, tempErrors };
};

const generateUserToken = (result) => {
    const decodedToken = jose.decodeJwt(result.AdminLogIn.accessToken);
    const data = JSON.stringify({
        token: result.AdminLogIn.accessToken,
        userID: decodedToken.user_id,
    });
    window.localStorage.setItem("mulaloggeduser", data);

    return { decodedToken };
};

const checkUserToken = () => {
    let userToken = window.localStorage.getItem("mulaloggeduser");

    if(userToken){
        let userData = JSON.parse(userToken);
        let rowDecodeToken = jose.decodeJwt(userData.token);
        userData = {...userData, "row": rowDecodeToken["https://hasura.io/jwt/claims"]["x-hasura-default-role"]};
        return userData;
    }
};

export { decodeUserToken, checkLoginInput, generateUserToken, checkUserToken };