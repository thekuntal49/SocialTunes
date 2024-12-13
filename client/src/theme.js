import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff3e3e", // Red
    },
    secondary: {
      main: "#212121", // Blackish background
    },
    background: {
      default: "#121212", // Dark theme background
      paper: "#1f1f1f", // Card background
    },
    text: {
      primary: "#ffffff", // White text
      secondary: "#ff8a8a", // Muted red
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h3: {
      fontWeight: 700,
      color: "#ff3e3e",
    },
    body1: {
      color: "#ffffff",
    },
  },
});

export default theme;
