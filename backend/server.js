import "dotenv/config"; // Loads environment variables from .env file
import "./utils/passport.js"; // Imports passport configuration (likely strategies)
import express from "express"; // Imports Express framework
import cors from "cors"; // Imports CORS middleware for cross-origin requests
import session from "express-session"; // Imports session middleware for managing user sessions
import MongoStore from "connect-mongo"; // Imports MongoDB session store
import passport from "passport"; // Imports Passport authentication middleware
import connectDB from "./utils/mongodb.js"; // Imports MongoDB connection function
import authRoutes from "./routes/auth.js"; // Imports authentication routes
import giveawayRoutes from "./routes/giveaway.js"; // Imports giveaway routes

const app = express(); // Creates an Express application
app.use(express.json()); // Parses JSON request bodies

// Setup Session
app.use(
  session({
    name: "SessionID", // Name of the session cookie
    secret: process.env.SESSION_SECRET, // Secret key for signing the session cookie
    resave: false, // Don't resave session if unmodified
    saveUninitialized: false, // Don't save unmodified new sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // Session cookie expiration time (7 days)
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // MongoDB connection URL for session storage
    }),
  })
);

// Setup passport
app.use(passport.initialize()); // Initializes Passport middleware
app.use(passport.session()); // Enables session-based authentication

// Setup CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allowed origin for CORS requests
    methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

// Connect to MongoDB
connectDB(); // Connects to the MongoDB database

// Routes
app.use("/auth", authRoutes); // Mounts authentication routes
app.use("/giveaway", giveawayRoutes); // Mounts giveaway routes

// Run server
app.listen(3000, () => console.log("Server ready on port 3000.")); // Starts the server on port 3000
