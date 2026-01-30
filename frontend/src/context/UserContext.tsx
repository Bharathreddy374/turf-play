
import { createContext, useState, ReactNode } from "react";

interface User {
    id: number;
    fullname: string;
    email: string;
    profileImageUrl?: string | null;
}

interface UserContextType {
    user: User | null;
    updateUser: (userData: User) => void;
    clearUser: () => void;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    updateUser: () => {},
    clearUser: () => {},
});

const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user,setUser]=useState<User | null>(null);

    const updateUser=(userData: User)=>{
        setUser(userData);
    };


    const clearUser=()=>{
        setUser(null);
    };
    return(
        <UserContext.Provider
        value={{user,updateUser,clearUser,}}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;