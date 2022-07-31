import { createContext, useContext } from "react";
import { useState } from "react";
const Context = createContext<{setLogs: (logs: string[]) => void; logs: string[]} | null>(null);


const useAppContext = () => {
    const context = useContext(Context);
    if (context === undefined) {
    throw new Error(
      "useProjectSettingsContext must be used within a ProjectSettingsProvider"
    );
  }
  return context;

};

const AppContext: React.FC = ({ children }) => {

    const [logs, setLogs] = useState<string[]>([]);
    return <Context.Provider value={{
        logs,
        setLogs
    }}>{children}</Context.Provider>;
    }


export { AppContext, useAppContext };