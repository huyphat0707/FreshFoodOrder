const express = require('express');
const expressHbs = require("express-handlebars");
const app = express();
const port = process.env.PORT || 3000;
const Handlebars = require('handlebars');
const cors = require('cors');
var passport = require('passport');
var flash = require('connect-flash');
app.use(flash());
var session = require('express-session');
var createError = require('http-errors');
var bodyParser = require('body-parser');
var express_handlebars_sections = require('express-handlebars-sections');
const expressValidator = require('express-validator');
app.use(expressValidator());
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

var admin = require('./routes/admin');
var product = require('./routes/product');
var cate = require('./routes/cate');
var user = require('./routes/user');
var users = require('./routes/userAdmin');
var indexRouter = require('./routes/index');

let bill = require('./routes/bill');
let billDetail = require('./routes/billDetail');

//connect mongoose
app.use(cors());
const mongoose = require('mongoose');
 mongoose.connect('mongodb+srv://admin:0joIlgGzoKMMEagE@cluster0.adn4g.mongodb.net/FreshVegetablemanager?retryWrites=true&w=majority', 
 {
    useNewUrlParser: true, 
    useFindAndModify: false,
    useUnifiedTopology: true,
}, function (err) {
  if (err) {
    console.log("Mongoose connect err" + err)
  } else {
    console.log("Mongoose connected successful")
  }
});

// app.use(function(req, res, next) {
//   next(createError(404));
// });

//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//configure handlebars
app.engine('.hbs', expressHbs());
app.set('view engine', '.hbs', 'handlebars');

app.engine(
  "hbs",
  expressHbs({
    extname: "hbs",
    defaultView: "main",
    defaultLayout: 'layout',
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + '/views/partials/',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    section: express_handlebars_sections(),
  })
);
//Lưu dữ liệu phiên đăng nhập
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: 'secret', 
  cookie: { maxAge: 60000000 }}));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.succsess_msg = req.flash('succsess_msg');
  res.locals.user = req.user;
  next();
});
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');
app.use('/admin', admin);
app.use('/admin/product', product);
app.use('/admin/cate', cate);
app.use('/admin/user', users);
app.use('/user', user);
app.use('/', indexRouter);
app.use('/admin/bill', bill);
app.use('/admin/billDetail', billDetail);
// app.use('/', indexRouter);

//api
app.use('/api/product', require('./api/product'));
app.use('/api/cate', require('./api/cate'));
app.use('/api/bill', require('./api/bill'));
app.use('/api/billDetail', require('./api/billDetail'));

//serving static files
// app.use(express.static('public'));
app.use(express.static(__dirname + "/public"));
app.use("/upload", express.static("/public/upload"));

app.listen(port, () => {
  console.log('server listening on port', port);
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


