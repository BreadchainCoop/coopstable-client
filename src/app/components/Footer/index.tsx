import { cn, pageWrapClasses } from "@/app/utils";
import Link from "next/link";

export function Footer() {
  return (
    <footer className={cn(pageWrapClasses, "py-16 lg:flex justify-between items-end")}> 
      {/* Mobile */}
      <div className="lg:hidden flex flex-col items-center gap-1 mb-2">
          <div className="size-10">
              <Logo />
          </div>
          <span className="font-theme-2 text-2xl font-extrabold tracking-wider text-black">
              CoopStable
          </span>
          <p className="text-[#7A7A7A] mb-8 leading-relaxed max-w-md">
              Solidarity funding for Stellar .
          </p>
      </div>
      
      {/* Social Links */}
      <div className="lg:hidden flex justify-center items-top gap-4">
          <SocialLink href="https://github.com" icon={<GithubIcon />} label="GitHub" />
          <SocialLink href="https://twitter.com" icon={<XIcon />} label="Twitter" />
      </div>
      <div className="lg:hidden border-t border-[#B1AEAB] mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Left side - Copyright and legal */}
          <div className="flex flex-col gap-4">
              <span className="text-[#7A7A7A] text-sm">
              © 2024 CoopStable. All rights reserved.
              </span>
              <div className="flex flex-wrap gap-6 text-sm">
              <FooterLink href="/privacy" className="text-sm">Privacy Policy</FooterLink>
              <FooterLink href="/terms" className="text-sm">Terms of Service</FooterLink>
              <FooterLink href="/cookies" className="text-sm">Cookie Policy</FooterLink>
              </div>
          </div>
          
          {/* Right side - Built on Stellar */}
          <div className="flex items-center gap-2 text-sm text-[#7A7A7A]">
              <span>Powered by</span>
              <div className="flex items-center gap-2">
              <span className="font-medium text-black">Stellar</span>
              </div>
          </div>
          </div>
      </div>

      {/* Larger screens */}
      <div className="hidden lg:flex items-center gap-x-4">
          <div className="size-12">
            <Logo />
          </div>
          <div className="flex flex-col">
            <span className="font-theme-2 text-2xl font-extrabold tracking-wider text-black">
              CoopStable
            </span>
            <p className="text-[#7A7A7A] leading-relaxed">
              Solidarity funding for Stellar.
            </p>
          </div>
      </div>

      <div className="hidden lg:flex gap-4 pb-0.5"> 
          <SocialLink href="https://github.com" icon={<GithubIcon />} label="GitHub" />
          <SocialLink href="https://twitter.com" icon={<XIcon />} label="Twitter" />
      </div>

      <p className="hidden lg:inline text-[#7A7A7A] leading-relaxed max-w-md">
        A BreadCoop solidarity solution.
      </p>
    </footer>
  );
}

function FooterLink({ 
  href, 
  children, 
  className 
}: { 
  href: string; 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <Link 
      href={href} 
      className={cn(
        "text-[#7A7A7A] hover:text-black transition-colors duration-200",
        className
      )}
    >
      {children}
    </Link>
  );
}

function SocialLink({ 
  href, 
  icon, 
  label 
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string;
}) {
  return (
    <Link
      href={href}
      className="w-10 h-10 flex items-center justify-center text-grey-4"
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </Link>
  );
}

function Logo() {
  return (
    <svg
      className="size-full"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40 40H0V0H40V40ZM20 8.75C13.7868 8.75 8.75 13.7868 8.75 20C8.75 26.2132 13.7868 31.25 20 31.25C26.2132 31.25 31.25 26.2132 31.25 20C31.25 13.7868 26.2132 8.75 20 8.75Z"
        fill="url(#paint0_linear_323_68)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_323_68"
          x1="32.5"
          y1="20"
          x2="7.5"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#666462" />
          <stop offset="1" stopColor="#11110F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.133 19.8478L14.2643 10.6247L20.0552 4.25438C20.1862 4.10674 20.2537 3.91343 20.2431 3.71636C20.2325 3.51929 20.1446 3.33435 19.9986 3.20161C19.8525 3.06888 19.66 2.99907 19.4628 3.00731C19.2657 3.01555 19.0797 3.10117 18.9452 3.24562L13.4289 9.31312L9.633 3.34781C9.56531 3.24127 9.47183 3.15353 9.36121 3.09274C9.25059 3.03194 9.12642 3.00004 9.00019 3H4.50019C4.36571 2.99993 4.2337 3.03603 4.11796 3.10449C4.00222 3.17296 3.90702 3.27129 3.84232 3.38918C3.77763 3.50707 3.74582 3.64018 3.75023 3.77458C3.75463 3.90898 3.7951 4.03973 3.86738 4.15313L9.73613 13.3753L3.94519 19.7503C3.87756 19.823 3.82503 19.9083 3.79063 20.0014C3.75623 20.0945 3.74065 20.1935 3.74479 20.2927C3.74894 20.3918 3.77272 20.4892 3.81477 20.5791C3.85681 20.669 3.91628 20.7496 3.98973 20.8164C4.06318 20.8831 4.14915 20.9346 4.24265 20.9679C4.33615 21.0012 4.43533 21.0156 4.53443 21.0103C4.63354 21.0049 4.7306 20.98 4.81999 20.9369C4.90938 20.8937 4.98932 20.8333 5.05519 20.7591L10.5714 14.6916L14.3674 20.6569C14.4356 20.7625 14.5293 20.8494 14.6399 20.9093C14.7505 20.9693 14.8744 21.0005 15.0002 21H19.5002C19.6345 21 19.7664 20.9638 19.882 20.8954C19.9976 20.827 20.0927 20.7288 20.1573 20.611C20.222 20.4933 20.2539 20.3604 20.2496 20.2261C20.2453 20.0918 20.205 19.9612 20.133 19.8478ZM15.4118 19.5L5.86613 4.5H8.58488L18.1343 19.5H15.4118Z" fill="black"/>
    </svg>        
  )
}

