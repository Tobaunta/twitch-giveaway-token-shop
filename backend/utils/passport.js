import "dotenv/config"; // Load environment variables for configuration
import passport from "passport"; // Passport.js for authentication
import { Strategy } from "passport-twitch-new"; // Twitch authentication strategy
import User from "../models/user.js"; // User model for interacting with user data

// Passport Serialization & Deserialization

// Serialize user ID for session storage
passport.serializeUser((user, done) => {
  try {
    // Store the user's ID in the session (typically a cookie or database)
    done(null, user.id);
  } catch (error) {
    // Handle serialization errors
    done(error, null);
  }
});

// Deserialize user based on ID during subsequent requests
passport.deserializeUser(async (id, done) => {
  try {
    // Fetch the user document from the database using the ID
    const user = await User.findById(id);

    // Pass the retrieved user object to the next middleware
    done(null, user);
  } catch (error) {
    // Handle deserialization errors
    done(error, null);
  }
});

// Twitch Authentication Strategy Configuration
passport.use(
  new Strategy(
    {
      // Authentication options
      clientID: process.env.TWITCH_CLIENT_ID, // Your Twitch application client ID
      clientSecret: process.env.TWITCH_CLIENT_SECRET, // Your Twitch application client secret
      callbackURL: "http://localhost:3000/auth/login/redirect", // URL where Twitch redirects after authorization
      scope: "user_read", // Permission scope - in this case, requesting basic user information
    },

    // Callback function (executed after Twitch authorization)
    async function (accessToken, refreshToken, profile, done) {
      try {
        // Attempt to find an existing user with the Twitch ID
        const existingUser = await User.findOne({ twitchId: profile.id });

        if (existingUser) {
          // User already exists, return the existing user for session management
          return done(null, existingUser);
        }

        // User not found, create a new user document
        const newUser = new User({
          twitchId: profile.id, // Set the Twitch ID
          username: profile.display_name, // Set the Twitch username
          tokens: 0, // Set the initial token balance
          keys: [], // Set the initial list of keys
        });

        // Save the new user to the database
        await newUser.save();

        // User created successfully, return the new user for session management
        return done(null, newUser);
      } catch (err) {
        // Handle errors during user lookup or creation
        console.error("Error checking or creating user:", err);
        return done(err);
      }
    }
  )
);
