import Giveaway from "../models/giveaway.js";
import User from "../models/user.js";
import { encryptString, decryptString } from "../utils/cryptoString.js";

const publicKey = process.env.CRYPTO_PUBLIC_KEY;
const privateKey = process.env.CRYPTO_PRIVATE_KEY;

// Controller function to retrieve a list of available games
export const getGames = async (req, res) => {
  // Fetch all giveaways from the database
  const giveaway = await Giveaway.find();

  // Sort giveaways by name in descending order (newest first)
  const sorted = giveaway.sort((a, b) => b.name - a.name);

  // Filter out giveaways that have already been collected
  const filtered = sorted.filter((giveaway) => giveaway.collected === false);

  // Prepare data to send as response
  const dataToSend = filtered.map((giveaway) => ({
    id: giveaway.id, // ID of the giveaway
    name: giveaway.name, // Name of the giveaway
    imageLink: giveaway.imageLink, // Link to the image of the giveaway
    storeLink: giveaway.storeLink, // Link to the store page of the giveaway
  }));

  // Send the response containing the list of available games
  res.send(dataToSend);
};

// Controller function to retrieve a list of all users
export const getUsers = async (req, res) => {
  // Fetch all users from the database
  const users = await User.find();

  // Sort users by username in descending order (newest or alphabetically last)
  const sortedUsers = users.sort((a, b) => b.username - a.username);

  // Send the response containing the list of users
  res.send(sortedUsers);
};

// Function to add a new game (giveaway)
export const addGame = async (req, res) => {
  try {
    // Extract data from request body
    const { name, imageLink, storeLink, cdkey } = req.body;

    // Encrypt the CD key
    const encryptedKey = encryptString(publicKey, cdkey);

    // Create a new Giveaway object with extracted data and encrypted key
    const newGiveaway = new Giveaway({
      name, // Name of the giveaway
      imageLink, // Link to the image of the giveaway
      storeLink, // Link to the store page of the giveaway
      cdkey: encryptedKey, // Encrypted CD key
    });

    // Save the new Giveaway to the database
    await newGiveaway.save();

    // Send a success response
    res.status(201).json({ message: "Game added successfully" });
  } catch (error) {
    // Error handling - log the error and send generic server error response
    console.error("Error saving giveaway:", error);
    res.status(500).json({ error: error.message });
  }
};

// Function to add a token to a user
export const addToken = async (req, res) => {
  try {
    // Extract username from request body
    const { username } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Increment the user's token count (assuming `tokens` is a field)
    user.tokens++;

    // Save the updated user document to the database
    await user.save();

    // Send successful response with a message
    res.status(200).json({ message: "Token added successfully" });
  } catch (error) {
    // Error handling - log the error and send generic server error response
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to remove a token from a user
export const removeToken = async (req, res) => {
  try {
    // Extract username from request body
    const { username } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Decrement the user's token count
    user.tokens--;

    // Save the updated user document to the database
    await user.save();

    // Send successful response with a message
    res.status(200).json({ message: "Token removed successfully" });
  } catch (error) {
    // Error handling - log the error and send generic server error response
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to redeem a game
export const redeemGame = async (req, res) => {
  try {
    // Get giveaway ID and user ID from request body
    const { giveawayId, userId } = req.body;

    // Validate input
    if (!giveawayId || !userId) {
      return res.status(400).json({ error: "Missing giveaway ID or user ID" });
    }

    // Find the giveaway document
    const giveaway = await Giveaway.findById(giveawayId);
    if (!giveaway) {
      return res.status(404).json({ error: "Giveaway not found" });
    }

    // Check if the giveaway has already been collected
    if (giveaway.collected) {
      return res
        .status(400)
        .json({ error: "Giveaway has already been redeemed" });
    }

    // Find the user document
    const user = await User.findOne({ twitchId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has enough tokens
    if (user.tokens < 1) {
      return res.status(400).json({ error: "Not enough tokens" });
    }

    // Update giveaway document
    giveaway.collected = true;

    const saveData = {
      name: giveaway.name,
      cdkey: giveaway.cdkey,
    };

    // Update user document (add CD key to user.keys array)
    user.keys.push(saveData);
    user.tokens--; // Reduce users tokens by 1
    await giveaway.save();
    await user.save();

    res.status(200).json({ message: "Game redeemed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const decryptKey = async (req, res) => {
  try {
    const { encryptedKey } = req.body;
    const decryptedKey = decryptString(privateKey, encryptedKey);
    res.status(200).json({
      success: true,
      decryptedKey: decryptedKey,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to decrypt key" });
  }
};
