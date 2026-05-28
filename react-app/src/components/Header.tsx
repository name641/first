import { useNavigate } from "react-router-dom";

type Props = {
    title?: string;
    userName?: string;
    showNewTask?: boolean;
    showMenu?: boolean;
    onNewTask?: () => void;
    onMenu?: () => void;
};

export default function Header({
    title = "MyApp",
    userName,
    showNewTask = false,
    showMenu = false,
    onNewTask,
    onMenu,
}: Props) {

    const navigate = useNavigate();

    return (
        <header
            className="navbar navbar-dark py-4"
            style={{
                backgroundColor: "#1f2937",
            }}
        >
            <div className="container-fluid px-3 d-flex justify-content-between align-items-center">

                <a
                    className="navbar-brand fw-bold m-0 cat-logo"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/functionlist")}
                >
                    {title}
                </a>

                <div className="d-flex align-items-center gap-3">

                    {userName && (
                        <div
                            className="d-flex align-items-center gap-2 px-2 py-1 rounded"
                            style={{
                                backgroundColor: "#374151",
                                cursor: "pointer",
                            }}
                            onClick={() => navigate("/profile")}
                        >
                            <i className="bi bi-person-circle" />

                            <span
                                style={{
                                    color: "white",
                                    fontSize: "18px",
                                }}
                            >
                                {userName}
                            </span>
                        </div>
                    )}

                    {showNewTask && (
<button
  data-testid="header-new-task-button"
  className="btn btn-success btn-sm"
  onClick={onNewTask}
>
  + New Task
</button>
                    )}

                    {showMenu && (
<button
  data-testid="menu-button"
  className="navbar-toggler"
  onClick={onMenu}
>
  <span className="navbar-toggler-icon" />
</button>
                    )}

                </div>
            </div>
        </header>
    );
}