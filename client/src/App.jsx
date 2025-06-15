import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import theme from "./theme";
import Home from "./pages/Home";
import MusicPlayer from "./pages/MusicPlayer";
import { Visitor } from "./components/Visitor";

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Visitor />
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player" element={<MusicPlayer />} />
      </Routes>
    </Router>
  </ThemeProvider>
);

export default App;
