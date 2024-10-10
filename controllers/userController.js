const User = require('../models/user');
const Event = require('../models/events');
const rsvpModel = require('../models/rsvp');

exports.new = (req, res, next)=>{
    res.render('./user/new');
};

exports.create = (req, res, next)=>{
    let user = new User(req.body);
    user.save()
    .then(() => {
        req.flash('success', 'Registration successful !');
        res.redirect('/users/login')
    })       
    .catch(err => {
     if(err.name === 'ValidationError') {
        req.flash('error', err.message);
        return res.redirect('/users/new');
     }
     else if(err.code === 11000) {
        req.flash('error', "Email address has been used");
         return res.redirect('/users/new');
     }
 
     next(err)
     });
 };

exports.displayLogin = (req, res, next)=>{
    res.render('./user/login');
};

exports.login = (req, res, next)=>{
    //authenticate user login request
    let email = req.body.email;
    let password = req.body.password;
    // get the user matches the email
    User.findOne({email: email})
    .then(user => {
        if(user) {
            //user found in the database
            user.comparePassword(password)
            .then( result => {
                if(result) {
                    req.session.user = user._id;// store user id in the session
                    req.session.firstName = user.firstName;
                    req.flash('success', "You have successfully logged in !");
                    res.redirect('/');
                } else {
                    console.log("***wrong password****");
                    req.flash('error', "wrong password")
                    res.redirect('/users/login');
                }
            })
        } else {
            console.log("***wrong email*****");
            req.flash('error', "wrong email address")
            res.redirect('/users/login');
        }
    })
    .catch(err => next(err));
 };

exports.profile = (req,res, next) => {
    let id = req.session.user;
    console.log("===========", id);
    Promise.all([Event.find({hostName: id}),rsvpModel.find({user: req.session.user}).populate('event', 'title')])
    .then(results=>{
        const [events, rsvpEvents] = results;
        console.log("RSVP events=====", rsvpEvents);
        res.render('./user/profile', {events, rsvpEvents})
    })
    .catch(err=>next(err));
};

exports.logout = (req,res, next) => {
    req.session.destroy(err => {
        if(err) {
            return next(err);
        } else {
            res.redirect('/');
        }
    });
};