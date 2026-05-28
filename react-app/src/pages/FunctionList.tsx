import "bootstrap/dist/css/bootstrap.min.css";
import "../css/FunctionList.css";
import Column from "../components/Column";
import useTasks from "../hooks/useTasks";
import useUser from "../hooks/useUser";
// useEffect,
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type { DragEndEvent } from "@dnd-kit/core";

// import {
//   arrayMove,
// } from "@dnd-kit/sortable";

// import type {
//   // Task,
//   User,
// } from "../types/task";

import {
  filterTasks,
} from "../utils/filterTasks";

import {
  reorderTasks,
} from "../utils/dragAndDrop";

const API_URL =
  import.meta.env.VITE_API_URL;

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

  // const [user, setUser] =
  //   useState<User | null>(null);

  const navigate = useNavigate();
  const {
    tasks,
    setTasks,
    taskError,
  } = useTasks(navigate);

  // const [error, setError] =
  //   useState("");
  const {
    user,
    userError,
  } = useUser(navigate);
  // ======================
  // user取得
  // ======================

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const token =
  //         localStorage.getItem("token");

  //       const res = await fetch(
  //         `${API_URL}/me`,
  //         {
  //           headers: {
  //             Authorization:
  //               `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       // ログイン切れ
  //       if (
  //         res.status === 401
  //       ) {
  //         localStorage.removeItem(
  //           "token"
  //         );

  //         navigate("/");
  //         return;
  //       }

  //       if (!res.ok)
  //         throw new Error();

  //       const data =
  //         await res.json();

  //       setUser(data);

  //     } catch {

  //       setError(
  //         "ユーザー情報の取得に失敗しました"
  //       );

  //     }
  //   };

  //   fetchUser();

  // }, [navigate]);
  // ======================
  // filter
  // ======================

  // const filteredTasks = tasks.filter(
  //   (task) => {
  //     const matchSearch =
  //       task.title
  //         .toLowerCase()
  //         .includes(search.toLowerCase()) ||
  //       task.description
  //         .toLowerCase()
  //         .includes(search.toLowerCase());

  //     if (!matchSearch)
  //       return false;

  //     if (deadlineFilter === "all")
  //       return true;

  //     if (!task.deadline)
  //       return false;

  //     const today =
  //       new Date();

  //     const d = new Date(
  //       task.deadline
  //     );

  //     today.setHours(
  //       0,
  //       0,
  //       0,
  //       0
  //     );

  //     d.setHours(
  //       0,
  //       0,
  //       0,
  //       0
  //     );

  //     const diff =
  //       Math.ceil(
  //         (d.getTime() -
  //           today.getTime()) /
  //         (1000 *
  //           60 *
  //           60 *
  //           24)
  //       );

  //     if (
  //       deadlineFilter ===
  //       "overdue"
  //     )
  //       return diff < 0;

  //     if (
  //       deadlineFilter ===
  //       "today"
  //     )
  //       return diff === 0;

  //     if (
  //       deadlineFilter ===
  //       "future"
  //     )
  //       return diff > 0;

  //     return true;
  //   }
  // );
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
    // const activeTask = tasks.find(
    //   (t) => t.id === activeId
    // );

    // if (!activeTask) return;

    // let newStatus = activeTask.status;

    // // status取得
    // if (
    //   overId === "todo" ||
    //   overId === "doing" ||
    //   overId === "done"
    // ) {
    //   newStatus =
    //     overId as Task["status"];
    // } else {
    //   const overTask = tasks.find(
    //     (t) => t.id === Number(overId)
    //   );

    //   if (overTask) {
    //     newStatus = overTask.status;
    //   }
    // }

    // // status更新
    // let updatedTasks = tasks.map(
    //   (task) =>
    //     task.id === activeId
    //       ? {
    //         ...task,
    //         status: newStatus,
    //       }
    //       : task
    // );

    // const oldIndex =
    //   updatedTasks.findIndex(
    //     (t) => t.id === activeId
    //   );

    // let newIndex = oldIndex;

    // if (
    //   overId !== "todo" &&
    //   overId !== "doing" &&
    //   overId !== "done"
    // ) {
    //   newIndex =
    //     updatedTasks.findIndex(
    //       (t) =>
    //         t.id === Number(overId)
    //     );
    // }

    // updatedTasks = arrayMove(
    //   updatedTasks,
    //   oldIndex,
    //   newIndex
    // );

    setTasks(updatedTasks);

    // ↓ DB保存処理追加
    try {
      const token =
        localStorage.getItem("token");

      const payload =
        updatedTasks.map(
          (task) => ({
            id: task.id,
            status: task.status,
            order:
              updatedTasks
                .filter(
                  t =>
                    t.status === task.status
                )
                .findIndex(
                  t =>
                    t.id === task.id
                )
          }))
      await fetch(
        `${API_URL}/tasks/reorder`,
        {
          method: "PUT", // ← POSTから変更
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify(
            payload
          ),
        }
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
      <header
        className="navbar navbar-dark py-4"
        style={{ backgroundColor: "#1f2937" }}
      >
        <div className="container-fluid px-3 d-flex justify-content-between align-items-center">

          <a
            className="navbar-brand fw-bold m-0 cat-logo"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/functionlist")}
          >
            MyApp
          </a>

          <div className="d-flex align-items-center gap-3">

            <div
              className="d-flex align-items-center gap-2 px-2 py-1 rounded"
              style={{
                backgroundColor: "#374151",
                cursor: "pointer"
              }}
              onClick={() => navigate("/profile")}
            >
              <i className="bi bi-person-circle" />
              <span style={{ color: "white", fontSize: "18px" }}>
                {user?.name}
              </span>
            </div>
            <button
              data-testid="header-new-task-button"
              className="btn btn-success btn-sm"
              onClick={goCreateTask}
            >
              + New Task
            </button>
            <button
              data-testid="menu-button"
              className="navbar-toggler"
              onClick={() => setOpen(true)}
            >
              <span className="navbar-toggler-icon" />
            </button>

          </div>
        </div>
      </header>

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