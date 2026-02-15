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
    },
    TURFS:{
        GET_ALL:"/api/v1/turfs",
        GET_BY_ID:(id: number) => `/api/v1/turfs/${id}`,
        CREATE:"/api/v1/turfs",
        UPDATE:(id: number) => `/api/v1/turfs/${id}`,
        DELETE:(id: number) => `/api/v1/turfs/${id}`,
        ADMIN_ALL:"/api/v1/turfs/admin/all",
        MY_TURFS:"/api/v1/turfs/admin/my-turfs",
    },
    BOOKINGS:{
        CREATE:"/api/v1/bookings",
        GET_SLOTS:"/api/v1/bookings/slots",
        MY_BOOKINGS:"/api/v1/bookings/my-bookings",
        CANCEL:(id: number) => `/api/v1/bookings/${id}/cancel`,
        ADMIN_ALL:"/api/v1/bookings/admin/all",
        ADMIN_UPDATE_STATUS:(id: number) => `/api/v1/bookings/admin/${id}/status`,
        ADMIN_STATS:"/api/v1/bookings/admin/stats",
    }
};