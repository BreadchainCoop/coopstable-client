"use client";
import { useUser } from "@/app/context/UserContext/UserContext";
import { SwapProvider, useSwap } from "./SwapContext";
// import { UserContextStateConnected } from "@/app/context/UserContext/types";
// import { useTokenABalance } from "@/app/context/ContractContext/hooks";
import { Button } from "../Button";
import { cn } from "@/app/utils";
import { ReactNode } from "react";
import { SubmitTransaction } from "./SubmitTransaction";

export function Swap() {
  const { user, connectWallet } = useUser();

  return (
    <SwapProvider>
      <form
        className="max-w-106 border-1 border-[#B1AEAB] bg-[#F7F6F3] p-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <SwapFormHeader />
        <SwapFrom />
        <ModeReverse />
        <SwapTo />
        <div className="h-6"></div>
        {user.status === "loading" && (
          <Button size="large" fullWidth disabled>
            loading...
          </Button>
        )}
        {user.status === "not_connected" && (
          <Button onClick={connectWallet} size="large" fullWidth>
            Sign In
          </Button>
        )}
        {user.status === "connected" && <SubmitTransaction user={user} />}
      </form>
    </SwapProvider>
  );
}

function SwapFormHeader() {
  const { state, modeChange } = useSwap();
  return (
    <div className="flex justify-center pb-2">
      <button
        className={cn(
          "font-theme-2 text-theme-black px-2 pb-1 text-xl leading-none font-black opacity-50 hover:cursor-pointer",
          state.mode === "mint" && "opacity-100",
        )}
        onClick={() => modeChange("mint")}
      >
        Mint
      </button>
      <button
        className={cn(
          "font-theme-2 text-theme-black px-2 pb-1 text-xl leading-none font-black opacity-50 hover:cursor-pointer",
          state.mode === "burn" && "opacity-100",
        )}
        onClick={() => modeChange("burn")}
      >
        Burn
      </button>
    </div>
  );
}

// function TokenBalance({ user }: { user: UserContextStateConnected }) {
//   const { status, data } = useTokenABalance(user.account, user.network);

//   console.log("token balance status: ", status);
//   return <span>{status === "success" && data}</span>;
// }

function SwapFrom() {
  const { state, inputValueChange } = useSwap();
  const token = state.mode === "mint" ? "USDC" : "cUSD";

  return (
    <div className="border-theme-grey-4 flex flex-col gap-1 border-1 p-2">
      <label htmlFor="deposit-amount" className="text-theme-grey-5 p-1 text-xs">
        You deposit
      </label>
      <div className="flex gap-4">
        <div className="grow">
          <input
            className="w-full grow p-1 text-3xl text-black placeholder-black"
            placeholder="00.00"
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            minLength={1}
            maxLength={79}
            spellCheck="false"
            value={state.inputValue}
            onChange={(event) => {
              inputValueChange(event.target.value);
            }}
          />
        </div>
        <div className="flex items-center gap-2 bg-white px-2 py-1">
          <div className="size-6">
            {state.mode === "mint" ? <USDCIcon /> : <CUSDIcon />}
          </div>
          <span className="text-theme-grey-6 text-xl">{token}</span>
        </div>
      </div>
      <div className="flex justify-end">
        <BalanceDisplay>Balance: 0.00 {token}</BalanceDisplay>
      </div>
    </div>
  );
}

function BalanceDisplay({ children }: { children: ReactNode }) {
  return <span className="text-theme-grey-5 pt-1 text-xs">{children}</span>;
}

function SwapTo() {
  const { state } = useSwap();
  const token = state.mode === "burn" ? "USDC" : "cUSD";
  return (
    <div className="border-theme-grey-4 flex flex-col gap-1 border-1 p-2">
      <span className="text-theme-grey-5 p-1 text-xs">You receive</span>
      <div className="flex">
        <div className="grow p-1 text-3xl text-black">
          {state.inputValue === "" ? <span>00.00</span> : state.inputValue}
        </div>
        <div className="flex items-center gap-2 bg-white px-2 py-1">
          <div className="size-6">
            {state.mode === "burn" ? <USDCIcon /> : <CUSDIcon />}
          </div>
          <span className="text-theme-grey-6 text-xl"> {token}</span>
        </div>
      </div>
      <div className="flex justify-end">
        <BalanceDisplay>Balance: 0.00 {token}</BalanceDisplay>
      </div>
    </div>
  );
}

