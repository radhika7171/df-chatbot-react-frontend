import React, { createContext, useContext } from "react";

export const StateContext = createContext();

export const StateProvider = ({ sessionId, children }) => {
  <StateContext.Provider value={sessionId}>{children}</StateContext.Provider>;
};

export const useStateValue = () => useContext(StateProvider);
