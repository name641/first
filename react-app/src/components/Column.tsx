import {
    useDroppable,
} from "@dnd-kit/core";

import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskCard from "./TaskCard";

import type { Task } from "../types/task";



export default function Column({
    title,
    tasks,
    color,
    status,
}: {
    title: string;
    tasks: Task[];
    color: string;
    status:
    | "todo"
    | "doing"
    | "done";
}) {

    const {
        setNodeRef,
        isOver,
    } = useDroppable({
        id: status,
    });

    return (
        <div className="col-md-4">

            <div
                ref={setNodeRef}
                className="p-3 rounded task-column"
                style={{
                    background:
                        isOver
                            ? "#e9f2ff"
                            : "#f5f7fb",
                    transition: "0.2s",
                }}
            >

                <h5 className="mb-3 d-flex align-items-center gap-2">

                    <span
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius:
                                "50%",
                            background:
                                color,
                        }}
                    />

                    {title} (
                    {tasks.length})

                </h5>

                <SortableContext
                    items={tasks.map(
                        (t) =>
                            t.id
                    )}
                    strategy={
                        verticalListSortingStrategy
                    }
                >

                    {tasks.map(
                        (
                            task
                        ) => (
                            <TaskCard
                                key={
                                    task.id
                                }
                                task={
                                    task
                                }
                            />
                        )
                    )}

                </SortableContext>

            </div>
        </div>
    );
}