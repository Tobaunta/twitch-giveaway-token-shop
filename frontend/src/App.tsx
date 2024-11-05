import "./App.css";
import { useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { User } from "./utils/interfaces";

// Theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6441a5",
    },
    secondary: {
      main: "#9c27b0",
    },
    info: {
      main: "#8697c4",
    },
  },
});

// Layout
import RootLayout from "./layouts/RootLayout.js";

// Pages
import Home from "./components/Home";
import Giveaway from "./components/Giveaway";
import AddGame from "./components/AddGame";
import GiveawayToken from "./components/GiveawayToken.js";
import RedeemedGames from "./components/RedeemedGames.js";
import { AuthContext } from "./components/AuthContext";

// Router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="giveaway" element={<Giveaway />} />
      <Route path="add-game" element={<AddGame />} />
      <Route path="giveaway-token" element={<GiveawayToken />} />
      <Route path="redeemed" element={<RedeemedGames />} />
      <Route path="*" element={<Home />} />
    </Route>
  )
);

// App
export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <AuthContext.Provider
        value={{ currentUser, setCurrentUser, loggedIn, setLoggedIn }}
      >
        <ThemeProvider theme={theme}>
          {<RouterProvider router={router} />}
        </ThemeProvider>
      </AuthContext.Provider>
    </>
  );
}
