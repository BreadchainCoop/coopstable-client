import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { UserContextState } from "./types";
import { UserService } from "@/app/services/userService";

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
    }
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
    setState({
      status: "not_connected",
    });
  }, []);

  async function connectWallet() {
    userService.connectWallet((account, network) => {
      setState({
        status: "connected",
        account,
        network,
      });
    });
  }

  async function disconnectWallet() {
    await userService.disconnectWallet();
    setState({ ...state, status: "not_connected" });
  }

  async function signTransaction(
    xdr: string,
    opts?: {
      networkPassphrase?: string;
      address?: string;
      path?: string;
      submit?: boolean;
      submitUrl?: string;
    }
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
