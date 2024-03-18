const schema = require('../models/role')
const asyncWrapper = require('../middleware/async-wrapper')
const {created,conflict,ok,selectFields,applySort,parsePaginationParams,buildQuery, notFound} = require('../middleware/response')
const _ = require('lodash')


const createRole = asyncWrapper(async(req,res)=>{
    //check role exist or not
    roleName = req.body.roleName.toLowerCase();
    const roleExist = await schema.exists({roleName:roleName});
    if(roleExist){
        // make first character become capitalize
        roleName = _.capitalize(roleName)
        return conflict(res,`${roleName} role already exist`)
    }

    //insert schema to db
    const data = await schema.create(req.body)
    created(res,data,`Role ${data.roleName} is created`)
}) 
const getRoles = asyncWrapper(async(req,res)=>{
    const {role,sort,fields,start_date,end_date} = req.query
    const queryObject = {}
    
    if(role){
        queryObject.roleName = role
    }

    buildQuery(queryObject, start_date,end_date);

    let result = schema.find(queryObject);

    result = applySort(result,sort)
    result = selectFields(result,fields)

    const pageParams = await parsePaginationParams(req.query)
    
    result = result.skip(pageParams.skip).limit(pageParams.limit)

    const data = await result
    if(data.length === 0){
        return notFound(res,`Role ${role} not found`)
    }
    return ok(res,`Retrieved ${data.length} roles`,data) 
}) 

const getRole = asyncWrapper(async(req,res)=>{
    const {id,role} = req.query;
    let data = {}
    console.log(data);

    if(id){
        data = await schema.findById(id)
    }else{
        data = await schema.findOne({roleName:role})
    }

    if(!data){
        return notFound(res,`Role not found`)
    }
    return ok(res,`Success find role ${data.roleName} detail`,data)
})

const updateRole = asyncWrapper(async(req,res)=>{
    const {id} = req.query
    let {roleName} = req.body
    if(roleName){
        roleName = roleName.toLowerCase()

    }
    
    const existingRole = await schema.findOne({roleName})
    if(existingRole && existingRole._id.toString() !== id){
        return conflict(res,`Role ${roleName} is exist`)
    }

    let updatedObject = {
        roleName:roleName
    }

    const updatedRole = await schema.findByIdAndUpdate(id,updatedObject,{new:true})
    if(!updatedRole){
        return notFound(res,`Role not found`)
    }
    return ok(res, 'Role updated successfully', updatedRole);
})



module.exports = {
    createRole,
    getRoles,
    getRole,
    updateRole, 
}