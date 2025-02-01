import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation example
    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      // Make the API request to register the user
      const response = await fetch("https://efficio-server.vercel.app/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Registration failed. Please try again.");
      }

      const data = await response.json();
      console.log("Registration success:", data);
      navigate('/login')
      // Redirect to login or show success message
      setError(null);
      setLoading(false);
    } catch (error:unknown) {
      if (error instanceof Error) {
        setError(error.message); 
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        
       <div className="flex items-center justify-center ">
          <img src="./lg.svg" alt="logo" width={30} height={30}/>
          <p className="text-blue-600">Efficio</p> 
        </div>
        
        <h2 className="text-2xl text-blue-600 font-bold text-center mb-6">Register</h2>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full py-2 px-3 text-sm text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none"
              placeholder="Enter your  username"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
              className={`w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:text-blue-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
