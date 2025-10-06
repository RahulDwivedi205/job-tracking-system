import apiClient from './apiClient';

export const getJobs = async (params) => {
    const { data } = await apiClient.get('/jobs', { params });
    return data;
};


export const getJobById = async (id) => {
    const { data } = await apiClient.get(`/jobs/${id}`);
    return data;
};
export const createJob = async (jobData) => {
    const { data } = await apiClient.post('/jobs', jobData);
    return data;
};

export const updateJob = async (id, jobData) => {
    const { data } = await apiClient.put(`/jobs/${id}`, jobData);
    return data;
};

export const deleteJob = async (id) => {
    const { data } = await apiClient.delete(`/jobs/${id}`);
    return data;
};

export const getAllJobsForAdmin = async () => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const { data } = await apiClient.get('/jobs/admin/all', config);
    return data;
};

export const deleteJobById = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found, please log in.');
    }

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // Using the proxy, so no need for the full URL
    // The path should match your backend route: DELETE /api/jobs/:id
    const response = await apiClient.delete(`/jobs/${jobId}`, config);
    return response.data;
};