import { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import { getTokenAClient } from "../contracts/contracts";
import { UserContextStateConnected } from "../context/UserContext/types";
import { NetworkString } from "./userService";

export type ContractService = {
  tokenA: {
    fetchBalance: (
      account: string,
      network: NetworkString
    ) => Promise<number | null>;
    fetchAllowance: (
      owner: string,
      spender: string,
      network: NetworkString
    ) => Promise<number | null>;
    mint: (
      account: string,
      amount: bigint,
      network: NetworkString
    ) => Promise<AssembledTransaction<null>>;
  };
  tokenB: {
    fetchBalance: (user: UserContextStateConnected) => Promise<number | null>;
  };
};

export const contractService: ContractService = {
  tokenA: {
    fetchBalance: async (account, network): Promise<number> => {
      const contract = getTokenAClient(network, account);
      const res = await contract.balance({ account });
      return Number(res.result) / 10e18;
    },
    fetchAllowance: async (
      owner: string,
      spender: string,
      network: NetworkString
    ): Promise<number> => {
      const contract = getTokenAClient(network, owner);
      const res = await contract.allowance({ owner, spender });
      return Number(res.result) / 10e18;
    },
    mint: async (
      account,
      amount,
      network
    ): Promise<AssembledTransaction<null>> => {
      const contract = getTokenAClient(network, account);
      const res = await contract.mint({ account, amount });
      return res;
    },
  },
  tokenB: {
    fetchBalance: async () => 777,
  },
};
