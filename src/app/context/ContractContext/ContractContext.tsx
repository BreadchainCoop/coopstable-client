import { createContext, ReactNode, useMemo } from "react";
import { type ContractService } from "../../services/ContractService/types";
import { yieldController, yieldDistributor } from "../../services/ContractService/index";
import { useUser } from "../UserContext/UserContext";
import { UserContextStateConnected, UserContextStateNotConnected } from "../UserContext/types";
import { SignTransaction } from "@stellar/stellar-sdk/contract";

export const ContractContext = createContext<ContractService | undefined>(undefined);

export function ContractProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const { user, signTransaction } = useUser();
  if (user.status !== "not_connected") return (
    <ContractProviderWithUser user={user as UserContextStateConnected} signTransaction={signTransaction}>
      {children}
    </ContractProviderWithUser>
  )
  return (
    <ContractProviderWithUser user={user} signTransaction={signTransaction}>
      {children}
    </ContractProviderWithUser>
  );
}

interface ContractProviderWithUserProps {
  readonly user: UserContextStateConnected | UserContextStateNotConnected;
  readonly signTransaction: SignTransaction;
  readonly children: ReactNode;
}

function ContractProviderWithUser({ 
  children,
  user,
  signTransaction,
}: ContractProviderWithUserProps) {
  const contractService = useMemo(() => {
    if (user.status === "not_connected") {
      return {
        yieldDistributor: yieldDistributor(),
        yieldController: yieldController(),
      };
    }
    return {
      yieldDistributor: yieldDistributor(user.network, user.account),
      yieldController: yieldController(user.network, user.account, signTransaction),
    }
  }, [user.status]);

  return (
    <ContractContext.Provider value={contractService}>
      {children}
    </ContractContext.Provider>
  );
}