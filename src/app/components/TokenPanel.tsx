"use client";
import {
  useTokenABalance,
  useTokenAMint,
} from "@/app/context/ContractContext/hooks";
import { useUser } from "../context/UserContext/UserContext";
import { UserContextStateConnected } from "../context/UserContext/types";

export function TokenPanel() {
  const { user } = useUser();

  return (
    <section className="flex flex-col gap-4 rounded bg-neutral-400 p-6">
      <div></div>
      <div>{user.status === "connected" && <Connected user={user} />}</div>
    </section>
  );
}

function Connected({ user }: { user: UserContextStateConnected }) {
  const { status, data } = useTokenABalance(user.account, user.network);

  return (
    <div>
      <div>{status === "success" && data}</div>;
      <Mint user={user} />
    </div>
  );
}

function Mint({ user }: { user: UserContextStateConnected }) {
  const { signTransaction } = useUser();
  const { signAndSend } = useTokenAMint(signTransaction);
  return (
    <div>
      <button
        onClick={() => {
          signAndSend(user, BigInt(2000000000000000000000));
        }}
      >
        mint
      </button>
    </div>
  );
}
