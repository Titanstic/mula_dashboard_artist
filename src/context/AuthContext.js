import { createContext, useState } from "react";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    const [artistId, setArtistId] = useState(null);

    return (
        <AuthContext.Provider value={{ role, setRole, artistId, setArtistId }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
export { AuthContextProvider };
