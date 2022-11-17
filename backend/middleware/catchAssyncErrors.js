module.exports = (asyncErrorFunction) => (req, res, next)=>{
    Promise.resolve(asyncErrorFunction(req,res,next)).catch(next);
}