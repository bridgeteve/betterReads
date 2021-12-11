import React, { createContext } from "react";

export const BookContext = createContext();
export const BookProvider = ({ children }) => {
  let toBeRead = [];
  let currentlyReading = [];

  const addToTBR = () => {
    toBeRead.push(volumeId)
  }

  return (
    <BookContext.Provider
      value={{
       
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
