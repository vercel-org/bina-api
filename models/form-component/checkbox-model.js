const mongoose = require('mongoose');

const checkboxSchema = new mongoose.Schema({
    field_name: {
        type: String,
        required: [true, 'Field name is required']
    },
    label: {
        type: String,
        required: [true, 'Label is required']
    },
    componentType:{
        type:String,
        required:[true,'Component type is required']
    },
    options: {
        type: [{
            value: {
                type:String,
                required:true
            },
            label: {
                type:String,
                required:true
            }
        }],
        validate:[optionsArray=>optionsArray.length > 0,'Options are required']
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'country',
        required: [true, 'Country is required']
    }
});

module.exports = mongoose.model('checkbox', checkboxSchema);
