import { createContext, useState } from "react";

const NavContext = createContext();

const NavContextProvider = ({ children }) => {
    const [nav, setNav] = useState("");

    return (
        <NavContext.Provider value={{ nav, setNav}}>
            {children}
        </NavContext.Provider>
    );
};

export default NavContext;
export { NavContextProvider };
