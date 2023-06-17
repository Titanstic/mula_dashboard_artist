import Box from "@mui/material/Box";
import {Button, Table, TableBody, TableContainer, TableHead, TablePagination} from "@mui/material";
import {StyledTableCell, StyledTableRow} from "../../composable/art";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../../context/AuthContext";
import loadingImage from "../../assets/image/loading.gif";

const ArtSeriesData = ({loadArtSeriesArtist, resultArtSeriesArtist, editHandle, searchName, searchBtn}) => {
    // useConstext
    const { artistId } = useContext(AuthContext);
    // useState
    const [ artseries, setArtSeries ] = useState(null);
    const [count, setCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [offset, setOffset] = useState(0);

    //Start UseEffect
    useEffect(() => {
        if(artistId){
            setArtSeries(null);
            setCount(0);
            loadArtSeriesArtist({ variables: { limit: rowsPerPage, offset: offset, fk_artist_id: artistId, series_name: `%${searchName}%`}});
        }
    }, [loadArtSeriesArtist, artistId, offset, rowsPerPage, searchBtn])

    useEffect(() => {
        if(resultArtSeriesArtist.data){
            setArtSeries(resultArtSeriesArtist.data.art_series);
            setCount(resultArtSeriesArtist.data.art_series_aggregate.aggregate.count)
        }
    }, [resultArtSeriesArtist])
    // End UserEffect

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

    return (
        <Box sx={{ display: "flex", flexFlow: "wrap row", "& > :not(style)": {m: 1, width: "100%"}}}>
            <TableContainer sx={{ maxHeight: "70vh", Width: "100px",  border: "1px groove rgba(0,0,0,0.2)"}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>ID</StyledTableCell>
                            <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>IMAGE</StyledTableCell>
                            <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>NAME</StyledTableCell>
                            <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>DESCRITPION</StyledTableCell>
                            <StyledTableCell style={{minWidth: 70, fontWeight: "bold"}}>ACTION</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>

                    <TableBody>
                        {
                            artseries ?
                                artseries.length > 0 ?
                                    artseries.map(s => (
                                        <StyledTableRow hover role="checkbox" tableindex={-1} key={s.id}>
                                            <StyledTableCell>{s.id}</StyledTableCell>
                                            <StyledTableCell>{s.series_thumbnail_url_id ? s.series_thumbnail_url_id : "-"}</StyledTableCell>
                                            <StyledTableCell>{s.series_name}</StyledTableCell>
                                            <StyledTableCell>{s.series_description ? s.series_description : "-"}</StyledTableCell>
                                            <StyledTableCell>
                                                <Button size="small" variant="contained" sx={{ color: "white", p: 1, mr: 1}} fontWeight="bold" onClick={() => editHandle(s)}>Edit</Button>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                :
                                <StyledTableRow hover role="checkbox" tableindex={-1}>
                                    <StyledTableCell sx={{ textAlign: "center", fontWeight: "bold" }} colSpan={5}>No Data</StyledTableCell>
                                </StyledTableRow>
                            :
                            <StyledTableRow hover role="checkbox" tableindex={-1}>
                                <StyledTableCell sx={{ textAlign: "center", fontWeight: "bold" }} colSpan={6}>
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

    )
};

export default ArtSeriesData;