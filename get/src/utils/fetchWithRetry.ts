import fetch, { FetchError } from 'node-fetch';

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_INITIAL_DELAY_MS = 1000; // 1 second

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchWithRetry(
  url: string,
  options?: Parameters<typeof fetch>[1],
  maxRetries: number = DEFAULT_MAX_RETRIES,
  initialDelayMs: number = DEFAULT_INITIAL_DELAY_MS
): Promise<Awaited<ReturnType<typeof fetch>>> {  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      // Only retry on network errors (FetchError) or socket errors
      const isRetryableError = 
        error instanceof FetchError ||
        (error instanceof Error && (
          error.message.includes('socket hang up') ||
          error.message.includes('ECONNRESET') ||
          error.message.includes('ETIMEDOUT') ||
          error.message.includes('ENOTFOUND')
        ));
      
      // If it's not a retryable error or we've exhausted retries, throw
      if (!isRetryableError || attempt === maxRetries - 1) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delayMs = initialDelayMs * Math.pow(2, attempt);
      await sleep(delayMs);
    }
  }
  
  // This should never be reached, but TypeScript needs it
  throw new Error('Failed to fetch after retries');
}

