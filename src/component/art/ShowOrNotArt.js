import { Box, Modal } from "@mui/material"
import { useMutation } from "@apollo/client";
import { UPDATE_ART_TRADITIONAL_DISABLE_BY_PK } from "../../gql/art";
import { useContext, useState } from "react";
import AlertContext from "../../context/AlertContext";
import { LoadingButton } from "@mui/lab";

const ShowOrNotArt = ({resultTraditionalArt, disableHandle, showDisable, tempArtData}) => {
    // useContext
    const { showAlert } = useContext(AlertContext);
    // useState
    const [loading, setLoading] = useState(false);

    // Start Mutation
    const [updateArtDisable] = useMutation(UPDATE_ART_TRADITIONAL_DISABLE_BY_PK, {
        onError: (error) => {
            console.log(error);
            showAlert(error.message, true);
        },
        onCompleted: (result) => {
            showAlert("Update successfully", false);
            resultTraditionalArt.refetch();
        }
    })
    // End Mutation

    const confirmHandle = async () => {
        setLoading(true);
        await updateArtDisable({ variables: {id: tempArtData.id, disabled: !tempArtData.disabled}});
        setLoading(false);
        disableHandle(null);
    }

    return(
        <Modal open={showDisable} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
            <Box role="presentation" sx={{width: "50%",position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',bgcolor: 'background.paper',boxShadow: 24,pt: 2,px: 4,pb: 3}}>
                <div>
                    <p style={{ fontSize: "20px" }}>Are you sure you {!tempArtData.disabled && "don't"} want to show this `{tempArtData.artwork_name}` image in mula app?</p>

                    <div style={{  display: "flex", justifyContent: "end" }}>
                        <LoadingButton size="small" variant="contained" color="error" fontWeight="bold" sx={{ color: "white", p: 1, mr: 1}} onClick={() => disableHandle(null)} loading={loading}>Cancel</LoadingButton>
                        <LoadingButton size="small" variant="contained" fontWeight="bold" sx={{ color: "white", p: 1, ml: 1}} onClick={confirmHandle} loading={loading}>Confirm</LoadingButton>
                    </div>
                </div>
            </Box>
        </Modal>
    )
};

export default ShowOrNotArt;