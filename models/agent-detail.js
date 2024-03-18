const mongoose = require('mongoose')

const agentDetailSchema = new mongoose.Schema({
    agentEmail : {
        type : String,
        unique:[true,`Please use another email, the email is used`],
        required: [true, `Agent email is required`]
    },
    agentPhoneNumber: {
        type : String,
        required: [true, `Agent phone number is required`]
    }
},{
    timestamps:true
})

module.exports = mongoose.model("agentDetail", agentDetailSchema)

