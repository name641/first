import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL;

/* ======================
   GET ME
====================== */
export const getMe = (token: string) => {
    return axios.get(`${API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

/* ======================
   UPDATE PROFILE
====================== */
export const updateProfile = (
    data: {
        name: string;
        email: string;
        password?: string | null;
    },
    token: string
) => {
    return axios.put(
        `${API_URL}/profile`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

/* ======================
   DELETE PROFILE
====================== */
export const deleteProfile = (token: string) => {
    return axios.delete(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
