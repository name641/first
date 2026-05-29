import api from "../lib/axios";

// ======================
// user取得
// ======================
export const getMe = async () => {

    const response =
        await api.get(
            "/me",
        );

    return response.data;
};

// ======================
// task取得
// ======================
export const getTask = async (
    id: string,
) => {

    const response =
        await api.get(
            `/tasks/${id}`,
            {
                headers: {
                    Accept:
                        "application/json",
                },
            }
        );

    return response.data;
};

// ======================
// update
// ======================
export const updateTask =
    async (
        id: string,
        body: object
    ) => {

        return api.put(
            `/tasks/${id}`,
            body,
        );
    };

// ======================
// delete
// ======================
export const deleteTask =
    async (
        id: string,
    ) => {

        return api.delete(
            `/tasks/${id}`,
        );
    };