const mongoose = require('mongoose')
const validator = require('validator')
const TaskSchema = new mongoose.Schema({
    description : {
        type : String,
        required: true,
        trim: true

    }, completed: {
        type : Boolean,
        default: false
    }, 
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" // we are making a ref to the User Model
}
}, { // you have to provide an owner for that task
 timestamps: true

})


const Task = mongoose.model('Task' , TaskSchema )
module.exports = Task