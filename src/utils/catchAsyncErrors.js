
// this function will work when there is an error in post verb
// Other wise this fuction will not do its work
// this function will send the err in the globle error handler via next keyword
module.exports = fn => {
    return (req, res, next)=>{
        fn(req, res, next).catch(err => next(err))
    }
}