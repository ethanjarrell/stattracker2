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
  lowercase: true,
},
quantity: {
  type: Number,
},
metric: {
  type: String,
  lowercase: true,
},
month: {
  type: String,
  lowercase: true,
},
day: {
  type: Number,
},
day_of_week: {
  type: String,
  lowercase: true,
},
year: {
  type: Number,
},
hour: {
  type: Number,
},
minute: {
  type: Number,
},
am_pm: {
  type: String,
  lowercase: true,
}
});


const Activity = mongoose.model('Activity', activitySchema);
activitySchema.plugin(uniqueValidator);
module.exports = Activity
