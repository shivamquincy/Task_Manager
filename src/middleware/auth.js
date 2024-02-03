// auth will authenticate users
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const auth = async (req,res,next) =>  {
     try {
      const token = req.header("Authorization").replace('Bearer ','') // removing the bearer part
      const decoded = jwt.verify(token, process.env.JWT_SECRET) // token verification
      const user = await User.findOne({_id: decoded._id, 'tokens.token' : token})
     if(!user) {
        throw new Error()
     }
     req.token = token // other route handlers are gonna use it
     req.user= user // we are passing the fetched user
     next()

     console.log(token)
     } catch(e) {
        res.status(401).send({error: "Please authenticate"})
     }
}
module.exports = auth