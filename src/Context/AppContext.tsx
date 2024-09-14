import React, { useState } from 'react';


type AppContextType = {
  chatClient: any | null;

  unreadCount: number | undefined;
  channel: null;
  setChannel: (channel:any) => {};
  thread: null;
  setThread: (thread:any) => {};
};

export const AppContext = React.createContext({} as AppContextType);


// export const AppProvider = ({ children }) => {
//   const [channel, setChannel] = useState();
//   const [thread, setThread] = useState();

//   return <AppContext.Provider value={{ channel, setChannel, thread, setThread }}>{children}</AppContext.Provider>;
// };

export const AppProvider = ({ children, chatClient, unreadCount }) => {
  const [channel, setChannel] = useState();
  const [thread, setThread] = useState();

  return (
    <AppContext.Provider value={{ chatClient, unreadCount, channel, setChannel, thread, setThread }}>
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => React.useContext(AppContext);





