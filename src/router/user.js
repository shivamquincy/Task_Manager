const express = require('express')
const User = require("../models/user")
const Task = require("../models/tasks")
const sharp = require("sharp")
const auth = require("../middleware/auth")
const router = new express.Router()
const sendEmail = require("../email/account")
const multer = require('multer')
//this is where plain text will be provided
router.post('/users', async (req,res) => {
    const user = new User(req.body)
     try{
 const token = await user.generateToken()
 await user.save()
 await sendEmail(user.email, `Hello! ${user.name}`, 'Welcome to the App!');
 res.status(201).send({user , token})
} catch(e) {
 res.status(400).send(e.message)
}

   //   user.save().then(() => {
   //     res.status(201).send(user)
   //   }).catch((error) => {
   //      res.status(400).send(error)
        //res.send(error)
        // always send status before error
    // })
})

router.post("/users/login" , async(req,res) => {
   try {
      const user = await User.findByCredentials(req.body.email, req.body.password) 
      const token = await user.generateToken()
      res.send({user : user , token})
      // it is stringifying it
      // we are sending user as well as token 
   } catch(e) {
     res.status(400).send({ error: e.toString() })
   }
})
router.post('/users/logout', auth , async(req,res) => {
   try {
      // we get the individual token
      req.user.tokens = req.user.tokens.filter((token) => {
         return token.token !== req.token; // the array returns the tokens that were not used for authentication  
     })
     
    await req.user.save()
    res.send()
   }  catch(e) {
     res.status(500).send(e)
   }
})
router.post("/users/logoutall" , auth , async(req,res) => {
   try {
   req.user.tokens = []
   await req.user.save()
   res.send("All users have been logged off")
   }
     catch(e) {
      res.status(500).send(e)  
     }
   // simply make it equal to an empty array
})
// first runs the middleware followed by the route
router.get("/users/me", auth , async (req,res) => {
   // function runs if user is authenticated
   res.send(req.user)
})
//   User.find({}).then((users) => {
//      res.send(users)
//   }).catch((e) => {
//      res.status(500).send()
//  })
// we need not to convert string id to object id
// router.get("/users/:id" , async (req,res) => {
//    const _id = req.params.id 
//    try{
//      const user = await User.findById(_id)
//      if(!user) {
//       return user.status(400).send()
//      }
//      res.send(user)
//    } catch{
//       res.status(500).send()
//    }
//    //  const _id = req.params.id 
//    // User.findById(_id).then((user) => {
//    //  if(!user) {
//    //      return res.status(404).send()
//    //  }
//    //  res.send(user)
//    // }).catch((e)  => {
//    //  res.status(500).send()
//    // })

// })
router.patch('/users/me' , auth,  async (req,res) => {
   const updates = Object.keys(req.body)
   // this allowed update is checking if req.body has any of the allowed updates
   const allowedUpdates = ['name', 'age' , 'email', 'password']
   const isValid = updates.every((update) =>  allowedUpdates.includes(update))
   if(!isValid) {
      return res.status(400).send({error : "Invalid Update"})
   }
   try{
      
      // iterate over and apply properties
      updates.forEach((update) =>  req.user[update] = req.body[update]) // gets called each time
        await  req.user.save()
         // . is not used because property is gonna change


      
      // new user AS OPPOSED TO THE FOUND ONE
      // updates applied new user
    //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true})
    res.send(req.user)
   }catch(e){
     res.status(400).send({Error : e.message})
   }

})
// runs if  user is authenticated
// router.delete("/users/me" , auth,  async(req,res) => { 
//    // remove yourself bitch
//    try{  
//       //  if (!user ) {
//       //    return res.status(404).send
//       //  }
//        await req.user.remove()
//        res.send(req.user)
//        res.send("Account Deleted Successfully!")
//    } catch(e) {
//     res.status(500).send(e)
//    } 
// })
// router.delete('/users/me', auth, async (req, res) => {
//    try {
//         await req.user.remove()
//         res.send(req.user)
//    } catch (e) {
//        res.status(500).send(e)
//    }
// })
router.delete("/users/me" ,auth, async (req,res) => {
   try{
      await Task.deleteMany({owner : req.user._id})
      await sendEmail(req.user.email, `Goodbye! ${req.user.name}`, 'We hope you had a good experience!');
   await req.user.deleteOne()
      res.send(req.user)
   } catch(e) {
   res.status(500).send({error : e.message })
   }
} )
const upload = multer ({
   // dest : 'avatar', if we remove dest multer will simply pass the data
   limits: {  // limits is an obj
      fileSize: 1000000,
      }, 
      fileFilter(req, file, cb) { // req = req being made
          if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
           return cb(new Error("Please upload Image"))
          }
          cb(undefined , true)
          // file = info about file being uploaded
          // cb = tell multer file has been filtered
      //    cb(new Error("File must be a Pdf"))
      //    cb(undefined, true) // if upload is expected
      //    cb(undefined, false) //rejects file
      
      }
      })

router.post("/users/me/avatar",auth, upload.single('avatar'), async (req,res) => {
   const buffer = await sharp(req.file.buffer).resize({width : 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer // user basically takes the bufferdata in avatar field
    await req.user.save()
    res.send()
}, (error, req, res , next) => {
   res.status(400).send({error : error.message})
})
router.delete("/users/me/avatar" , auth , async(req,res) => {
   req.user.avatar = undefined
   await req.user.save()
   res.send()
}, (error, req,res , next) => {
   res.status(400).send({error: error.message})
})
router.get("/users/:id/avatar", async (req,res) => {
   try {
      const user = await User.findById(req.params.id)
      if(!user || !user.avatar) {
           throw new Error()
      }
      res.set('Content-Type', 'image/png')  // key value pair
      res.send(user.avatar)
   } catch(e) {
      res.status(404).send({Error: e.message})
   }
})
// router.post('/api/email', async (req, res) => {
//    const user = new User(req.body)
//    const mailOptions = {
//       from: 'singh.shvam26@gmail.com',
//       to: req.body.recipientEmail,
//       subject: req.body.subject,
//       text: req.body.message
//    };
  
//    try {
//       let info = await transporter.sendMail(mailOptions);
//       res.status(200).send({ success: true });
//    } catch (error) {
//       res.status(500).send({ Error : error.message});
//    }
//   });
module.exports = router 