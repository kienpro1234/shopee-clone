import { createContext, useState } from "react";
import { getAccessTokenFromLS, getProfileFromLS } from "../utils/auth";
import React from "react";
import { User } from "../types/user.type";
import { ExtendedPurchases } from "../types/purchase.type";

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  profile: User | null;
  setProfile: React.Dispatch<React.SetStateAction<User | null>>;
  extendedPurchases: ExtendedPurchases[];
  setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchases[]>>;
  reset: () => void;
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  extendedPurchases: [],
  setExtendedPurchases: () => null,
  reset: () => null,
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated);
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchases[]>(initialAppContext.extendedPurchases);
  console.log("isAuthen", isAuthenticated);
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile);

  const reset = () => {
    setIsAuthenticated(false);
    setProfile(null);
    setExtendedPurchases([]);
  };
  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        extendedPurchases,
        setExtendedPurchases,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
