import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL;
type User = {
  name: string;
};

const TaskEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<string>("");
  const [status, setStatus] = useState<"todo" | "doing" | "done">("todo");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  // ======================
  // user取得
  // ======================
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error()

        return res.json()
      })
      .then((data) =>
        setUser(data)
      )
      .catch(() =>
        setError(
          'ユーザー取得失敗'
        )
      )
  }, []);

  // ======================
  // task取得
  // ======================
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/tasks/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setDeadline(data.deadline || "");
        setStatus(data.status || "todo"); // ★追加
      })
      .catch(() => setError("取得失敗"))
      .finally(() => setLoading(false));
  }, [id]);

  // ======================
  // update
  // ======================
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        deadline: deadline || null,
        status, // ★追加
      }),
    });

    if (res.ok) {
      navigate("/functionlist");
    } else {
      setError("更新失敗");
    }
  };

  // ======================
  // delete
  // ======================
  const handleDelete = async () => {
    const token =
      localStorage.getItem("token");

    const res = await fetch(
      `${API_URL}/tasks/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      navigate("/functionlist");
    } else {
      setError("削除失敗");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

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
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/functionlist")}
          >
            MyApp
          </a>


          <div className="d-flex align-items-center gap-3">

            <div
              className=" px-2 py-1 rounded"
              style={{
                backgroundColor: "#374151",
                cursor: "pointer"
              }}
              onClick={() => navigate("/profile")}
            >
              <i className="bi bi-person-circle" />
              <span style={{ color: "white" }}>{user?.name}</span>
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

      {/* ================= OFFCANVAS ================= */}
      <div
        className={`offcanvas offcanvas-end text-bg-dark ${open ? "show" : ""}`}
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
        style={{ backgroundColor: "#f5f7fb", minHeight: "100vh" }}
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
              }}
            >
              <div className="card-body p-4">

                <h4 className="mb-3 fw-bold">✏️ Edit Task</h4>


                {error && (
                  <div
                    role="alert"
                    className="alert alert-danger py-2"
                  >
                    {error}
                  </div>
                )}


                <form onSubmit={handleUpdate}>

                  <input
                    className="form-control mb-3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                  />

                  <textarea
                    className="form-control mb-3"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                  />

                  <input
                    type="date"
                    className="form-control mb-3"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />

                  {/* ★ STATUS追加（UI崩さない） */}
                  <select
                    className="form-control mb-4"
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as "todo" | "doing" | "done"
                      )
                    }
                  >
                    <option value="todo">未着手</option>
                    <option value="doing">進行中</option>
                    <option value="done">完了</option>
                  </select>

                  <div className="d-flex justify-content-between">

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate("/functionlist")}
                    >
                      Back
                    </button>

                    <div className="d-flex gap-2">

                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() =>
                          setShowDeleteModal(true)
                        }
                      >
                        Delete
                      </button>

                      <button className="btn btn-primary px-4">
                        Update
                      </button>

                    </div>

                  </div>

                </form>

              </div>
            </div>

          </div>
        </div>
      </div>
      {showDeleteModal && (
        <>
          <div
            className="modal fade show"
            style={{
              display: "block",
              background:
                "rgba(0,0,0,0.5)"
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title text-danger">
                    ⚠ タスク削除
                  </h5>
                </div>

                <div className="modal-body">
                  <p>
                    このタスクを削除します
                  </p>

                  <p className="text-danger small">
                    DELETE を入力してください
                  </p>

                  <input
                    className="form-control"
                    value={deleteText}
                    onChange={(e) =>
                      setDeleteText(
                        e.target.value
                      )
                    }
                    placeholder="DELETE"
                  />
                </div>

                <div className="modal-footer">

                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowDeleteModal(
                        false
                      );
                      setDeleteText("");
                    }}
                  >
                    キャンセル
                  </button>

                  <button
                    className="btn btn-danger"
                    disabled={
                      deleteText !==
                      "DELETE"
                    }
                    onClick={
                      handleDelete
                    }
                  >
                    削除
                  </button>

                </div>

              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TaskEdit;