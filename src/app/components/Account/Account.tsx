import { useUser } from "@/app/context/UserContext/UserContext";
import { AccountConnected } from "./Connected";
import { HeaderBurgerMenu } from "../HeaderBurgerMenu";
import { Button } from "../Button";

export function Account() {
  const { user, connectWallet, disconnectWallet } = useUser();
  
  return (
    <div>
      {user.status === "loading" && <Button disabled>loading...</Button>}
      {user.status === "not_connected" && (
        <div className="flex items-center gap-2">
          <AccountNotConnected connect={connectWallet} />
          <HeaderBurgerMenu connect={connectWallet} />
        </div>
      )}
      {user.status === "connecting" && <AccountConnecting />}
      {user.status === "connected" && (
        <AccountConnected user={user} disconnectWallet={disconnectWallet} />
      )}
    </div>
  );
}

export function AccountNotConnected({ connect }: { connect: () => void }) {
  return <Button onClick={connect}>Sign In</Button>;
}

export function AccountConnecting() {
  return <div>connecting...</div>;
}