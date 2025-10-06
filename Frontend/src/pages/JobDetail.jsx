import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getJobById, deleteJob } from '../api/jobs';
import JobForm from '../components/JobForm';
import Spinner from '../components/Spinner';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

// Re-using the color mapping for consistency
const statusColors = {
    Applied: 'bg-blue-100 text-blue-800',
    Interview: 'bg-yellow-100 text-yellow-800',
    Offer: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
    Accepted: 'bg-purple-100 text-purple-800',
};

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Using useCallback to memoize the fetch function
    const fetchJobDetail = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getJobById(id);
            setJob(data);
            setError(null);
        } catch (err) {
            setError('Could not fetch job details. The job may not exist.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchJobDetail();
    }, [fetchJobDetail]);

    const handleDelete = async () => {
        if (window.confirm('Are you absolutely sure you want to delete this application?')) {
            try {
                await deleteJob(id);
                toast.success('Job application deleted successfully.');
                navigate('/'); // Redirect to dashboard after deletion
            } catch (err) {
                toast.error('Failed to delete job.');
                console.error(err);
            }
        }
    };

    const handleFormSubmit = () => {
        setIsEditing(false);
        fetchJobDetail(); // Refresh data after editing
    };

    if (loading) {
        return <Spinner fullscreen />;
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 text-xl">{error}</p>
                <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
                    ← Back to Dashboard
                </Link>
            </div>
        );
    }

    if (!job) {
        return <p className="text-center py-10">Job not found.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-700 mb-6">
                <FaArrowLeft />
                Back to Dashboard
            </Link>

            {isEditing ? (
                <JobForm jobToEdit={job} onFormSubmit={handleFormSubmit} />
            ) : (
                <div className="bg-white p-8 rounded-lg shadow-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">{job.role}</h1>
                            <h2 className="text-2xl text-gray-600 mb-2">{job.company}</h2>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[job.status]}`}>
                                {job.status}
                            </span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button onClick={() => setIsEditing(true)} className="p-3 bg-gray-100 rounded-full hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition">
                                <FaEdit />
                            </button>
                            <button onClick={handleDelete} className="p-3 bg-gray-100 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-600 transition">
                                <FaTrash />
                            </button>
                        </div>
                    </div>

                    <hr className="my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                        <div>
                            <h3 className="font-semibold text-gray-500 uppercase text-sm">Applied Date</h3>
                            <p>{new Date(job.appliedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-500 uppercase text-sm">Last Updated</h3>
                            <p>{new Date(job.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>

                    {job.notes && (
                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-500 uppercase text-sm">Notes</h3>
                            <p className="mt-2 p-4 bg-gray-50 rounded-md whitespace-pre-wrap">{job.notes}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobDetail;