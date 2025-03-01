// NavigationContext.js
import React, {createContext, useState, useContext} from 'react';

const NavigationContext = createContext();

export const NavigationProvider = ({children}) => {
  const [currentScreen, setCurrentScreen] = useState('');

  return (
    <NavigationContext.Provider value={{currentScreen, setCurrentScreen}}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
