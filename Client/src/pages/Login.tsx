import { useAuth } from "@/context/AuthContext";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const {dispatch} =useAuth();
  const navigate=useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials. Please try again.");
      }

      const data = await response.json();
      console.log("Login success:", data);
      // Handle success (e.g., store token, redirect, etc.)
      localStorage.setItem("token", data.token); // Save auth token in local storage
      dispatch({ type: "LOGIN_SUCCESS", payload: { user: data.user } });
      navigate("/")
      console.log("auth-token",data.token) 
      console.log("data user",data.user)
      setError(null);
      setLoading(false);
      
      // Redirect or show success message
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        
      <div className="w-full   max-w-md bg-white p-8 rounded-xl shadow-md">
        
        <div className="flex items-center justify-center ">
          <img src="./logo2.png" width={100} height={100}/>
        </div>
        
        <h2 className="text-2xl text-blue-600 font-bold text-center mb-6">Login</h2>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full py-2 px-3 text-sm text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-bold text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full py-2 px-3 text-sm text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-6 text-center">
            <button
              type="submit"
              className={`w-full py-2 px-4 bg-blue-500  text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? <div className="flex items-center"><Loader2Icon className="animate-spin"/></div> : "Login"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:text-blue-600">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
