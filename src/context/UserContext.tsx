"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface IUserProvider {
  children: React.ReactNode;
}

interface UserContextType {
  userRole: string;
  setUserRole: React.Dispatch<React.SetStateAction<string>>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: IUserProvider) => {
  const [userRole, setUserRole] = useState("merchant");
  const [userId, setUserId] = useState("");

  const getCookies = useCallback(async () => {
    try {
      const response = await fetch("/api/get-cookie");
      const data = await response.json();
      const userId = data.userId;

      setUserId(userId);
    } catch (error) {
      console.error("Failed to fetch cookie value:", error);
      setUserId("");
    }
  }, []);

  useEffect(() => {
    getCookies();
    setUserRole("merchant");
    console.log("userRole", userRole);
  }, [userRole]);

  const contextValue = {
    userRole,
    setUserRole,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
