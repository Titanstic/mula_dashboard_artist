import {gql} from "@apollo/client";

const GET_ARTIST_DATA = gql`
    query MyQuery($fk_user_id: Int!) {
          artist(where: {fk_user_id: {_eq: $fk_user_id}}) {
                artist_name
                id
          }
    }
`;

const GET_TRADITIONAL_ARTWORK_BY_ARITSTID = gql`
    query MyQuery($fk_artist_id: Int!) {
          traditional_art_work(where: {fk_artist_id: {_eq: $fk_artist_id}}, order_by: {id: desc}) {
                artwork_image_url
                artwork_name
                artwork_type
                artwork_year
                current_price
                created_at
                description
                dimensions
                disabled
                fk_art_series_id
                id
                pending
          }
    }
`

const GET_ART_SERIES_BY_ARTIST = gql`
    query MyQuery($fk_artist_id: Int!) {
          art_series(where: {fk_artist_id: {_eq: $fk_artist_id}}) {
                id
                series_name
          }
    }
`;

const GET_IMAGE_UPLOAD_URL = gql`
    mutation GET_IMAGE_UPLOAD_URL($contentType: String!) {
          getImageUploadUrl(contentType: $contentType) {
                imageUploadUrl
                imageName
                contentType
                error
                message
          }
    }
`;

const INSERT_ART_TRADITIONAL = gql`
    mutation MyMutation($artwork_image_url: String!, $artwork_name: String!, $artwork_type: String!, $artwork_year: Int!, $current_price: String!, $description: String!, $dimensions: String!, $disabled: Boolean!, $fk_art_series_id: Int!, $fk_artist_id: Int!, $fk_ownership_id: Int!, $pending: String!) {
          insert_traditional_art_work_one(object: {artwork_image_url: $artwork_image_url, artwork_name: $artwork_name, artwork_type: $artwork_type, artwork_year: $artwork_year, current_price: $current_price, description: $description, dimensions: $dimensions, disabled: $disabled, fk_art_series_id: $fk_art_series_id, fk_artist_id: $fk_artist_id, fk_ownership_id: $fk_ownership_id, pending: $pending}) {
                id
          }
    }
`;

export { GET_ARTIST_DATA, GET_TRADITIONAL_ARTWORK_BY_ARITSTID, GET_ART_SERIES_BY_ARTIST, GET_IMAGE_UPLOAD_URL, INSERT_ART_TRADITIONAL };