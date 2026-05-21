
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// type Task = {
//   id: number;
//   title: string;
//   description: string;
// };

// export default function Page() {
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [user, setUser] = useState<any>(null);

// useEffect(() => {
//   const token = localStorage.getItem("token");

//   fetch("http://localhost:8000/api/tasks", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error("API error");
//       }
//       return res.json();
//     })
//     .then((data) => {
//       console.log("tasks:", data);
//       setTasks(data);
//     })
//     .catch((err) => {
//       console.error("fetch error:", err);
//     });
// }, []);

// useEffect(() => {
//   const token = localStorage.getItem("token");

//   fetch("http://localhost:8000/api/me", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((res) => {
//       if (!res.ok) throw new Error("API error");
//       return res.json();
//     })
//     .then((data) => {
//       setUser(data);
//     })
//     .catch((err) => {
//       console.error("fetch me error:", err);
//     });
// }, []);

//   // 🔍 検索フィルター
//   const filteredTasks = tasks.filter((task) =>
//     task.title.toLowerCase().includes(search.toLowerCase()) ||
//     task.description.toLowerCase().includes(search.toLowerCase())
//   );
//   //NewTask
//   const goCreateTask = () => {
//   navigate("/taskscreate");
//   };
//   //logout
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   return (
//     <>
//     {/* ================= HEADER ================= */}
//     <header
//       className="navbar navbar-dark py-4"
//       style={{
//         backgroundColor: "#1f2937",
//       }}
//     >
//     <div className="container-fluid px-3 d-flex align-items-center justify-content-between">

//     {/* 左：ブランド */}
//     <a className="navbar-brand fw-bold m-0">
//       MyApp
//     </a>

//     {/* 中：検索 */}
//     <input
//       className="form-control w-50"
//       placeholder="タスクを検索..."
//       value={search}
//       onChange={(e) => setSearch(e.target.value)}
//     />

//     {/* 右：ボタン */}
//     <div className="d-flex align-items-center gap-3">

//       <button
//         className="btn btn-success btn-sm"
//         onClick={goCreateTask}
//       >
//         + New Task
//       </button>

//       <div
//         className="d-flex align-items-center gap-2 px-2 py-1 rounded"
//         style={{
//           backgroundColor: "#374151",
//           cursor: "pointer",
//         }}
//       >
//         {/* アイコン（固定） */}
//       <i className="bi bi-person-circle" />

//         {/* 名前 */}
//       <span style={{ color: "white", fontSize: "20px" }}>
//         {user?.name}
//       </span>
//     </div>

//       <button
//         className="navbar-toggler"
//         onClick={() => setOpen(true)}
//       >
//         <span className="navbar-toggler-icon" />
//       </button>

//     </div>

//   </div>
// </header>

//       {/* ================= OFFCANVAS ================= */}
//       <div
//         className={`offcanvas offcanvas-end text-bg-dark ${
//           open ? "show" : ""
//         }`}
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
//               onClick={() => navigate("/profile")}
//               style={{ cursor: "pointer" }}
//             >
//               👤 profile
//             </a>
            
//             <a className="list-group-item list-group-item-action bg-dark text-white">
//               ⚙ Settings
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

//       {/* backdrop */}
//       {open && (
//         <div
//           className="offcanvas-backdrop fade show"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* ================= BODY ================= */}
//       <div
//         className="container-fluid py-5"
//         style={{
//           backgroundColor: "#f5f7fb",
//           minHeight: "100vh",
//         }}
//       >
//         <h4 className="mb-4">📋 Task List</h4>

//         <div className="row g-4">

//           {filteredTasks.map((task, index) => (
//             <div className="col-12 col-md-4" key={task.id}>

//               <div
//                 className="card h-100 border-0"
//                 style={{
//                   borderRadius: "16px",
//                   boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//                   transition: "all 0.2s ease",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = "translateY(-4px)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "translateY(0)";
//                 }}
//                 onClick={() =>
//                   navigate(`/taskedit/${task.id}`)
//                 }
//               >

//                 <div className="card-body">

//                   {/* 🔢 連番表示（DBのidじゃなく表示順） */}
//                   <span className="badge bg-secondary mb-2">
//                     #{index + 1}
//                   </span>

//                   <h5 className="card-title fw-bold">
//                     {task.title}
//                   </h5>

//                   <p className="card-text text-muted">
//                     {task.description}
//                   </p>

//                   <span className="badge bg-primary">
//                     Task
//                   </span>
                  
//                 </div>

//               </div>

//             </div>
//           ))}
//         </div>

//       </div>
      
//     </>
//   );
// }



import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Task = {
  id: number;
  title: string;
  description: string;
  deadline?: string | null;
};

export default function Page() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<any>(null);

  const navigate = useNavigate();

  // ======================
  // task取得
  // ======================
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/tasks", {
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
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        console.error("fetch error:", err);
      });
  }, []);

  // ======================
  // user取得
  // ======================
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/me", {
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
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error("fetch me error:", err);
      });
  }, []);

  // ======================
  // 検索フィルター
  // ======================
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.description.toLowerCase().includes(search.toLowerCase())
  );

  // ======================
  // 新規作成
  // ======================
  const goCreateTask = () => {
    navigate("/taskscreate");
  };

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

    if (d < today) return "#dc3545"; // red
    if (d.getTime() === today.getTime()) return "#ffc107"; // yellow

    return "#198754"; // green
  };

  // ======================
  // 残り日数
  // ======================
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

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className="navbar navbar-dark py-4"
        style={{ backgroundColor: "#1f2937" }}
      >
        <div className="container-fluid px-3 d-flex align-items-center justify-content-between">

          <a className="navbar-brand fw-bold m-0">
            MyApp
          </a>

          <input
            className="form-control w-50"
            placeholder="タスクを検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="d-flex align-items-center gap-3">

            <button
              className="btn btn-success btn-sm"
              onClick={goCreateTask}
            >
              + New Task
            </button>

            <div
              className="d-flex align-items-center gap-2 px-2 py-1 rounded"
              style={{ backgroundColor: "#374151", cursor: "pointer" }}
            >
              <i className="bi bi-person-circle" />
              <span style={{ color: "white", fontSize: "20px" }}>
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
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer" }}
            >
              👤 profile
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
        <h4 className="mb-4">📋 Task List</h4>

        <div className="row g-4">

          {filteredTasks.map((task, index) => (
            <div className="col-12 col-md-4" key={task.id}>

              <div
                className="card h-100 border-0"
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "all 0.2s ease",
                  borderLeft: `6px solid ${getDeadlineColor(task.deadline)}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onClick={() => navigate(`/taskedit/${task.id}`)}
              >

                <div className="card-body">

                  <span className="badge bg-secondary mb-2">
                    #{index + 1}
                  </span>

                  <h5 className="card-title fw-bold">
                    {task.title}
                  </h5>

                  <p className="card-text text-muted">
                    {task.description}
                  </p>

                  {task.deadline && (
                    <>
                      <small className="text-muted">
                        📅 {task.deadline}
                      </small>
                      <br />
                      <small style={{ color: getDeadlineColor(task.deadline) }}>
                        {getRemainingDays(task.deadline)}
                      </small>
                    </>
                  )}

                  <span className="badge bg-primary mt-2">
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
