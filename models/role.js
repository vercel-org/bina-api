const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    roleName : {
        type : String,
        required: [true, `Role name is required`]
    }
},{
    timestamps:true
})

module.exports = mongoose.model("role",roleSchema)