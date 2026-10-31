import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../../services/api.js';

function ProtectedRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await api.get('/api/admin/me');
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      }
    };

    verifyLogin();
  }, []);

  if (authenticated === null) {
    return <p>Checking authentication...</p>;
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
