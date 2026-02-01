export const BASE_URL= import.meta.env.VITE_BASE_URL || "http://localhost:8000";

export const API_PATHS={
    AUTH:{
        LOGIN:"/api/v1/auth/login",
        SIGNUP:"/api/v1/auth/signup",
        GET_USER:"/api/v1/auth/getUser",
    },
    ADMIN:{
        STATS:"/api/v1/auth/admin/stats",
        GET_ALL_USERS:"/api/v1/auth/admin/users",
        GET_USER_BY_ID:(id: number) => `/api/v1/auth/admin/users/${id}`,
        UPDATE_USER_ROLE:(id: number) => `/api/v1/auth/admin/users/${id}/role`,
        DELETE_USER:(id: number) => `/api/v1/auth/admin/users/${id}`,
    }
};