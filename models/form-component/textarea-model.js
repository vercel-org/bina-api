const mongoose = require('mongoose')

const textareaSchema = new mongoose.Schema({
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
    rows:{
        type : Number,
        required: [true, `Rows is required`]
    },
    cols:{
        type : Number,
        required: [true, `Cols is required`]
    },
    value : {
        type : String,
        required: [true, `Value is required`]
    },
    country:{
        type: mongoose.Schema.Types.ObjectId, ref: 'country',
        required: [true, `Country is required`]
    },
})
delete mongoose.connection.models.formcomponent;

module.exports = mongoose.model("textarea", textareaSchema)
