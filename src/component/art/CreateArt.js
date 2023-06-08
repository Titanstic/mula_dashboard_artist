import Typography from "@mui/material/Typography";
import {Avatar, Button, Card, CardContent, CardMedia, InputLabel, Modal, Select, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import {ModalStyled, useStyles, checkImageError, uploadImageCloud} from "../../composable/art";
// import cancelIcon from "../../assets/icons/cancel.png";
import {useContext, useState, useEffect} from "react";
import {useLazyQuery, useMutation} from "@apollo/client";
import {GET_ART_SERIES_BY_ARTIST, GET_IMAGE_UPLOAD_URL, INSERT_ART_TRADITIONAL} from "../../gql/art";
import MenuItem from "@mui/material/MenuItem";
import AuthContext from "../../context/AuthContext";

const CreateArt = ({showCreate, createHandle, resultTraditionalArt}) => {
    // useContext
    const { userId, artistId } = useContext(AuthContext);
    // useLazyQuery
    const [loadArtSeries, resultArtSeries] = useLazyQuery(GET_ART_SERIES_BY_ARTIST);
    // useState
    const [loading, setLoading] = useState(true);
    const [artData, setArtData] = useState({
        "fk_artist_id": 1
    });
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState({});
    const [artSeries, setArtSerires] = useState(null);


    const classes = useStyles();

    // Start UseEffect
    useEffect(() => {
        setLoading(true);
        loadArtSeries({ variables: { fk_artist_id: artistId }});
    }, [loadArtSeries])

    useEffect(() => {
        if(resultArtSeries.data){
            setArtSerires(resultArtSeries.data.art_series);
            setLoading(false);
        }
    }, [resultArtSeries])
    // End UseEffect

    // Start Mutation
    const [getImageUploadUrl] = useMutation(GET_IMAGE_UPLOAD_URL, {
        onError: (error) =>{
            console.log(error);
        },
        onCompleted: (result) => {
            return result;
        }
    });

    const [insertArtTraditional] = useMutation(INSERT_ART_TRADITIONAL, {
        onError: (error) => {
            console.log(error);
        },
        onCompleted: (result) => {
            console.log(result);
            createHandle();
            resultTraditionalArt.refetch();
        }
    })
    // End Mutation

    // Start Function
    const handleInput = (data, inputName) => {
        if(inputName === "artwork_year"){
            setArtData({ ...artData, [inputName]: +data})
        }else{
            setArtData({ ...artData, [inputName]: data});
        }
    };

    const uploadImage = (e) => {
        if(e.target.files && e.target.files[0]){
            let img = e.target.files[0];
            let {error, errorDetail} = checkImageError(img);

            if(error){
                setError({...error, "image": errorDetail});
            }else{
                setImageFile(img);
                setArtData({ ...artData, artwork_image_url: URL.createObjectURL(img) });
            }
        }
    };

    const createTraditionArt = async () => {
        const response = await getImageUploadUrl({variables: { contentType: "image/*"}});
        await uploadImageCloud(response.data.getImageUploadUrl.imageUploadUrl, imageFile);
        await insertArtTraditional({variables: {...artData, pending: "true", artwork_image_url: `https://axra.sgp1.digitaloceanspaces.com/Mula/${response.data.getImageUploadUrl.imageName}`, fk_ownership_id: userId, fk_artist_id: artistId}});
    }
    // End Function

    return(
        <Modal open={showCreate} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
            {
                loading ?
                    <Box role="presentation" sx={{...ModalStyled, p: 2}}>
                        <Typography fontWeight="bold" variant="h6" sx={{textAlign: "center"}}>Loading</Typography>
                    </Box>
                    :
                    <Box role="presentation" sx={{...ModalStyled, p: 2}}>
                        <div style={{ display: "flex", justifyContent: "space-between", px: 6, marginBottom: "10px"}}>
                            <Typography fontWeight="bold" variant="h6">Create Art</Typography>
                            {/*<Avatar sx={{ cursor: "pointer" }} src={cancelIcon} onClick={createHandle} alt="cancel Icon" />*/}
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
                                    <FormControl sx={{ mx: 3, my: 1, minWidth: "300px"}}>
                                        <TextField variant="filled" id="artwork_name" onChange={(e) => handleInput(e.target.value, "artwork_name")} label="ArtWork Name"/>
                                    </FormControl>

                                    <FormControl sx={{ mx: 3, my: 1, minWidth: "300px"}}>
                                        <TextField type="file" variant="filled" id="artwork_image_url" label="Artwork Image" onChange={uploadImage} accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml" InputLabelProps={{ shrink: true }}/>
                                    </FormControl>

                                    <FormControl sx={{ mx: 3, my: 1, minWidth: "300px"}}>
                                        <TextField variant="filled" id="artwork_year" label="Artwork Year" onChange={(e) => handleInput(e.target.value, "artwork_year")}/>
                                    </FormControl>

                                    <FormControl sx={{ mx: 3, my: 1, minWidth: "300px"}}>
                                        <InputLabel id="artwork_type">Artwork Type</InputLabel>
                                        <Select labelId="artwork_type" label="artwork_type" defaultValue="" onChange={(e) => handleInput(e.target.value, "artwork_type")}>
                                            <MenuItem value="water">Water</MenuItem>
                                            <MenuItem value="dry">Dry</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControl sx={{ mx: 3, my: 1, minWidth: "300px"}}>
                                        <InputLabel id="fk_art_series_id">Art Series</InputLabel>
                                        <Select labelId="fk_art_series_id" label="Art Series" defaultValue="" onChange={(e) => handleInput(e.target.value, "fk_art_series_id")}>
                                            {
                                                artSeries.length > 0 ?
                                                    artSeries.map(art => (
                                                        <MenuItem key={art.id} value={art.id}>{art.series_name}</MenuItem>
                                                    ))
                                                    :
                                                    <MenuItem value="null" disabled>No Data</MenuItem>
                                            }
                                        </Select>
                                    </FormControl>

                                    <FormControl sx={{ mx: 3, my: 1, minWidth: "300px"}}>
                                        <TextField variant="filled" id="dimensions" label="Dimension" onChange={(e) => handleInput(e.target.value, "dimensions")}/>
                                    </FormControl>

                                    <FormControl sx={{ mx: 3, my: 1, minWidth: "300px"}}>
                                        <TextField variant="filled" id="current_price" label="Price" onChange={(e) => handleInput(e.target.value, "current_price")}/>
                                    </FormControl>

                                    <FormControl sx={{ mx: 3, my: 1, minWidth: "300px"}}>
                                        <TextField variant="filled" id="description" label="Description" onChange={(e) => handleInput(e.target.value, "description")}/>
                                    </FormControl>

                                    <FormControl  sx={{ mx: 3, my: 1, minWidth: "300px"}}>
                                        <InputLabel id="disbaled">Disable</InputLabel>
                                        <Select labelId="disbaled" label="disable" defaultValue="" onChange={(e) => handleInput(e.target.value, "disabled")}>
                                            <MenuItem value={true}>True</MenuItem>
                                            <MenuItem value={false}>False</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </CardContent>

                            <Box sx={{ display: "flex", justifyContent: "end", marginRight: "40px", marginBottom: "20px"}}>
                                <Button variant="contained" color="primary" sx={{ px: 3, py: 1 }} onClick={createTraditionArt}>Create</Button>
                            </Box>
                        </Card>
                    </Box>
            }

        </Modal>
    )
};

export default CreateArt;