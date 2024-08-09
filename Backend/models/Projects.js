// backend/models/SentencePair.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    project_name: {
        type: String,
        required: true
    },
    project_type: {
        type: String,
        required: true
    },
    tasks: [{
        type: mongoose.Types.ObjectId,
        ref: "Task"
    }],
    assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const ProjectModel = mongoose.model('Projects', ProjectSchema);

module.exports = ProjectModel;
