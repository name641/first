import "bootstrap/dist/css/bootstrap.min.css";
import "../css/FunctionList.css";
import Column from "../components/Column";
import useTasks from "../hooks/useTasks";
import useUser from "../hooks/useUser";
import Header from "../components/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DragEndEvent } from "@dnd-kit/core";
import { reorderTask } from "../services/task";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  filterTasks,
} from "../utils/filterTasks";

import {
  reorderTasks,
} from "../utils/dragAndDrop";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [deadlineFilter, setDeadlineFilter] =
    useState("all");

  // ======================
  // DnD
  // ======================

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const navigate = useNavigate();
  const {
    tasks,
    setTasks,
    taskError,
  } = useTasks(navigate);

  const {
    user,
    userError,
  } = useUser(navigate);

  const filteredTasks =
    filterTasks(
      tasks,
      search,
      deadlineFilter
    );

  const todoTasks =
    filteredTasks.filter(
      (t) =>
        t.status === "todo"
    );

  const doingTasks =
    filteredTasks.filter(
      (t) =>
        t.status === "doing"
    );

  const doneTasks =
    filteredTasks.filter(
      (t) =>
        t.status === "done"
    );

  // ======================
  // Drag
  // ======================
  const handleDragEnd = async (
    event: DragEndEvent
  ) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = Number(active.id);
    const overId = over.id;

    const updatedTasks =
      reorderTasks(
        tasks,
        activeId,
        overId
      );

    setTasks(updatedTasks);

    // ↓ DB保存処理追加
    try {
      const token =
        localStorage.getItem("token");

      const payload =
        updatedTasks.map((task) => ({
          id: Number(task.id),
          status: task.status,
          order:
            updatedTasks
              .filter(
                (t) =>
                  t.status === task.status
              )
              .findIndex(
                (t) =>
                  t.id === task.id
              ),
        }));
      await reorderTask(
        payload,
        token || ""
      );
    } catch (err) {
      console.error(
        "保存失敗",
        err
      );
    }
  };
  const goCreateTask =
    () =>
      navigate(
        "/taskscreate"
      );

  const handleLogout =
    () => {
      localStorage.removeItem(
        "token"
      );

      navigate("/");
    };

  return (
    <div
      className="d-flex  flex-wrap flex-column min-vh-100"
    >
      {(taskError || userError) && (
        <div
          role="alert"
          className="alert alert-danger m-3"
        >
          {taskError || userError}
        </div>
      )}
      <Header
        userName={user?.name}
        showNewTask
        showMenu
        onNewTask={goCreateTask}
        onMenu={() => setOpen(true)}
      />

      <div className="d-flex flex-column flex-md-row gap-2 p-3 bg-white border-bottom">

        <input
          data-testid="search-input"
          className="form-control"
          placeholder="タスクを検索..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <select
          data-testid="deadline-filter"
          className="form-select w-auto"
          value={
            deadlineFilter
          }
          onChange={(e) =>
            setDeadlineFilter(
              e.target.value
            )
          }
        >
          <option value="all">
            全て
          </option>

          <option value="overdue">
            期限切れ
          </option>

          <option value="today">
            今日
          </option>

          <option value="future">
            今後のタスク
          </option>

        </select>

      </div>

      <div className="flex-grow-1">

        {tasks.length === 0 ? (

          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ minHeight: "60vh" }}
          >
            <h5>タスクがありません</h5>

            <p className="text-muted">
              「+ New Task」から追加してください
            </p>
            <button
              data-testid="empty-new-task-button"
              className="btn btn-success"
              onClick={goCreateTask}
            >
              + New Task
            </button>

          </div>

        ) : (

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="container-fluid py-4">

              <div className="row g-3">

                <Column
                  title="TODO"
                  tasks={todoTasks}
                  color="#6c757d"
                  status="todo"
                />

                <Column
                  title="DOING"
                  tasks={doingTasks}
                  color="#ffc107"
                  status="doing"
                />

                <Column
                  title="DONE"
                  tasks={doneTasks}
                  color="#198754"
                  status="done"
                />

              </div>

            </div>

          </DndContext>

        )}

      </div>
      <div
        className={`offcanvas offcanvas-end text-bg-dark ${open
          ? "show"
          : ""
          }`}
        style={{
          visibility:
            open
              ? "visible"
              : "hidden",
          width:
            "260px",
        }}
      >
        <div className="offcanvas-header">

          <h5 className="offcanvas-title">
            Menu
          </h5>

          <button
            className="btn-close btn-close-white"
            onClick={() =>
              setOpen(
                false
              )
            }
          />

        </div>

        <div className="offcanvas-body">

          <div className="list-group list-group-flush">

            <button
              className="list-group-item list-group-item-action bg-dark text-white"
              onClick={() =>
                navigate(
                  "/profile"
                )
              }
            >
              👤 Profile
            </button>

            <button
              className="list-group-item list-group-item-action bg-dark text-danger"
              onClick={
                handleLogout
              }
            >
              🚪 Logout
            </button>

          </div>

        </div>
      </div>

      {open && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() =>
            setOpen(
              false
            )
          }
        />
      )}

      <footer
        className=" navbar-dark text-center py-3 border-top"
        style={{
          backgroundColor: "#1f2937",
          color: "white"
        }}
      >
        <div>Task Management App</div>

        <small>
          React + TypeScript + Laravel + MySQL
        </small>
      </footer>
    </div>
  );
}