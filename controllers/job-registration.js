const schema = require('../models/job-registration')
const countrySchema = require('../models/country')
const components = require('../middleware/component-type')
const getFormatForm = require('../controllers/form')
const optionalForm = require('../models/optional-form')


const asyncWrapper = require('../middleware/async-wrapper')
const {conflict,created,badRequest,notFound, badGateway} = require('../middleware/response')
const _ = require('lodash')

const maxFileSize = process.env.MAX_SIZE_COUNTRY  * 1024 * 1024
const allowedFileTypes = new RegExp(`${process.env.ALLOWED_TYPES_PICTURE.split(',').join('|')}`);


const createJobRegistration = asyncWrapper(async(req,res)=>{
    let {name,date_of_birth,email,phone_number,domicile,formal_education} = req.body
    const cv = req.file
    const country = req.query.country
    if(!country){
        const data = await schema.create({
            name,
            date_of_birth,
            email,
            phone_number,
            domicile,
            formal_education,
            cv : cv ? cv.ptah : null
        })
        
        return created(res,data,`Your data is submited, please wait for further information`)

    }else{
        const countryExists = await countrySchema.exists({_id:country});
        if(!countryExists){
            return notFound(res,`No Country found`)
        }else{
            const optional = await optionalForm(country)
            const newOptional = new optional(req.body)
            const savedOptional = await newOptional.save()
            const data = await schema.create({
                name,
                date_of_birth,
                email,
                phone_number,
                domicile,
                formal_education,
                optional_form: savedOptional,
                cv : cv ? cv.path : null
            })
            
            return created(res,data,`Your data is submited, please wait for further information`)
        }
    }
})

module.exports = {
    createJobRegistration,
    allowedFileTypes,
    maxFileSize
}