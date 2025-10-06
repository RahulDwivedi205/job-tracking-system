import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { loginUser } from '../api/auth';
import toast from 'react-hot-toast';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const userData = await loginUser(data);
            login(userData, userData.token);
            toast.success('Logged in successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center mt-10">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input type="email" {...register('email', { required: 'Email is required' })} className="w-full p-2 border rounded" />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700">Password</label>
                        <input type="password" {...register('password', { required: 'Password is required' })} className="w-full p-2 border rounded" />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;