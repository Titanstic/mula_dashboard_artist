import Box from "@mui/material/Box";
import {Avatar, Button, Table, TableBody, TableContainer, TableHead, TablePagination} from "@mui/material";
import {StyledTableCell, StyledTableRow} from "../../composable/art";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../../context/AuthContext";
import loadingImage from "../../assets/image/loading.gif";

const ArtData = ({detailHandle, editHandle, disableHandle, loadTraditionalArt, resultTraditionalArt, searchName, searchBtn}) => {
    // useContext
    const { userId } = useContext(AuthContext);
    // useState
    const [ arts, setArts ] = useState(null);
    const [count, setCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [offset, setOffset] = useState(0);

    // Start useEffect
    useEffect(() => {
        setArts(null);
        setCount(0);
        loadTraditionalArt({ variables: { fk_ownership_id: userId, limit: rowsPerPage, offset, artwork_name: `%${searchName}%`}})
    }, [loadTraditionalArt, offset, rowsPerPage, searchBtn])

    useEffect(() => {
        if(resultTraditionalArt.data){
            setArts(resultTraditionalArt.data.traditional_art_work);
            setCount(resultTraditionalArt.data.traditional_art_work_aggregate.aggregate.count);
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
            <Box sx={{ display: "flex", flexFlow: "wrap row", "& > :not(style)": {m: 1, width: "100%"}}}>
                <TableContainer sx={{ maxHeight: "70vh", Width: "100px",  border: "1px groove rgba(0,0,0,0.2)"}}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>ID</StyledTableCell>
                                <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>IMAGE</StyledTableCell>
                                <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>ART NAME</StyledTableCell>
                                <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>Series</StyledTableCell>
                                <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>CURRENT PRICE</StyledTableCell>
                                <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>Status</StyledTableCell>
                                <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>ACTION</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>

                        <TableBody>
                            {
                                arts ?
                                    arts.length > 0 ?
                                        arts.map( art => (
                                            <StyledTableRow hover role="checkbox" tableindex={-1} key={art.id}>
                                                <StyledTableCell>{art.id}</StyledTableCell>
                                                <StyledTableCell>
                                                    <Avatar sx={{ width: 56, height: 56}} alt="test" src={art.artwork_image_url}/>
                                                </StyledTableCell>
                                                <StyledTableCell>{art.artwork_name}</StyledTableCell>
                                                <StyledTableCell>{art.traditional_art_work_artist_art_series.length > 0 ? art.traditional_art_work_artist_art_series[0].artist_art_series_art_sery.series_name : "-"}</StyledTableCell>
                                                <StyledTableCell>{Number(art.current_price).toLocaleString("en-US")}</StyledTableCell>
                                                <StyledTableCell>
                                                    <Button size="small" variant="contained" color={art.pending ? "warning" : "success"} sx={{ p: 1, cursor: "default"}}>{art.pending ? "pending" : "completed"}</Button>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <Button size="small" variant="contained" sx={{ color: "white", p: 1, mr: 1}} fontWeight="bold" onClick={() => detailHandle(art)}>Detail</Button>
                                                    <Button size="small" variant="contained" sx={{ color: "white", p: 1, mr: 1}} fontWeight="bold" onClick={() => editHandle(art)}>Edit</Button>
                                                    <Button size="small" variant="contained" color={art.disabled ? "success" : "error"} sx={{ color: "white", p: 1, mr: 1}} fontWeight="bold" onClick={() => disableHandle(art)}>{art.disabled ? "Show" : "Not Show"}</Button>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                        :
                                        <StyledTableRow hover role="checkbox" tableindex={-1}>
                                            <StyledTableCell sx={{ textAlign: "center", fontWeight: "bold" }} colSpan={7}>No Data</StyledTableCell>
                                        </StyledTableRow>
                                    :
                                    <StyledTableRow hover role="checkbox" tableindex={-1}>
                                        <StyledTableCell sx={{ textAlign: "center", fontWeight: "bold" }} colSpan={7}>
                                            <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                <img src={loadingImage} width="20px" style={{ marginRight: "10px" }} alt="loading"/> Loading ...
                                            </span>
                                        </StyledTableCell>
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