const schema = require('../models/user')
const roleSchema = require('../models/role')
const agentSchema = require('../models/agent')
const asyncWrapper = require('../middleware/async-wrapper')
const {created,conflict,notFound} = require('../middleware/response')
const _ = require('lodash')
const {hashPassword,checkPassword} = require('../middleware/hash-password')


const createUser = asyncWrapper(async(req,res)=>{
    let {username,password,agent,role} = req.body
    const usernameExist = await schema.exists({username:username});
    if(usernameExist){
        return conflict(res,`User ${_.capitalize(username)} already exist`)
    }

    const roleExist = await roleSchema.exists({_id:req.body.role})
    
    if(!roleExist && role){
        return notFound(res,`Role with id ${req.body.role} not found`)
    }

    const agentExist = await agentSchema.exists({_id:req.body.agent})
    if(!agentExist && agent){
        return notFound(res,`Agent with id ${req.body.agent} not found`)
    }

    password = await hashPassword(password,10)

    const data = await schema.create({
        username,
        password:password,
        agent,
        role,
        status:true
    })

    return created(res,data,`User ${username} created`)

})

const getUsers = asyncWrapper(async(req,res)=>{
    const {sort,fields,start_date,end_date} = req.query
    const queryObject = {}
    

    buildQuery(queryObject, start_date,end_date);

    let result = schema.find(queryObject);

    result = applySort(result,sort)
    result = selectFields(result,fields)

    const pageParams = await parsePaginationParams(req.query)
    
    result = result.skip(pageParams.skip).limit(pageParams.limit)

    const data = await result

    return ok(res,`Retrieved ${data.length} users`,data) 
})

const getUser = asyncWrapper(async(req,res)=>{
    const {id} = req.query;
    let data = {}

    if(id){
        data = await schema.findById(id)
    }

    if(!data){
        return notFound(res,`User not found`)
    }
    return ok(res,`Success find User ${data.title}`,data)
})

module.exports = {
    createUser,
    getUser,
    getUsers
}