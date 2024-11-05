import { Box, Typography } from "@mui/material";
import hero from "../assets/hero.png";

export default function Home() {
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
      <Typography variant="h5" sx={{ m: 2, p: 2 }}>
        Twitch Giveaway Token Shop
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          width: "100%",
        }}
      >
        <Box component="img" src={hero} alt="logo" sx={{ width: "40vw" }} />
        <Typography variant="body1">
          Maximize your Twitch Giveaway experience with a token shop. Redeem
          your tokens for a variety of exciting rewards, including exclusive
          in-game items, games and more. It's your chance to unlock the full
          potential of your hard-earned tokens.
        </Typography>
      </Box>
    </Box>
  );
}
