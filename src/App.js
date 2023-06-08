import {ApolloProvider} from "@apollo/client";
import {client} from "./hasura/config";
import MainRouters from "./router/MainRouters";
import {AlertContextProvider} from "./context/AlertContext";
import {AuthContextProvider} from "./context/AuthContext";

function App() {
      return (
          <ApolloProvider client={client}>
              <AuthContextProvider>
                  <AlertContextProvider>
                      <MainRouters/>
                  </AlertContextProvider>
              </AuthContextProvider>
          </ApolloProvider>
      );
}

export default App;
