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
month: {
  type: String,
},
day: {
  type: Number,
},
day_of_week: {
  type: String,
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
}
});


const Activity = mongoose.model('Activity', activitySchema);
activitySchema.plugin(uniqueValidator);
module.exports = Activity
