import Typography from "@mui/material/Typography";
import {Button, Card, CardContent, CardMedia, InputLabel, Modal, Select, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import {ModalStyled, useStyles, checkImageError, uploadImageCloud, checkArtInput} from "../../composable/art";
import {useContext, useState, useEffect} from "react";
import {useLazyQuery, useMutation} from "@apollo/client";
import {GET_ARTWORK_DIMENSION, GET_ARTWORK_MEDIUM_TYPE, GET_ART_SERIES_BY_ARTIST, GET_IMAGE_UPLOAD_URL, INSERT_ARTIST_ART_SERIES, INSERT_ART_TRADITIONAL} from "../../gql/art";
import MenuItem from "@mui/material/MenuItem";
import AuthContext from "../../context/AuthContext";
import { LoadingButton } from "@mui/lab";
import AlertContext from "../../context/AlertContext";
import RichTextEditor from "react-rte";

const CreateArt = ({showCreate, createHandle, resultTraditionalArt}) => {
    // useContext
    const { userId, artistId } = useContext(AuthContext);
    const { showAlert } = useContext(AlertContext);
    // useLazyQuery
    const [ loadArtType, resultArtType ] = useLazyQuery(GET_ARTWORK_MEDIUM_TYPE);
    const [ loadDimension, resultDimension ] = useLazyQuery(GET_ARTWORK_DIMENSION);
    const [ loadArtSeries, resultArtSeries ] = useLazyQuery(GET_ART_SERIES_BY_ARTIST);
    // useState
    const [artData, setArtData] = useState({disabled: false, lengthunit: "cm", widthunit: "cm"});
    const [description, setDescription] = useState(RichTextEditor.createEmptyValue());
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState({});
    const [dimension, setDimension] = useState(null);
    const [ artSeries, setArtSeries ] = useState(null);
    const [artType, setArtType] = useState(null);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    // Start UseEffect
    // For Art Type
    useEffect(() => {
        loadArtType();
    }, [loadArtType])

    useEffect(() => {
        if(resultArtType.data){
            setArtType(resultArtType.data.artwork_medium_type);
        }
    }, [resultArtType])

    // For Art Series
    useEffect(() => {
        loadArtSeries({ variables: { fk_artist_id: artistId }})
    }, [loadArtSeries])

    useEffect(() => {
        if(resultArtSeries.data){
            setArtSeries(resultArtSeries.data.art_series);
        }
    }, [resultArtSeries])

    // For Art Dimension
    useEffect(() => {
        loadDimension();
    }, [loadDimension])

    useEffect(() => {
        if(resultDimension.data){
            setDimension(resultDimension.data.artwork_dimensions);
        }
    }, [resultDimension])
    // End UseEffect

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

    const [insertArtTraditional] = useMutation(INSERT_ART_TRADITIONAL, {
        onError: (error) => {
            console.log(error);
            showAlert(error.message, true);
        },
        onCompleted: (result) => {
            createHandle();
            showAlert("Insert Successfully", false);
            resultTraditionalArt.refetch();
            return result;
        }
    });

    const [insertAritistArtSeries] = useMutation(INSERT_ARTIST_ART_SERIES, {
        onError: (error) =>{
            console.log(error);
            showAlert(error.message, true);
        },
        onCompleted: (result) => {
            console.log(result);
        }
    })
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

    const handleDescription = (value) => {
        setDescription(value);
        setArtData({ ...artData, "description": value.toString("html")});
    }

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

    
const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: [
        "INLINE_STYLE_BUTTONS",
        "BLOCK_TYPE_BUTTONS",
        "LINK_BUTTONS",
        "BLOCK_TYPE_DROPDOWN",
        "HISTORY_BUTTONS",
    ],
    INLINE_STYLE_BUTTONS: [
        { label: "Bold", style: "BOLD", className: "custom-css-class" },
        { label: "Italic", style: "ITALIC" },
        { label: "Underline", style: "UNDERLINE" },
    ],
    BLOCK_TYPE_DROPDOWN: [
        { label: "Normal", style: "unstyled" },
        { label: "Heading Large", style: "header-one" },
        { label: "Heading Medium", style: "header-two" },
        { label: "Heading Small", style: "header-three" },
    ],
    BLOCK_TYPE_BUTTONS: [
        { label: "UL", style: "unordered-list-item" },
        { label: "OL", style: "ordered-list-item" },
    ],
};

    const cancelBtn = () => {
        setArtData({disabled: false, lengthunit: "cm", widthunit: "cm"});
        setError({});
        createHandle();
    }

    const createTraditionArt = async () => {
        setLoading(true);
        const { errorExist, tempErrors } = checkArtInput(artData);
        
        if(errorExist){
            setError(tempErrors);
        }else{
            try{
                const response = await getImageUploadUrl({variables: { contentType: "image/*"}});
                await uploadImageCloud(response.data.getImageUploadUrl.imageUploadUrl, imageFile);
                const artId = await insertArtTraditional({variables: {...artData, pending: "true", artwork_image_url: `https://axra.sgp1.digitaloceanspaces.com/Mula/${response.data.getImageUploadUrl.imageName}`, fk_ownership_id: userId, fk_artist_id: artistId, "dimensions": `${artData.width}${artData.fk_dimension} x ${artData.height}${artData.fk_dimension}`}});

                if(artData.artwork_series){
                    await insertAritistArtSeries({ variables: { fk_traditional_art_work_id: artId.data.insert_traditional_art_work_one.id, fk_art_series_id: artData.artwork_series}});
                }
            }catch(e){
                showAlert(e.message, true);
            }
        }
        setLoading(false);
    }
    // End Function

    return(
        <Modal open={showCreate} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
            <Box role="presentation" sx={{...ModalStyled, p: 2}}>
                <div>
                        <div style={{ display: "flex", justifyContent: "space-between", px: 6, marginBottom: "10px"}}>
                            <Typography fontWeight="bold" variant="h4">Create Art</Typography>
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
                                        <TextField variant="filled" id="artwork_name" label="Artwork Name" onChange={(e) => handleInput(e.target.value, "artwork_name")} error={error.artwork_name ? true : false}/>
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
                                        <TextField variant="filled" id="artwork_year" label="Artwork Year" onChange={(e) => handleInput(e.target.value, "artwork_year")} error={error.artwork_year ? true : false}/>
                                        {
                                            error.artwork_year && <small style={{ display: "block", color: "red", position: "absolute", top: "100%", left: 5 }}>{error.artwork_year}</small>
                                        }
                                    </FormControl>

                                    
                                    <FormControl sx={{ mx: 1, my: 1, minWidth: "300px"}}>
                                        <InputLabel id="artwork_series">Artwork Series</InputLabel>
                                        <Select labelId="artwork_series" label="artwork_series" defaultValue="" onChange={(e) => handleInput(e.target.value, "artwork_series")}>
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
                                        {
                                            error.fk_medium_type_id && <small style={{ display: "block", color: "red", position: "absolute", top: "100%", left: 5 }}>{error.fk_medium_type_id}</small>
                                        }
                                    </FormControl>

                                    <FormControl sx={{ mx: 1, my: 1, minWidth: "300px"}}>
                                        <InputLabel id="artwork_type">Artwork Type</InputLabel>
                                        <Select labelId="artwork_type" label="artwork_type" defaultValue="" onChange={(e) => handleInput(e.target.value, "fk_medium_type_id")} error={error.fk_medium_type_id ? true : false}>
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
                                            <TextField variant="filled" id="Length" label="Length" sx={{ maxWidth: "85px"}} onChange={(e) => handleInput(e.target.value, "width")} error={error["width"] ? true : false}/>
                                            <TextField variant="filled" id="Length" label="Width" sx={{ maxWidth: "100px"}} onChange={(e) => handleInput(e.target.value, "height")} error={error["height"] ? true : false}/>

                                            <Select labelId="unit" label="unit" defaultValue="cm" sx={{ maxWidth: "70px"}} onChange={(e) => handleInput(e.target.value, "fk_dimension")}>
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
                                            error.dimensions && <small style={{ display: "block", color: "red", position: "absolute", top: "100%", left: 5 }}>{error.dimensions}</small>
                                        }
                                    </FormControl>

                                    <FormControl sx={{ mx: 1, my: 1, minWidth: "300px"}}>
                                        <TextField variant="filled" id="current_price" label="Price" onChange={(e) => handleInput(e.target.value, "current_price")} error={error.current_price ? true : false}/>
                                        {
                                            error.current_price && <small style={{ display: "block", color: "red", position: "absolute", top: "100%", left: 5 }}>{error.current_price}</small>
                                        }
                                    </FormControl>

                                    <FormControl  sx={{ mx: 1, my: 1, minWidth: "300px"}}>
                                        <InputLabel id="disbaled">Disable</InputLabel>
                                        <Select labelId="disbaled" label="disable" defaultValue="false" onChange={(e) => handleInput(e.target.value, "disabled")} error={error.disabled ? true : false}>
                                            <MenuItem value={true}>True</MenuItem>
                                            <MenuItem value={false}>False</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <Box>
                                        <InputLabel>Description</InputLabel>

                                        <RichTextEditor className="description-text" onChange={handleDescription} value={description} toolbarConfig={toolbarConfig} />
                                    </Box>
                                </Box>
                            </CardContent>

                            <Box sx={{ display: "flex", justifyContent: "end", marginRight: "40px", marginBottom: "20px"}}>
                                <Button variant="contained" color="error" sx={{ px: 3, py: 1, mr: 2 }} onClick={cancelBtn} disabled={loading}>Cancel</Button>
                                <LoadingButton variant="contained" color="primary" sx={{ px: 3, py: 1 }} onClick={createTraditionArt} loading={loading}>Create</LoadingButton>
                            </Box>
                        </Card>
                </div>
            </Box>
        </Modal>
    )
};

export default CreateArt;