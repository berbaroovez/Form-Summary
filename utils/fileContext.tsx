import React from "react";

type AppContextState = { count: number };

const appContextDefaultValue = {
  count: { count: 0 },
  setCount: (state: AppContextState) => {},
};

const FileContext = React.createContext(appContextDefaultValue);

const FileProvider: React.FC = ({ children }) => {
  var [count, setCount] = React.useState(appContextDefaultValue.count);

  return (
    <FileContext.Provider value={{ count, setCount }}>
      {children}
    </FileContext.Provider>
  );
};
