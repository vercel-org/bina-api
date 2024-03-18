const mongoose = require('mongoose')

const countrySchema = new mongoose.Schema({
    countryName : {
        type : String,
        required: [true, `Country name is required`]
    },
    description : {
        type : String,
        required: [true, `Description is required`]
    },
    picture :{
        type : String,
        required: [true, `Picture is required`]
    }
},{
    timestamps:true
})

module.exports = mongoose.model("country", countrySchema)
