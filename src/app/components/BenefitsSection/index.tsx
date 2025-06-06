import { ReactNode } from "react";

export function BenefitsSection() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="font-theme-2 text-4xl font-bold text-black mb-4">
          Benefits of cUSD
        </h2>
        <p className="text-lg text-[#7A7A7A] max-w-2xl mx-auto">
          Discover how CoopStable creates sustainable funding for the Stellar ecosystem
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <BenefitCard
          title="Support Stellar ecosystem"
          description="Mint cUSD (CoopStable coin), hold it, send it and spend it."
          icon={<EcosystemIcon />}
          gradient="from-blue-50 to-indigo-50"
        />
        
        <BenefitCard
          title="At no cost"
          description="Your mint = Yield generated for Stellar ecosystem projects. At no cost."
          icon={<NoCostIcon />}
          gradient="from-green-50 to-emerald-50"
        />
        
        <BenefitCard
          title="Powered by soroban contracts"
          description="Mint cUSD (CoopStable coin), hold it, send it and spend it."
          icon={<SorobanIcon />}
          gradient="from-purple-50 to-violet-50"
        />
      </div>
    </section>
  );
}

function BenefitCard({
  title,
  description,
  icon,
  gradient
}: {
  title: string;
  description: string;
  icon: ReactNode;
  gradient: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} border border-[#B1AEAB] p-8 rounded-lg relative overflow-hidden`}>
      {/* Decorative curve */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M0,0 C50,0 100,50 100,100 L0,100 Z"
            fill="currentColor"
          />
        </svg>
      </div>
      
      <div className="relative z-10">
        <div className="mb-6">
          {icon}
        </div>
        
        <h3 className="font-theme-2 text-xl font-bold text-black mb-4">
          {title}
        </h3>
        
        <p className="text-[#7A7A7A] leading-relaxed">
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