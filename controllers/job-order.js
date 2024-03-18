const schema = require('../models/job-order')
const detailSchema = require('../models/job-order-detail')
const asyncWrapper = require('../middleware/async-wrapper')
const {conflict,created,badRequest} = require('../middleware/response')
const _ = require('lodash')

const createJobOrder = asyncWrapper(async(req,res)=>{
    const {requirements,qualification,job_description,status,job_order_name} = req.body

    //create detail job order from req.body
    const jobOrderDetail = new detailSchema({
        requirements:req.body.requirements,
        qualification:req.body.qualification,
        job_description:req.body.description,
        status:req.body.status
    }) 
    const jobOrder = new schema({
        job_order_name: req.body.job_order_name,
        agent:req.body.agent,
        job_order_detail:jobOrderDetail
    })
    
    const detail = await detailSchema.create(jobOrderDetail);
    const data = await schema.create(jobOrder);
    created(res,data,`Agent ${data.job_order_name} is created`)
})

module.exports = {
    createJobOrder
}