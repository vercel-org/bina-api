const mongoose = require('mongoose')

const jobRegistrationSchema = new mongoose.Schema({
    name : {
        type : String,
        required: [true, `Name is required`]
    },
    date_of_birth : {
        type : Date,
        required: [true, `Date of birth is required`]
    },
    email : {
        type : String,
        required: [true, `Email is required`]
    },
    phone_number : {
        type : String,
        required: [true, `Phone Number is required`]
    },
    domicile : {
        type : String,
        required: [true, `Domicile is required`]
    },
    formal_education : {
        type : String,
        required: [true, `Formal education is required`]
    },
    cv : {
        type : String
    },
    optional_form: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'optional_form'
    },
    job_order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job_order'
    }
})

module.exports = mongoose.model("job_registration", jobRegistrationSchema)
