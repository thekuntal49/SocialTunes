import React, { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { Button } from "@mui/material";

export const UserName = () => {
  const { setUser } = useContext(UserContext);
  const [inputName, setInputName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputName.trim()) {
      setUser(inputName.trim());
    } else {
      alert("Please enter a valid name!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#1e1e1e",
        color: "#fff",
      }}
    >
      <h1
        style={{
          color: "#ff5252",
          marginBottom: "1.5rem",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
        }}
      >
        Apna naam bataye?
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "300px",
        }}
      >
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Enter your name"
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #ff5252",
            outline: "none",
            backgroundColor: "#2a2a2a",
            color: "#fff",
            fontSize: "1rem",
          }}
        />
        <Button
          type="submit"
          variant="contained"
          style={{
            backgroundColor: "#ff5252",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1rem",
            textTransform: "none",
          }}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

