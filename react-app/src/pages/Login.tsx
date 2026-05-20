import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/functionlist");
      } else {
        setError("ログイン失敗");
      }
    } catch (err) {
      setError("ユーザーアカウントまたはパスワードが間違っています");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">

      <div
        className="card shadow-sm p-5"
        style={{
          width: "380px",
          borderRadius: "12px",
          fontFamily: "Roboto, Arial, sans-serif",
        }}
      >

        {/* Google風ヘッダー */}
        <div className="text-center mb-4">

          <h5 className="fw-normal">Sign in</h5>

          <p className="text-muted" style={{ fontSize: "14px" }}>
            to continue to YourApp
          </p>

        </div>

        <form onSubmit={handleLogin}>

          {/* Email */}
          <input
            type="email"
            className="form-control form-control-lg mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            className="form-control form-control-lg mb-2"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Error */}
          {error && (
            <div className="alert alert-danger py-2">
              {error}
            </div>
          )}

          {/* Footer buttons */}
          <div className="d-flex justify-content-between align-items-center mt-3">

            <Link to="/create" className="text-primary" style={{ fontSize: "14px" }}>
              Create account
            </Link>

            <button className="btn btn-primary px-4">
              Next
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default Login;
