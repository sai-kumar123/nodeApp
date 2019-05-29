var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')
var User = require('../models/userModel');
var app = express();
var nodemailer = require('nodemailer');
var multer = require('multer');
const path = require('path');
const crypto = require('crypto')



router.get('/',(req,res)=>{
   res.render("home")
})

router.get('/login',(req,res)=>{
   if(req.session.email){
      res.redirect('/dashboard')
   }
   else{res.render("login",{errinfo:req.query.info})}
})

router.post('/login',(req,res)=>{
   User.find({email:req.body.logemail},(err,data)=>{
     
      if(data && data.length){
         bcrypt.compare(req.body.logpassword,data[0].password,(err,resp)=>{
            if(resp){
               req.session.email = data[0].email;
               res.redirect("/dashboard")
            }
            else{
               res.redirect('/login?info=error')
            }
         })
      }
      else{
         res.redirect('/login?info=error')
      }
   })
})

router.get('/logout',(req,res)=>{
   req.session.destroy((err)=>{
      console.log('session cleared')
      res.redirect('/')
   })
})

router.get('/forget',(req,res)=>{
   res.render("forgetpwd")
})

router.post('/forget',(req,res)=>{

   var mailer = nodemailer.createTransport({
      service : "gmail",
      auth : {
         user : 'saleem.kumar5@gmail.com',
         pass : 'SKsam@7915'
      }
   })


   var mailOptions = {
      from : 'saleem.kumar5@gmail.com',
      to : req.body.email,
      subject : "sending email from the node js",
      text : "mail hasbeen sent"
   }
   
   mailer.sendMail(mailOptions,(err,info)=>{
      if (err) {
         console.log(err);
       } else {
         res.send('Email sent: ' + info.response);
       }
   })
   
})



router.get('/dashboard',(req,res)=>{

   if(req.session.email){
      User.find({email:req.session.email},(err,data)=>{
         if(err) console.log('error')
         else{
            res.render("dashboard",{
               email : data[0].email,
               name : data[0].username,
               date : data[0].date
            })
         }
      })
   }
   else{
      res.redirect('/login')
   }

})

router.get('/fupload',(req,res)=>{
   res.render("fileupload")
})


let fupload = multer.diskStorage({
      destination: (req, file, cb) => {
         cb(null, path.join(__dirname, '../tmp'))
    },
    filename: (req, file, cb) => {
       let customFileName = crypto.randomBytes(18).toString('hex'),
           fileExtension = file.originalname.split('.')[1] // get file extension from original file name
           cb(null, customFileName + '.' + fileExtension)
        }
     })

var upload = multer({ storage: fupload })
router.post('/fupload',upload.single('myfile'),(req,res)=>{
   const file = req.file
   if (!file) {
       res.send("file upload error")
   }
   res.send(file)
})


router.get('/signup', function(req, res){
   res.render('register');
});

router.post('/signup',(req,res)=>{
   
   bcrypt.hash(req.body.password,10,(err,hash)=>{

      let user = new User({
         email : req.body.email,
         username : req.body.username,
         password : hash
      })

      user.save((err)=>{
         if(err) console.log('error')
         else {
            req.session.email = req.body.email;
            console.log('data saved succesfully')
            res.redirect('/dashboard')
         }
      })

   })

})


//export this router to use in our index.js
module.exports = router;