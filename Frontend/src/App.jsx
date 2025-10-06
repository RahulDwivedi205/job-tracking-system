import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import JobDetail from './pages/JobDetail'; 
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard'; 

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="bg-gray-50 min-h-screen">
                    <Navbar />
                    <main className="container mx-auto p-4 md:p-6">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/admin" element={<AdminRoute />}>
                                <Route path="" element={<AdminDashboard />} />
                            </Route>
                            {/* Add the new route for the job detail page */}
                            <Route
                                path="/job/:id"
                                element={
                                    <ProtectedRoute>
                                        <JobDetail />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;