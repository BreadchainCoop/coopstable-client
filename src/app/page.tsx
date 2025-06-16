"use client";
import { Swap } from "./components/Swap/Swap";
import { cn, pageWrapClasses } from "./utils";
import { StatsPanel } from "./components/StatsPanel";
import { BenefitsSection } from "./components/BenefitsSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <BenefitsSection />
    </main>
  )
}

function Hero() { 
  return (
    <section className={cn(pageWrapClasses, 'px-[unset] py-[1.5rem]') }> 
      <div className="px-4 pt-2 pb-[5rem] lg:py-[10rem] grid grid-cols-1 items-center gap-6 lg:gap-12 lg:grid-cols-2 lg:px-20 hero-bg"> 
        <div className="grid gap-5">
          <h1 className="font-theme-2 text-3xl leading-tight font-extrabold tracking-wider text-black lg:text-6xl">
            Mint cUSD and fund the Stellar ecosystem.
          </h1>
          <p className="text-theme-black leading-tight tracking-wider lg:text-2xl">
            We empower projects in the Stellar ecosystem through a solidarity principled onchain funding solution.
          </p>
        </div>
        <div className="flex justify-end">
          <Swap />
        </div>
      </div>
      <StatsPanel />
    </section>
  );
}