// Contract error codes from LendingYieldControllerError
const CONTRACT_ERROR_CODES: Record<number, string> = {
  1: "An internal error occurred",
  3: "Contract is already initialized",
  4: "You are not authorized to perform this action",
  8: "Amount cannot be negative",
  10: "Insufficient balance",
  12: "Calculation overflow error",
  1000: "This asset is not supported",
  1001: "Yield is currently unavailable",
  1002: "No pending harvest exists",
  1003: "A harvest is already in progress",
  1004: "Invalid harvest state",
  1005: "No yield available to harvest",
};

// Common Soroban/Stellar error patterns
const ERROR_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  {
    pattern: /resulting balance is not within the allowed range/i,
    message: "Insufficient balance. Please check your wallet has enough tokens.",
  },
  {
    pattern: /Error\(Contract, #(\d+)\)/,
    message: "", // Will be filled dynamically from CONTRACT_ERROR_CODES
  },
  {
    pattern: /insufficient/i,
    message: "Insufficient funds for this transaction",
  },
  {
    pattern: /unauthorized|not authorized/i,
    message: "You are not authorized to perform this action",
  },
  {
    pattern: /timeout|timed out/i,
    message: "Transaction timed out. Please try again.",
  },
  {
    pattern: /rejected|declined/i,
    message: "Transaction was rejected. Please try again.",
  },
];

export function parseContractError(error: unknown): string {
  const errorMessage = getErrorMessage(error);

  // Check for specific contract error codes
  const contractErrorMatch = errorMessage.match(/Error\(Contract, #(\d+)\)/);
  if (contractErrorMatch) {
    const errorCode = parseInt(contractErrorMatch[1], 10);
    const friendlyMessage = CONTRACT_ERROR_CODES[errorCode];
    if (friendlyMessage) {
      return friendlyMessage;
    }
  }

  // Check for known error patterns
  for (const { pattern, message } of ERROR_PATTERNS) {
    if (pattern.test(errorMessage) && message) {
      return message;
    }
  }

  // Extract the main error message before event log
  const parts = errorMessage.split('Event log (newest first):');
  if (parts.length > 1) {
    const mainError = parts[0].trim();
    // Try to extract a cleaner message
    const hostErrorMatch = mainError.match(/HostError:\s*(.+)/);
    if (hostErrorMatch) {
      return `Transaction failed: ${hostErrorMatch[1]}`;
    }
    return mainError;
  }

  // Default fallback
  if (errorMessage && errorMessage !== 'Unknown error occurred') {
    return errorMessage.length > 100
      ? `${errorMessage.substring(0, 100)}...`
      : errorMessage;
  }

  return "Something went wrong. Please try again.";
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Unknown error occurred';
}