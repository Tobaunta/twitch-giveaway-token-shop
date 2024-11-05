import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Edit, Add, Remove } from "@mui/icons-material";
import { User } from "../utils/interfaces.ts";
import { api_url } from "../../config.ts";
import { SkeletonRows } from "./SkeletonRows.tsx";

// Import the AuthContext and its context type
import { AuthContext, AuthContextType } from "../components/AuthContext.tsx";

const GiveawayToken = () => {
  const { currentUser, loggedIn } = useContext(AuthContext) as AuthContextType;

  // State to control loading indicator
  const [isLoading, setIsLoading] = useState(true);

  // State to store list of users
  const [users, setUsers] = useState([] as User[]);
  const [filteredUsers, setFilteredUsers] = useState([] as User[]);

  // State for search filter
  const [filterText, setFilterText] = useState("");

  // State for forcing re-render (used after data changes)
  const [rerender, setRerender] = useState(false);

  // Fetch list of users on component mount and re-render (if not fetched from AuthContext)
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${api_url}/giveaway/getUsers`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!currentUser?.isAdmin) {
      // Handle non-admin users here (e.g., display message)
      return;
    }

    fetchUsers();
  }, [currentUser?.isAdmin, rerender]);

  useEffect(() => {
    const filterUsers = () => {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(filterText.toLowerCase())
      );
      setFilteredUsers(filtered);
    };

    if (users.length > 0) {
      filterUsers();
    }
  }, [users, filterText]);

  // Function to add a giveaway token to a user
  const handleAddToken = async (username: string) => {
    try {
      const response = await fetch(`${api_url}/giveaway/addToken/${username}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error("Failed to add token");
      }

      // Trigger re-render to update UI
      setRerender(!rerender);
    } catch (error) {
      console.error("Error adding token:", error);
    }
  };

  // Function to remove a giveaway token from a user
  const handleRemoveToken = async (username: string) => {
    try {
      const response = await fetch(
        `${api_url}/giveaway/removeToken/${username}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove token");
      }

      // Trigger re-render to update UI
      setRerender(!rerender);
    } catch (error) {
      console.error("Error removing token:", error);
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
      {/* Conditionally render content based on login status and user role */}
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
            GIVEAWAY TOKEN
          </Typography>
          <Button variant="contained" onClick={() => setRerender(!rerender)}>
            Refresh List
          </Button>
          <Input
            type="text"
            placeholder="Search by username"
            value={filterText}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setFilterText(event.target.value)
            }
          />

          {/* Display table of users */}
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell width={"80%"}>Username</TableCell>
                  <TableCell width={"10%"}>Tokens</TableCell>
                  <TableCell width={"10%"}>
                    <Edit />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Conditionally render loading indicator or user rows */}
                {isLoading
                  ? SkeletonRows
                  : filteredUsers.map((user: User, i) => (
                      <TableRow
                        key={i}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {user.username}
                        </TableCell>
                        <TableCell>{user.tokens}</TableCell>
                        <TableCell sx={{ display: "flex", gap: 1 }}>
                          <Remove
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleRemoveToken(user.username)}
                          />
                          <Add
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleAddToken(user.username)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" sx={{ m: 2, p: 2 }}>
            You are not authorized to give tokens.
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

export default GiveawayToken;
