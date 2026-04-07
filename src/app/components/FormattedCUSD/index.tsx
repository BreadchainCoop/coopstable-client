import { formatCUSDFromStroops } from "@/app/utils/tokenFormatting";

interface FormattedCUSDProps {
  readonly stroops: string | number | bigint;
  readonly symbol?: string;
  readonly symbolPosition?: 'prefix' | 'suffix';
  readonly significantDigits?: number;
  readonly className?: string;
}

export function FormattedCUSD({
  stroops,
  symbol = "cUSD",
  symbolPosition = "suffix",
  significantDigits = 4,
  className,
}: FormattedCUSDProps) {
  const result = formatCUSDFromStroops(stroops, { significantDigits });
  const pre = symbolPosition === "prefix" ? symbol : "";
  const suf = symbolPosition === "suffix" ? ` ${symbol}` : "";

  switch (result.type) {
    case "zero":
      return <span className={className}>{pre}0{suf}</span>;

    case "normal":
      return (
        <span className={className}>
          {pre}{result.formatted}{suf}
        </span>
      );

    case "subscript":
      return (
        <span className={className}>
          {pre}{result.wholePart}.0
          <span className="text-[0.7em]" style={{ verticalAlign: "sub" }}>
            {result.zeroCount}
          </span>
          {result.significant}{suf}
        </span>
      );
  }
}
