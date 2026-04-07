import { formatCUSDFromStroops } from "@/app/utils/tokenFormatting";

interface FormattedCUSDProps {
  readonly stroops: string | number | bigint;
  readonly symbol?: string;
  readonly significantDigits?: number;
  readonly className?: string;
}

export function FormattedCUSD({
  stroops,
  symbol = "cUSD",
  significantDigits = 4,
  className,
}: FormattedCUSDProps) {
  const result = formatCUSDFromStroops(stroops, { significantDigits });

  switch (result.type) {
    case "zero":
      return <span className={className}>0 {symbol}</span>;

    case "normal":
      return (
        <span className={className}>
          {result.formatted} {symbol}
        </span>
      );

    case "subscript":
      return (
        <span className={className}>
          {result.wholePart}.0
          <span className="text-[0.7em]" style={{ verticalAlign: "sub" }}>
            {result.zeroCount}
          </span>
          {result.significant} {symbol}
        </span>
      );
  }
}
