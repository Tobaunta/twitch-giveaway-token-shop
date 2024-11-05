import { Button, Card, CardActions, CardMedia } from "@mui/material";
import { LaunchOutlined } from "@mui/icons-material";
import ConfirmDialog from "./ConfirmDialog";
import { api_url } from "../../config";
import { GameCardProps } from "../utils/interfaces";

export default function GameCard({
  id, // ID of the game
  uid, // User ID
  tokens, // User's token balance
  name, // Game name
  imageLink, // Image link for the game
  storeLink, // Store link for the game
}: GameCardProps) {
  // Function to redeem a giveaway game
  const redeemGiveaway = async () => {
    const userId = uid; // User ID
    const giveawayId = id; // Giveaway ID

    try {
      // Send a POST request to the API to redeem the game
      const response = await fetch(`${api_url}/giveaway/redeemGame`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, giveawayId }),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parse the response and handle success or error
      const data = await response.json();
      if (data.message == "Game redeemed successfully") {
        window.location.reload(); // Reload the page on success
      }
      console.log("Giveaway redeemed successfully:", data);
    } catch (error) {
      console.error("Error redeeming giveaway:", error);
    }
  };

  return (
    <Card sx={{ width: 230 }}>
      {/* Display the game image */}
      <CardMedia sx={{ height: 107.5 }} image={imageLink} title={name} />
      {/* Card actions with buttons */}
      <CardActions sx={{ justifyContent: "space-between" }}>
        {/* Button to open the game's store page in a new tab */}
        <Button
          size="small"
          href={storeLink}
          target="_blank"
          variant="outlined"
        >
          <LaunchOutlined /> Store
        </Button>
        {/* Confirmation dialog for redeeming the game */}
        <ConfirmDialog
          button="Trade" // Button text
          title="Confirm Trade" // Dialog title
          text={`Are you sure you want to trade one of your ${tokens} tokens for ${name}?`} // Dialog body text
          shop // Show shopping cart icon
          confirm={redeemGiveaway} // Callback function to redeem the game
          disabled={tokens < 1} // Disable button if user doesn't have enough tokens
        />
      </CardActions>
    </Card>
  );
}
