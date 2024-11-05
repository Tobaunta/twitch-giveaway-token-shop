import express from "express"; // Import Express for creating web applications
const router = express.Router(); // Create a new router instance for this specific group of routes

// Import controller functions (assuming giveawayController.js exports these)
import {
  getGames,
  getUsers,
  addGame,
  addToken,
  removeToken,
  redeemGame,
  decryptKey,
} from "../controllers/giveawayController.js";

// Define routes using Express router methods

// GET Routes
router.get("/getGames", getGames); // Fetch all available games
router.get("/getUsers", getUsers); // Fetch all users (likely for admin purposes)

// POST Routes
router.post("/addGame", addGame); // Add a new game (giveaway)
router.post("/addToken/:username", addToken); // Add a token to a specific user (username in URL param)
router.post("/removeToken/:username", removeToken); // Remove a token from a specific user (username in URL param)
router.post("/redeemGame", redeemGame); // Redeem a game for a user
router.post("/decrypt", decryptKey); // Decrypt an encrypted key

export default router; // Export the router to be used in your main application file
