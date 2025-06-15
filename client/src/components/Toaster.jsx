import { Toaster as ReactToast } from "react-hot-toast";

export const Toaster = () => {
  const theme = {
    primaryBgColor: "#1a0000", // Very dark maroon
    themeColor: "#ff4c4c", // Vibrant coral-red
    themeTextColor: "#ffffff", // Pure white for contrast
    color1: "#00e676", // Vibrant green (Success)
    color2: "#ff1744", // Strong red-pink (Error/Danger)
    color3: "#ffc107", // Amber (Loading/Info)
  };

  return (
    <ReactToast
      position="bottom-left"
      reverseOrder={false}
      toastOptions={{
        style: {
          background: theme.primaryBgColor,
          border: `2px solid ${theme.themeColor}`,
          color: theme.themeTextColor,
        },
        iconTheme: {
          primary: theme.color1,
          secondary: theme.themeTextColor,
        },

        // ✅ Success toast: color1
        success: {
          style: {
            background: theme.primaryBgColor,
            color: theme.color1,
            border: `2px solid ${theme.color1}`,
          },
          iconTheme: {
            primary: theme.color1,
            secondary: theme.themeTextColor,
          },
        },

        loading: {
          style: {
            background: theme.primaryBgColor,
            color: theme.color3,
            border: `2px solid ${theme.color3}`,
          },
          iconTheme: {
            primary: theme.color3,
            secondary: theme.themeTextColor,
          },
        },

        error: {
          style: {
            background: theme.primaryBgColor,
            color: theme.themeColor,
            border: `1px solid ${theme.themeColor}`,
          },
          iconTheme: {
            primary: theme.themeColor,
            secondary: theme.themeTextColor,
          },
        },
      }}
    />
  );
};
