import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import LeadsPage from './pages/LeadsPage';
import LeadDetailsPage from './pages/LeadDetailsPage';
import AddLeadPage from './pages/AddLeadPage';
import AdminPage from './pages/AdminPage';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="leads" element={<LeadsPage />} />
                <Route path="leads/add" element={<AddLeadPage />} />
                <Route path="leads/:id" element={<LeadDetailsPage />} />
                <Route path="admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
            </Route>
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
