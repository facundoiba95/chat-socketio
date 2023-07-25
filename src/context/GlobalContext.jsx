import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalContextProvider = ({children}) => {
    const [ message, setMessage ] = useState('');
    const [ listMessages, setListMessages ] = useState([]);
    const [ user, setUser ] = useState('');
    const [ usersOnline, setUsersOnline ] = useState([]);

    return (
        <GlobalContext.Provider value={{
            message, setMessage,
            listMessages, setListMessages,
            user,setUser,
            usersOnline, setUsersOnline
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

