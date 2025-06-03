// src/app/context/UserContext/UserContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { UserContextState } from "./types";
import type { UserService } from "@/app/services/UserService/types";

const UserContext = createContext<{
  user: UserContextState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  signTransaction: (
    xdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
      submit?: boolean;
      submitUrl?: string;
    },
  ) => Promise<{
    signedTxXdr: string;
    signerAddress?: string;
  }>;
} | null>(null);

export function UserProvider({
  userService,
  children,
}: {
  userService: UserService;
  children: ReactNode;
}) {
  const [state, setState] = useState<UserContextState>({
    status: "loading",
  });

  useEffect(() => {
    const restore = async () => {
      try {
        const restored = await userService.restoreConnection?.(
          (account, network) => {
            setState({
              status: "connected",
              account,
              network,
            });
          },
          (error) => {
            console.error("Failed to restore connection:", error);
            setState({ status: "not_connected" });
          }
        );

        if (!restored) {
          setState({ status: "not_connected" });
        }
      } catch (error) {
        console.error("Error during connection restore:", error);
        setState({ status: "not_connected" });
      }
    };

    restore();
  }, [userService]);

  async function connectWallet() {
    setState({ status: "connecting" });
    try {
      await userService.connectWallet((account, network) => {
        setState({
          status: "connected",
          account,
          network,
        });
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setState({ status: "error" });
    }
  }

  async function disconnectWallet() {
    try {
      await userService.disconnectWallet();
      setState({ status: "not_connected" });
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  }

  async function signTransaction(
    xdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
      submit?: boolean;
      submitUrl?: string;
    },
  ): Promise<{
    signedTxXdr: string;
    signerAddress?: string;
  }> {
    return userService.signTransaction(xdr, opts);
  }

  return (
    <UserContext.Provider
      value={{ user: state, connectWallet, disconnectWallet, signTransaction }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const userContext = useContext(UserContext);
  if (!userContext)
    throw new Error("useUser can only be called within a UserProvider");
  return userContext;
}