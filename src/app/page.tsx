import { Swap } from "./components/Swap/Swap";
import { cn, pageWrapClasses } from "./utils";
import { TokenPanel } from "./components/TokenPanel";

export default function Home() {
  return (
    <div className="bg-theme-grey-3 py-12 lg:py-24">
      <div className={cn(pageWrapClasses)}>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:px-20">
          <div className="grid gap-4">
            <h1 className="font-theme-2 text-3xl leading-tight font-extrabold tracking-wider text-black lg:text-6xl">
              Mint cUSD and fund the Stellar ecosystem.
            </h1>
            <p className="text-theme-black leading-tight tracking-wider lg:text-2xl">
              We empower projects in the Stellar ecosystem through a solidarity
              principled onchain funding solution.
            </p>
          </div>
          <div className="flex justify-end">
            <Swap />
          </div>
          <TokenPanel />
        </div>
      </div>
    </div>
  );
}
