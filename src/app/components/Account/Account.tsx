import { useUser } from "@/app/context/UserContext/UserContext";
import { AccountConnected } from "./Connected";
import { HeaderBurgerMenu } from "../HeaderBurgerMenu";
import { Button } from "../Button";
import Link from "next/link";

export function Account() {
  const { user, connectWallet, disconnectWallet } = useUser();
  return (
    <>
      {user.status === "loading" && <Button disabled>loading...</Button>}
      {user.status === "not_connected" && (
        <div className="flex items-center gap-2">
          <AccountNotConnected connect={connectWallet} />
          <HeaderBurgerMenu connect={connectWallet} />
        </div>
      )}
      {user.status === "connecting" && 
        <div className="flex items-center gap-2">
          <Link 
            target="_blank" 
            href="https://form.typeform.com/to/sHp99h2H" 
            className="hidden md:inline mx-1 font-theme-2 px-6 py-3 text-[20px] lg:text-xl text-theme-black bg-theme-grey-3 font-bold uppercase hover:cursor-pointer"
          >Submit Project</Link>
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