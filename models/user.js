const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role',
        required: [true, 'Role is required']
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'agent',
        required: [true, 'Agent is required']
    },
    status:{
        type:Boolean,
        required:[true,'Status is required']
    },
});

module.exports = mongoose.model('user', userSchema);
