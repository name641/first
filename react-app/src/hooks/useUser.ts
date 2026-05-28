import {
    useEffect,
    useState,
} from "react";

import type {
    NavigateFunction,
} from "react-router-dom";

import type {
    User,
} from "../types/task";

const API_URL =
    import.meta.env.VITE_API_URL;

export default function useUser(
    navigate: NavigateFunction
) {

    const [user, setUser] =
        useState<User | null>(null);

    const [userError, setUserError] =
        useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                const res = await fetch(
                    `${API_URL}/me`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                // ログイン切れ
                if (
                    res.status === 401
                ) {
                    localStorage.removeItem(
                        "token"
                    );

                    navigate("/");
                    return;
                }

                if (!res.ok)
                    throw new Error();

                const data =
                    await res.json();

                setUser(data);

            } catch {

                setUserError(
                    "ユーザー情報の取得に失敗しました"
                );

            }
        };

        fetchUser();

    }, [navigate]);

    return {
        user,
        userError,
    };
}