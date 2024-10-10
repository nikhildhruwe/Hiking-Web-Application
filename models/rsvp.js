const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// RSVP Schema
const rsvpSchema = new Schema({
    status: {type: String, required: [true, 'Status is required'], enum: ['YES', 'NO', 'MAYBE']},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'User is required']},
    event: {type: Schema.Types.ObjectId, ref: 'Event', required: [true, 'Event is required']}
},
  { timestamps: true }
);


module.exports = mongoose.model('RSVP', rsvpSchema);