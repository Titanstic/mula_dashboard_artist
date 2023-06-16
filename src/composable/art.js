import {styled, TableCell, tableCellClasses, TableRow} from "@mui/material";
import {makeStyles} from "@mui/styles";
import axios from "axios";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        fontSize: 15,
        fontWeight: "bold",
        minWidth: 70,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15,
    },
}));

const ModalStyled = {
    width: "95%",
    position: 'absolute',
    top: '2%',
    left: '50%',
    transform: 'translateX(-50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

const useStyles = makeStyles({
    cardImage: {
        width: "250px",
        height: "300px",
        backgroundColor: "gray",
    }
});


const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon",
];

const checkImageError = (image) => {
    let errorExist = false,
        errorDetail = "";

    if(!fileTypes.includes(image.type)){
        errorExist = true;
        errorDetail = "Please select image. (PNG, JPG, JPEG, GIF, ...)";
    }

    if(image.size > 10485760){
        errorExist = true;
        errorDetail = "Image file size must be smaller than 10MB.";
    }

    return { errorExist, errorDetail };
};

const uploadImageCloud = async(uri, data) => {
    const config = {
        headers: {
            "Content-Type": "image/*",
            "x-amz-acl": "public-read"
        }
    };

    return await axios.put(uri, data, config);
};


const checkArtInput = (data) => {
    let errorExist = false;
    const tempErrors = {};

    if (!data.artwork_name) {
        tempErrors.artwork_name = "Artwork Name is required.";
        errorExist = true;
    }
    if (!data.artwork_image_url) {
        tempErrors.artwork_image_url = "Image File is required.";
        errorExist = true;
    }
    if (!data.artwork_year) {
        tempErrors.artwork_year = "Artwork Year is required.";
        errorExist = true;
    }
    if (!data.fk_medium_type_id) {
        tempErrors.fk_medium_type_id = "Artwork Type is required.";
        errorExist = true;
    }
    if (!data["height"]) {
        tempErrors["height"] = "Length is required.";
        errorExist = true;
    }
    if (!data["width"]) {
        tempErrors["width"] = "Width is required.";
        errorExist = true;
    }
    if (!data.fk_dimension) {
        tempErrors.fk_dimension = "Unit is required.";
        errorExist = true;
    }
    if (!data.current_price) {
        tempErrors.current_price = "Price is required.";
        errorExist = true;
    }
    if (!data.description) {
        tempErrors.description = "Description is required.";
        errorExist = true;
    }

    return { errorExist, tempErrors };

};



export { StyledTableRow, StyledTableCell, ModalStyled, useStyles, checkImageError, uploadImageCloud, checkArtInput }