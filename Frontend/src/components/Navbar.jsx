import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
// ... other imports

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">JobTracker</Link>
                <div>
                    {user ? (
                        <>
                            {/* Conditionally render Admin Panel link */}
                            {user.role === 'admin' && (
                                <Link to="/admin" className="mr-4 hover:text-gray-300">Admin Panel</Link>
                            )}
                            <span className="mr-4">Welcome, {user.name}</span>
                            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
                            {/* NotificationBell component here */}
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="mr-4">Login</Link>
                            <Link to="/signup">Signup</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;