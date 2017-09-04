const mongoose = require('mongoose');


let Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
})

const User = mongoose.model('User', userSchema);

module.exports = User;
