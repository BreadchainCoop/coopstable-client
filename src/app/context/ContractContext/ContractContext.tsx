import { createContext, ReactNode } from "react";
import { ContractService } from "../../services/ContractService/types";

export const ContractContext = createContext<ContractService | undefined>(
  undefined,
);

export function ContractProvider({
  contractService,
  children,
}: {
  contractService: ContractService;
  children: ReactNode;
}) {
  return (
    <ContractContext.Provider value={contractService}>
      {children}
    </ContractContext.Provider>
  );
}
