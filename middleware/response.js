const asyncWrapper = require("./async-wrapper");

const response = (res,status,data,code,message)=>{
    return res.status(code).json({
        data:data,
        code:code,
        status:status,
        message:message})
}

const payloadTooLargeResponse = (res)=>{
    return response(res,'PAYLOAD_TOO_LARGE',null,413,`File size too large`)
}

const limitUnexpectedFile = (res)=>{
    return response(res,'UNSUPPORTED_MEDIA_TYPE',null,415,`Unexpected file type`)
}

const invalidFileType = (res)=>{
    return response(res,'INVALID_FORMAT',null,403,`Invalid File Type`)
}

const conflict = (res,message)=>{
    return response(res,'CONFLICT',null,409,message)
}

const created = (res,data,message)=>{
    return response(res,'CREATED',data,201,message)
}

const badRequest =(res,message)=>{
    return response(res,'BAD_REQUEST',null,400,message)
}

const notFound =(res,message)=>{
    return response(res,'NOT_FOUND',null,404,message)
}

const badGateway = (res,message,data)=>{
    return response(res,'BAD_GATEWAY',data,500,message)
}

const ok = (res,message,data)=>{
    return response(res,`OK`,data,200,message)
}

function parsePaginationParams(query){
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    return {page,limit,skip}
}

// Helper function to build date range query
function buildQuery(queryObject, start_date,end_date) {

    // Build date range query
    if (start_date) {
        queryObject.createdAt = { $gte: new Date(start_date) };
    }
    if (end_date) {
        queryObject.createdAt = {
            ...queryObject.createdAt,
            $lte: new Date(end_date)
        };
    }

    return queryObject;
}


function selectFields(query,fields){
    if(fields){
        const fieldsList = fields.split(',').join(' ');
        query = query.select(fieldsList)
    }
    return query
}

function applySort(query,sort){
    if (sort) {
        const sortList = sort.split(',').join(' ');
        query = query.sort(sortList);
    } else {
        query = query.sort('createdAt');
    }
    return query;
}



module.exports = {
    payloadTooLargeResponse,
    limitUnexpectedFile,
    invalidFileType,
    response,
    conflict,
    created,
    badRequest,
    notFound,
    badGateway,
    ok,
    selectFields,
    applySort,
    parsePaginationParams,
    buildQuery
};








// const responseMiddleware = (req, res, next) => {
//     res.customResponse = (data, code = 200, message = 'Success') => {
//         res.status(code).json({
//             data: data,
//             code: code,
//             status: (code === 200) ? 'success' : 'error',
//             message: message
//         });
//     };
//     next();
// };