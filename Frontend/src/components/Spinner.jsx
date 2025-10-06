const Spinner = ({ fullscreen = false }) => {
    const spinnerClass = "animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500";
    
    if (fullscreen) {
        return (
            <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex justify-center items-center z-50">
                <div className={spinnerClass}></div>
            </div>
        );
    }
    
    return <div className={spinnerClass}></div>;
};

export default Spinner;