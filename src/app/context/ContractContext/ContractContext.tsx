import { createContext, ReactNode } from "react";
import { type ContractService } from "../../services/ContractService/types";
import { yieldController } from "../../services/ContractService/index";
import { useUser } from "../UserContext/UserContext";
import { UserContextStateConnected } from "../UserContext/types";
import { SignTransaction } from "@stellar/stellar-sdk/contract";

export const ContractContext = createContext<ContractService | undefined>(undefined);

export function ContractProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user, signTransaction } = useUser();
  if (user.status !== "connected") return children;
  return (
    <ContractProviderWithUser user={user} signTransaction={signTransaction}>
      {children}
    </ContractProviderWithUser>
  );
}

function ContractProviderWithUser({ 
  children,
  user,
  signTransaction,
}: { 
  children: ReactNode,
  user: UserContextStateConnected,
  signTransaction: SignTransaction,
}) {
  const contractService = {
    yieldController: yieldController(user.network, user.account, signTransaction),
  }
  return (
    <ContractContext.Provider value={contractService}>
      {children}
    </ContractContext.Provider>
  );
}