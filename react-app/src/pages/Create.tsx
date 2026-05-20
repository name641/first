import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Ce = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/api/users", {
        name,
        email,
        password,
      });

      setMessage("登録成功！");

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      setMessage("登録失敗");
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

        {/* ヘッダー（Google風） */}
        <div className="text-center mb-4">

          <h4 className="fw-normal">Create account</h4>

          <p className="text-muted" style={{ fontSize: "14px" }}>
            to continue to YourApp
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          {/* 名前 */}
          <input
            className="form-control form-control-lg mb-3"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* メール */}
          <input
            className="form-control form-control-lg mb-3"
            placeholder="Email or phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* パスワード */}
          <input
            type="password"
            className="form-control form-control-lg mb-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* メッセージ */}
          {message && (
            <div className="alert alert-info py-2 mt-2">
              {message}
            </div>
          )}

          {/* フッター */}
          <div className="d-flex justify-content-between align-items-center mt-4">

            <Link to="/" className="text-primary" style={{ fontSize: "14px" }}>
              Sign in instead
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

export default Ce;
