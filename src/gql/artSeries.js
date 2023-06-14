import { gql } from "@apollo/client";

const GET_ART_SERIES_BY_ARTIST_ID = gql`
    query GET_ART_SERIES_BY_ARTIST_ID($limit: Int!, $offset: Int!, $fk_artist_id: Int!, $id: order_by = desc) {
        art_series(limit: $limit, offset: $offset, where: {fk_artist_id: {_eq: $fk_artist_id}}, order_by: {id: $id}) {
            id
            series_description
            series_name
            series_thumbnail_url_id
        }
        art_series_aggregate(where: {fk_artist_id: {_eq: $fk_artist_id}}) {
            aggregate {
                count
            }
        }
    }  
`;

const INSERT_ART_SERIES = gql`
    mutation INSERT_ART_SERIES($fk_artist_id: Int!, $series_description: String, $series_name: String!, $series_thumbnail_url_id: Int) {
        insert_art_series_one(object: {fk_artist_id: $fk_artist_id, series_description: $series_description, series_name: $series_name, series_thumbnail_url_id: $series_thumbnail_url_id}) {
            id
            series_name
        }
    }  
`

export { GET_ART_SERIES_BY_ARTIST_ID, INSERT_ART_SERIES };