import { LoadingButton } from "@mui/lab";
import FormControl from "@mui/material/FormControl";
import { Box, Button, Card, CardContent, CardMedia, Modal, Select, TextField, InputLabel } from "@mui/material";
import { useContext, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import {  useMutation } from "@apollo/client";
import { checkArtInput, checkImageError, uploadImageCloud, useStyles } from "../../composable/art";
import { GET_IMAGE_UPLOAD_URL, INSERT_ARTIST_ART_SERIES, UPDATE_ARTSERIES_BY_PK, UPDATE_ART_TRADITIONAL_BY_PK } from "../../gql/art";
import AlertContext from "../../context/AlertContext";


const EditArt = ({ resultTraditionalArt, editHandle, showEdit, tempArtData, dimension, artSeries, artType}) => {
    // useState
    const [ artData, setArtData ] = useState({ ...tempArtData, fk_dimension: tempArtData.traditional_artwork_dimension.id});
    const [ error, setError ] = useState({});
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    // useContext
    const { showAlert } = useContext(AlertContext);

    const classes = useStyles();

    // Start Mutation
    const [getImageUploadUrl] = useMutation(GET_IMAGE_UPLOAD_URL, {
        onError: (error) =>{
            console.log(error);
            showAlert(error.message, true);
        },
        onCompleted: (result) => {
            return result;
        }
    });

    const [editArtSeries] = useMutation(UPDATE_ARTSERIES_BY_PK, {
        onError: (error) => {
            console.log(error);
            showAlert(error.message, true);
        },
        onCompleted: (result) => {
            console.log(result);
        }
    });
    
    const [insertArtSeries] = useMutation(INSERT_ARTIST_ART_SERIES, {
        onError: (error) => {
            console.log(error);
            showAlert(error.message, true);
        },
        onCompleted: (result) => {
            console.log(result);
        }
    })

    const [editTraditionalArtWork] = useMutation(UPDATE_ART_TRADITIONAL_BY_PK, {
        onError: (error) => {
            console.log(error);
            showAlert(error.message, true);
        },
        onCompleted: async (result) => {
            if(artData.artwork_series){
                if(artData.traditional_art_work_artist_art_series.length > 0 ){
                    await editArtSeries({variables: {fk_traditional_art_work_id: artData.id, fk_art_series_id: artData.artwork_series}})
                }else{
                    await insertArtSeries({ variables: { fk_traditional_art_work_id: artData.id, fk_art_series_id: artData.artwork_series }});
                }
            }
            
            resultTraditionalArt.refetch();
            setArtData(null);
            showAlert("Edit Successfully", false);
            editHandle(null);
        }
    });
    // End Mutation

    // Start Function
    const handleInput = (data, inputName) => {
        if(inputName === "artwork_year"){
            setArtData({ ...artData, [inputName]: +data});
        }else{
            setArtData({ ...artData, [inputName]: data});
        }

        if(error[inputName]){
            delete error[inputName];
            setError(error);
        }
    };

    const uploadImage = (e) => {
        if(e.target.files && e.target.files[0]){
            let img = e.target.files[0];
            let {errorExist, errorDetail} = checkImageError(img);

            if(errorExist){
                setError({...error, artwork_image_url: errorDetail});
            }else{
                setImageFile(img);
                setArtData({ ...artData, artwork_image_url: URL.createObjectURL(img) });

                if(error.artwork_image_url){
                    delete error.artwork_image_url;
                    setError(error);
                }
            }
        }
    };


    const editDataBtn = async () => {
        setLoading(true);
        const { errorExist, tempErrors } = checkArtInput(artData);
        setError(tempErrors);

        if(!errorExist){
            try{
                let response;
                if(imageFile){
                    response = await getImageUploadUrl({ variables: { contentType: "image/*"}})
                    await uploadImageCloud(response.data.getImageUploadUrl.imageUploadUrl, imageFile);
                }
                await editTraditionalArtWork({ variables: {id: artData.id, ...artData, artwork_image_url: imageFile ? `https://axra.sgp1.digitaloceanspaces.com/Mula/${response.data.getImageUploadUrl.imageName}` : tempArtData.artwork_image_url }});

            }catch(error){
                console.log(error);
            }
        }
        setLoading(false);
    }

    // End Function
    
    return (
        <Modal open={showEdit} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
            <Box role="presentation" sx={{width: "95%",position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',bgcolor: 'background.paper',boxShadow: 24,pt: 2,px: 4,pb: 3}}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p>Edit For {tempArtData.artwork_name}</p>
                    <Button size="small" variant="contained" color="error"  onClick={() => editHandle(null)}>Close</Button>
                </div>

                
                <Card>
                            <CardContent sx={{ p: 3, display: "flex" }} elevation={4}>
                                <Box>
                                    {
                                        artData.artwork_image_url ?
                                            <CardMedia image={artData.artwork_image_url} className={classes.cardImage} component="img"></CardMedia>
                                            :
                                            <div className={classes.cardImage}></div>
                                    }
                                </Box>  
                                <Box sx={{ display: "grid", gridTemplateColumns: "300px 300px 300px", gap: 2}}>
                                    <FormControl sx={{ mx: 1, my: 1, minWidth: "300px"}}>
                                    <TextField variant="filled" id="artwork_name" label="Artwork Name" value={artData.artwork_name} onChange={(e) => handleInput(e.target.value, "artwork_name")} InputLabelProps={{ shrink: true }} error={error.artwork_name ? true : false}/>
                                    {
                                        error.artwork_name && <small style={{ display: "block", color: "red", position: "absolute", top: "100%", left: 5 }}>{error.artwork_name}</small>
                                    }
                                </FormControl>

                                <FormControl sx={{ mx: 1, my: 1, minWidth: "300px"}}>
                                    <TextField type="file" variant="filled" id="artwork_image_url" label="Artwork Image" onChange={uploadImage} accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml" InputLabelProps={{ shrink: true }} error={error.artwork_image_url ? true : false}/>
                                    {
                                        error.artwork_image_url && <small style={{ display: "block", color: "red", position: "absolute", top: "100%", left: 5 }}>{error.artwork_image_url}</small>
                                    }
                                </FormControl>
                                
                                <FormControl sx={{ mx: 1, my: 1, minWidth: "300px"}}>
                                    <TextField variant="filled" id="artwork_year" label="Artwork Year" value={artData.artwork_year} onChange={(e) => handleInput(e.target.value, "artwork_year")} InputLabelProps={{ shrink: true }} error={error.artwork_year ? true : false}/>
                                    {
                                        error.artwork_year && <small style={{ display: "block", color: "red", position: "absolute", top: "100%", left: 5 }}>{error.artwork_year}</small>
                                    }
                                </FormControl>

                                                
                                <FormControl sx={{ mx: 1, my: 1, minWidth: "300px"}}>
                                    <InputLabel id="artwork_series">Artwork Series</InputLabel>
                                        <Select labelId="artwork_series" label="artwork_series" defaultValue={artData.traditional_art_work_artist_art_series.length > 0 ? artData.traditional_art_work_artist_art_series[0].artist_art_series_art_sery.id : ""} onChange={(e) => handleInput(e.target.value, "artwork_series")}>
                                            {
                                                            artSeries ?
                                                                artSeries.length > 0 ?
                                                                    artSeries.map(s => (
                                                                        <MenuItem key={s.id} value={s.id}>{s.series_name}</MenuItem>
                                                                    ))
                                                                    :
                                                                    <MenuItem disabled>No Data</MenuItem>
                                                                :
                                                                <MenuItem disabled>Loading ...</MenuItem>
                                                        }
                                                    </Select>
                                                </FormControl>

                                                <FormControl sx={{ mx: 1, my: 1, minWidth: "300px"}}>
                                                    <InputLabel id="artwork_type">Artwork Type</InputLabel>
                                                    <Select labelId="artwork_type" label="artwork_type" defaultValue={artData.fk_medium_type_id} onChange={(e) => handleInput(e.target.value, "fk_medium_type_id")} error={error.fk_medium_type_id ? true : false}>
                                                        {
                                                            artType ?
                                                                artType.length > 0 ?
                                                                    artType.map(t => (
                                                                        <MenuItem key={t.id} value={t.id}>{t.medium_name}</MenuItem>
                                                                    ))
                                                                    :
                                                                    <MenuItem disabled>No Data</MenuItem>
                                                                :
                                                                <MenuItem disabled>Loading ...</MenuItem>
                                                        }
                                                    </Select>
                                                    {
                                                        error.fk_medium_type_id && <small style={{ display: "block", color: "red", position: "absolute", top: "100%", left: 5 }}>{error.fk_medium_type_id}</small>
                                                    }
                                                </FormControl>

                                                <FormControl sx={{ mx: 1, my: 1, minWidth: "300px"}}>
                                                    <div style={{  display: "flex", justifyContent: "space-between" }}>
                                                        <TextField variant="filled" id="Length" label="Width" sx={{ maxWidth: "85px"}} defaultValue={artData.width} onChange={(e) => handleInput(e.target.value, "width")} error={error["width"] ? true : false}/>
                                                        <TextField variant="filled" id="Length" label="Height" sx={{ maxWidth: "100px"}}  defaultValue={artData.height} onChange={(e) => handleInput(e.target.value, "height")} error={error["height"] ? true : false}/>

                                                        <Select labelId="unit" label="unit"  sx={{ maxWidth: "100px"}} defaultValue={artData.traditional_artwork_dimension ? artData.traditional_artwork_dimension.id : ""} onChange={(e) => handleInput(e.target.value, "fk_dimension")} error={error["fk_dimension"] ? true : false}>
                                                            {
                                                                dimension ?
                                                                    dimension.length > 0 ?
                                                                        dimension.map(d => (
                                                                            <MenuItem key={d.id} value={d.id}>{d.dimension_name}</MenuItem>
                                                                        ))
                                                                        :
                                                                        <MenuItem disabled>No Data</MenuItem>
                                                                    :
                                                                    <MenuItem disabled>Loading ...</MenuItem>
                                                            }
                                                        </Select>
                                                    </div>
                                                    {
                                                        error.fk_dimension && <small style={{ display: "block", color: "red", position: "absolute", top: "100%", left: 5 }}>{error.dimensions}</small>
                                                    }
                                                </FormControl>

                                                <FormControl sx={{ mx: 1, my: 1, minWidth: "300px"}}>
                                                    <TextField variant="filled" id="current_price" label="Price" defaultValue={artData.current_price} onChange={(e) => handleInput(e.target.value, "current_price")} error={error.current_price ? true : false}/>
                                                    {
                                                        error.current_price && <small style={{ display: "block", color: "red", position: "absolute", top: "100%", left: 5 }}>{error.current_price}</small>
                                                    }
                                                </FormControl>

                                                <FormControl  sx={{ mx: 1, my: 1, minWidth: "300px"}}>
                                                    <InputLabel id="disbaled">Disable</InputLabel>
                                                    <Select labelId="disbaled" label="disable" defaultValue={artData.disabled} onChange={(e) => handleInput(e.target.value, "disabled")} error={error.disabled ? true : false}>
                                                        <MenuItem value={true}>True</MenuItem>
                                                        <MenuItem value={false}>False</MenuItem>
                                                    </Select>
                                                </FormControl>

                                                
                                                <FormControl sx={{ mx: 1, my: 1, minWidth: "300px"}}>
                                                    <TextField variant="filled" id="description" label="Description" defaultValue={artData.description} onChange={(e) => handleInput(e.target.value, "description")} error={error.description ? true : false}/>
                                                    {
                                                        error.description && <small style={{ display: "block", color: "red", position: "absolute", top: "100%", left: 5 }}>{error.description}</small>
                                                    }
                                                </FormControl>

                                                <Box sx={{ display: "flex", justifyContent: "end", marginRight: "40px", marginBottom: "20px"}}>
                                                    <Button variant="contained" color="error" sx={{ px: 3, py: 1, mr: 2 }} onClick={() => editHandle(null)}  disabled={loading}>Cancel</Button>
                                                    <LoadingButton variant="contained" color="primary" sx={{ px: 3, py: 1 }} onClick={editDataBtn} loading={loading}>Edit</LoadingButton>
                                                </Box>
                                </Box>
                            </CardContent>
                        </Card>
            </Box>
        </Modal>
    )
};

export default EditArt;