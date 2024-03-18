const mongoose = require('mongoose')
const {agentDetailSchema} = require('../models/agent-detail')

const agentSchema = new mongoose.Schema({
    agentName : {
        type : String,
        required: [true, `Agent name is required`]
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'country',
        required: [true, 'Country is required']
    },
    agentDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'agentDetail', 
        required: true 
    }
},{
    timestamps:true
})

module.exports = mongoose.model("agent", agentSchema)
