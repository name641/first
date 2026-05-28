import {
    useEffect,
    useState,
} from "react";

import type {
    Task,
} from "../types/task";

const API_URL =
    import.meta.env.VITE_API_URL;

export default function useTasks(
    navigate: (
        path: string
    ) => void
) {

    const [tasks, setTasks] =
        useState<Task[]>([]);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const fetchTasks =
            async () => {

                try {

                    const token =
                        localStorage.getItem(
                            "token"
                        );

                    const res =
                        await fetch(
                            `${API_URL}/tasks`,
                            {
                                headers: {
                                    "Content-Type":
                                        "application/json",
                                    Accept:
                                        "application/json",
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );

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

                    setTasks(data);

                } catch {

                    setError(
                        "タスクの取得に失敗しました"
                    );

                }

            };

        fetchTasks();

    }, [navigate]);

    return {
        tasks,
        setTasks,
        taskError: error,
    };
}