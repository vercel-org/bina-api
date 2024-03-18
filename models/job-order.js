const mongoose = require('mongoose')

const jobOrderSchema = new mongoose.Schema({
    job_order_name : {
        type : String,
        required: [true, `Job order name is required`]
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'agent', 
        required: true 
    },
    job_order_detail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job_order_detail', 
        required: true 
    }
})

module.exports = mongoose.model("job_order", jobOrderSchema)
