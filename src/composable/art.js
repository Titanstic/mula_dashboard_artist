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
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
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
    let error = false,
        errorDetail = "";

    if(!fileTypes.includes(image.type)){
        error = true;
        errorDetail = "Please select image. (PNG, JPG, JPEG, GIF, ...)";
    }

    if(image.size > 10485760){
        error = true;
        errorDetail = "Image file size must be smaller than 10MB.";
    }

    return { error, errorDetail };
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

export { StyledTableRow, StyledTableCell, ModalStyled, useStyles, checkImageError, uploadImageCloud }