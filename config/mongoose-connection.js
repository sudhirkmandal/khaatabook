const mongoose = require('mongoose');
const dbgr = require("debug")("development:mongoose")

mongoose
.connect(`mongodb+srv://sudhirkmandal6:sudhirkmandal6@cluster0.j2qmg.mongodb.net/`)
.then(function(){
    dbgr("Connected to MongoDB");
})
.catch(function(err){    
    dbgr(err);
})

let db = mongoose.connection;
module.exports = db;
