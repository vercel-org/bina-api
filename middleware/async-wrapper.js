const asyncWrapper = (param) =>{
    return async(req,res,next)=>{
        try {
            await param(req,res,next)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = asyncWrapper