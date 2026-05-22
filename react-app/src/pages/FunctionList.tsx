import "bootstrap/dist/css/bootstrap.min.css";
import "../css/FunctionList.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Task = {
  id: number;
  title: string;
  description: string;
  deadline?: string | null;
  status?: "todo" | "doing" | "done";
};

export default function Page() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [deadlineFilter, setDeadlineFilter] = useState("all"); // ★変更
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<any>(null);

  const navigate = useNavigate();

  // ======================
  // tasks取得
  // ======================
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8000/api/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  }, []);

  // ======================
  // user取得
  // ======================
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, []);

  // ======================
  // search + deadline filter
  // ======================
  const filteredTasks = tasks.filter((task) => {
    const matchSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    if (deadlineFilter === "all") return true;

    if (!task.deadline) return false;

    const today = new Date();
    const d = new Date(task.deadline);

    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);

    const diff = Math.ceil(
      (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (deadlineFilter === "overdue") return diff < 0;
    if (deadlineFilter === "today") return diff === 0;
    if (deadlineFilter === "future") return diff > 0;

    return true;
  });

  // ======================
  // statusで分割（Trello）
  // ======================
  const todoTasks = filteredTasks.filter((t) => t.status === "todo");
  const doingTasks = filteredTasks.filter((t) => t.status === "doing");
  const doneTasks = filteredTasks.filter((t) => t.status === "done");

  // ======================
  // utils
  // ======================
  const getDeadlineColor = (deadline?: string | null) => {
    if (!deadline) return "#6c757d";

    const today = new Date();
    const d = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);

    if (d < today) return "#dc3545";
    if (d.getTime() === today.getTime()) return "#ffc107";
    return "#198754";
  };

  const getRemainingDays = (deadline?: string | null) => {
    if (!deadline) return null;

    const today = new Date();
    const d = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);

    const diff = Math.ceil(
      (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff < 0) return "期限切れ";
    if (diff === 0) return "今日";
    return `あと${diff}日`;
  };

  const goCreateTask = () => navigate("/taskscreate");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ======================
  // Card
  // ======================
  const TaskCard = ({ task }: { task: Task }) => (
    <div
      className="p-3 bg-white rounded shadow-sm mb-3"
      style={{
        borderLeft: `5px solid ${getDeadlineColor(task.deadline)}`,
        cursor: "pointer",
      }}
      onClick={() => navigate(`/taskedit/${task.id}`)}
    >
      <div className="d-flex justify-content-between">
        <h6 className="fw-bold">{task.title}</h6>

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

      <p className="text-muted small mt-2">{task.description}</p>

      <div className="d-flex justify-content-between small">
        <span>📅 {task.deadline ?? "未設定"}</span>
        <span style={{ color: getDeadlineColor(task.deadline), fontWeight: 600 }}>
          {getRemainingDays(task.deadline)}
        </span>
      </div>
    </div>
  );

  // ======================
  // Column
  // ======================
  const Column = ({
    title,
    tasks,
    color,
  }: {
    title: string;
    tasks: Task[];
    color: string;
  }) => (
    <div className="col-md-4">
      <div
        className="p-3 rounded"
        style={{ background: "#f5f7fb", minHeight: "80vh" }}
      >
        <h5 className="mb-3 d-flex align-items-center gap-2">
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: color,
              display: "inline-block",
            }}
          />
          {title} ({tasks.length})
        </h5>

        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="d-flex justify-content-between align-items-center px-4 py-3 bg-dark text-white">
        <h4
          className="m-0"
          onClick={() => navigate("/functionlist")}
          style={{ cursor: "pointer" }}
        >
          MyApp
        </h4>

        <div className="d-flex align-items-center gap-3">
          <span className="small text-light">{user?.name}</span>

          <button className="btn btn-success btn-sm" onClick={goCreateTask}>
            + New Task
          </button>

          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* ================= FILTER ================= */}
      <div className="d-flex gap-2 p-3 bg-white border-bottom">
        <input
          className="form-control"
          placeholder="タスクを検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ★ここが変更 */}
        <select
          className="form-select w-auto"
          value={deadlineFilter}
          onChange={(e) => setDeadlineFilter(e.target.value)}
        >
          <option value="all">全て</option>
          <option value="overdue">期限切れ</option>
          <option value="today">今日</option>
          <option value="future">今後のタスク</option>
        </select>
      </div>

      {/* ================= BOARD ================= */}
      <div className="container-fluid py-4">
        <div className="row g-3">
          <Column title="TODO" tasks={todoTasks} color="#6c757d" />
          <Column title="DOING" tasks={doingTasks} color="#ffc107" />
          <Column title="DONE" tasks={doneTasks} color="#198754" />
        </div>
      </div>

      {/* ================= OFFCANVAS ================= */}
      <div
        className={`offcanvas offcanvas-end text-bg-dark ${
          open ? "show" : ""
        }`}
        style={{
          visibility: open ? "visible" : "hidden",
          width: "260px",
        }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menu</h5>
          <button
            className="btn-close btn-close-white"
            onClick={() => setOpen(false)}
          />
        </div>

        <div className="offcanvas-body">
          <div className="list-group list-group-flush">
            <a
              className="list-group-item list-group-item-action bg-dark text-white"
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer" }}
            >
              👤 Profile
            </a>

            <a
              className="list-group-item list-group-item-action bg-dark text-danger"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              🚪 Logout
            </a>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}