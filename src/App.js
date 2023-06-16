import { ApolloProvider } from "@apollo/client";
import { client } from "./hasura/config";
import MainRouters from "./router/MainRouters";
import { AlertContextProvider } from "./context/AlertContext";
import { AuthContextProvider } from "./context/AuthContext";
import { NavContextProvider } from "./context/NavContext";
import { GqlContextProvider } from "./context/GqlContext";

function App() {
    return ( 
        <ApolloProvider client = { client } >
            <AuthContextProvider >
                <GqlContextProvider>
                    <NavContextProvider >
                        <AlertContextProvider >
                            <MainRouters/>
                        </AlertContextProvider> 
                    </NavContextProvider> 
                </GqlContextProvider>
            </AuthContextProvider> 
        </ApolloProvider>
    );
}

export default App;