const mongoose = require('mongoose')
const validator = require('validator')
const bycrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Task =require("../models/tasks")
const userSchema = new mongoose.Schema({
  name : {
  type: String,
  required: true,
  trim : true
  }  // the required here is true which means that it is a neccesity
  ,
  email : {
    type : String,
     unique: true, // create an index in mongo db to guarantee uniqueness
      required: true,
      trim: true,
      lowercase: true,
      validate(value)  {
        if(!validator.isEmail(value )) {
          throw new Error("email is invalid")
        } 
      }   
  },
  age: {
   type: Number,
   default: 0,
   validate(value) {
      if(value<0) {
          throw new Error("Age must be +ve")
      }

   } 
  },
   password: {
      type: String,
      required : true, 
      minlength: 7,
      trim : true,
      validate(value) {
          if(value.includes("password")) {
              throw new Error("password is bad")
          }
          // if(value.includes("password") && value.length < 6 || value.length < 6 ) {
          //     throw new Error("password is bad")
          // }
      }
   },
   tokens : [{  // adding a token to the schema
      token:{
        type: String,
        require: true
      } 
   }]  ,
   avatar : {
      type : Buffer  // binary data of image format
   }
  },
   {
   timestamps : true
    })
  // virtual property will be used
   // virtual because we are not changing the user document
   userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', // owner object id relationship between task and user id
    foreignField: 'owner' // name of field on task that will create
});

  // statics is accesible on the model
  // methods are used on instances
  userSchema.methods.generateToken = async function() {
  const user = this
  // targets the instance
  // object id => convert it into string
  const token  = jwt.sign({_id : user._id.toString() }, 'thisisnew') 
  // so it is using this string
  user.tokens = user.tokens.concat({token}) // token is getting added
  await user.save()
  return token

  }
  // this keyword should never be used with an arrow function
  userSchema.methods.tJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject 
  } 
  userSchema.statics.findByCredentials= async(email,password) => {
    const user = await User.findOne({email})
    if(!user) {
      throw new Error("Unable to login")
     }
     const match = await bycrypt.compare(password,user.password)
     if (!match) {
      throw new Error("Wrong Password")
     }
     return user
  }
  // pre means before saving basically
  // hashing password function
  userSchema.pre('save', async function(next) {
    const user = this
    // this gives us access to the user object that will be saved
      console.log("Just before saving ")  
      if(user.isModified('password')) { // user modifies password
       user.password = await bycrypt.hash(user.password, 8)
       // 8 rounds of hashing
      }
     next()   // run code before saving ;)
     // next is called when we are done 
  })
 
  // don't use an arrow function

const User = mongoose.model('User',userSchema )
    module.exports = User
    // so that other files can use it

