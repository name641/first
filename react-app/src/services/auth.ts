import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL;

export const registerUser = (
    name: string,
    email: string,
    password: string
) => {
    return axios.post(
        `${API_URL}/users`,
        {
            name,
            email,
            password,
        }
    );
};

export const loginUser = (
    email: string,
    password: string
) => {
    return axios.post(
        `${API_URL}/login`,
        {
            email,
            password,
        }
    );
};