const schema = require('../models/agent')
const detailSchema = require('../models/agent-detail')
const countrySchema = require('../models/country')
const asyncWrapper = require('../middleware/async-wrapper')
const {conflict,created,badRequest,selectFields,applySort,parsePaginationParams,buildQuery, notFound, ok} = require('../middleware/response')
const _ = require('lodash')

const createAgent = asyncWrapper(async(req,res)=>{

    //create detail agent from req.body
    const detailAgent = new detailSchema({
        agentEmail:req.body.agentEmail,
        agentPhoneNumber:req.body.agentPhoneNumber
    }) 
    const agent = new schema({
        agentName: req.body.agentName,
        country: req.body.country,
        agentDetail:detailAgent
    })
    const emailExists = await detailSchema.exists({agentEmail:detailAgent.agentEmail})
    if(emailExists){
        return conflict(res,`Email is exist, please use other email`)
    }
    const agentExists = await schema.exists({agentName:agent.agentName});
    if(agentExists){
        // make first character become capitalize
        agentName = _.capitalize(agent.agentName)
        return conflict(res,`Agent ${agent.agentName} already exist`)
    }
    
    const detail = await detailSchema.create(detailAgent);
    const data = await schema.create(agent);
    created(res,data,`Agent ${data.agentName} is created`)
})

const getAgents = asyncWrapper(async(req,res)=>{
    const {agent,sort,fields,startDate,endDate} = req.query
    const queryObject = {}
    if(agent){
        queryObject.agentName = agent
    }
    buildQuery(queryObject,startDate,endDate)

    let result = schema.find(queryObject).populate('agentDetail')
    result = applySort(result,sort)
    result = selectFields(result,fields)
    const pageParams = await parsePaginationParams(req.query)
    result = result.skip(pageParams.skip).limit(pageParams.limit)
    
    const data = await result
    if(data.length === 0){
        if(agent === undefined){
            return notFound(res,`No agent found`)
        }else{
            return notFound(res,`Agent ${agent} not found`)
        }
    }
    return ok(res,`Retrieved ${data.length} agent`,data) 
})

const getAgent = asyncWrapper(async(req,res)=>{
    const{id,agent} = req.query
    let data = {}
    if(id){
        data = await schema.findById(id).populate('agentDetail')
    }else{
        data = await schema.findOne({agentName:agent}).populate('agentDetail')
    }

    if(!data){
        return notFound(res,`Agent not found`)
    }
    return ok(res,`Success find agent ${data.agentName}`,data)
})

const updateAgent = asyncWrapper(async(req,res)=>{
    const {id} = req.query
    let {agentName,country,agentEmail,agentPhoneNumber} = req.body
    const existingAgent = await schema.findOne({_id:id})
    if(existingAgent && existingAgent._id.toString() != id){
        return conflict(res, `Agent ${agentName} is exist`) 
    }else if(!existingAgent){
        return badRequest(res,`Agent not found`)
    }else{
        if(agentName){
            agentName = agentName.toLowerCase()
        }   
    }
    const idDetail = existingAgent.agentDetail
    const updatedObjectAgent = {
        agentName,
        country
    }
    const updatedObjectAgentDetail = {
        agentEmail,
        agentPhoneNumber
    }

    const updatedAgent = await schema.findByIdAndUpdate(id,updatedObjectAgent,{new:true})
    await detailSchema.findByIdAndUpdate(idDetail,updatedObjectAgentDetail,{new:true})
    
    if(!updatedAgent){
        return notFound(res,`Agent not found`)
    }
    const data = await updatedAgent.populate('agentDetail');
    return ok(res,`Agent updated successfully`,data)

})

module.exports = {
    createAgent,
    getAgents,
    getAgent,
    updateAgent
}