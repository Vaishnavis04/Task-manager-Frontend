// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../utils/api';
// import './Signup.css';

// const Signup = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const navigate = useNavigate();
// // 
//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');
//     try {
//       await API.post('/auth/signup', {
//         username,
//         password,
//         email: email.trim() === '' ? undefined : email.trim(),
//       });
//       setMessage('Signup successful! Please login.');
//       setTimeout(() => {
//         navigate('/');
//       }, 1500);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Signup failed.');
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Signup</h2>
//       <form onSubmit={handleSignup}>
//         <input
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email (optional)"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <button type="submit">Signup</button>
//       </form>

//       {message && <div className="success-msg">{message}</div>}
//       {error && <div className="error-msg">{error}</div>}
//     </div>
//   );
// };

// export default Signup;
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserAlt, FaLock, FaEnvelope } from 'react-icons/fa';
import API from '../utils/api';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await API.post('/auth/signup', {
        username,
        password,
        email: email.trim() === '' ? undefined : email.trim(),
      });
      setMessage('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <div className="page-container">
      <div className={`signup-container ${fadeIn ? 'fade-in' : ''}`}>
        <div className="signup-image-container">
          <img
            src="https://dbaerpamu.com/assets/images/login-img.webp"
            alt="Signup Visual"
            className="signup-image"
          />
        </div>

        <div className="signup-form-container">
          <h2>Signup</h2>
          <form onSubmit={handleSignup} className="signup-form">
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

            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="signup-button">
              Signup
            </button>
          </form>

          <div className="signup-link">
            Already have an account?
            <Link to="/" className="login-link"> Login  </Link>
          </div>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Signup;
