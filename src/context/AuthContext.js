import { createContext, useState } from "react";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [artistId, setArtistId] = useState(null);

    return (
        <AuthContext.Provider value={{ userId, setUserId, artistId, setArtistId }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
export { AuthContextProvider };
