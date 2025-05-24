// mobile/context/LocationContext.js
import React, { createContext, useState } from 'react';

export const LocationContext = createContext({
  coords: null,
  current: null,
  setCoords: () => {},
  setCurrent: () => {},
});

export function LocationProvider({ children }) {
  const [coords, setCoords]     = useState(null);
  const [current, setCurrent]   = useState(null);

  return (
    <LocationContext.Provider value={{ coords, current, setCoords, setCurrent }}>
      {children}
    </LocationContext.Provider>
  );
}
