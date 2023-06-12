import { ApolloProvider } from "@apollo/client";
import { client } from "./hasura/config";
import MainRouters from "./router/MainRouters";
import { AlertContextProvider } from "./context/AlertContext";
import { AuthContextProvider } from "./context/AuthContext";
import { NavContextProvider } from "./context/NavContext";

function App() {
    return ( 
        <ApolloProvider client = { client } >
            <AuthContextProvider >
                <NavContextProvider >
                    <AlertContextProvider >
                        <MainRouters/>
                    </AlertContextProvider> 
                </NavContextProvider> 
            </AuthContextProvider> 
        </ApolloProvider>
    );
}

export default App;