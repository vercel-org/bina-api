const mongoose = require('mongoose')

const textboxSchema = new mongoose.Schema({
    field_name : {
        type : String,
        required: [true, `Field name is required`]
    },
    placeholder : {
        type : String,
        required: [true, `Placeholder is required`]
    },
    label : {
        type : String,
        required: [true, `Label is required`]
    },
    componentType : {
        type : String,
        required: [true, `Component type is required`]
    },
    value : {
        type : String,
        required: [true, `Value is required`]
    },
    country:{
        type: mongoose.Schema.Types.ObjectId, ref: 'country',
        required: [true, `Country is required`]
    }
})

module.exports = mongoose.model("textbox", textboxSchema)
