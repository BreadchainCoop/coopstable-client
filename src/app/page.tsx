import { Swap } from "./components/Swap/Swap";
import { cn, pageWrapClasses } from "./utils";
import { StatsPanel } from "./components/StatsPanel";

export default function Home() {
  return (
    <main className={cn(pageWrapClasses)}>
      <Hero />
      <BenefitsSection />
    </main>
  )
}

function Hero() {
  return (
    <>
      <section className="px-4 py-12 lg:py-[calc(var(--spacing)*30)] hero-bg"> 
        <div className="grid grid-cols-1 items-center gap-6 lg:gap-12 lg:grid-cols-2 lg:px-20">
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
      </section>
      <StatsPanel />
    </>

  );
}

function BenefitsSection() {
  return (
    <section className="px-4"> 
      <h1 className="font-theme-1 text-3xl leading-tight font-extrabold tracking-wider text-black lg:text-6xl">
        Benefits of cUSD
      </h1>
      <div className="grid grid-cols-1 items-center gap-6 lg:gap-12 lg:grid-cols-2 lg:px-20">
        <div className="grid gap-5">
          {/* <BenefitCard
            title="Support Stellar ecosystem"
            description="Mint cUSD (CoopStable coin), hold it, send it and spend it."
            gradient="from-blue-50 to-indigo-50"
          />
          
          <BenefitCard
            title="At no cost"
            description="Your mint = Yield generated for Stellar ecosystem projects. At no cost."
            gradient="from-green-50 to-emerald-50"
          />
          
          <BenefitCard
            title="Powered by soroban contracts"
            description="Mint cUSD (CoopStable coin), hold it, send it and spend it."
            gradient="from-purple-50 to-violet-50"/> */}
          </div>
      </div>
    </section>
  )
}
