import { useLazyQuery } from "@apollo/client";
import { createContext } from "react";
import { GET_ART_SERIES_BY_ARTIST_ID } from "../gql/artSeries";

const GqlContext = createContext();

const GqlContextProvider = ({children}) => {
    const [ loadArtSeriesArtist, resultArtSeriesArtist ] = useLazyQuery(GET_ART_SERIES_BY_ARTIST_ID);

    return(
        <GqlContext.Provider value={{ loadArtSeriesArtist, resultArtSeriesArtist }}>
            {children}
        </GqlContext.Provider>
    )
}

export default GqlContext;
export {GqlContextProvider }