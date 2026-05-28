//計算だけ　Utils関数
import { arrayMove } from "@dnd-kit/sortable";

import type {
    Task,
} from "../types/task";

export function reorderTasks(
    tasks: Task[],
    activeId: number,
    overId: string | number
) {

    const activeTask =
        tasks.find(
            (t) =>
                t.id === activeId
        );

    if (!activeTask)
        return tasks;

    let newStatus =
        activeTask.status;

    if (
        overId === "todo" ||
        overId === "doing" ||
        overId === "done"
    ) {

        newStatus =
            overId as Task["status"];

    } else {

        const overTask =
            tasks.find(
                (t) =>
                    t.id === Number(overId)
            );

        if (overTask) {
            newStatus =
                overTask.status;
        }
    }

    let updatedTasks =
        tasks.map(
            (task) =>
                task.id === activeId
                    ? {
                        ...task,
                        status: newStatus,
                    }
                    : task
        );

    const oldIndex =
        updatedTasks.findIndex(
            (t) =>
                t.id === activeId
        );

    let newIndex =
        oldIndex;

    if (
        overId !== "todo" &&
        overId !== "doing" &&
        overId !== "done"
    ) {

        newIndex =
            updatedTasks.findIndex(
                (t) =>
                    t.id === Number(overId)
            );
    }

    return arrayMove(
        updatedTasks,
        oldIndex,
        newIndex
    );
}