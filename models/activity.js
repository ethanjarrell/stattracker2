const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

const activitySchema = new mongoose.Schema({

user: {
  type: String,
  ref: 'Category'
},
category: {
  type: String,
  ref: 'Category',
},
activity_name: {
  type: String,
},
quantity: {
  type: Number,
},
metric: {
  type: String,
},
date: {
  type: Date,
},
time: {
  type: mongoose.Schema.Types.Mixed,
}
});


const Activity = mongoose.model('Activity', activitySchema);
activitySchema.plugin(uniqueValidator);
module.exports = Activity
