import { Button, Box, Card, CardContent, Modal, TextField } from "@mui/material";
import { ModalStyled } from "../../composable/art";
import FormControl from "@mui/material/FormControl";
import { LoadingButton } from "@mui/lab";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { checkArtSeriesInput } from "../../composable/artSeries";
import { useMutation } from "@apollo/client";
import AlertContext from "../../context/AlertContext";
import { UPDATE_ART_SERIES_BY_PK } from "../../gql/artSeries";

const EditArtSeries = ({showEdit, editHandle, resultArtSeriesArtist, tempData}) => {
    // useState
    const [ seriesData, setSeriesData] = useState(tempData);
    const [error, setError] = useState({});
    const [ loading, setLoading] = useState(false);
    // useConstext
    const { artistId } = useContext(AuthContext);
    const { showAlert } = useContext(AlertContext);

    // Start Mutation
    const [updateArtSeries] = useMutation(UPDATE_ART_SERIES_BY_PK, {
        onError: (error) => {
            console.log(error);
            showAlert(error.message, true);
        },
        onCompleted: (result) => {
            console.log(result);
            showAlert("Edit Successfully", false);
            resultArtSeriesArtist.refetch();
            editHandle(null);
        }
    })
    // End Mutation


    // Start Function
    const handleInput = (data, input) => {
        setSeriesData({ ...seriesData, [input]: data});

        if(error[input]){
            delete error[input];
            setError(error);
        }
    };

    const cancelBtn = () => {
        setSeriesData({});
        setError({});
        editHandle(null);
    };

    const editArtSeries =  async () => {
        setLoading(true);
        const { errorExist, tempErrors } = checkArtSeriesInput(seriesData);
        setError(tempErrors);

        if(!errorExist){
            await updateArtSeries({ variables: seriesData});
        }
        setLoading(false);
    };
    // End Function

    return(
        <Modal open={showEdit} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
            {
                artistId ?
                    <Box role="presentation" sx={{...ModalStyled, p: 2}}>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", px: 6, marginBottom: "10px"}}>
                                <Typography fontWeight="bold" variant="h4">Create Art Series</Typography>
                            </div>
                        </div>

                        
                        <Card>
                            <CardContent sx={{ p: 3, display: "flex" }} elevation={4}>
                                <Box sx={{ display: "grid", gridTemplateColumns: "300px 300px 300px", gap: 2}}>
                                    <FormControl sx={{ mx: 1, my: 1, minWidth: "300px"}}>
                                        <TextField variant="filled" id="series_name" defaultValue={seriesData.series_name} onChange={(e) => handleInput(e.target.value, "series_name")} label="Name" error={error.series_name ? true : false}/>
                                        {
                                            error.series_name && <small style={{ display: "block", color: "red", position: "absolute", top: "100%", left: 5}}>{error.series_name}</small>
                                        }
                                    </FormControl>

                                    <FormControl sx={{ mx: 1, my: 1, minWidth: "300px"}}>
                                        <TextField variant="filled" id="series_description" defaultValue={seriesData.series_description} onChange={(e) => handleInput(e.target.value, "series_description")} label="Description" error={error.series_description ? true : false}/>
                                        {
                                            error.series_description && <small style={{ display: "block", color: "red", position: "absolute", top: "100%", left: 5}}>{error.series_description}</small>
                                        }
                                    </FormControl>
                                </Box>
                            </CardContent>

                            
                            <Box sx={{ display: "flex", justifyContent: "end", marginRight: "40px", marginBottom: "20px"}}>
                                <Button variant="contained" color="error" sx={{ px: 3, py: 1, mr: 2 }} onClick={cancelBtn} disabled={loading}>Cancel</Button>
                                <LoadingButton variant="contained" color="primary" sx={{ px: 3, py: 1 }} onClick={editArtSeries} loading={loading}>Edit</LoadingButton>
                            </Box>
                        </Card>
                    </Box>
                :
                <>
                Loading
                </>
            }
        </Modal>
    )
};

export default EditArtSeries;