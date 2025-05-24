// mobile/index.js
import React from 'react';
import { registerRootComponent } from 'expo';
import App from './App';
import { LocationProvider } from './context/LocationContext';

function Root() {
  return (
    <LocationProvider>
      <App />
    </LocationProvider>
  );
}

registerRootComponent(Root);
