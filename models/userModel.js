var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var schema = mongoose.Schema;

var userSchema = new schema({
    email : String,
    username : String,
    password : String,
    files : {type:Array,default:[]},
    chat : {type:Array,default:[]},
    date : {type:Date, default:Date.now}
})

module.exports = mongoose.model('User',userSchema)


