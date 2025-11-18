const Job = require('../models/Job');
const { validationResult } = require('express-validator');
const { sendNotification } = require('../services/notificationService');

exports.getJobs = async (req, res) => {
    const { status, sortBy } = req.query;
    const query = { user: req.user.id };

    if (status) query.status = status;

    const sortOptions = {};
    if (sortBy === 'date_asc') {
        sortOptions.appliedDate = 1; // Ascending
    } else {
        sortOptions.appliedDate = -1; // Descending (default)
    }

    try {
        const jobs = await Job.find(query).sort(sortOptions);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) return res.status(404).json({ message: 'Job not found' });
        
        // Ensure the job belongs to the user
        if (job.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this job' });
        }
        
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new job application
exports.createJob = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { company, role, status, notes } = req.body;

    try {
        const job = new Job({
            company,
            role,
            status,
            notes,
            user: req.user.id,
        });

        const createdJob = await job.save();

        // Send notifications
        const notifMessage = `New application added for ${role} at ${company}.`;
        sendNotification(req.user.id, notifMessage); // Panel notification
        sendNotification(req.user.email, 'New Job Added', notifMessage); // Email notification

        res.status(201).json(createdJob);
    } catch (error) {
        res.status(400).json({ message: 'Invalid job data' });
    }
};

// @desc    Update a job application
exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        
        if (job.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }
        
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the modified document
            runValidators: true,
        });

        const notifMessage = `Your application for ${updatedJob.role} at ${updatedJob.company} has been updated.`;
        sendNotification(req.user.id, notifMessage);

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (job.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();
        
        res.json({ message: 'Job removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAllJobsForAdmin = async (req, res) => {
    try {

        const jobs = await Job.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        // First, find the job by its ID to see if it exists
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        
        if (req.user.role === "admin" || job.user.toString() === req.user.id) {
            await Job.deleteOne({ _id: req.params.id });
            res.json({ message: 'Job application removed successfully' });
        } else {

            res.status(401).json({ message: 'User not authorized to delete this job' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};