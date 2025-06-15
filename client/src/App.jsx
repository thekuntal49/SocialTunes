import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import theme from "./theme";
import Home from "./pages/Home";
import MusicPlayer from "./pages/MusicPlayer";
import { Visitor } from "./components/Visitor";
import { Toaster } from "./components/Toaster";

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Visitor />
    <Toaster />
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player" element={<MusicPlayer />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  </ThemeProvider>
);

export default App;
