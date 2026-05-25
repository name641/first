import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL;

type User = {
  id: number;
  name: string;
  email: string;
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  const navigate = useNavigate();

  // 👤 user取得
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data: User) => {
        setUser(data);
        setName(data.name);
        setEmail(data.email);
      })
      .catch((err) => console.error(err));
  }, []);

  // ✏️ update
  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        email,
        password: password ? password : null,
      }),
    });

    alert("更新しました");
  };

  // 🗑 delete
  const handleDelete = async () => {
    const token =
      localStorage.getItem("token");

    await fetch(
      `${API_URL}/profile`,
      {
        method: "DELETE",
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    localStorage.removeItem(
      "token"
    );

    navigate("/");
  };
  
  //Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* ================= HEADER（FunctionList統一） ================= */}
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
              <span style={{ color: "white", fontSize: "18px" }}>
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

      {/* ================= OFFCANVAS（統一） ================= */}
      <div
        className={`offcanvas offcanvas-end text-bg-dark ${open ? "show" : ""}`}
        style={{
          visibility: open ? "visible" : "hidden",
          width: "260px",
        }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menu</h5>
          <button className="btn-close btn-close-white" onClick={() => setOpen(false)} />
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

      {/* ================= BODY（統一カード風） ================= */}
      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#f5f7fb", minHeight: "100vh" }}
      >

        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">

            <div
              className="card border-0 p-3 mx-auto"
              style={{
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                maxWidth: "500px",
                width: "100%",
              }}
            >
              <div className="text-center mb-3">
                <i
                  className="bi bi-person-circle"
                  style={{ fontSize: "60px", color: "#555" }}
                />
                <h4 className="mt-2">{user?.name}</h4>
              </div>

              <input
                className="form-control mb-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="name"
              />

              <input
                className="form-control mb-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
              />

              <input
                type="password"
                className="form-control mb-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="new password (optional)"
              />

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
                    className="btn btn-danger"
                    onClick={() =>
                      setShowDeleteModal(true)
                    }
                  >
                    Delete Account
                  </button>
                  {/* <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                  >
                    Delete Account
                  </button> */}

                  <button
                    className="btn btn-primary px-4"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                </div>
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
            onClick={() =>
              setShowDeleteModal(false)
            }
          />

          <div
            className="modal fade show d-block"
            tabIndex={-1}
          >
            <div className="modal-dialog modal-dialog-centered">

              <div
                className="modal-content"
                style={{
                  borderRadius: "20px"
                }}
              >

                <div className="modal-header">

                  <h5 className="modal-title text-danger">
                    ⚠ アカウント削除
                  </h5>

                </div>

                <div className="modal-body">

                  <p>
                    すべてのタスクと
                    アカウント情報が
                    完全に削除されます。
                  </p>

                  <p className="fw-bold">

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
                      setShowDeleteModal(false);
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
                    削除する
                  </button>

                </div>

              </div>

            </div>
          </div>
        </>
      )}
    </>
  );
}
