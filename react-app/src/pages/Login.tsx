import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);

        if (data.token) {
          localStorage.setItem("token", data.token);
          alert("ログイン成功");
        } else {
          alert("ログイン失敗");
        }
      });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "300px" }}>
      <h1>ログイン</h1>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワード"
      />

      <button onClick={handleLogin}>
        ログイン
      </button>
      
    </div>
  );
}

export default Login;