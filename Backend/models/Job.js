const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    company: {
        type: String,
        required: [true, 'Please add a company name'],
        trim: true,
    },
    role: {
        type: String,
        required: [true, 'Please add a job role'],
        trim: true,
    },
    status: {
        type: String,
        enum: ["Applied", "Interview", "Offer", "Rejected", "Accepted"],
        default: "Applied",
    },
    appliedDate: {
        type: Date,
        default: Date.now,
    },
    notes: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Job', JobSchema);