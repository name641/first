
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
};

export default function Page() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "TEST TASK",
      description: "debug test",
    },
    {
      id: 2,
      title: "Login UI作成",
      description: "Google風UIで作る",
    },
    {
      id: 3,
      title: "API接続",
      description: "axiosで接続確認",
    },
  ]);

  // DBから取得（例）
  useEffect(() => {
    fetch("http://localhost:8000/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data) 
      })
      .catch(() => {
        // 失敗してもダミー継続
      });
  }, []);

  // 🔍 検索フィルター
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="navbar navbar-dark bg-dark px-3">

        {/* 左：ブランド */}
        <a className="navbar-brand fw-bold" href="#">
          MyApp
        </a>

        {/* 中：検索 */}
        <input
          className="form-control w-50"
          placeholder="タスクを検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 右：ボタン */}
        <div className="d-flex gap-2">

          <button className="btn btn-success btn-sm">
            + New Task
          </button>

          <button
            className="navbar-toggler"
            onClick={() => setOpen(true)}
          >
            <span className="navbar-toggler-icon" />
          </button>

        </div>

      </header>

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

            <a className="list-group-item list-group-item-action bg-dark text-white">
              📋 Tasks
            </a>

            <a className="list-group-item list-group-item-action bg-dark text-white">
              📊 Dashboard
            </a>

            <a className="list-group-item list-group-item-action bg-dark text-white">
              ⚙ Settings
            </a>

            <a className="list-group-item list-group-item-action bg-dark text-danger">
              🚪 Logout
            </a>

          </div>

        </div>
      </div>

      {/* backdrop */}
      {open && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= BODY ================= */}
      <div className="container py-5">

        <h4 className="mb-4">📋 Task List</h4>

        <div className="row g-4">

          {filteredTasks.map((task, index) => (
            <div className="col-12 col-md-4" key={task.id}>

              <div className="card h-100 shadow-sm border-0">

                <div className="card-body">

                  {/* 🔢 連番表示（DBのidじゃなく表示順） */}
                  <span className="badge bg-secondary mb-2">
                    #{index + 1}
                  </span>

                  <h5 className="card-title fw-bold">
                    {task.title}
                  </h5>

                  <p className="card-text text-muted">
                    {task.description}
                  </p>

                  <span className="badge bg-primary">
                    Task
                  </span>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </>
  );
}


