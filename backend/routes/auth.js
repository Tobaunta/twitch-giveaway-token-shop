import express from "express"; // Import the Express framework for creating web applications
const router = express.Router(); // Create a new router instance to handle specific routes

import passport from "passport"; // Import the Passport library for authentication

import { login, logout, apiUser } from "../controllers/auth.js"; // Import authentication controllers

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace for debugging
  res.status(500).json({ success: false, message: "Internal server error" }); // Send a generic error response with a 500 status code
});

// Define routes
router.get("/login", login); // Route for initiating the Twitch login process
router.get("/login/redirect", passport.authenticate("twitch"), (req, res) => {
  // passport.authenticate("twitch") is a middleware that handles the authentication flow
  res.redirect(`${process.env.CLIENT_URL}/giveaway`); // Redirect the user to the client-side giveaway page
});
router.get("/user", apiUser); // Route for fetching user information
router.get("/logout", logout); // Route for logging out the user

export default router; // Export the router to be used in your main application
