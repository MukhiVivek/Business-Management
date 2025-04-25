import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../Config";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post(BACKEND_URL + "/api/v1/user/signin", {
      username: form.username,
      password: form.password,
    });    

    const jwt = res.data.token;
    localStorage.setItem("token", jwt);

    navigate("/dashboard");
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Welcome Back
        </h2>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Enter your username"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="block w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-indigo-500 hover:text-indigo-700 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="text-center text-sm text-gray-500 py-2">
            You don't have an account? <Link to="/signup" className="text-center text-sm text-blue-500 hover:text-blue-700 focus:outline-none">Sign Up</Link>          
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