function GithubIcon() {
  return (
  <svg className="size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M21.5291 6.84501C21.7583 6.10551 21.8318 5.32653 21.745 4.55719C21.6582 3.78785 21.413 3.04484 21.0247 2.37501C20.9588 2.26097 20.8641 2.16628 20.7501 2.10045C20.636 2.03462 20.5067 1.99998 20.375 2.00001C19.5014 1.99818 18.6395 2.2007 17.8582 2.59137C17.0768 2.98205 16.3977 3.55006 15.875 4.25001H13.625C13.1023 3.55006 12.4232 2.98205 11.6418 2.59137C10.8605 2.2007 9.99857 1.99818 9.125 2.00001C8.99332 1.99998 8.86395 2.03462 8.7499 2.10045C8.63586 2.16628 8.54115 2.26097 8.47531 2.37501C8.08704 3.04484 7.84177 3.78785 7.75497 4.55719C7.66816 5.32653 7.74169 6.10551 7.97094 6.84501C7.50756 7.65381 7.25934 8.56793 7.25 9.50001V10.25C7.25158 11.519 7.71225 12.7446 8.54696 13.7004C9.38166 14.6563 10.534 15.2778 11.7913 15.4503C11.2781 16.107 10.9995 16.9166 11 17.75V18.5H8.75C8.15326 18.5 7.58097 18.263 7.15901 17.841C6.73705 17.419 6.5 16.8468 6.5 16.25C6.5 15.7576 6.403 15.2699 6.21455 14.8149C6.02609 14.36 5.74987 13.9466 5.40165 13.5984C5.05343 13.2501 4.64003 12.9739 4.18506 12.7855C3.73009 12.597 3.24246 12.5 2.75 12.5C2.55109 12.5 2.36032 12.579 2.21967 12.7197C2.07902 12.8603 2 13.0511 2 13.25C2 13.4489 2.07902 13.6397 2.21967 13.7803C2.36032 13.921 2.55109 14 2.75 14C3.34674 14 3.91903 14.2371 4.34099 14.659C4.76295 15.081 5 15.6533 5 16.25C5 17.2446 5.39509 18.1984 6.09835 18.9017C6.80161 19.6049 7.75544 20 8.75 20H11V21.5C11 21.6989 11.079 21.8897 11.2197 22.0303C11.3603 22.171 11.5511 22.25 11.75 22.25C11.9489 22.25 12.1397 22.171 12.2803 22.0303C12.421 21.8897 12.5 21.6989 12.5 21.5V17.75C12.5 17.1533 12.7371 16.581 13.159 16.159C13.581 15.7371 14.1533 15.5 14.75 15.5C15.3467 15.5 15.919 15.7371 16.341 16.159C16.7629 16.581 17 17.1533 17 17.75V21.5C17 21.6989 17.079 21.8897 17.2197 22.0303C17.3603 22.171 17.5511 22.25 17.75 22.25C17.9489 22.25 18.1397 22.171 18.2803 22.0303C18.421 21.8897 18.5 21.6989 18.5 21.5V17.75C18.5005 16.9166 18.2219 16.107 17.7087 15.4503C18.966 15.2778 20.1183 14.6563 20.953 13.7004C21.7877 12.7446 22.2484 11.519 22.25 10.25V9.50001C22.2407 8.56793 21.9924 7.65381 21.5291 6.84501ZM20.75 10.25C20.75 11.2446 20.3549 12.1984 19.6516 12.9017C18.9484 13.6049 17.9946 14 17 14H12.5C11.5054 14 10.5516 13.6049 9.84835 12.9017C9.14509 12.1984 8.75 11.2446 8.75 10.25V9.50001C8.7592 8.75004 8.98373 8.0185 9.39688 7.39251C9.47389 7.291 9.52377 7.17154 9.54182 7.0454C9.55986 6.91926 9.54547 6.79061 9.5 6.67157C9.30465 6.16776 9.21063 5.63035 9.22334 5.09013C9.23605 4.54992 9.35523 4.01752 9.57406 3.52345C10.1879 3.58948 10.7789 3.79281 11.3034 4.11836C11.828 4.44391 12.2725 4.88334 12.6041 5.40407C12.6716 5.50974 12.7646 5.59676 12.8745 5.6572C12.9844 5.71763 13.1077 5.74955 13.2331 5.75001H16.2659C16.3918 5.75002 16.5157 5.71833 16.6261 5.65787C16.7366 5.59742 16.83 5.51014 16.8978 5.40407C17.2293 4.8833 17.6738 4.44383 18.1984 4.11827C18.7229 3.79271 19.314 3.58941 19.9278 3.52345C20.1463 4.01765 20.2652 4.55011 20.2776 5.09032C20.29 5.63053 20.1956 6.16788 20 6.67157C19.9547 6.78947 19.9395 6.91682 19.9559 7.04206C19.9722 7.16731 20.0196 7.28648 20.0938 7.38876C20.511 8.01475 20.7388 8.7478 20.75 9.50001V10.25Z" fill="black"/>
  </svg>
  );
}

