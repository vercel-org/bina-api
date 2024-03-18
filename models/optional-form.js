const mongoose = require('mongoose')
const getFormatForm = require('../controllers/form')

async function main(country){
    try {
        const objectForm = await getFormatForm(country)
        if(objectForm.lenght === 0){
            return objectForm
        }else{
            const schema = {}
            objectForm.forEach(obj=>{
                schema[obj.field_name]={
                    type: String,
                    required: [true, `You must provide a ${obj.field_name}`],
                }
            })
            const optionalSchema = new mongoose.Schema(schema)
            delete mongoose.connection.models.optional_form
            const customModel = mongoose.model("optional_form", optionalSchema)
            return customModel;
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

module.exports = main