const express = require('express');
const PORT = 3000;
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();



// Passport Config
require('./config/passport')(passport);

//db config
const db = require('./config/keys').MongoURI;
//mongo connect
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>console.log('mongoDB connected!'))
.catch(err=>console.log(err));
 


//template engine
app.use(expressLayouts);
app.set('view engine','ejs');

//body parser
app.use(express.urlencoded({extended:false}));

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );


  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

  // Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


//routes
app.use('/',indexRouter);
app.use('/users',userRouter);



app.listen(PORT,console.log('server running on port 3000'));