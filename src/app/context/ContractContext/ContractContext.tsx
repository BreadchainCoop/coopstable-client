import { createContext, ReactNode, useMemo } from "react";
import { type ContractService } from "../../services/ContractService/types";
import { yieldController, yieldDistributor } from "../../services/ContractService/index";
import { useUser } from "../UserContext/UserContext";
import { UserContextStateConnected } from "../UserContext/types";
import { SignTransaction } from "@stellar/stellar-sdk/contract";

export const ContractContext = createContext<ContractService | undefined>(undefined);

export function ContractProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const { user, signTransaction } = useUser();
  if (user.status !== "connected") return children;
  return (
    <ContractProviderWithUser user={user} signTransaction={signTransaction}>
      {children}
    </ContractProviderWithUser>
  );
}

interface ContractProviderWithUserProps {
  readonly user: UserContextStateConnected;
  readonly signTransaction: SignTransaction;
  readonly children: ReactNode;
}

function ContractProviderWithUser({ 
  children,
  user,
  signTransaction,
}: ContractProviderWithUserProps) {
  const contractService = useMemo(() => {
    return {
      yieldController: yieldController(user.network, user.account, signTransaction),
      yieldDistributor: yieldDistributor(user.network, user.account),
    }
  }, [user, signTransaction]);

  return (
    <ContractContext.Provider value={contractService}>
      {children}
    </ContractContext.Provider>
  );
}