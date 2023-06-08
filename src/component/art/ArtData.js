import Box from "@mui/material/Box";
import {Avatar, Button, Table, TableBody, TableContainer, TableHead, TablePagination} from "@mui/material";
import {StyledTableCell, StyledTableRow} from "../../composable/art";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../../context/AuthContext";

const ArtData = ({loadTraditionalArt, resultTraditionalArt}) => {
    // useContext
    const { artistId } = useContext(AuthContext);
    // useState
    const [ arts, setArts ] = useState(null);
    const [count, setCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [offset, setOffset] = useState(0);

    // Start useEffect
    useEffect(() => {
        loadTraditionalArt({ variables: { fk_artist_id: artistId}})
    }, [loadTraditionalArt])

    useEffect(() => {
        if(resultTraditionalArt.data){
            console.log(resultTraditionalArt.data.traditional_art_work);
            setArts(resultTraditionalArt.data.traditional_art_work);
        }
    }, [resultTraditionalArt])
    // End useEffect


    // Start Function
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setOffset(rowsPerPage * newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    // End Function


    return(
        <>
            <Box sx={{ display: "flex", flexFlow: "wrap row", "& > :not(style)": {m: 1, width: "100%", minHeight: "25vh"}}}>
                <TableContainer sx={{ maxHeight: "60vh", Width: "100px"}}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>ID</StyledTableCell>
                                <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>IMAGE</StyledTableCell>
                                <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>ART NAME</StyledTableCell>
                                <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>CURRENT PRICE</StyledTableCell>
                                <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>ACTION</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>

                        <TableBody>
                            {
                                arts ?
                                    arts.map( art => (
                                        <StyledTableRow hover role="checkbox" tableindex={-1} key={art.id}>
                                            <StyledTableCell>{art.id}</StyledTableCell>
                                            <StyledTableCell>
                                                <Avatar sx={{ width: 56, height: 56}} alt="test" src={art.artwork_image_url}/>
                                            </StyledTableCell>
                                            <StyledTableCell>{art.artwork_name}</StyledTableCell>
                                            <StyledTableCell>{art.current_price.toLocaleString("en-US")}</StyledTableCell>
                                            <StyledTableCell>
                                                <Button size="small" sx={{ color: "red"}} fontWeight="bold">Detail</Button>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                    :
                                    <StyledTableRow hover role="checkbox" tableindex={-1}>
                                        <StyledTableCell>Loading</StyledTableCell>
                                    </StyledTableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination sx={{ color: "black" }} rowsPerPageOptions={[10, 25, 100]} component="div" count={count} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}/>
            </Box>
        </>
    )
};

export default ArtData;