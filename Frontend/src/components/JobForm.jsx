import { useForm } from 'react-hook-form';
import { createJob, updateJob } from '../api/jobs';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const JobForm = ({ jobToEdit, onFormSubmit }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const isEditMode = !!jobToEdit;

    useEffect(() => {
        if (isEditMode) {
            reset(jobToEdit);
        } else {
            reset({ status: "Applied" }); // Default status for new jobs
        }
    }, [jobToEdit, reset, isEditMode]);

    const onSubmit = async (data) => {
        try {
            if (isEditMode) {
                await updateJob(jobToEdit._id, data);
                toast.success('Job updated successfully!');
            } else {
                await createJob(data);
                toast.success('Job added successfully!');
            }
            onFormSubmit(); // Callback to refresh job list and close form
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Job' : 'Add New Job'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="company" className="block text-gray-700">Company</label>
                    <input {...register('company', { required: 'Company is required' })} className="w-full mt-1 p-2 border rounded" />
                    {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>}
                </div>
                <div>
                    <label htmlFor="role" className="block text-gray-700">Role</label>
                    <input {...register('role', { required: 'Role is required' })} className="w-full mt-1 p-2 border rounded" />
                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                </div>
                <div>
                    <label htmlFor="status" className="block text-gray-700">Status</label>
                    <select {...register('status')} className="w-full mt-1 p-2 border rounded">
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-gray-700">Notes</label>
                    <textarea {...register('notes')} className="w-full mt-1 p-2 border rounded" rows="3"></textarea>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    {isEditMode ? 'Update Job' : 'Save Job'}
                </button>
            </div>
        </form>
    );
};

export default JobForm;