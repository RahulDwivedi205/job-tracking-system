import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link

const statusColors = {
    // ... same as before
};

const JobCard = ({ job, onEdit, onDelete }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between transition-transform hover:scale-105">
            <div>
                <div className="flex justify-between items-start mb-2">
                    {/* Make this a link */}
                    <Link to={`/job/${job._id}`} className="group">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">{job.role}</h3>
                        <p className="text-md text-gray-600 group-hover:text-blue-500 transition">{job.company}</p>
                    </Link>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[job.status]}`}>
                        {job.status}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                    Applied on: {new Date(job.appliedDate).toLocaleDateString()}
                </p>
                {job.notes && (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md truncate">
                        {job.notes}
                    </p>
                )}
            </div>
            <div className="flex justify-end items-center mt-4 space-x-2">
                {/* We pass the whole job object to onEdit */}
                <button onClick={() => onEdit(job)} className="p-2 text-gray-500 hover:text-blue-600 transition">
                    <FaEdit />
                </button>
                <button onClick={() => onDelete(job._id)} className="p-2 text-gray-500 hover:text-red-600 transition">
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

export default JobCard;