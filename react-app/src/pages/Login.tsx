import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = import.meta.env.VITE_API_URL;

console.log(API_URL);

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (loading) return;

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/functionlist");
      } else {
        setError("ログインに失敗しました");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 401) {
          setError("メールアドレスまたはパスワードが間違っています");
        } else if (status === 500) {
          setError("サーバーエラーが発生しました");
        } else {
          setError("通信エラーが発生しました");
        }
      } else {
        setError("予期しないエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f5f7fb" }}
    >
      <div
        className="card border-0"
        style={{
          width: "420px",
          borderRadius: "20px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="text-center py-4"
          style={{
            backgroundColor: "#1f2937",
            color: "white",
          }}
        >
          <h3 className="fw-bold m-0">MyApp</h3>
          <p
            className="m-0 mt-2"
            style={{
              color: "#d1d5db",
              fontSize: "14px",
            }}
          >
            Sign in to continue
          </p>
        </div>

        {/* Body */}
        <div className="card-body p-5">
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Email
              </label>

              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                style={{
                  borderRadius: "12px",
                }}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Password
              </label>

              <div className="input-group">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  className="form-control form-control-lg"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  style={{
                    borderRadius:
                      "12px 0 0 12px",
                    borderRight: "none",
                  }}
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  style={{
                    borderRadius:
                      "0 12px 12px 0",
                  }}
                >
                  <i
                    className={`bi ${
                      showPassword
                        ? "bi-eye-slash"
                        : "bi-eye"
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <Link
                to="/create"
                style={{
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Create account
              </Link>

              <button
                className="btn btn-success px-4 py-2"
                style={{
                  borderRadius: "10px",
                  fontWeight: "bold",
                }}
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;