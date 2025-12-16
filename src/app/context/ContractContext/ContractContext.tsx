import { createContext, ReactNode, useMemo } from "react";
import { type ContractService } from "@/app/services/ContractService/types";
import { yieldController, yieldDistributor, cusdManager } from "@/app/services/ContractService";
import { useUser } from "../UserContext/UserContext";
import { DEFAULT_NETWORK } from "@/app/config";

export const ContractContext = createContext<ContractService | undefined>(undefined);

export function ContractProvider({ children }: { readonly children: ReactNode }) {
  const { user, signTransaction } = useUser();
  const isConnected = user.status === "connected";
  const account = isConnected ? user.account : undefined;
  const network = isConnected ? user.network : undefined;

  const contractService = useMemo(() => {
    if (isConnected && account && network) {
      return {
        yieldDistributor: yieldDistributor(network, account),
        yieldController: yieldController(network, account, signTransaction),
        cusdManager: cusdManager(network),
      };
    } else {
      return {
        yieldDistributor: yieldDistributor(DEFAULT_NETWORK),
        yieldController: yieldController(DEFAULT_NETWORK),
        cusdManager: cusdManager(DEFAULT_NETWORK),
      };
    }
  }, [isConnected, account, network, signTransaction]);

  return (
    <ContractContext.Provider value={contractService}>
      {children}
    </ContractContext.Provider>
  );
}