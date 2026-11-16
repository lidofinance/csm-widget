const MIN_VISIBLE_USD = 0.01;

export const calcGasCostWei = (gas: bigint, gasPrice: bigint) => gas * gasPrice;

export const formatUsdCost = (usd: number) => {
  if (!Number.isFinite(usd) || usd < 0) return undefined;
  if (usd > 0 && usd < MIN_VISIBLE_USD) return `<$${MIN_VISIBLE_USD}`;
  return `$${usd.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// djb2: keeps query keys short when the source (deposit data) is large
export const hashString = (value: string) => {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
};
