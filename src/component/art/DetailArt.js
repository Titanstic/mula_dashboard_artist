import {Button, Card, CardContent, CardMedia, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ModalStyled, useStyles } from "../../composable/art";

const DetailArt = ({detailHandle, showDetail, tempArtData}) => {
    const classes = useStyles();

    return(
        
        <Modal open={showDetail} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
            <Box role="presentation" sx={{...ModalStyled, p: 2}}>
                <div>
                        <div style={{ display: "flex", justifyContent: "space-between", px: 6, marginBottom: "10px"}}>
                            <Typography fontWeight="bold" variant="h4">Detail Art</Typography>
                            <Button variant="contained" color="error" onClick={() => detailHandle(null)}>Close</Button>
                        </div>

                        <Card>
                            <CardContent sx={{ p: 3, display: "flex" }} elevation={4}>
                                <Box>
                                    {
                                        tempArtData.artwork_image_url &&
                                            <CardMedia image={tempArtData.artwork_image_url} className={classes.cardImage} component="img"></CardMedia>
                                    }
                                </Box>

                                <Box>
                                    <p>Name - {tempArtData.artwork_name}</p>
                                    <p>Year - {tempArtData.artwork_year}</p>
                                    <p>$ -{tempArtData.current_price.toLocaleString("en-US")} KS</p>
                                    <p>Description - {tempArtData.description}</p>
                                    {/* <p>Type - {tempArtData.traditional_art_work_artwork_medium_type ? tempArtData.traditional_art_work_artwork_medium_type.medium_name : "No Data"}</p> */}
                                    {/* <p>Dimension - {tempArtData.width}{tempArtData.traditional_artwork_dimension ? tempArtData.traditional_artwork_dimension : "-"} x {tempArtData.height}{tempArtData.traditional_artwork_dimension ? tempArtData.traditional_artwork_dimension.dimension_name: "-"}</p> */}
                                </Box>
                            </CardContent>

                        </Card>
                </div>
            </Box>
        </Modal>
    )
};

export default DetailArt;