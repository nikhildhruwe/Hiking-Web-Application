const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middleware/auth');
const {logInLimiter} = require('../middleware/rateLimiters');
const {validateSignUp, validateLogIn, validateResult} = require('../middleware/validator');

const router = express.Router();

//GET send html form for signing up a new user
router.get('/new', isGuest, controller.new);

////create new user - post request
router.post('/', isGuest, validateSignUp, validateResult, controller.create);

//GET send html form for logging in
router.get('/login', isGuest, controller.displayLogin);

////show loggedIn user - post request
router.post('/login', logInLimiter, isGuest, validateLogIn, validateResult, controller.login);

//get profile
router.get('/profile', isLoggedIn, controller.profile);

//logout the user
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;