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
      query MyQuery($fk_ownership_id: Int!, $limit: Int!, $offset: Int!, $artwork_name: String) {
            traditional_art_work(where: {fk_ownership_id: {_eq: $fk_ownership_id}, artwork_name: {_ilike: $artwork_name}}, order_by: {id: desc}, limit: $limit, offset: $offset) {
                  artwork_image_url
                  artwork_name
                  artwork_year
                  current_price
                  created_at
                  description
                  fk_medium_type_id
                  dimensions
                  disabled
                  id
                  pending
                  height
                  width
                  traditional_art_work_artwork_medium_type {
                        id
                        medium_name
                  }
                  traditional_artwork_dimension {
                        id
                        dimension_name
                  }
                  traditional_art_work_artist_art_series {
                        artist_art_series_art_sery {
                              id
                              series_name
                        }
                  }
                  artwork_name_mm
                  description_mm
            }
            traditional_art_work_aggregate(where: {fk_ownership_id: {_eq: $fk_ownership_id}, artwork_name: {_ilike: $artwork_name}}) {
                  aggregate {
                        count
                  }
            }
      }
`;

const GET_ARTWORK_DIMENSION = gql`
      query GET_ARTWORK_DIMENSION {
            artwork_dimensions {
            id
            dimension_name
            }
      }
`;

const GET_ART_SERIES_BY_ARTIST = gql`
    query GET_ART_SERIES_BY_ARTIST($fk_artist_id: Int!) {
          art_series(where: {fk_artist_id: {_eq: $fk_artist_id}}) {
                id
                series_name
          }
    }
`;

const GET_ARTWORK_MEDIUM_TYPE = gql`
      query GET_ARTWORK_MEDIUM_TYPE {
            artwork_medium_type(order_by: {id: asc}) {
                  id
                  medium_name
            }
      }
`

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
    mutation INSERT_ART_TRADITIONAL($artwork_image_url: String!, $artwork_name: String!, $fk_medium_type_id: Int!, $artwork_year: Int!, $current_price: Int!, $description: String!, $dimensions: String!, $disabled: Boolean!, $fk_ownership_id: Int!, $pending: Boolean!, $fk_artist_id: Int!, $height: numeric!, $width: numeric!, $fk_dimension: Int!, $artwork_name_mm: String!, $description_mm: String!) {
          insert_traditional_art_work_one(object: {artwork_image_url: $artwork_image_url, artwork_name: $artwork_name, fk_medium_type_id: $fk_medium_type_id, artwork_year: $artwork_year, current_price: $current_price, description: $description, dimensions: $dimensions, disabled: $disabled, fk_ownership_id: $fk_ownership_id, pending: $pending, fk_artist_id: $fk_artist_id, height: $height, width: $width, fk_dimension: $fk_dimension, artwork_name_mm: $artwork_name_mm, description_mm: $description_mm}) {
                id
          }
    }
`;

const INSERT_ARTIST_ART_SERIES = gql`
      mutation INSERT_ARTIST_ART_SERIES($fk_traditional_art_work_id: Int!, $fk_art_series_id: Int!) {
            insert_artist_art_series_one(object: {fk_traditional_art_work_id: $fk_traditional_art_work_id, fk_art_series_id: $fk_art_series_id}) {
                 id
            }
      }    
`;

const UPDATE_ART_TRADITIONAL_DISABLE_BY_PK = gql`
      mutation MyMutation($id: Int!, $disabled: Boolean!) {
            update_traditional_art_work_by_pk(pk_columns: {id: $id}, _set: {disabled: $disabled}) {
                  id
                  disabled
            }
      }    
`;

const UPDATE_ART_TRADITIONAL_BY_PK = gql`
      mutation UPDATE_ART_TRADITIONAL_BY_PK($id: Int!, $artwork_name: String!, $artwork_year: Int!, $current_price: Int!, $description: String!, $disabled: Boolean!, $fk_medium_type_id: Int!, $height: numeric!, $width: numeric!, $artwork_image_url: String!, $description_mm: String!, $artwork_name_mm: String!) {
            update_traditional_art_work_by_pk(pk_columns: {id: $id}, _set: {artwork_name: $artwork_name, artwork_year: $artwork_year, current_price: $current_price, description: $description, disabled: $disabled, fk_medium_type_id: $fk_medium_type_id, height: $height, width: $width, artwork_image_url: $artwork_image_url, description_mm: $description_mm, artwork_name_mm: $artwork_name_mm}) {
                  id
            }
      }    
`;

const UPDATE_ARTSERIES_BY_PK = gql`
      mutation MyMutation($fk_traditional_art_work_id: Int!, $fk_art_series_id: Int!) {
            update_artist_art_series(where: {fk_traditional_art_work_id: {_eq: $fk_traditional_art_work_id}}, _set: {fk_art_series_id: $fk_art_series_id}) {
                  returning {
                        fk_art_series_id
                        id
                  }
            }
      }
`

export { GET_ARTIST_DATA, GET_TRADITIONAL_ARTWORK_BY_ARITSTID, GET_ARTWORK_DIMENSION, GET_ART_SERIES_BY_ARTIST, GET_ARTWORK_MEDIUM_TYPE, GET_IMAGE_UPLOAD_URL, INSERT_ART_TRADITIONAL, INSERT_ARTIST_ART_SERIES, UPDATE_ART_TRADITIONAL_DISABLE_BY_PK, UPDATE_ART_TRADITIONAL_BY_PK, UPDATE_ARTSERIES_BY_PK};