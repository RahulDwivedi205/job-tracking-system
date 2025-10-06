import { useState, useEffect, useCallback } from 'react';
import { getJobs, deleteJob } from '../api/jobs';
import JobCard from '../components/JobCard';
import JobForm from '../components/JobForm';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', sortBy: 'date_desc' });
    const [isFormVisible, setFormVisible] = useState(false);
    const [jobToEdit, setJobToEdit] = useState(null);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getJobs(filters);
            setJobs(data);
        } catch (error) {
            toast.error("Failed to fetch jobs");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleEdit = (job) => {
        setJobToEdit(job);
        setFormVisible(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this job application?')) {
            try {
                await deleteJob(id);
                toast.success('Job deleted successfully');
                fetchJobs(); // Refresh list
            } catch (error) {
                toast.error('Failed to delete job');
            }
        }
    };

    const handleFormSubmit = () => {
        setFormVisible(false);
        setJobToEdit(null);
        fetchJobs(); // Refresh the list after add/edit
    };

    const toggleFormVisibility = () => {
        if (isFormVisible) {
            setJobToEdit(null); // Clear edit state when closing
        }
        setFormVisible(!isFormVisible);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">My Job Applications</h1>
                <div className="flex items-center space-x-4">
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="p-2 border rounded">
                        <option value="">All Statuses</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="p-2 border rounded">
                        <option value="date_desc">Newest First</option>
                        <option value="date_asc">Oldest First</option>
                    </select>
                </div>
            </div>

            <button onClick={toggleFormVisibility} className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                {isFormVisible ? 'Cancel' : 'Add New Job'}
            </button>
            
            {isFormVisible && <JobForm onFormSubmit={handleFormSubmit} jobToEdit={jobToEdit} />}

            {loading ? (
                <div className="flex justify-center mt-10"><Spinner /></div>
            ) : jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <JobCard key={job._id} job={job} onEdit={handleEdit} onDelete={handleDelete} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No job applications found. Add one to get started!</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;