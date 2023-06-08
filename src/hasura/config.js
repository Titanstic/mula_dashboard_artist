import {setContext} from "@apollo/client/link/context";
import {onError} from "@apollo/client/link/error";
import {ApolloClient, HttpLink, InMemoryCache} from "@apollo/client";
import {decodeUserToken} from "../composable/login";

const authLink = setContext(( _ , { headers }) => {
    let userData = decodeUserToken();
    return{
        headers: {
            ...headers,
            authorization: userData ? `Bearer ${userData.token}` : null,
            "x-hasura-admin-secret": "mula is very good",
        }
    };
});

const errorLink = onError(({graphQLErrors, networkError}) => {
    if(graphQLErrors) {
        graphQLErrors.forEach(({extensions}) => {
            if(extensions.code === "invalid-headers" || extensions.code === "invalid-jwt"){
                window.localStorage.removeItem("loggedUser");
                window.location.assign(`${window.location.origin}`);
            }
        })
    }

    if(networkError){
        console.log(`[Network error]: ${networkError}`);
        alert("network connection problem");
    }
});

const httpLink = new HttpLink({ uri: "http://146.190.4.124:8080/v1/graphql"});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: errorLink.concat(authLink).concat(httpLink)
});


export { authLink, errorLink, httpLink, client };