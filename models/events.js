const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  category: { type: String, required: [true, 'Category is required'], enum: ['Local Treks', 'Adventure Series', 'International Expeditions', 'Tips & Techniques', 'Others'] },
  title: { type: String, required: [true, 'Title is required'] },
  hostName: {type: Schema.Types.ObjectId, ref: 'User'},
  startDateTime: { type: Date, required: [true, 'Start date and time are required'] },
  endDateTime: { type: Date, required: [true, 'End date and time are required'] },
  details: { type: String, required: [true, 'Details are required'] },
  image: { type: String, required: [true, 'Image is required'] },
  location: { type: String, required: [true, 'Location is required'] }
},
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
