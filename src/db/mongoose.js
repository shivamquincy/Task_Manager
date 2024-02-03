const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_CONNECTION)

// const me = new User({
//     name: "Tanzuuu",
//     email: "TanzTrincy@gmail.com",
//     password: "   gayyyy"

// })
// me.save().then(() => {
//   console.log(me)
// }).catch((error) => {
// console.log("Error: ", error)
// })
//returns a promise
// this is a model ;))




// return a promise