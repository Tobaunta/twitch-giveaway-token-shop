import { useState, useContext } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { GiveawayGame } from "../utils/interfaces.ts";
import { api_url } from "../../config.ts";

// Import the AuthContext and its context type
import { AuthContext, AuthContextType } from "../components/AuthContext.tsx";

const AddGame = () => {
  const { currentUser, loggedIn } = useContext(AuthContext) as AuthContextType;

  // State for giveaway game data and associated errors
  const [gameData, setGameData] = useState<GiveawayGame>({
    name: "",
    imageLink: "",
    storeLink: "",
    cdkey: "",
    collected: false,
  });
  const [errors, setErrors] = useState({} as GiveawayGame);

  // Function to validate giveaway game data
  const validateFields = () => {
    const newErrors = {} as GiveawayGame; // Initialize an empty object for errors

    // Function to validate a URL format
    const validateUrl = (url: string) => {
      const urlRegex = /^(http|https):\/\/[^\s]+/i;
      return urlRegex.test(url);
    };

    // Validate game name (required, not empty)
    if (!gameData.name.trim()) {
      newErrors.name = "Game name is required.";
    }

    // Validate image link (required, not empty and valid URL)
    if (!gameData.imageLink.trim()) {
      newErrors.imageLink = "Image link is required.";
    } else if (!validateUrl(gameData.imageLink)) {
      newErrors.imageLink = "Invalid image link. Please enter a valid URL.";
    }

    // Validate store link (required, not empty and valid URL)
    if (!gameData.storeLink.trim()) {
      newErrors.storeLink = "Store link is required.";
    } else if (!validateUrl(gameData.storeLink)) {
      newErrors.storeLink = "Invalid store link. Please enter a valid URL.";
    }

    // Validate CD key (required, not empty)
    if (!gameData.cdkey.trim()) {
      newErrors.cdkey = "CD key is required.";
    }

    // Set the errors state with any collected validation errors
    setErrors(newErrors);

    // Return true if validation passes (no errors), false otherwise
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    // Validate game data before submitting
    if (!validateFields()) {
      return; // Exit function if validation fails
    }

    try {
      // Send a POST request to the API endpoint to add the game
      const response = await fetch(`${api_url}/giveaway/addGame`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });

      if (response.ok) {
        console.log("Game added successfully!");
        window.location.reload(); // Reload the page on success
      } else {
        console.error("Error adding game:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding game:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "80vh",
      }}
    >
      {/* Conditionally render content based on logged-in admin status */}
      {loggedIn && currentUser?.isAdmin ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "90%", md: "70%", lg: "50%" },
            gap: 2,
          }}
        >
          <Typography variant="h5" sx={{ m: 2, p: 2 }}>
            ADD GAME
          </Typography>
          {/* Form fields for adding a game */}
          <TextField
            id="name"
            label="Game name"
            variant="outlined"
            autoComplete="off"
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name}
            onChange={(e) => setGameData({ ...gameData, name: e.target.value })}
          />
          <TextField
            id="imageLink"
            label="Image Link"
            variant="outlined"
            autoComplete="off"
            fullWidth
            required
            error={!!errors.imageLink}
            helperText={errors.imageLink}
            onChange={(e) =>
              setGameData({ ...gameData, imageLink: e.target.value })
            }
          />
          <TextField
            id="storeLink"
            label="Store Link"
            variant="outlined"
            autoComplete="off"
            fullWidth
            required
            error={!!errors.storeLink}
            helperText={errors.storeLink}
            onChange={(e) =>
              setGameData({ ...gameData, storeLink: e.target.value })
            }
          />
          <TextField
            id="cdkey"
            label="CD Key"
            variant="outlined"
            autoComplete="off"
            fullWidth
            required
            error={!!errors.cdkey}
            helperText={errors.cdkey}
            onChange={(e) =>
              setGameData({ ...gameData, cdkey: e.target.value })
            }
          />
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" sx={{ m: 2, p: 2 }}>
            You are not authorized to add games.
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#6441a5" }}
            onClick={() => window.open(`${api_url}/auth/login`, "_self")}
          >
            Login with Twitch
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AddGame;
