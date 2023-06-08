import {gql} from "@apollo/client";

const ADMIN_LOGIN = gql`
    mutation ADMIN_LOGIN($password: String!, $phone: String!, $username: String = "") {
          AdminLogIn(password: $password, phone: $phone, username: $username) {
                accessToken
                error
                message
          }
    }
`;

export { ADMIN_LOGIN };