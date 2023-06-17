import { gql } from "@apollo/client";

const GET_ART_SERIES_BY_ARTIST_ID = gql`
    query GET_ART_SERIES_BY_ARTIST_ID($limit: Int!, $offset: Int!, $fk_artist_id: Int!, $id: order_by = desc, $series_name: String) {
        art_series(limit: $limit, offset: $offset, where: {fk_artist_id: {_eq: $fk_artist_id}, series_name: {_ilike: $series_name}}, order_by: {id: $id}) {
            id
            series_description
            series_name
            series_thumbnail_url_id
        }
        art_series_aggregate(where: {fk_artist_id: {_eq: $fk_artist_id}, series_name: {_ilike: $series_name}}) {
            aggregate {
                count
            }
        }
    }  
`;

const GET_ART_SERIES_BY_TRADITIONAL_ID = gql`
    query MyQuery($fk_traditional_art_work_id: Int!) {
        artist_art_series(where: {fk_traditional_art_work_id: {_eq: $fk_traditional_art_work_id}}) {
            artist_art_series_art_sery {
                series_name
                id
            }
            id
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
`;

const UPDATE_ART_SERIES_BY_PK = gql`
    mutation MyMutation($series_description: String!, $series_name: String!, $series_thumbnail_url_id: Int, $id: Int!) {
        update_art_series(where: {id: {_eq: $id}}, _set: {series_description: $series_description, series_name: $series_name, series_thumbnail_url_id: $series_thumbnail_url_id}) {
            returning {
                series_name
                series_description
                series_thumbnail_url_id
            }
        }
    }  
`

export { GET_ART_SERIES_BY_ARTIST_ID, GET_ART_SERIES_BY_TRADITIONAL_ID, INSERT_ART_SERIES, UPDATE_ART_SERIES_BY_PK };