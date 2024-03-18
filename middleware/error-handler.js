const {CustomApiError} = require('../middleware/custom-error')
const {payloadTooLargeResponse,limitUnexpectedFile,invalidFileType,badGateway,badRequest,conflict} = require('./response')
const multer = require('multer')
const Response = require('./response')

const errorHandler = (err,req,res,next)=>{
    if(err instanceof CustomApiError){
        return res.status(err.statusCode).json({message:err.message})
    }
    else if(err.name === 'ValidationError'){
        const fieldErrors = {};
        Object.keys(err.errors).forEach(field=>{
            fieldErrors[field] = err.errors[field].message;
        })
        return res.status(400).json({message:fieldErrors})
    }else if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        payloadTooLargeResponse(res)
    }else if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE'){
        limitUnexpectedFile(res)
    }else if (err instanceof multer.MulterError || err.message === 'INVALID_FORMAT'){
        invalidFileType(res)
    }else if(err.kind === 'ObjectId'){
        return badRequest(res,`Invalid Object Id`)
    }else if (err.name === 'CastError'){
        return badRequest(res,err.message)
    }
    else if(err.statusCode = 500){  
        return badGateway(res,err.message,err)
    }
}


module.exports = errorHandler