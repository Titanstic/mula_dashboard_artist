import { LoadingButton } from "@mui/lab";
import { Box, Modal } from "@mui/material";

const EditArt = ({editHandle, showEdit, tempArtData}) => {
    console.log(tempArtData);
    
    return (
        <Modal open={showEdit} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
            <Box role="presentation" sx={{width: "50%",position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',bgcolor: 'background.paper',boxShadow: 24,pt: 2,px: 4,pb: 3}}>
                <div>
                    <p>Hello Edit</p>
                    <LoadingButton onClick={() => editHandle(null)}>Cancel</LoadingButton>
                </div>
            </Box>
        </Modal>
    )
};

export default EditArt;