import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  name: string;
};

const TasksCreate = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const [status, setStatus] = useState<"todo" | "doing" | "done">("todo");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // ======================
  // 👇ここが追加部分（useEffect）
  // ======================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("tokenなし");
      return;
    }

    fetch("http://localhost:8000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("auth error");
        }
        return res.json();
      })
      .then((data) => {
        console.log("user:", data);
        setUser(data);
      })
      .catch((err) => {
        console.error("me API error:", err);
      });
  }, []);

  // ======================
  // logout
  // ======================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ======================
  // deadline色判定
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

  // ======================
  // 残り日数
  // ======================
  const getRemainingDays = (deadline?: string | null) => {
    if (!deadline) return "未設定";

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

  // ======================
  // 作成
  // ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          deadline: deadline || null,
          status,
        }),
      });

      if (!response.ok) throw new Error();

      navigate("/functionlist");
    } catch {
      setError("タスク作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className="navbar navbar-dark py-4"
        style={{ backgroundColor: "#1f2937" }}
      >
        <div className="container-fluid px-3 d-flex justify-content-between align-items-center">
          <a
            className="navbar-brand fw-bold m-0"
            onClick={() => navigate("/functionlist")}
            style={{ cursor: "pointer" }}
          >
            MyApp
          </a>

          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center gap-2 px-2 py-1 rounded"
              style={{ backgroundColor: "#374151", cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            >
              <i className="bi bi-person-circle" />
              <span style={{ color: "white" }}>
                {user?.name}
              </span>
            </div>

            <button
              className="navbar-toggler"
              onClick={() => setOpen(true)}
            >
              <span className="navbar-toggler-icon" />
            </button>
          </div>
        </div>
      </header>

      {/* 以下省略（元のUIそのままでOK） */}
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
              onClick={() => navigate("/functionlist")}
              style={{ cursor: "pointer" }}
            >
              📋 Tasks
            </a>

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

      {/* ================= BODY ================= */}
      <div
        className="container-fluid py-5"
        style={{
          backgroundColor: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        <div className="row justify-content-center">

          <div className="col-12 col-md-6 col-lg-5">

            <div
              className="card border-0 mx-auto"
              style={{
                maxWidth: "500px",
                width: "100%",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderLeft: `6px solid ${getDeadlineColor(deadline)}`,
              }}
            >

              <div className="card-body p-4">
                <h4 className="mb-3 fw-bold">
                  ➕ Create Task
                </h4>

                {error && (
                  <div className="alert alert-danger py-2">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  <input
                    className="form-control mb-3"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />

                  <textarea
                    className="form-control mb-3"
                    rows={5}
                    placeholder="Description"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    required
                  />

                  <input
                    type="date"
                    className="form-control mb-2"
                    value={deadline}
                    onChange={(e) =>
                      setDeadline(e.target.value)
                    }
                  />

                  {/* ★ STATUS追加（UI崩さない） */}
                  <select
                    className="form-control mb-2"
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as
                          | "todo"
                          | "doing"
                          | "done"
                      )
                    }
                  >
                    <option value="todo">未着手</option>
                    <option value="doing">進行中</option>
                    <option value="done">完了</option>
                  </select>

                  <small
                    style={{
                      color: getDeadlineColor(deadline),
                      fontWeight: "bold",
                    }}
                  >
                    {getRemainingDays(deadline)}
                  </small>

                  <div className="d-flex justify-content-between mt-4">

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        navigate("/functionlist")
                      }
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      className="btn btn-success px-4"
                      disabled={loading}
                    >
                      {loading
                        ? "Creating..."
                        : "Create"}
                    </button>

                  </div>

                </form>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default TasksCreate;