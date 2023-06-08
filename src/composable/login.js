import * as jose from "jose";

const decodeUserToken = () => {
    let userToken = window.localStorage.getItem("mulaloggedartisuser");

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
    console.log(decodedToken);
    // const data = JSON.stringify({
    //     token: result.AdminLogIn.accessToken,
    //     userID: decodedToken.user_id,
    // });
    // window.localStorage.setItem("mulaloggeduser", data);

    return { decodedToken };
}

export { decodeUserToken, checkLoginInput, generateUserToken };