const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req, res ,next) =>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateResult = (req, res, next) => {
    // console.log(req);
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
};

exports.validateEvent = [
    body('category', 'Category can not be empty, please select a category!').notEmpty().trim().escape()
        .isIn(['Local Treks', 'Adventure Series', 'International Expeditions', 'Tips And Techniques', 'Others'])
        .withMessage('category should only be Local Treks, Adventure Series, International Expeditions, Tips And Techniques or Others'),
    body('title', 'Title cannot be empty').notEmpty().trim().escape(),
    body('details', 'Details cannot be empty').notEmpty().trim().escape(),
    body('location', 'Where cannot be empty').notEmpty().trim().escape(),
    body('startDateTime', 'Start cannot be empty').notEmpty().trim()
        .isISO8601().withMessage('Start date must be a valid format YYYY-MM-DDThh:mm:ssTZD')
        .isAfter(new Date().toISOString()).withMessage('Start date must be after today\'s date').escape(),
    body('endDateTime', 'End cannot be empty').notEmpty().trim()
        .isISO8601().withMessage('End date must be a valid format YYYY-MM-DDThh:mm:ssTZD')
        .custom((value, { req }) => {
            const endDateTime = new Date(value);
            const startDateTime = new Date(req.body.startDateTime);
            console.log("startDAte", startDateTime);
            console.log("endDAte", endDateTime);
            if ( endDateTime.getTime() <= startDateTime.getTime()) {
                console.log("end date is before");
                throw new Error("End date must be after Start date");
            }
            return true;
        }).escape()
];

exports.validateRSVP = [
    body('status', 'RSVP cannot be empty').notEmpty().trim().escape().
    isIn(['YES', 'NO', 'MAYBE']).withMessage('RSVP should only be YES, NO or MAYBE')
    ];