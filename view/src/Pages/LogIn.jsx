import axios from "axios";
import { useState } from "react";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios(`${import.meta.env.VITE_BASE_URL}/api/users/login`, {
         email, password 
      });
      const data = response.data;
      // store JWT token
      localStorage.setItem("token", data.token);
      alert("Login successful!"); 
    } catch (err) {
        console.error(err);
        if (err.response)
           setError(err.response.data.message || "Login failed");
        else
           setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <a href="/login">Press here if you don't have an account?</a>
    </>
  );
}
