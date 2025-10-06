const express = require('express');
const { body } = require('express-validator');
const {
    getJobs,
    createJob,
    getJobById,
    updateJob,
    deleteJob,
    getAllJobsForAdmin,
} = require('../controllers/jobController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes here are protected and require a valid token
router.use(protect);

router.route('/')
    .get(getJobs)
    .post(
        [
            body('company', 'Company is required').not().isEmpty(),
            body('role', 'Role is required').not().isEmpty(),
        ],
        createJob
);
    
router.route('/admin/all')
    .get(protect, admin, getAllJobsForAdmin);

router.route('/:id')
    .get(getJobById)
    .put(updateJob)
    .delete(deleteJob);

module.exports = router;