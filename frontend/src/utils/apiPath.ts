export const BASE_URL= import.meta.env.VITE_BASE_URL || "http://localhost:8000";

export const API_PATHS={
    AUTH:{
        LOGIN:"/api/v1/auth/login",
        SIGNUP:"/api/v1/auth/signup",
        GET_USER:"/api/v1/auth/getUser",
    }
};