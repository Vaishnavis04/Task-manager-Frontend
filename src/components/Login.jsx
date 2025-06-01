// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaUser, FaLock } from 'react-icons/fa';
// import API from '../utils/api';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post('/auth/login', { username, password });
//       const { token, role } = res.data;
//       localStorage.setItem('token', token);

//       if (role === 'admin') {
//         navigate('/admin-dashboard');
//       } else {
//         navigate('/user-dashboard');
//       }
//     } catch (err) {
//       alert('Invalid credentials');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 p-6">
//       <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden">

//         {/* Left Panel */}
//         <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
//           <h2 className="text-4xl font-bold text-gray-800 mb-2">LOGIN</h2>
//           <p className="text-sm text-gray-500 mb-8">How to get started lorem ipsum dolor at?</p>

//           <form onSubmit={handleLogin} className="space-y-5">
//             {/* Username */}
//             <div className="relative">
//               <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//                 className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
//               />
//             </div>

//             {/* Password */}
//             <div className="relative">
//               <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
//               />
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
//             >
//               Login Now
//             </button>
//           </form>

//           <p className="text-sm text-center text-gray-600 mt-6">
//             Don't have an account?{' '}
//             <span
//               onClick={() => navigate('/signup')}
//               className="text-purple-600 font-semibold cursor-pointer hover:underline"
//             >
//               Sign up
//             </span>
//           </p>
//         </div>

//         {/* Right Panel - Image */}
//         <div className="w-full md:w-1/2 bg-purple-600 flex items-center justify-center p-4">
//        <img
//             src="https://dbaerpamu.com/assets/images/login-img.webp"
//             alt="Login Visual"
//             className="rounded-2xl shadow-xl w-full max-w-sm object-cover"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
// src/pages/Login.jsx
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import API from '../utils/api';
// import { FaUser, FaLock } from 'react-icons/fa';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post('/auth/login', { username, password });
//       const { token, role } = res.data;
//       localStorage.setItem('token', token);

//       if (role === 'admin') {
//         navigate('/admin-dashboard');
//       } else {
//         navigate('/user-dashboard');
//       }
//     } catch (err) {
//       alert('Invalid credentials');
//     }
//   };

//   return (
// <div className="min-h-screen flex items-center justify-center bg-[#f9f8fe] px-4">
//       <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-5xl">
//         {/* LEFT: Login Form */}
//         <div className="w-full md:w-1/2 p-8">
//           <h2 className="text-3xl font-bold text-center text-[#6651ee] mb-2">LOGIN</h2>
//           <p className="text-center text-gray-600 mb-6">Welcome back! Please login to your account.</p>

//           <form>
//             {/* Username */}
//             <div className="relative mb-4">
//               <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Username"
//                 className="w-full pl-10 pr-4 py-2 rounded-md bg-[#f1effd] focus:outline-none border border-gray-300"
//               />
//             </div>

//             {/* Password */}
//             <div className="relative mb-6">
//               <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="w-full pl-10 pr-4 py-2 rounded-md bg-[#f1effd] focus:outline-none border border-gray-300"
//               />
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               className="w-full bg-[#6651ee] hover:bg-[#5846d9] text-white py-2 rounded-md transition duration-300"
//             >
//               Login Now
//             </button>
//           </form>

//           <p className="mt-6 text-center text-gray-600">
//             Don’t have an account?{" "}
//             <a href="#" className="text-[#6651ee] font-semibold hover:underline">
//               Sign Up
//             </a>
//           </p>
//         </div>

//         {/* RIGHT: Image + Gradient Boxes */}
//         <div className="w-full md:w-1/2 relative bg-gradient-to-br from-[#6651ee] to-[#8e7df3] flex items-center justify-center p-6">
//           <div className="z-10">
//             <img
//               src="https://dbaerpamu.com/assets/images/login-img.webp"
//               alt="Login Visual"
//               className="rounded-2xl shadow-xl w-full max-w-xs object-cover"
//             />
//           </div>
//           {/* Decorative Boxes */}
//           <div className="absolute top-4 right-4 w-24 h-24 bg-white opacity-10 rounded-lg animate-pulse"></div>
//           <div className="absolute bottom-4 left-4 w-32 h-32 bg-white opacity-10 rounded-xl animate-ping"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock } from "react-icons/fa";
import API from "../utils/api";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { username, password });
      const { token, role } = res.data;
      localStorage.setItem("token", token);

      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="page-container">
      <div className={`login-container ${fadeIn ? "fade-in" : ""}`}>
        <div className="login-image-container">
          <img
            src="https://dbaerpamu.com/assets/images/login-img.webp"
            alt="Login Visual"
            className="login-image"
          />
        </div>

        <div className="login-form-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <FaUserAlt className="input-icon" />
              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <div className="signup-link">
            New user?
            <a href="/signup">Signup</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
