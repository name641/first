import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TaskEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================
  // 取得
  // ======================
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8000/api/tasks/${id}`, {
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
      })
      .catch(() => setError("取得失敗"))
      .finally(() => setLoading(false));
  }, [id]);

  // ======================
  // 更新
  // ======================
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8000/api/tasks/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      }
    );

    if (res.ok) {
      navigate("/functionlist");
    } else {
      setError("更新失敗");
    }
  };

  // ======================
  // 削除
  // ======================
  const handleDelete = async () => {
    const ok = window.confirm("本当に削除しますか？");
    if (!ok) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8000/api/tasks/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      navigate("/functionlist");
    } else {
      setError("削除失敗");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div
      className="container-fluid py-5"
      style={{ backgroundColor: "#f5f7fb", minHeight: "100vh" }}
    >
      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h4 className="fw-bold">Task Edit</h4>
        <p className="text-muted">タスクを編集・更新・削除できます</p>
      </div>

      {/* ================= CARD ================= */}
      <div className="row justify-content-center">
        <div className="col-md-6">

          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "16px" }}
          >

            <div className="card-body p-4">

              {error && (
                <div className="alert alert-danger py-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleUpdate}>

                {/* Title */}
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-between">

                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>

                  <button className="btn btn-primary px-4">
                    Update
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

export default TaskEdit;