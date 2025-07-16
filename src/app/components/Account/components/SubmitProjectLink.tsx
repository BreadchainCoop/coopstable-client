import Link from "next/link";

export function SubmitProjectLink() { 
  return (
    <Link 
    target="_blank" 
    href="https://ruben280.typeform.com/to/NTdqRDcK" 
    className="hidden md:inline mx-1 font-theme-2 px-6 py-3 text-[20px] lg:text-xl text-theme-black bg-theme-grey-3 font-bold uppercase hover:cursor-pointer"
    >Submit Project</Link>
  );
}