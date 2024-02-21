const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  Lastname: {
    type: String,
    required: true
  },
  Firstname: {
    type: String,
    required: true
  },
  Gender: {
    type: String,
    required: true
  },
  Birthday: {
    type: Date,
    required: true
  },
  Age: {
    type: Number,
    get: function() {
      const today = new Date();
      const birthDate = new Date(this.Birthday); // Corrected field name
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
  }
});

const UserProfile = mongoose.model('UserProfile', userSchema);
module.exports = UserProfile;


