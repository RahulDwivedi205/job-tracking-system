import { useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';

const NotificationBell = () => {
    const { socket } = useAuth();

    useEffect(() => {
        if (!socket) return;

        const handleNotification = (data) => {
            toast.success(data.message, {
                icon: '🔔',
                duration: 5000,
            });
        };

        socket.on('notification', handleNotification);

        return () => {
            socket.off('notification', handleNotification);
        };
    }, [socket]);

    return (
        <div className="relative">
            <FaBell className="text-gray-600 h-6 w-6" />
            {/* Can add a notification count indicator here */}
        </div>
    );
};

export default NotificationBell;