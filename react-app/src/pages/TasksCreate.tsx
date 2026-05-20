// const TasksCreate = () => {
//     return (
//         <h1>hello</h1>
//     );
// }
// export default TasksCreate;

import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TasksCreate = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // タスク作成
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

      // 作成成功 → 一覧へ戻る
      navigate("/functionlist");

    } catch (err) {
      setError("タスク作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">

      <div
        className="card shadow-sm p-5"
        style={{
          width: "500px",
          borderRadius: "16px",
        }}
      >

        {/* Header */}
        <div className="mb-4 text-center">

          <h3 className="fw-bold">
            Create Task
          </h3>

          <p className="text-muted">
            新しいタスクを追加
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div className="mb-3">

            <label className="form-label fw-semibold">
              Title
            </label>

            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="タスクタイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

          </div>

          {/* Description */}
          <div className="mb-4">

            <label className="form-label fw-semibold">
              Description
            </label>

            <textarea
              className="form-control"
              rows={5}
              placeholder="タスク内容を入力..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

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
  );
};

export default TasksCreate;