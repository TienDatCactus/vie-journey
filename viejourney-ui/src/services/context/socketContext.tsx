// SocketContext.tsx
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
  socketLoading: boolean;
  setSocketLoading: (loading: boolean) => void;
  socketDisconnected: boolean;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  setSocket: () => {},
  socketLoading: true,
  setSocketLoading: () => {},
  socketDisconnected: false,
});

export const useSocket = () => useContext(SocketContext);
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketLoading, setSocketLoading] = useState<boolean>(true);
  const [socketDisconnected, setSocketDisconnected] = useState<boolean>(false);

  useEffect(() => {
    if (socket && socket.connected == false) {
      setSocketDisconnected(true);
    }
  }, [socket?.connected]);
  return (
    <SocketContext.Provider
      value={{
        socket,
        setSocket,
        socketLoading,
        setSocketLoading,
        socketDisconnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
