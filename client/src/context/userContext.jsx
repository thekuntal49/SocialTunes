import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io } from "socket.io-client";
import { MusicContext } from "./MusicContext";
import toast from "react-hot-toast";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [partner, setPartner] = useState([]);

  const { setCurrentSong } = useContext(MusicContext);

  useEffect(() => {
    if (user && !socket) {
      // const newSocket = io("https://social-tunes.onrender.com");
      const newSocket = io("http://192.168.1.3:5000");
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("✅ Connected with socket ID:", newSocket.id);

        // Now it's safe to emit with socket ID
        newSocket.emit("register", { user, socketId: newSocket.id });
      });

      newSocket.on("activeUsers", (users) => {
        const filteredUsers = users.filter((u) => u.user !== user);
        setActiveUsers(filteredUsers);
        setIsUserLoading(false);
      });

      newSocket.on("songSockett", ({ song, user, partner }) => {
        console.log("Song received:", song, user, partner);
        setCurrentSong(song);
      });

      newSocket.on("partnerLeft", () => {
        setPartner([]);
        toast.error("Your partner has left the session.");
      });

      newSocket.emit("readyToReceiveSong", newSocket.id);

      newSocket.on("disconnect", () => {
        setPartner([]);
        toast.error("Your partner has left the session.");
      });
      return () => {
        newSocket.off("partnerLeft");
        newSocket.disconnect();
      };
    }
  }, [user]);

  const refreshUsers = () => {
    if (socket) {
      setIsUserLoading(true);
      socket.emit("refreshUsers");
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      socket,
      activeUsers,
      isUserLoading,
      setIsUserLoading,
      refreshUsers,
      partner,
      setPartner,
    }),
    [user, socket, activeUsers, isUserLoading, partner]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
