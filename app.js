//require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session'); //4
const MongoStore = require('connect-mongo'); //4
const flash = require('connect-flash'); //4
const eventRoutes = require('./routes/eventRoutes');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');

//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
let url = 'mongodb+srv://ndhruwe:nbad123@cluster0.jxrinb3.mongodb.net/nbad-project-final';
app.set('view engine', 'ejs');

//connect to MongoDB
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    })
})
.catch(err=>console.log(err.message));

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true})); //post requests handling 
app.use(morgan('tiny')); //log all the request and response on terminal
app.use(methodOverride('_method'));

app.use(session({
    secret: 'ddsliwueiowuosswdsjkh',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongoUrl: url}),
    cookie: {maxAge: 60*60*1000}
}));

app.use(flash());

app.use((req,res,next) => {
    res.locals.user = req.session.user||null;
    res.locals.firstName = req.session.firstName||null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});


app.use('/', mainRoutes);

app.use('/events', eventRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url)
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render('error', {error: err});
});