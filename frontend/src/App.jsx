import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './features/auth/pages/Login';
import Dashboard from './features/inquiries/pages/Dashboard';
import InquiryForm from './features/inquiries/pages/InquiryForm';

import ProtectedRoute from './features/auth/components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/inquiry" element={<InquiryForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
