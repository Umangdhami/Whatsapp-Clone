const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const profileSchema = mongoose.Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'Register' },
    profile_pic: {
      type: String,
      require: true,
    },

    username : {
      type: String,
      require: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profiles", profileSchema);
