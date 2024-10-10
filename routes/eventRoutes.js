const express = require('express');
const controller = require('../controllers/eventController');
const {fileUpload} = require('../middleware/fileUpload');
const {validateId} = require('../middleware/validator');
const {isLoggedIn, isAuthor, isEventHost} = require('../middleware/auth');
const {validateEvent, validateResult, validateRSVP} = require('../middleware/validator');

const router = express.Router();

//get - send all events
router.get('/', controller.index);

//get /events/new send html form for creating a new event
router.get('/new', isLoggedIn, controller.new);

//get /events/:id send details of event identified by id
router.get('/:id', validateId, controller.show);

//get /events/:id/edit: send the html form for editing an existing event
router.get('/:id/edit',  isLoggedIn, validateId, isAuthor, controller.edit);

//put /events/:id update the event identified by id
router.put('/:id', isLoggedIn, validateId, isAuthor, fileUpload, validateEvent, validateResult, controller.update);

//post /events create a new event
router.post('/', isLoggedIn, fileUpload, validateEvent, validateResult, controller.create);

//delete /events/:id
router.delete('/:id',  isLoggedIn, validateId, isAuthor, controller.delete);

//get /events/:id/edit: send the html form for editing an existing event
router.post('/:id/rsvp',  isLoggedIn, validateId, isEventHost, validateRSVP, validateResult, controller.createRSVP);

module.exports = router;
