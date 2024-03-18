const schema = require('../models/news-event')
const asyncWrapper = require('../middleware/async-wrapper')
const _ = require('lodash')
const {created,conflict,ok,selectFields,applySort,parsePaginationParams,buildQuery, notFound, badGateway} = require('../middleware/response')
const fs = require('fs')

const maxFileSize = process.env.MAX_SIZE_NEWS  * 1024 * 1024
const allowedFileTypes = new RegExp(`${process.env.ALLOWED_TYPES_PICTURE.split(',').join('|')}`);


const createNewsEvent = asyncWrapper(async(req,res)=>{
    let {title,content} = req.body
    const pictures = req.files
    const picturePaths = pictures.map(picture => picture.path);
        
    const data = await schema.create({
        title,
        content,
        picture:picturePaths
    })
    country = req.query.country
    return created(res,data,`News & Event ${title} is created`)

})

const getNewsEventList = asyncWrapper(async(req,res)=>{
    const {title,sort,fields,startDate,endDate} = req.query
    const queryObject = {}
    
    if(title){
        queryObject.title = title
    }
    buildQuery(queryObject,startDate,endDate)
    
    let result = schema.find(queryObject)
    
    result = applySort(result,sort)    
    result = selectFields(result,fields)
    const pageParams = await parsePaginationParams(req.query)
    result = result.skip(pageParams.skip).limit(pageParams.limit)
    
    const data = await result
    if(data.length === 0){
        if(title === undefined){
            return notFound(res,`No news or event found`)
        }
        else{
            return notFound(res,`News and Event ${title} not found`)
        }
    }
    return ok(res,`Retrieved ${data.length} News & Event`,data)
})


const getNewsEvent = asyncWrapper(async(req,res)=>{
    const {id,title} = req.query;
    let data = {}

    if(id){
        data = await schema.findById(id)
    }else{
        data = await schema.findOne({title:title})
    }

    if(!data){
        return notFound(res,`News & Event not found`)
    }
    return ok(res,`Success find News & Event ${data.title}`,data)
})

const updateNewsEvent = asyncWrapper(async(req,res)=>{
    const {id} = req.query
    let {title,content,deletedPictures} = req.body
    const pictures = req.files
    let filesToDelete,newPictures = []
    const existingNewsEvent = await schema.findById({_id:id})
    
    let updatedObject = {
        title,
        content,
        }

    if(deletedPictures && pictures.length > 0){
        if(existingNewsEvent.picture.includes(deletedPictures)){
            // SPLIT DELETE PICTURE FROM INPUT TO ARRAY
            filesToDelete = deletedPictures.split(',') || [];

            // PICTURE FROM DB - FILESTODELETE
            newPictures = existingNewsEvent.picture.filter(element=>!deletedPictures.includes(element))

            // DELETE FILE FROM STORAGE
            filesToDelete.forEach(picture=>{
                fs.unlink(picture,(err)=>{
                    if(err){
                        return badGateway(res,`Error in serever`,err)
                        }
                    })
            })

            // MERGE ARRAY FROM DB + PICTURE UPLOADED
            const newPicturesArray = [].concat(...Array.from(new Set([newPictures,[...pictures.map(picture => picture.path)]])));
            
            updatedObject.picture = newPicturesArray
            console.log(updatedObject);
            const updatedNewsEvent = await schema.findByIdAndUpdate(id,updatedObject,{new:true})
            return ok(res,`News & Event updated successfully`,updatedNewsEvent)
        }else{
            return notFound(res,`Deleted Picture Not Found`)
        }
    }
    else if(deletedPictures && existingNewsEvent.picture.includes(deletedPictures)){
        // SPLIT DELETE PICTURE FROM INPUT TO ARRAY
        filesToDelete = deletedPictures.split(',') || [];
        // PICTURE FROM DB - FILESTODELETE
        newPictures = existingNewsEvent.picture.filter(element=>!deletedPictures.includes(element))

        // DELETE FILE FROM STORAGE
        filesToDelete.forEach(picture=>{
            fs.unlink(picture,(err)=>{
                if(err){
                    return badGateway(res,`Error in serever`,err)
                    }
                })
        })
        
        updatedObject.picture = newPictures
        const updatedNewsEvent = await schema.findByIdAndUpdate(id,updatedObject,{new:true})
        return ok(res,`News & Event updated successfully`,updatedNewsEvent)
    
    }
    else if(pictures.length > 0 && !deletedPictures){

        newPictures = existingNewsEvent.picture

        // MERGE ARRAY FROM DB + PICTURE UPLOADED
        const newPicturesArray = [].concat(...Array.from(new Set([newPictures,[...pictures.map(picture => picture.path)]])));
        
        updatedObject.picture = newPicturesArray
        const updatedNewsEvent = await schema.findByIdAndUpdate(id,updatedObject,{new:true})
        return ok(res,`News & Event updated successfully`,updatedNewsEvent)
    }else{
        const updatedNewsEvent = await schema.findByIdAndUpdate(id,updatedObject,{new:true})
        return ok(res,`News & Event updated successfully`,updatedNewsEvent)
    }
   
})

module.exports = {
    createNewsEvent,
    getNewsEventList,
    getNewsEvent,
    updateNewsEvent,
    allowedFileTypes,
    maxFileSize
}