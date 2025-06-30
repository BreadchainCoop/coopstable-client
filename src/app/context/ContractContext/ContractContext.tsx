import { createContext, ReactNode, useMemo } from "react";
import { type ContractService } from "../../services/ContractService/types";
import { cusd, yieldController, yieldDistributor, cusdManager } from "../../services/ContractService/index";
import { useUser } from "../UserContext/UserContext";
import { DEFAULT_NETWORK } from "@/app/config";

export const ContractContext = createContext<ContractService | undefined>(undefined);

export function ContractProvider({ children }: { readonly children: ReactNode }) {
  const { user, signTransaction } = useUser();
  const contractService = useMemo(() => {
    if (user.status === "connected") {
      return {
        yieldDistributor: yieldDistributor(user.network, user.account),
        yieldController: yieldController(user.network, user.account, signTransaction),
        cusd: cusd(user.network),
        cusdManager: cusdManager(user.network),
      };
    } else {
      return {
        yieldDistributor: yieldDistributor(DEFAULT_NETWORK),
        yieldController: yieldController(DEFAULT_NETWORK),
        cusd: cusd(DEFAULT_NETWORK),
        cusdManager: cusdManager(DEFAULT_NETWORK),
      };
    }
  }, [
    user.status, 
    user.status === "connected" ? user.account : null, 
    user.status === "connected" ? user.network : null, 
    signTransaction
  ]);

  return (
    <ContractContext.Provider value={contractService}>
      {children}
    </ContractContext.Provider>
  );
}