//見た目　UIの部品
import {
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { useNavigate } from "react-router-dom";

import type { Task } from "../types/task";

import {
  getDeadlineColor,
  getRemainingDays,
} from "../utils/deadline";

export default function TaskCard({
  task,
}: {
  task: Task;
}) {

  const navigate = useNavigate();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  return (
    <div
      data-testid={`task-${task.id}`}
      ref={setNodeRef}
      style={{
        transform:
          CSS.Transform.toString(
            transform
          ),
        transition,
        opacity: isDragging ? 0.5 : 1,
        borderLeft: `5px solid ${getDeadlineColor(
          task.deadline
        )}`,
        cursor: "pointer",
      }}
      className="p-3 bg-white rounded shadow-sm mb-3"
      onClick={() =>
        navigate(`/taskedit/${task.id}`)
      }
    >
      <div className="d-flex justify-content-between">

        <h6 className="fw-bold text-truncate">
          {task.title}
        </h6>

        <span
          className={`badge ${
            task.status === "done"
              ? "bg-success"
              : task.status === "doing"
              ? "bg-warning text-dark"
              : "bg-secondary"
          }`}
        >
          {task.status === "done"
            ? "完了"
            : task.status === "doing"
            ? "進行中"
            : "未着手"}
        </span>

      </div>

      <p className="text-muted small mt-2">
        {task.description}
      </p>

      <div className="d-flex justify-content-between small">

        <span
          style={{
            color: getDeadlineColor(
              task.deadline
            ),
            fontWeight: 600,
          }}
        >
          {getRemainingDays(
            task.deadline
          )}
        </span>

        <span
          {...attributes}
          {...listeners}
          style={{
            cursor: "grab",
            fontSize: "18px",
          }}
        >
          ⋮⋮
        </span>

      </div>
    </div>
  );
}