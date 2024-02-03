const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/user')
const taskRouter = require('./router/task')
const User = require("./models/user")
const app = express()
const port = process.env.PORT 
const Task = require("./models/tasks");


// app . use basically is over ridding the router importion,
// app.use((req,res,next) => {
//     if(req.method) { 
//         res.status(503).send("Site is under maintenance")
//     } 
// })

// app.use((req, res, next)  => {
//      if(req.method === 'GET') {
//         res.send("Get requests are prohibited")
//      } else {
//         next()
//      }
      

// })
// const main = async() => {
//     // const task = await Task.findById('65b87f417ef85a40678b3d11').populate('owner')
//     //  console.log(task.owner)
//     const user = await User.findById("65b87e760ae7c7a6d93bfd2e").populate('tasks')
//     console.log(user.tasks)
// }
// main()
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
// const myFunction = async() => {
//     const token = jwt.sign({_id: "abc123"}, "ilovethis", {expiresIn: "7 days"})
//     console.log(token)

//  const data=   jwt.verify(token,"ilovethis" )

//  console.log(data)
//     // returns a new token
//     // a token is like a band in coachella
    
//     // encryption allows us to convert it to original
//     // hashing is a one way algorithm
//     // no way to get it back
//  // password given - hashes into hassPass - compared with the one stored in the database
// }
// const pet = {
//     name: "Hall"
// }
// pet.toJSON = function () {
//     return {}
// // no properties attached 
// // to jSon has manipulated in the middleware
// }
// console.log(JSON.stringify(pet))
//myFunction()
// const multer = require('multer')
// // we are creating a multer object 
// // dest === destination 
// const upload = multer ({
// dest : 'images',
// limits: {  // limits is an obj
// fileSize: 1000000,
// }, 
// fileFilter(req, file, cb) { // req = req being made
//     if(!file.originalname.match(/\.(doc|docx)$/)) {
//      return cb(new Error("Please upload a Word Document"))
//     }
//     cb(undefined , true)
//     // file = info about file being uploaded
//     // cb = tell multer file has been filtered
// //    cb(new Error("File must be a Pdf"))
// //    cb(undefined, true) // if upload is expected
// //    cb(undefined, false) //rejects file

// }
// })
// const errorMiddleWare = (req, res, next) => {
//     throw new Error("From my middleware")
// }
//upload.single() is the middleware from multer
// app.post('/upload' , upload.single('upload'), (req,res) => {
//     res.send()
// }, (error, req, res , next) => { // after getting error we get a callback
//     res.status(400).send({error : error.message})
// })
module.exports = app;