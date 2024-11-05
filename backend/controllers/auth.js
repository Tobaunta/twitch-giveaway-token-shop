import passport from "passport";

// Login handler
export const login = (req, res, next) => {
  // Authenticate user with Twitch strategy
  passport.authenticate("twitch", (err, user, info) => {
    if (err) {
      // Pass error to error handling middleware
      return next(err);
    }
    if (!user) {
      // Authentication failed, send error response
      return res.status(401).json({ success: false, message: "Login failed" });
    }

    // Log the user in
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        // Pass error to error handling middleware
        return next(loginErr);
      }

      // Login successful, redirect or send success response
      res
        .status(200)
        .json({ success: true, message: "Login successful", user });
    });
  })(req, res, next); // Apply middleware chain
};

// Logout handler
export const logout = (req, res) => {
  // Log the user out
  req.logout((err) => {
    if (err) {
      // Log error and send error response
      console.error("Error logging out:", err);
      return res.status(500).send("Error logging out");
    }

    // Redirect to client-side URL
    res.redirect(process.env.CLIENT_URL);
  });
};

// API endpoint to check user authentication status
export const apiUser = (req, res) => {
  if (req.isAuthenticated()) {
    // User is authenticated, send user information
    res.status(200).json({
      success: true,
      message: "Authenticated",
      user: req.user,
    });
  } else {
    // User is not authenticated, send error response
    res.status(401).json({
      success: false,
      message: "You are not logged in",
    });
  }
};
