import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      // Send token to your backend
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        token: credentialResponse.credential
      });

      // Update state and redirect
      login(res.data.user);
      navigate('/');
    } catch (err) {
      console.error("Auth Error:", err);
      alert("Login failed! Check your backend console.");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <h1>CampusFlow</h1>
        <p>Sign in with your Google account</p>
        <div className="login-btn-container">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => alert('Google Login Failed')}
            theme="outline"
            size="large"
            width="320"
          />
        </div>
      </div>
    </div>
  );
}