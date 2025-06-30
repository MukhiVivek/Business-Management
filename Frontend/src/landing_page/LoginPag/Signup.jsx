import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../Config";
import RegisterIllustration from "../../assets/Illustration2.jpg"; // Make sure this is a valid image path

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(BACKEND_URL + "/api/v1/user/signup", form);
    navigate("/signin");
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side image */}
      <div className="w-1/2 h-screen">
        <img
          src={RegisterIllustration}
          alt="Registration Image"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right side form */}
      <div className="w-1/2 flex items-center justify-center px-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 rounded-lg border-1 hover:shadow-xl transition-all duration-300"
        >
          {/* Header Section */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create your Magnet Account,</h2>
          <p className="text-sm text-gray-500 mb-6">Sign In to unlock your business tools!</p>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="block w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your username"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Sign In Link */}
            <div className="text-sm text-gray-500 text-center pt-2 mb-6">
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-500 hover:text-blue-700">
                Sign In
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold shadow-lg hover:scale-105 transition-transform"
            style={{
              background:
                "linear-gradient(90deg, rgba(21, 58, 69, 1) 10%, rgba(38, 66, 89, 1) 39%, rgba(29, 118, 145, 1) 80%)",
            }}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;