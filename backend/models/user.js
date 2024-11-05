import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  twitchId: String, // Twitch ID
  username: String, // Username
  tokens: Number, // User's token balance
  keys: [
    {
      name: String, // Giveaway name
      cdkey: String, // Giveaway CD key
    },
  ],
  isAdmin: {
    type: Boolean, // Flag to indicate if the user is an admin
    default: false, // Default value is false
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
