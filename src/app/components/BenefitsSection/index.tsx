import { cn, pageWrapClasses } from "@/app/utils";

export function BenefitsSection() {
  return (
    <section className={cn(pageWrapClasses)} >
      <div className="pb-[1.5rem] text-center">
        <h1 className="font-theme-2 text-5xl font-bold text-black mb-4">
          Benefits of cUSD
        </h1>
      </div>

      <div className="md:hidden grid grid-cols-1 gap-8 w-full">
        <BenefitCard
          title="Support Stellar ecosystem"
          description="Mint cUSD (CoopStable coin), hold it, send it and spend it."
          background="bg-top"
          className="mx-auto max-w-106"
        />        
        <BenefitCard
          title="At no cost"
          description="Your mint = Yield generated for Stellar ecosystem projects. At no cost."
          background="bg-middle"
          className="mx-auto max-w-106"
        />
        <BenefitCard
          title="Powered by soroban contracts"
          description="Mint cUSD (CoopStable coin), hold it, send it and spend it."
          background="bg-bottom"
          className="mx-auto max-w-106"
        />
      </div>

      <div className="hidden md:grid grid-cols-2 gap-x-6 gap-y-4 w-full [&>*:nth-child(-n+2)]:max-w-[573px]">
        <BenefitCard
          title="Support Stellar ecosystem"
          description="Mint cUSD (CoopStable coin), hold it, send it and spend it."
          discriptionClass="max-w-[473px]"
          background="lg-bg-tl"
          className="min-h-80 py-14 px-10"
        />        
        <BenefitCard
          title="At no cost"
          description="Your mint = Yield generated for Stellar ecosystem projects. At no cost."
          background="lg-bg-tr"
          className="min-h-80 py-14 px-12"
        />
        <BenefitCard
          title="Powered by soroban contracts"
          description="Mint cUSD (CoopStable coin), hold it, send it and spend it."
          discriptionClass="max-w-[473px]"
          background="lg-bg-bottom"
          className="col-span-2 min-h-60"
        />
      </div>
    </section>
  );
}

interface BenefitsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  discriptionClass?: string;
  background: string;
}
function BenefitCard({
  title,
  description,
  background,
  discriptionClass,
  className,
  ...props
}: Readonly<BenefitsCardProps>)  {
  return (
    <div className={`benefits-card border-theme-grey-4 border-[0.5px] p-8 relative overflow-hidden ${background} ${className||""}`} {...props}>  
      {/* mobile */}
      <div className="relative z-10 md:hidden">
        <h2 className="font-theme-2 text-4xl font-bold text-black mb-4">
          {title}
        </h2>
        <p className={`text-[1.25rem] text-grey-6 leading-relaxed ${discriptionClass??""}`} >
          {description}
        </p>
      </div>

      <div className="hidden relative z-10 md:flex flex-col justify-end h-full">
        <h2 className="font-theme-2 text-[32px] font-bold text-black mb-4">
          {title}
        </h2>
        <p className={`text-[1.25rem] text-grey-6 leading-relaxed ${discriptionClass??""}`}>
          {description}
        </p>
      </div>
    </div>
  );
}
