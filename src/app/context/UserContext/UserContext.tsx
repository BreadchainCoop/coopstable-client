import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  readonly userService: UserService;
  readonly children: ReactNode;
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

  const connectWallet = useCallback(async () => {
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
  }, [userService]);

  const disconnectWallet = useCallback(async () => {
    try {
      await userService.disconnectWallet();
      setState({ status: "not_connected" });
    } catch (error) {
      throw new Error("Failed to disconnect wallet");
    }
  }, [userService]);

  const signTransaction = useCallback(async (
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
  }> => {
    return userService.signTransaction(xdr, opts);
  }, [userService]);

  const contextValue = useMemo(() => ({ user: state, connectWallet, disconnectWallet, signTransaction }), [state, connectWallet, disconnectWallet, signTransaction]);
  return (
    <UserContext.Provider
      value={contextValue}
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