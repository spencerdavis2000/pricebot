import fetch from 'node-fetch';
import { tickers } from './interfaces/tickers';
export class UpholdBot {
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

async function PriceBotOscillator(
  currencies: string[],
  upholdBot: UpholdBot
): Promise<void> {
  await upholdBot.getTickers();
  const myTickers = await upholdBot.getCurrencyPairs(currencies);
  myTickers.map((ticker) => {
    console.log(ticker);
  });
}

let interval = 0;
function start(currencies: string[]) {
  const upholdBot = new UpholdBot();
  global.setTimeout(() => {
    PriceBotOscillator(currencies, upholdBot);
    console.log(interval);
    interval++;
    start(currencies);
  }, 5000);
}

start(['BTCUSD']);
