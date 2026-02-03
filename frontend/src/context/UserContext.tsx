import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface User {
    id: number;
    fullname: string;
    email: string;
    profileImageUrl?: string | null;
    role: "user" | "admin";
}

interface UserContextType {
    user: User | null;
    updateUser: (userData: User) => void;
    clearUser: () => void;
    isAdmin: () => boolean;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    updateUser: () => {},
    clearUser: () => {},
    isAdmin: () => false,
});

const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user,setUser]=useState<User | null>(null);

    const updateUser=(userData: User)=>{
        setUser(userData);
    };

    const clearUser=()=>{
        setUser(null);
    };

    const isAdmin = () => {
        return user?.role === "admin";
    };

    return(
        <UserContext.Provider
        value={{user,updateUser,clearUser,isAdmin}}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;