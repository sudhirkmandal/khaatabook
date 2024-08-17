const mongoose = require("mongoose");

const hisaabSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minLength:3,
        maxLength:20
    },
    description:{
        type:String,
        required:true,
        trim:true,       
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    encrypted:{
        type:Boolean,
        default:false
    },
    shareable:{
        type:Boolean,
        default:false
    },
    passcode:{
        type:String,
        default:""
    },
    editpermissions:{
        type:Boolean,
        default:false
    }
}, {timestamps:true})

const Hisaab = mongoose.model("Hisaab", hisaabSchema);

module.exports = Hisaab;