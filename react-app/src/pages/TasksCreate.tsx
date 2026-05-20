import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TasksCreate = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // 作成
  // =========================
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
        }),
      });

      if (!response.ok) {
        throw new Error("作成失敗");
      }

      navigate("/functionlist");

    } catch {
      setError("タスク作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        backgroundColor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >

      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h4 className="fw-bold">Create Task</h4>
        <p className="text-muted">新しいタスクを追加します</p>
      </div>

      {/* ================= CENTER CARD ================= */}
      <div className="row justify-content-center">
        <div className="col-md-6">

          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "16px",
            }}
          >

            <div className="card-body p-4">

              {error && (
                <div className="alert alert-danger py-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Title */}
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    placeholder="タスクタイトル"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    placeholder="タスク内容"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-between">

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/functionlist")}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="btn btn-success px-4"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default TasksCreate;