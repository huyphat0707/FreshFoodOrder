const express = require('express');
const expressHbs = require("express-handlebars");
const app = express();
const port = process.env.PORT || 3000;
const Handlebars = require('handlebars')
var flash = require('connect-flash');
var session = require('express-session');
var createError = require('http-errors');
var bodyParser = require('body-parser');
var express_handlebars_sections = require('express-handlebars-sections');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

var admin = require('./routes/admin');
var product = require('./routes/product');
var cate = require('./routes/cate');

//connect mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:0joIlgGzoKMMEagE@cluster0.adn4g.mongodb.net/FreshVegetablemanager?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false}, function (err) {
  if (err) {
    console.log("Mongoose connect err" + err)
  } else {
    console.log("Mongoose connected successful")
  }
});

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
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use('/admin', admin);
app.use('/admin/product', product);
app.use('/admin/cate', cate);

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


