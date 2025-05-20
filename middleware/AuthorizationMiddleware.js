const jwt = require('jsonwebtoken')

module.exports = function(req, res, next){
    if(req.method ==="OPTIONS"){
        next()
    }
    try {
        const jwt_token = req.headers.authorization.split(' ')[1]
        if(!jwt_token){
            return res.status(401).json({message:"Користувач не авторизований"})
        }
        const decoded = jwt.verify(jwt_token, process.env.SECRET_KEY)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({message:"Користувач не авторизований"})
    }
}