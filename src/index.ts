import fetch from 'node-fetch';
import { tickers } from './interfaces/tickers';

class UpholdBot {
  constructor() {
    this.getTickers();
  }

  public async getTickers(): Promise<unknown> {
    return fetch('https://api.uphold.com/v0/ticker/USD')
      .then((res: any) => res.json())
      .then((data: any) => {
        return data;
      });
  }
  public async getCurrencyPairs(pairs: string[]): Promise<tickers[]> {
    const data = (await this.getTickers()) as tickers;
    const match: tickers[] = [];
    Object.values(data).map((value) => {
      pairs.forEach((pair) => {
        if (value.pair === pair) {
          match.push(value);
        }
      });
    });
    return match;
  }
}

const pb = new UpholdBot();
pb.getCurrencyPairs(['BTCUSD']).then((result) => console.log(result));
