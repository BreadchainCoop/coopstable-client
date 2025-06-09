import { cn, pageWrapClasses } from "@/app/utils";
import { ReactNode } from "react";

export function BenefitsSection() {
  return (
    <section className={cn(pageWrapClasses)} >
      <div className="pb-[1.5rem] text-center">
        <h1 className="font-theme-2 text-5xl font-bold text-black mb-4">
          Benefits of cUSD
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <BenefitCard
          title="Support Stellar ecosystem"
          description="Mint cUSD (CoopStable coin), hold it, send it and spend it."
          background="bg-top"

        />
        
        <BenefitCard
          title="At no cost"
          description="Your mint = Yield generated for Stellar ecosystem projects. At no cost."
          background="bg-middle"
        />
        
        <BenefitCard
          title="Powered by soroban contracts"
          description="Mint cUSD (CoopStable coin), hold it, send it and spend it."
          background="bg-bottom"
        />
      </div>
    </section>
  );
}

function BenefitCard({
  title,
  description,
  background,
}: {
  title: string;
  description: string;
  background: string;
}) {
  return (
    <div className={`benefits-card mx-auto max-w-[21rem] border border-theme-grey-4 p-8 relative overflow-hidden ${background}`}> 
      
      <div className="relative z-10">
        
        <h2 className="font-theme-2 text-4xl font-bold text-black mb-4">
          {title}
        </h2>
        
        <p className="text-[1.25rem] text-grey-6 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function EcosystemIcon() {
  return (
    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
      <svg
        className="w-6 h-6 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
}

function NoCostIcon() {
  return (
    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
      <svg
        className="w-6 h-6 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
}

function SorobanIcon() {
  return (
    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
      <svg
        className="w-6 h-6 text-purple-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    </div>
  );
}