function ModeReverse() {
  const { state, modeChange } = useSwap();
  return (
    <div className="relative h-2">
      <button
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 transform border-[1.5px] border-[#B1AEAB] bg-white p-1 hover:cursor-pointer"
        onClick={() => {
          modeChange(state.mode === "burn" ? "mint" : "burn");
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 3.125V16.875"
            stroke="#11110F"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.375 11.25L10 16.875L15.625 11.25"
            stroke="#11110F"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

function USDCIcon() {
  return (
    <svg
      className="size-full"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_318_172)">
        <path
          d="M12 0.75C18.4893 0.75 23.75 6.01065 23.75 12.5C23.75 18.9893 18.4893 24.25 12 24.25C5.51065 24.25 0.25 18.9893 0.25 12.5C0.25 6.01065 5.51065 0.75 12 0.75Z"
          fill="#3E73C4"
          stroke="#325D9E"
          strokeWidth="0.5"
        />
        <path
          d="M15.0162 14.0932C15.0162 12.5002 14.0562 11.9542 12.1362 11.7262C10.7652 11.5439 10.4914 11.1802 10.4914 10.5427C10.4914 9.90519 10.9489 9.49569 11.8624 9.49569C12.6852 9.49569 13.1427 9.76869 13.3707 10.4519C13.3944 10.518 13.4379 10.5752 13.4951 10.6158C13.5524 10.6565 13.6207 10.6786 13.6909 10.6792H14.4222C14.4644 10.6803 14.5064 10.6729 14.5457 10.6573C14.585 10.6417 14.6207 10.6182 14.6506 10.5884C14.6805 10.5586 14.7041 10.5231 14.7199 10.4839C14.7357 10.4447 14.7434 10.4027 14.7424 10.3604V10.3154C14.6531 9.82111 14.4029 9.37014 14.0309 9.03257C13.6589 8.69501 13.1858 8.48975 12.6852 8.44869V7.35669C12.6852 7.17444 12.5479 7.03794 12.3199 6.99219H11.6337C11.4514 6.99219 11.3142 7.12869 11.2684 7.35669V8.40369C9.89668 8.58519 9.02893 9.49569 9.02893 10.6342C9.02893 12.1357 9.94243 12.7274 11.8624 12.9554C13.1427 13.1827 13.5537 13.4564 13.5537 14.1847C13.5537 14.9122 12.9139 15.4132 12.0454 15.4132C10.8567 15.4132 10.4457 14.9129 10.3084 14.2297C10.2634 14.0482 10.1254 13.9567 9.98818 13.9567H9.21118C9.169 13.9557 9.12706 13.9632 9.08788 13.9788C9.04871 13.9945 9.01311 14.0179 8.98324 14.0477C8.95338 14.0775 8.92987 14.1131 8.91413 14.1522C8.89839 14.1913 8.89075 14.2333 8.89168 14.2754V14.3204C9.07393 15.4589 9.80593 16.2779 11.3142 16.5059V17.5987C11.3142 17.7802 11.4514 17.9174 11.6794 17.9624H12.3657C12.5479 17.9624 12.6852 17.8259 12.7309 17.5987V16.5052C14.1027 16.2779 15.0162 15.3217 15.0162 14.0924V14.0932Z"
          fill="white"
        />
        <path
          d="M9.66848 18.8727C6.10298 17.5977 4.27448 13.6377 5.60048 10.133C6.28598 8.2205 7.79423 6.76475 9.66848 6.0815C9.85148 5.99075 9.94223 5.85425 9.94223 5.62625V4.98875C9.94223 4.80725 9.85148 4.67075 9.66848 4.625C9.62273 4.625 9.53123 4.625 9.48548 4.67C8.4568 4.99124 7.50183 5.5128 6.67555 6.20463C5.84927 6.89646 5.168 7.74491 4.67097 8.70112C4.17394 9.65733 3.87096 10.7024 3.77949 11.7762C3.68802 12.85 3.80985 13.9312 4.13798 14.9578C4.95998 17.5078 6.92573 19.4653 9.48548 20.2843C9.66848 20.375 9.85148 20.2842 9.89648 20.102C9.94223 20.057 9.94223 20.0105 9.94223 19.9198V19.2822C9.94223 19.1457 9.80573 18.9642 9.66848 18.8727ZM14.5135 4.67075C14.3305 4.57925 14.1475 4.67075 14.1025 4.85225C14.0567 4.898 14.0567 4.94375 14.0567 5.0345V5.672C14.0567 5.85425 14.1932 6.03575 14.3305 6.12725C17.896 7.40225 19.7245 11.3623 18.3985 14.867C17.713 16.7795 16.2047 18.2353 14.3305 18.9185C14.1475 19.0093 14.0567 19.1458 14.0567 19.3738V20.0112C14.0567 20.1927 14.1475 20.3293 14.3305 20.375C14.3762 20.375 14.4677 20.375 14.5135 20.33C15.5422 20.0088 16.4971 19.4872 17.3234 18.7954C18.1497 18.1035 18.831 17.2551 19.328 16.2989C19.825 15.3427 20.128 14.2976 20.2195 13.2238C20.3109 12.15 20.1891 11.0688 19.861 10.0422C19.039 7.44725 17.0275 5.48975 14.5135 4.67075Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_318_172">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function CUSDIcon() {
  return (
    <svg
      className="size-full"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_318_195)">
        <path
          d="M12 0.75C18.4893 0.75 23.75 6.01065 23.75 12.5C23.75 18.9893 18.4893 24.25 12 24.25C5.51065 24.25 0.25 18.9893 0.25 12.5C0.25 6.01065 5.51065 0.75 12 0.75Z"
          fill="#11110F"
          stroke="#11110F"
          strokeWidth="0.5"
        />
        <path
          d="M19 19.5H5V5.5H19V19.5ZM12 8.5625C9.82538 8.5625 8.0625 10.3254 8.0625 12.5C8.0625 14.6746 9.82538 16.4375 12 16.4375C14.1746 16.4375 15.9375 14.6746 15.9375 12.5C15.9375 10.3254 14.1746 8.5625 12 8.5625Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_318_195">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
