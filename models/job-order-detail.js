const mongoose = require('mongoose')

const jobOrderDetailSchema = new mongoose.Schema({
    requirements : {
        type : Array,
        required: [true, `Requirements is required`]
    },
    qualification: {
        type : Array,
        required: [true, `Qualification is required`]
    },
    job_description:{
        type: Array,
        required:[true,`Job Description is required`]
    },
    status:{
        type:String,
        enum:{
            values:['ssw','fulltime','internship'],
            message:'Status is ssw, fulltime or insternship',
            required:[true,`Status is required`]
        }
    }
})

module.exports = mongoose.model("job_order_detail", jobOrderDetailSchema)

