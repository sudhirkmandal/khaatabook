const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 20,
        required: true,    
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      profilepicture: {
        type: String,
        trim: true,
        default: "default.webp"
      },
      email: {
        type: String,
        required: true,
        trim: true,    
      },
      password: {
        type: String,
        required: true,
        select:false,
      },
    hisaab: [{type: mongoose.Schema.Types.ObjectId, ref:"Hisaab"}]
})

const User = mongoose.model("User", userSchema)
module.exports = User