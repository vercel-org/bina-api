const componentTypes = require('../middleware/component-type')
const countrySchema = require('../models/country')
const asyncWrapper = require('../middleware/async-wrapper')
const components = require('../middleware/component-type')
const {notFound,badGateway,created} = require('../middleware/response')


const createComponent = asyncWrapper(async(req,res)=>{
    const country = req.query.country
    const componentType = req.query.componentType

    // check country is exist
    const countryExists = await countrySchema.exists({country_name:country});
    if(!countryExists){
        return notFound(res,`Country ${country} not found`)
      
    }
    // check component is exist
    if(!(componentType in componentTypes)){
        return badGateway(res,`No component type in schema`)
    }
    const schema = componentTypes[componentType];

    // insert query param to body
    req.body.country = countryExists._id;
    req.body.componentType = componentType;

    const data = await schema.create(req.body);
    return created(res,data,`${componentType.charAt(0).toUpperCase() + componentType.slice(1)} ${data.field_name} success to create`)
})

const getComponent = asyncWrapper(async(req,res)=>{
    const country = req.query.country
    
    // if didnt have country parameter will return all component
    if (!country) {
        let allComponents = []
        for(const component in components){
            const data = await components[component].find();
            allComponents = allComponents.concat(data)
        }
        
        res.status(200).json({
            data: allComponents,
            code: 200,
            status: 'success',
            message: `Retrieved ${allComponents.length} components`
        });
    }else if(country){
        // check country is exist
        const countryExists = await schema.exists({_id:country});
        if(!countryExists){
            return res.status(404).json({
                data:null,
                code:404,
                status:'NOT_FOUND',
                message:`No country found`})
        }

        let allComponents = [];
        for(const component in components){
            const data = await components[component].find({country:country}).populate('country');
            allComponents = allComponents.concat(data)
        }

        // Respond with the retrieved components
        res.status(200).json({
            data: allComponents,
            code: 200,
            status: 'success',
            message: `Retrieved ${allComponents.length} components for country ${country}`
        });
    }

})


module.exports = {
    createComponent,
    getComponent

}