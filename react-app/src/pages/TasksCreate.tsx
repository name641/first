// import "bootstrap/dist/css/bootstrap.min.css";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// type User = {
//   name: string;
// };

// const TasksCreate = () => {
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [deadline, setDeadline] = useState(""); // ★追加

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [open, setOpen] = useState(false);
//   const [user, setUser] = useState<User | null>(null);

//   // ======================
//   // user取得（統一）
//   // ======================
//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     fetch("http://localhost:8000/api/me", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => setUser(data))
//       .catch(() => {});
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   // ======================
//   // 作成
//   // ======================
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setError("");
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch("http://localhost:8000/api/tasks", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           title,
//           description,
//           deadline, // ★追加
//         }),
//       });

//       if (!response.ok) throw new Error();

//       navigate("/functionlist");
//     } catch {
//       setError("タスク作成に失敗しました");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* ================= HEADER（統一） ================= */}
//       <header
//         className="navbar navbar-dark py-4"
//         style={{ backgroundColor: "#1f2937" }}
//       >
//         <div className="container-fluid px-3 d-flex justify-content-between align-items-center">

//           <a
//             className="navbar-brand fw-bold m-0"
//             onClick={() => navigate("/functionlist")}
//             style={{ cursor: "pointer" }}
//           >
//             MyApp
//           </a>

//           <div className="d-flex align-items-center gap-3">

//             <div
//               className="d-flex align-items-center gap-2 px-2 py-1 rounded"
//               style={{ backgroundColor: "#374151", cursor: "pointer" }}
//               onClick={() => navigate("/profile")}
//             >
//               <i className="bi bi-person-circle" />
//               <span style={{ color: "white" }}>{user?.name}</span>
//             </div>

//             <button
//               className="navbar-toggler"
//               onClick={() => setOpen(true)}
//             >
//               <span className="navbar-toggler-icon" />
//             </button>

//           </div>
//         </div>
//       </header>

//       {/* ================= OFFCANVAS ================= */}
//       <div
//         className={`offcanvas offcanvas-end text-bg-dark ${open ? "show" : ""}`}
//         style={{
//           visibility: open ? "visible" : "hidden",
//           width: "260px",
//         }}
//       >
//         <div className="offcanvas-header">
//           <h5 className="offcanvas-title">Menu</h5>
//           <button
//             className="btn-close btn-close-white"
//             onClick={() => setOpen(false)}
//           />
//         </div>

//         <div className="offcanvas-body">

//           <div className="list-group list-group-flush">

//             <a
//               className="list-group-item list-group-item-action bg-dark text-white"
//               onClick={() => navigate("/functionlist")}
//               style={{ cursor: "pointer" }}
//             >
//               📋 Tasks
//             </a>

//             <a
//               className="list-group-item list-group-item-action bg-dark text-white"
//               onClick={() => navigate("/profile")}
//               style={{ cursor: "pointer" }}
//             >
//               👤 Profile
//             </a>

//             <a
//               className="list-group-item list-group-item-action bg-dark text-danger"
//               onClick={handleLogout}
//               style={{ cursor: "pointer" }}
//             >
//               🚪 Logout
//             </a>

//           </div>
//         </div>
//       </div>

//       {open && (
//         <div
//           className="offcanvas-backdrop fade show"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* ================= BODY（統一カード） ================= */}
//       <div
//         className="container-fluid py-5"
//         style={{ backgroundColor: "#f5f7fb", minHeight: "100vh" }}
//       >
//         <div className="row justify-content-center">
//           <div className="col-12 col-md-6 col-lg-5">

//             <div
//               className="card border-0 mx-auto"
//               style={{
//                 maxWidth: "500px",
//                 width: "100%",
//                 borderRadius: "16px",
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//               }}
//             >
//               <div className="card-body p-4">

//                 <h4 className="mb-3 fw-bold">➕ Create Task</h4>

//                 {error && (
//                   <div className="alert alert-danger py-2">
//                     {error}
//                   </div>
//                 )}

//                 <form onSubmit={handleSubmit}>

//                   <input
//                     className="form-control mb-3"
//                     placeholder="Title"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     required
//                   />

//                   <textarea
//                     className="form-control mb-3"
//                     rows={5}
//                     placeholder="Description"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     required
//                   />

//                   {/* ★追加 */}
//                   <input
//                     type="datetime-local"
//                     className="form-control mb-4"
//                     value={deadline}
//                     onChange={(e) => setDeadline(e.target.value)}
//                   />

//                   <div className="d-flex justify-content-between">

//                     <button
//                       type="button"
//                       className="btn btn-outline-secondary"
//                       onClick={() => navigate("/functionlist")}
//                     >
//                       Back
//                     </button>

//                     <button
//                       type="submit"
//                       className="btn btn-success px-4"
//                       disabled={loading}
//                     >
//                       {loading ? "Creating..." : "Create"}
//                     </button>

//                   </div>

//                 </form>

//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TasksCreate;



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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // ======================
  // user取得（統一）
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
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
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
        body: JSON.stringify({ title, description }),
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
      {/* ================= HEADER（統一） ================= */}
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

      {/* ================= BODY（統一カード） ================= */}
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

                <h4 className="mb-3 fw-bold">➕ Create Task</h4>

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
                    className="form-control mb-4"
                    rows={5}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />

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
    </>
  );
};

export default TasksCreate;