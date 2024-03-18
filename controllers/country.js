const schema = require('../models/country')
const asyncWrapper = require('../middleware/async-wrapper')
const _ = require('lodash')
const {created,conflict,ok,selectFields,applySort,parsePaginationParams,buildQuery, notFound, badGateway, badRequest} = require('../middleware/response')
const fs = require('fs')

const maxFileSize = process.env.MAX_SIZE_COUNTRY  * 1024 * 1024
const allowedFileTypes = new RegExp(`${process.env.ALLOWED_TYPES_PICTURE.split(',').join('|')}`);

const createCountry = asyncWrapper(async(req,res)=>{
    //destructure
    let {countryName,description} = req.body
    let picture = req.file
    // if(!picture){
    //     return badRequest(res,`You must provide a picture`)
    // }
    if(countryName){
        countryName = countryName.toLowerCase()
    }
    //convert country name to lowercase
    //check country is exist or not
    const countryExists = await schema.exists({countryName:countryName});
    if(countryExists){
        // make first character become capitalize
        countryName = _.capitalize(countryName)
        return conflict(res,`${countryName} Country already exist`)
    }
    if(picture){
        picture = picture.path
    }
    //create schema
    const data = await schema.create({
        countryName,
        description,
        picture:picture
    })
    
    return created(res,data,`Country ${countryName} is created`)
})

const getCountries = asyncWrapper(async(req,res)=>{
    const {country,sort,fields,start_date,end_date} = req.query
    const queryObject = {}
    
    if(country){
        queryObject.countryName = country
    }

    buildQuery(queryObject, start_date,end_date);

    let result = schema.find(queryObject);

    result = applySort(result,sort)
    result = selectFields(result,fields)

    const pageParams = await parsePaginationParams(req.query)
    
    result = result.skip(pageParams.skip).limit(pageParams.limit)

    const data = await result

    if(data.length === 0){
        if(country === undefined){
            return notFound(res,`No Country found`)
        }
        else{
            return notFound(res,`Country ${country} not found`)
        }
    }
    return ok(res,`Retrieved ${data.length} country`,data) 
})

const getCountry = asyncWrapper(async(req,res)=>{
    const {id,country} = req.query;
    let data = {}

    if(id){
        data = await schema.findById(id)
    }else{
        data = await schema.findOne({countryName:country})
    }

    if(!data){
        return notFound(res,`Country not found`)
    }
    return ok(res,`Success find country ${data.countryName}`,data)
})

const updateCountry = asyncWrapper(async(req,res)=>{
    const {id} = req.query
    let {countryName,description} = req.body
    const picture = req.file
    const existingCountryById = await schema.findById(id)
    if(!existingCountryById){
        return badRequest(res,`Country with id ${id} not found`)
    }
    if(existingCountryById && existingCountryById._id.toString() != id){
        return conflict(res, `Country ${countryName} is exist`)
    }else{
        if(countryName){
            countryName = countryName.toLowerCase()
        }
        let updatedObject = {
            countryName,
            description
        }
        if(req.file && req.file.fieldname === 'picture'){
            if(existingCountryById.picture){
                fs.unlink(existingCountryById.picture,(err)=>{
                    if(err){
                        return badGateway(res,`Error in server`,err)
                    }
                })
                updatedObject.picture = picture.path || existingCountryById.picture;
            }
        }
        const updatedCountry = await schema.findByIdAndUpdate(id, updatedObject, { new: true });
    
        if(!updatedCountry){
            return notFound(res,`Country not found`)
        }
        return ok(res,`Country updated successfully`,updatedCountry)

    }
})

module.exports = { 
    createCountry,
    allowedFileTypes,
    maxFileSize,
    getCountries,
    getCountry,
    updateCountry
}