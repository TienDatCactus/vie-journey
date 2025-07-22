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
  setSocketDisconnected: (disconnected: boolean) => void;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  setSocket: () => {},
  socketLoading: true,
  setSocketLoading: () => {},
  socketDisconnected: false,
  setSocketDisconnected: () => {},
});

export const useSocket = () => useContext(SocketContext);
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketLoading, setSocketLoading] = useState<boolean>(true);
  const [socketDisconnected, setSocketDisconnected] = useState<boolean>(false);

  return (
    <SocketContext.Provider
      value={{
        socket,
        setSocket,
        socketLoading,
        setSocketLoading,
        socketDisconnected,
        setSocketDisconnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
