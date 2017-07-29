
  const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs');

  let Schema = mongoose.Schema;

  const userSchema = new Schema({username: String, password: String});

  userSchema.pre('save', function(next){
  let hash = bcrypt.hashSync(this.password, 6);
  this.password = hash;
  next();
  });

  const Users = mongoose.model('Users', userSchema);

  module.exports = Users;
