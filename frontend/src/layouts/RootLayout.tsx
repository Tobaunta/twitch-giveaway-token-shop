import { useEffect, useState, MouseEvent, useContext } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet, NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/logo.png";
import { api_url } from "../../config";
import { AuthContext, AuthContextType } from "../components/AuthContext";

export default function RootLayout() {
  // Context to manage authentication
  const { currentUser, setCurrentUser, loggedIn, setLoggedIn } = useContext(
    AuthContext
  ) as AuthContextType;

  // State to manage the navigation menu's anchor element
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Function to open the navigation menu
  const openNav = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to close the navigation menu
  const closeNav = () => {
    setAnchorEl(null);
  };

  // Effect hook to fetch user information on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch user data from the API endpoint
        const response = await fetch(`${api_url}/auth/user`, {
          method: "GET",
          credentials: "include", // Include credentials for authentication
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true", // Allow credentials in the request
          },
        });

        // Parse the response JSON
        const data = await response.json();

        // If the request was successful, update the user and login status
        if (data.success) {
          setLoggedIn(true);
          setCurrentUser(data.user);
        }
      } catch (error) {
        // Log any errors that occur during the fetch
        console.error("Error fetching user data:", error);
      }
    };

    // Call the fetchUser function to initiate the data fetching process
    fetchUser();
  }, [setCurrentUser, setLoggedIn]);

  return (
    <Box className="root-layout">
      {/* Header section */}
      <header>
        <nav className="navbar">
          {/* App bar with rounded corners and container for responsive layout */}
          <AppBar position="static" sx={{ borderRadius: 2 }}>
            <Container maxWidth="xl">
              {/* Toolbar with justified content spacing */}
              <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
                {/* Logo image */}
                <Box
                  component={"img"}
                  src={logo}
                  alt="logo"
                  sx={{
                    width: "45px",
                    height: "45px",
                    mr: 2,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    window.location.href = "/";
                  }}
                />
                {/* Navigation links */}
                <Box sx={{ display: { xs: "flex", md: "none" } }}>
                  <IconButton size="large" onClick={openNav} color="inherit">
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={closeNav}
                    sx={{ display: { xs: "block", md: "none" } }}
                  >
                    <NavLink to="/">
                      <MenuItem onClick={closeNav}>
                        <Typography sx={{ color: "black" }}>Home</Typography>
                      </MenuItem>
                    </NavLink>
                    <NavLink to="/giveaway">
                      <MenuItem onClick={closeNav}>
                        <Typography sx={{ color: "black" }}>
                          Giveaway
                        </Typography>
                      </MenuItem>
                    </NavLink>
                    {loggedIn && currentUser?.isAdmin && (
                      <NavLink to="/add-game">
                        <MenuItem onClick={closeNav}>
                          <Typography sx={{ color: "black" }}>
                            Add Game
                          </Typography>
                        </MenuItem>
                      </NavLink>
                    )}
                    {loggedIn && currentUser?.isAdmin && (
                      <NavLink to="/giveaway-token">
                        <MenuItem onClick={closeNav}>
                          <Typography sx={{ color: "black" }}>
                            Give Tokens
                          </Typography>
                        </MenuItem>
                      </NavLink>
                    )}
                    {loggedIn ? (
                      <NavLink to="/">
                        <MenuItem onClick={closeNav}>
                          <Typography
                            sx={{ color: "black" }}
                            onClick={() =>
                              window.open(`${api_url}/auth/logout`, "_self")
                            }
                          >
                            Logout
                          </Typography>
                        </MenuItem>
                      </NavLink>
                    ) : (
                      <NavLink to="/">
                        <MenuItem onClick={closeNav}>
                          <Typography
                            sx={{ color: "black" }}
                            onClick={() =>
                              window.open(`${api_url}/auth/login`, "_self")
                            }
                          >
                            Login
                          </Typography>
                        </MenuItem>
                      </NavLink>
                    )}
                  </Menu>
                </Box>
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <NavLink to="/">
                    <Button sx={{ my: 2, color: "white" }}>Home</Button>
                  </NavLink>
                  <NavLink to="/giveaway">
                    <Button sx={{ my: 2, color: "white" }}>Giveaway</Button>
                  </NavLink>
                  {loggedIn && currentUser?.isAdmin && (
                    <NavLink to="/add-game">
                      <Button sx={{ my: 2, color: "white" }}>Add Game</Button>
                    </NavLink>
                  )}
                  {loggedIn && currentUser?.isAdmin && (
                    <NavLink to="/giveaway-token">
                      <Button sx={{ my: 2, color: "white" }}>
                        Give Tokens
                      </Button>
                    </NavLink>
                  )}
                  {loggedIn ? (
                    <NavLink to="/">
                      <Button
                        sx={{ my: 2, color: "white" }}
                        onClick={() =>
                          window.open(`${api_url}/auth/logout`, "_self")
                        }
                      >
                        Logout
                      </Button>
                    </NavLink>
                  ) : (
                    <NavLink to="/">
                      <Button
                        sx={{ my: 2, color: "white" }}
                        onClick={() =>
                          window.open(`${api_url}/auth/login`, "_self")
                        }
                      >
                        Login
                      </Button>
                    </NavLink>
                  )}
                </Box>
              </Toolbar>
            </Container>
          </AppBar>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </Box>
  );
}
