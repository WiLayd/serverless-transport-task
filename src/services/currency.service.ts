import { HttpError } from 'src/lib/http-error';
import { logger } from 'src/lib/logger';
import { CurrencyRates } from 'src/common/types/currency.type';

const FIXER_API_KEY = process.env.FIXER_API_KEY;
const FIXER_API_URL = 'https://data.fixer.io/api/latest';

const cache = {
  rates: null as CurrencyRates | null,
  timestamp: 0,
};

const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

export class CurrencyService {
  public static async getRates(
    base: string = 'EUR',
    symbols: string[] = ['USD', 'UAH'],
  ): Promise<CurrencyRates> {
    const now = Date.now();

    if (cache.rates && now - cache.timestamp < CACHE_DURATION_MS) {
      logger.info('Returning currency rates from cache');
      return cache.rates;
    }

    if (!FIXER_API_KEY) {
      logger.error('FIXER_API_KEY is not configured in environment variables.');
      throw new HttpError(500, 'Currency conversion service is not configured.');
    }

    const url = `${FIXER_API_URL}?access_key=${FIXER_API_KEY}&base=${base}&symbols=${symbols.join(
      ',',
    )}`;

    try {
      logger.info('Fetching fresh currency rates from Fixer API');
      const response = await fetch(url);
      const data = await response.json();

      if (!data.success) {
        logger.error('Fixer API request failed', { error: data.error });
        throw new HttpError(502, `Failed to fetch currency rates: ${data.error?.info}`);
      }

      cache.rates = data.rates;
      cache.timestamp = now;

      logger.info('Successfully fetched and cached new currency rates');
      return data.rates;
    } catch (error) {
      logger.error('Error calling Fixer API', { error });
      throw new HttpError(502, 'Could not connect to the currency conversion service.');
    }
  }
}
