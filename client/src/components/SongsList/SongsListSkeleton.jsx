import { Box, Skeleton } from "@mui/material";

export const SongsListSkeleton = () => {
  // Skeleton UI for loading state
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "1.5rem",
        padding: "1px",
        backgroundColor: "radial-gradient(circle, #2e0f13, #1b0005)",
        minHeight: "screen",
      }}
    >
      {Array.from(new Array(6)).map((_, index) => (
        <Box
          key={index}
          sx={{
            position: "relative",
            borderRadius: "10px",
            overflow: "hidden",
            padding: "1rem",
            backgroundColor: "#1a1a1a",
          }}
        >
          <Skeleton
            variant="rectangular"
            sx={{
              width: "100%",
              height: 140,
              marginBottom: "0.5rem",
            }}
          />
          <Skeleton
            variant="text"
            sx={{
              width: "80%",
              marginBottom: "0.3rem",
              backgroundColor: "#333",
            }}
          />
          <Skeleton
            variant="text"
            sx={{
              width: "60%",
              backgroundColor: "#333",
            }}
          />
        </Box>
      ))}
    </Box>
  );
};
