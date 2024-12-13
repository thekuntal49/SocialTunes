import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io } from "socket.io-client";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [partner, setPartner] = useState([]);

  useEffect(() => {
    if (user && !socket) {
      const newSocket = io("http://192.168.43.102:5000");
      setSocket(newSocket);

      newSocket.emit("register", { user });

      newSocket.on("activeUsers", (users) => {
        const filteredUsers = users.filter((u) => u.user !== user);
        setActiveUsers(filteredUsers);
        setIsUserLoading(false);
      });

      return () => newSocket.disconnect();
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
