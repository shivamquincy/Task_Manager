const express = require('express')
const Task = require("../models/tasks")
const auth = require("../middleware/auth")
const router = new express.Router()

//TASKS
router.post('/tasks',auth,  async(req,res) => {
   // const task =new Task(req.body)   
   const task = new Task({
    ...req.body, // spread operator copies data 
    owner: req.user._id
   })
    try {
      await task.save()
      res.status(201).send(task)
    } catch {
       res.status(400).send()
    }
 //    task.save().then(() => {
 //     res.status(201).send(task)
 //   }).catch((error) => {
 //      res.status(400).send(error)
 //      //res.send(error)
 //      // always send status before error
 //   })
 })
 
 
 router.get("/tasks",auth, async (req,res) => {
  const match = {}
   const sort = {}
    if(req.query.completed) {
    match.completed = req.query.completed === "true" //
  }
   if(req.query.sortBy) {
    const parts = req.query.sortBy.split(':') // splitting it
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
   }
    try {
        await req.user.populate({
        path : 'tasks',
        match ,
      options : {
        limit : parseInt(req.query.limit),
        skip : parseInt(req.query.skip),
        sort
     } })
     res.send(req.user.tasks)
    } catch(e) {
     res.status(500).send({Error : e.message})
    }
 
    //  Task.find({}).then((task) => {
    //     res.send(task)
    //  }).catch((e) => {
    //     res.status(500).send()
    //  })
   })
   
   router.get("/tasks/:id" ,auth,  async (req,res) => {
     const _id = req.params.id 
     try{
       const task = await Task.findOne({ _id, owner: req.user._id}) // the owner with this id
   //const task = await Task.findById(_id)
     if(!task) {
         return res.status(404).send()
     }
     res.send(task)
    } catch{
     res.status(500).send()
    }
 
 })
 router.patch("/tasks/:id" ,auth, async(req,res) => {
    const updates = Object.keys(req.body)
    // this allowed update is checking if req.body has any of the allowed updates
    const allowedUpdates = ['description', 'completed']
    const isValid = updates.every((update) =>  allowedUpdates.includes(update))
    if(!isValid) {
       return res.status(400).send({error : "Invalid Update"})
    }
    try {
      const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
     // const task = await Task.findById(req.params.id)
      // iterate over and apply properties

      //  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true})
           if (!task) {
          return res.status(404).send()
           }
           updates.forEach((update) =>  task[update] = req.body[update]) // gets called each time
           await task.save()
       res.send(task)
       }catch (e){
         res.status(400).send(e)
       }
 })
 router.delete('/tasks/:id', auth, async (req, res) => {
  try {
      const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

      if (!task) {
          res.status(404).send()
      }

      res.send(task)
  } catch (e) {
      res.status(500).send()
  }
})
//  router.delete("/tasks/:id" ,auth, async(req,res) => {
//     try{
//         const task = await Task.findOneAndDelete({_id: req.params.id, owner : req.user._id})
//         if (!task ) {
//           return res.status(404).send
//         }
//         res.send(task)
//     } catch(e) {
//      res.status(500).send({Error : e.message})
//     } 
//  })
 
module.exports = router