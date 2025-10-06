import { useState, useEffect } from 'react';
import { getAllJobsForAdmin, deleteJobById } from '../api/jobs';

// IMPROVEMENT 1: Add dynamic status colors for better UI clarity
const statusColors = {
    Applied: 'bg-blue-100 text-blue-800',
    Interview: 'bg-yellow-100 text-yellow-800',
    Offer: 'bg-green-100 text-green-800',
    Accepted: 'bg-purple-100 text-purple-800',
    Rejected: 'bg-red-100 text-red-800',
};

function AdminDashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // FIX 1: Define the fetchJobs function inside useEffect
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const data = await getAllJobsForAdmin();
                setJobs(data);
            } catch (err) {
                setError('Failed to fetch jobs. You may not have admin privileges.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []); // Empty dependency array ensures this runs only once on mount

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to permanently delete this job application?')) {
            return;
        }

        // IMPROVEMENT 2: Clear any previous errors before trying a new action
        setError('');

        try {
            const result = await deleteJobById(jobId);
            console.log(result.message);

            setJobs(currentJobs => currentJobs.filter(job => job._id !== jobId));
        } catch (err) {
            console.error('Failed to delete job:', err);
            setError(err.response?.data?.message || 'Could not delete the job.');
        }
    };

    if (loading) return <p className="text-center mt-8">Loading all applications...</p>;
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Admin Panel - All Job Applications</h1>
            
            {/* Display error message prominently if it exists */}
            {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
            
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company & Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {jobs.map((job) => (
                            <tr key={job._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{job.user.name}</div>
                                    <div className="text-sm text-gray-500">{job.user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{job.company}</div>
                                    <div className="text-sm text-gray-500">{job.role}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {/* IMPROVEMENT 1 (applied here): Use dynamic colors */}
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[job.status] || 'bg-gray-100 text-gray-800'}`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(job.appliedDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleDelete(job._id)}
                                        className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default AdminDashboard;