import api from "../lib/axios";

export const registerUser = (
    name: string,
    email: string,
    password: string
) => {
    return api.post(
        "/users",
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
    return api.post(
        "/login",
        {
            email,
            password,
        }
    );
};