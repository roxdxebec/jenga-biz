import React, { createContext, useContext, useEffect, useState } from 'react';

type HubContextType = {
  currentHubId: string | null;
  impersonateHub: (hubId: string | null) => void;
  clearImpersonation: () => void;
};

const HubContext = createContext<HubContextType | null>(null);

export const HubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentHubId, setCurrentHubId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('impersonate_hub');
    if (stored) setCurrentHubId(stored);
  }, []);

  const impersonateHub = (hubId: string | null) => {
    if (hubId) {
      localStorage.setItem('impersonate_hub', hubId);
      setCurrentHubId(hubId);
    } else {
      localStorage.removeItem('impersonate_hub');
      setCurrentHubId(null);
    }
  };

  const clearImpersonation = () => impersonateHub(null);

  return (
    <HubContext.Provider value={{ currentHubId, impersonateHub, clearImpersonation }}>
      {children}
    </HubContext.Provider>
  );
};

export const useHub = (): HubContextType => {
  const ctx = useContext(HubContext);
  if (!ctx) throw new Error('useHub must be used within a HubProvider');
  return ctx;
};
