const mongoose = require('mongoose');

const radioButtonSchema = new mongoose.Schema({
    field_name: {
        type: String,
        required: [true, 'Field name is required']
    },
    label: {
        type: String,
        required: [true, 'Label is required']
    },
    componentType : {
        type : String,
        required: [true, `Component type is required`]
    },
    options: {
        type: [{
            value: String, // Nilai dari opsi radio button
            label: String  // Label yang akan ditampilkan di samping radio button
        }],
        required: [true, 'Options are required']
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'country',
        required: [true, 'Country is required']
    }
});

module.exports = mongoose.model('radio', radioButtonSchema);
