import { useUser } from "@/app/context/UserContext/UserContext";
import { AccountConnected } from "./Connected";

export function Account() {
  const { user, connectWallet, disconnectWallet } = useUser();

  return (
    <div>
      {user.status === "not_connected" && (
        <AccountNotConnected connect={connectWallet} />
      )}
      {user.status === "connecting" && <AccountConnecting />}
      {user.status === "connected" && (
        <AccountConnected user={user} disconnect={disconnectWallet} />
      )}
    </div>
  );
}

export function AccountNotConnected({ connect }: { connect: () => void }) {
  return <button onClick={connect}>connect</button>;
}

export function AccountConnecting() {
  return <div>connecting...</div>;
}
