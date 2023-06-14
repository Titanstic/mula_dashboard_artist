import {Button, Card, CardContent, CardMedia, InputLabel, Modal, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { ModalStyled, useStyles } from "../../composable/art";

const DetailArt = ({detailHandle, showDetail, tempArtData}) => {
    const classes = useStyles();

    return(
        
        <Modal open={showDetail} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
            <Box role="presentation" sx={{...ModalStyled, p: 2}}>
                <div>
                        <div style={{ display: "flex", justifyContent: "space-between", px: 6, marginBottom: "10px"}}>
                            <Typography fontWeight="bold" variant="h4">Detail Art</Typography>
                        </div>

                        <Card>
                            <CardContent sx={{ p: 3, display: "flex" }} elevation={4}>
                                <Box>
                                    {
                                        tempArtData.artwork_image_url &&
                                            <CardMedia image={tempArtData.artwork_image_url} className={classes.cardImage} component="img"></CardMedia>
                                    }
                                </Box>
                            </CardContent>

                        </Card>
                </div>
            </Box>
        </Modal>
    )
};

export default DetailArt;