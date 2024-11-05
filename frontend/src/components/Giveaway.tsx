import { useContext, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import GameCard from "./GameCard";
import { GiveawayGame } from "../utils/interfaces.ts";
import { api_url } from "../../config.ts";

// Import the AuthContext and its context type
import { AuthContext, AuthContextType } from "../components/AuthContext.tsx";

export default function Giveaway() {
  // State to store user data
  const { currentUser, loggedIn } = useContext(AuthContext) as AuthContextType;

  // State to store available giveaway games
  const [games, setGames] = useState([] as GiveawayGame[]);

  // Fetches giveaway games on login status change
  useEffect(() => {
    const fetchGames = async () => {
      if (!loggedIn) return; // Skip fetching games if not logged in
      try {
        const response = await fetch(`${api_url}/giveaway/getGames`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
          },
        });
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchGames();
  }, [loggedIn]);

  return (
    <Box>
      {/* Display content based on login status */}
      {loggedIn && currentUser ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" sx={{ m: 4 }}>
            Welcome {currentUser.username}! You have {currentUser.tokens}{" "}
            unspent tokens.
          </Typography>
          {currentUser.keys.length > 0 && (
            <Button variant="contained" sx={{ mb: 4 }} href="/redeemed">
              Redeemed Games
            </Button>
          )}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {/* Render GameCard components for each available game */}
            {games.map((game, i) => (
              <GameCard
                key={i}
                tokens={currentUser.tokens}
                {...game}
                uid={currentUser.twitchId}
              />
            ))}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "80vh",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "20px" }}>
            Please login to see the giveaway items
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
}
