const jwt = require('jsonwebtoken');

const createJWT = (id, email, role) =>{
    return jwt.sign({id, email, role},
        process.env.SECRET_KEY,
         {expiresIn:'48h'})
}


module.exports = { createJWT };