import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { loginUser } from "../services/auth";
import { getLoginErrorMessage } from "../utils/loginError";
import {
  useNavigate,
  Link,
} from "react-router-dom";


const API_URL =
  import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error(
    "VITE_API_URL が設定されていません"
  );
}

const Login = () => {
  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const handleLogin =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (loading)
        return;

      setError("");

      const trimmedEmail =
        email.trim();

      // 入力チェック
      if (
        !trimmedEmail
      ) {
        setError(
          "メールアドレスを入力してください"
        );
        return;
      }

      // パスワードはtrimしない
      if (
        !password
      ) {
        setError(
          "パスワードを入力してください"
        );
        return;
      }

      setLoading(
        true
      );

      try {
        const response =
          await loginUser(
            trimmedEmail,
            password
          );
          
        if (
          response.data
            ?.token
        ) {
          localStorage.setItem(
            "token",
            response.data
              .token
          );

          // userが返る場合のみ保存
          if (
            response.data
              ?.user
          ) {
            localStorage.setItem(
              "user",
              JSON.stringify(
                response.data
                  .user
              )
            );
          }

          navigate(
            "/functionlist",
            {
              replace:
                true,
            }
          );
        } else {
          setError(
            "ログインに失敗しました"
          );
        }
      } catch (
      err: unknown
      ) {

        setError(
          getLoginErrorMessage(err)
        );

      } finally {
        setLoading(
          false
        );
      }
    };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundColor:
          "#f5f7fb",
      }}
    >
      <div
        className="card border-0"
        style={{
          width:
            "420px",
          borderRadius:
            "20px",
          boxShadow:
            "0 6px 18px rgba(0,0,0,0.08)",
          overflow:
            "hidden",
        }}
      >
        {/* Header */}
        <div
          className="text-center py-4"
          style={{
            backgroundColor:
              "#1f2937",
            color:
              "white",
          }}
        >
          <h3 className="fw-bold m-0">
            MyApp
          </h3>

          <p
            className="m-0 mt-2"
            style={{
              color:
                "#d1d5db",
              fontSize:
                "14px",
            }}
          >
            Sign in to
            continue
          </p>
        </div>

        {/* Body */}
        <div className="card-body p-5">
          <form
            onSubmit={
              handleLogin
            }
          >
            {/* Email */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Email
              </label>

              <input
                data-testid="email-input"
                type="email"
                className="form-control form-control-lg"
                placeholder="Enter your email"
                value={
                  email
                }
                disabled={
                  loading
                }
                onChange={(
                  e
                ) =>
                  setEmail(
                    e.target
                      .value
                  )
                }
                style={{
                  borderRadius:
                    "12px",
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
                  data-testid="password-input"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  className="form-control form-control-lg"
                  placeholder="Enter your password"
                  value={
                    password
                  }
                  disabled={
                    loading
                  }
                  onChange={(
                    e
                  ) =>
                    setPassword(
                      e.target
                        .value
                    )
                  }
                  autoComplete="current-password"
                  style={{
                    borderRadius:
                      "12px 0 0 12px",
                    borderRight:
                      "none",
                  }}
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  disabled={
                    loading
                  }
                  aria-label={
                    showPassword
                      ? "パスワードを隠す"
                      : "パスワードを表示"
                  }
                  onClick={() =>
                    setShowPassword(
                      (
                        prev
                      ) =>
                        !prev
                    )
                  }
                  style={{
                    borderRadius:
                      "0 12px 12px 0",
                  }}
                >
                  <i
                    className={`bi ${showPassword
                      ? "bi-eye-slash"
                      : "bi-eye"
                      }`}
                  />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                data-testid="error-message"
                className="alert alert-danger"
              >
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <Link
                to="/create"
                style={{
                  textDecoration:
                    "none",
                  fontWeight:
                    500,
                }}
              >
                Create account
              </Link>

              <button
                data-testid="login-button"
                type="submit"
                className="btn btn-success px-4 py-2"
                disabled={
                  loading
                }
                style={{
                  borderRadius:
                    "10px",
                  fontWeight:
                    "bold",
                }}
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