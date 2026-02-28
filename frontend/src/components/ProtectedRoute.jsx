import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // If there is no user, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, show the requested page
  return children;
};

export default ProtectedRoute;