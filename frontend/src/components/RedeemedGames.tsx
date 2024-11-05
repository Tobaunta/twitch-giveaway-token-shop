import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { DecryptedKey } from "../utils/interfaces";
import { api_url } from "../../config";

// Import the AuthContext and its context type
import { AuthContext, AuthContextType } from "../components/AuthContext.tsx";

const RedeemedGames = () => {
  const { currentUser, loggedIn } = useContext(AuthContext) as AuthContextType;
  const [decryptedKeys, setDecryptedKeys] = useState([] as DecryptedKey[]);

  // Check if user has any keys and decrypt them if needed
  useEffect(() => {
    const decryptKeys = async () => {
      if (currentUser && currentUser.keys.length > 0) {
        const decryptedKeys = await Promise.all(
          currentUser.keys.map(async (keyData: DecryptedKey) => {
            return {
              name: keyData.name,
              cdkey: await decryptKey(keyData.cdkey),
            };
          })
        );
        // Update state with decrypted keys
        setDecryptedKeys(decryptedKeys);
      }
    };
    decryptKeys();
  }, [currentUser, loggedIn]);

  // Function to decrypt an encrypted key.
  const decryptKey = async (encryptedKey: string) => {
    try {
      const response = await fetch(`${api_url}/giveaway/decrypt`, {
        method: "POST",
        credentials: "include", // Include cookies for authentication
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true", // Allow cross-origin cookies
        },
        body: JSON.stringify({ encryptedKey }),
      });
      const data = await response.json();
      if (data.success) {
        return data.decryptedKey;
      } else {
        console.error("Error decrypting key:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error decrypting key:", error);
      return null;
    }
  };

  return (
    <>
      {/* Conditionally render content based on login status */}
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
            You are signed in as {currentUser.username}!
          </Typography>

          {/* Display redeemed games if user has any */}
          {currentUser.keys.length > 0 ? (
            <>
              <TableContainer>
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell width={"50%"}>Name</TableCell>
                      <TableCell width={"50%"}>CD-Key</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {decryptedKeys.map((keyData, i) => (
                      <TableRow
                        key={i}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {keyData.name}
                        </TableCell>
                        <TableCell>{keyData.cdkey}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Typography variant="h6" sx={{ mb: 4 }}>
              You have not redeemed any games yet.
            </Typography>
          )}
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
            Please login to see redeemed games.
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
    </>
  );
};

export default RedeemedGames;
