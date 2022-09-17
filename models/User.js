const { Schema, model } = require("mongoose");


//User Schema
const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      match: [/.+\@.+\..+/],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],

    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);



//get total count of friends for user
UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

UserSchema.virtual("thoughtCount").get(function(){
  return this.thoughts.length;
})
//create User model using UserSchema
const User = model("User", UserSchema);

module.exports = User;
