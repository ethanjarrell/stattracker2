const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({

user: {
  type: String,
  ref: 'User',
},

activity_type: {
  type: String,
},

});

categorySchema.plugin(uniqueValidator);
const Category = mongoose.model('Category', categorySchema);

module.exports = Category
