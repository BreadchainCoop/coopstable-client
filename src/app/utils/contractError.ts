export function parseContractError(error: any): string {
    if (error?.message) {
      const parts = error.message.split('Event log (newest first):');
      if (parts.length > 1) {
        return `Contract Error: ${parts[0].trim()}`;
      }
      return error.message;
    }
    return 'Unknown error occurred';
  }