import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/auth";
import { useState } from "react";
import { getCreateErrorMessage } from "../utils/createError";


const Create = () => {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setMessage("");

    try {
      await registerUser(
        name,
        email,
        password
      );

      setMessage(
        "登録成功！"
      );

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      setMessage(
        getCreateErrorMessage(error)
      );
    }
  }
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
          width: "430px",
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
            Create Account
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
            Join YourApp today
          </p>

        </div>

        {/* Body */}
        <div className="card-body p-5">

          <form
            onSubmit={
              handleSubmit
            }
          >

            {/* Name */}
            <div className="mb-3">

              <label className="form-label fw-semibold">
                Name
              </label>

              <input
                data-testid="name-input"
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                style={{
                  borderRadius:
                    "12px",
                }}
                required
              />

            </div>

            {/* Email */}
            <div className="mb-3">

              <label className="form-label fw-semibold">
                Email
              </label>

              <input
                data-testid="email-input"
                type="email"
                className="form-control form-control-lg"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                style={{
                  borderRadius:
                    "12px",
                }}
                required
              />

            </div>

            {/* Password */}
            <div className="mb-2">

              <label className="form-label fw-semibold">
                Password
              </label>

              <input
                data-testid="password-input"
                type="password"
                minLength={8}
                className="form-control form-control-lg"
                placeholder="Create password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                style={{
                  borderRadius:
                    "12px",
                }}
                required
              />

              <small className="text-muted">
                Password must be at least
                8 characters
              </small>

            </div>

            {/* Message */}
            {message && (

              <div
                data-testid="message"
                className={`alert mt-3 ${message.includes(
                  "成功"
                )
                  ? "alert-success"
                  : "alert-danger"
                  }`}
              >
                {message}
              </div>

            )}

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center mt-4">

              <Link
                to="/"
                style={{
                  textDecoration:
                    "none",
                  fontWeight:
                    500,
                }}
              >
                Sign in instead
              </Link>

              <button
                data-testid="register-button"
                type="submit"
                className="btn btn-success px-4 py-2"
                style={{
                  borderRadius:
                    "10px",
                  fontWeight:
                    "bold",
                }}
              >
                Create
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Create;