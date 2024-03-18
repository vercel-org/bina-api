
const {conflict,created,notFound} = require('../middleware/response')
const schema = require('../models/country')
const components = require('../middleware/component-type')

async function getFormatForm(country) {
    try {
        const countryExists = await schema.exists({_id:country});
        if(!countryExists){
            return notFound(res,`Country with id ${country} not found`)
        }else{
            let allComponents = [];
            for(const component in components){
                const data = await components[component].find({country:country});
                allComponents = allComponents.concat(data)
            }
            return allComponents
        }
        
    } catch (error) {
        console.error("Error fetching schemas:", error);
        throw error;
    }
}

module.exports = getFormatForm