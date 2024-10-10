const { DateTime } = require('luxon');
const model = require('../models/events');
const rsvpModel = require('../models/rsvp');
const Event = require('../models/events');

exports.index = (req, res, next) => {
    model.find()
        .then(events => {
            console.log("**", events);
            res.render('./events/index.ejs', { events })
        })
        .catch(err => next(err));
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    let loggedInUserId = req.session.user;
    Promise.all([model.findById(id).populate('hostName','firstName lastName'),rsvpModel.find({status: 'YES', event: req.params.id})])
    .then(results => {
        console.log(results);
        const [event, rsvpEvents] = results;
        const rsvpCount = rsvpEvents.length || 0;
        if (event) {
            res.render('./events/eventDetails.ejs', { event, rsvpCount});
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.new = (req, res) => {
    res.render('./events/newEvent');
};

exports.create = (req, res, next) => {
    let event = new model(req.body);
    // console.log(event);
    if (req.file) {
        let image = req.file.filename;
        event.image = "../images/" + image;
    }
    event.hostName = req.session.user;
    event.save()
        .then(event => {
            req.flash('success', "Event was created successfully !");
            res.redirect('/events');
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', "Validation Error, Check all the fields");
                res.redirect('back');
            }
            next(err);
        });
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id).lean()
        .then(event => {
            if (event) {
                event.startDateTime = DateTime.fromJSDate(event.startDateTime).toISO({ includeOffset: false, suppressMilliseconds: true });
                event.endDateTime = DateTime.fromJSDate(event.endDateTime).toISO({ includeOffset: false, suppressMilliseconds: true });
                return res.render("./events/edit", { event });
            } else {
                let err = new Error('Cannot find a event with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

exports.update = (req, res, next) => {
    let newEvent = req.body;
    let id = req.params.id;
    if (req.file) {
        let image = req.file.filename
        newEvent.image = "../images/" + image;
    }

    model.findByIdAndUpdate(id, newEvent, { useFindAndModify: false, runValidators: true })
        .then(newEvent => {
            if (newEvent) {
                req.flash('success', "Event was updated successfuly!");
                res.redirect('/events/' + id);
            } else {
                let err = new Error('Cannot find a story with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            if ((err.name === 'ValidationError')) {
                err.status = 400;
            }
            next(err)
        });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    Promise.all([model.findByIdAndDelete(id, { useFindAndModify: false }) , rsvpModel.deleteMany({event : id}, { useFindAndModify: false })])
        .then(results => {
            const [event, rsvp] = results;
            if (event) {
                req.flash('success', "Event was deleted successfuly!");
                res.redirect('/events');
            }
            else {
                let err = new Error('Cannot find a story with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

exports.createRSVP = (req, res, next) => {
    const eventId = req.params.id;
    const userId = req.session.user;
    console.log("inside rsvp");
    console.log(req.body);
    rsvpModel.findOneAndUpdate(
                { user: userId, event: eventId },
                { status: req.body.status},
                { new: true, upsert: true, runValidators: true }
            )
        .then(rsvp => {
            let createdDate = new Date(rsvp.createdAt);
            let updatedDate = new Date(rsvp.updatedAt);
            if (createdDate.getTime() === updatedDate.getTime()) {
                req.flash('success', 'RSVP was created successfully!');
            } else {
                req.flash('success', 'RSVP was updated successfully!');
            }
            res.redirect('/users/profile');
        })
        .catch(err => next(err));
};


