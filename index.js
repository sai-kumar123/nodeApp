// adding inbuilt  modules
const path = require('path')

//adding third party modules
const express = require("express"),
app = express(),
bodyParser = require('body-parser'),
cookieParser = require('cookie-parser'),
expsession  =  require('express-session');
MongoStore  =  require('connect-mongo')(expsession);
helmet = require('helmet'),
bcrypt = require('bcrypt'),
morgan =require('morgan'),
mongoose = require('mongoose'),
nodemailer = require('nodemailer'),
multer = require('multer'),
ejs = require('ejs');
require ('dotenv').config();


//connect to MongoDB
mongoose.connect('mongodb://localhost/userdb',{ useNewUrlParser: true });
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//setting view engine
app.set('view engine','ejs')
app.set('views',__dirname+'/views')
app.engine('html',require('ejs').renderFile)


//setting static folders
app.use(express.static('public'))
app.use(express.static('views'))
app.use(express.static('node_modules'))


//configures middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(expsession({
  secret:process.env.secret,
  resave:false,
  saveUninitialized:true,
  store:new MongoStore({mongooseConnection:db})
}))
app.use(helmet())
app.use(morgan('dev'))


//routes configuration
var userRoute = require('./routes/userRoutes.js');

app.use('/',userRoute)


//error route
app.use('*',(req,res)=>{
    res.render('e404')
})


//setting port and listening on server
const PORT = process.env.PORT || 3000
app.listen(PORT,(err)=>{
    console.log('Server started at http://localhost:'+PORT+'.....')
})


