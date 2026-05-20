import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
};

export default function Page() {
  const [open, setOpen] = useState(false);
  // const [tasks, setTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "TEST TASK",
      description: "debug test",
    },
  ]);

  // DBから取得（例：/api/tasks）
  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      // .then((data) => setTasks(data));
      .then((data) => setTasks(data.tasks));
  }, []);
  return (
    <>
      {/* Navbar */}
      <header className="navbar navbar-dark bg-dark">
        <div className="container-fluid">

          <a className="navbar-brand fw-bold" href="#">
            MyApp
          </a>

          <button
            className="navbar-toggler"
            onClick={() => setOpen(true)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Offcanvas */}
          <div
            className={`offcanvas offcanvas-end text-bg-dark ${
              open ? "show" : ""
            }`}
            style={{ visibility: open ? "visible" : "hidden" }}
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">Menu</h5>

              <button
                className="btn-close btn-close-white"
                onClick={() => setOpen(false)}
              />
            </div>

            <div className="offcanvas-body">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Home
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Features
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {open && (
            <div
              className="offcanvas-backdrop fade show"
              onClick={() => setOpen(false)}
            />
          )}
        </div>
      </header>

      {/* Body → DBの数だけカード生成 */}
      <div className="container py-5">
  <div className="row g-4">

    {tasks.map((task) => (
      <div className="col-12 col-md-4" key={task.id}>
        <div className="card h-100">

          <div className="card-body">

            <h5 className="card-title">
              {task.title}
            </h5>

            <p className="card-text">
              {task.description}
            </p>

          </div>

        </div>
      </div>
    ))}

  </div>
</div>
      {/* <div className="container py-5">
        <div className="row g-4">
      {tasks.map((task) => (
        <div className="card" key={task.id} style={{ width: "18rem" }}>
          <div className="card-body">

            <h5 className="card-title">
              {task.title}
            </h5>

            <p className="card-text">
              {task.description}
            </p>

            <span>

            </span>

          </div>
        </div>
      ))} 
        </div>
      </div> */}
    </>
  );
}