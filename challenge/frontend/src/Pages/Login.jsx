import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/login/", {
        username: username,
        password: password,
      });
      const token = response.data.token;
      if (token) {
        localStorage.setItem("authToken", token);
        navigate("/dashboard", { state: { username: username } });
      }
    } catch (error) {
      setError(error.response.data.non_field_errors);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-lg font-medium text-gray-700"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              className="w-full p-2 border border-gray-300 rounded-md shadow-md  focus:outline-blue-400"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm  focus:outline-blue-400"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 text-white rounded-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
