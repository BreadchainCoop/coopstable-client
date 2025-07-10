import { useUser } from "@/app/context/UserContext/UserContext";
import { AccountConnected } from "./components/AccountConnected";
import { HeaderBurgerMenu } from "../HeaderBurgerMenu";
import { Button } from "../Button";
import { SubmitProjectLink } from "./components/SubmitProjectLink";

export function Account() {
  const { user, connectWallet, disconnectWallet } = useUser();
  return (
    <>
      {user.status === "loading" && (
        <div className="flex items-center gap-2">
          <SubmitProjectLink />
          <Button disabled>loading...</Button>
        </div>
      )}
      {user.status === "not_connected" && (
        <div className="flex items-center gap-2">
          <SubmitProjectLink />
          <AccountNotConnected connect={connectWallet} />
          <HeaderBurgerMenu connect={connectWallet} />
        </div>
      )}
      {user.status === "connecting" && 
        <div className="flex items-center gap-2">
          <SubmitProjectLink />
          <AccountConnecting /> 
        </div>
      }
      {user.status === "connected" && (
        <AccountConnected user={user} disconnectWallet={disconnectWallet} />
      )}
    </>
  );
}

export function AccountNotConnected({ connect }: Readonly<{ connect: () => void }>) {
  return <Button onClick={connect}>Sign In</Button>;
}

export function AccountConnecting() {
  return <Button disabled>Connecting...</Button>;
}