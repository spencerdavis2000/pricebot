import fetch from 'node-fetch';
import { tickers } from './interfaces/tickers';
import chalk from 'chalk';
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

function hasThreshold(
  baseprice: number,
  currentprice: number,
  threshold: number
): boolean {
  const upThreshold = 1 + threshold;
  const downThreshold = 1 - threshold;
  if (
    currentprice > baseprice * upThreshold ||
    currentprice < baseprice * downThreshold
  ) {
    return true;
  }
  return false;
}
// dictionary map holder for base prices
const baseprices: { [pair: string]: number } = {};

async function PriceBotOscillator(
  currencies: string[],
  upholdBot: UpholdBot
): Promise<void> {
  const tickers = await upholdBot.getTickers();
  const myTickers = await upholdBot.getCurrencyPairs(currencies);
  myTickers.map((ticker) => {
    // if it does exist find out threshold
    if (Object.keys(baseprices).length > 0) {
      if (hasThreshold(baseprices[ticker.pair], parseFloat(ticker.bid), 0.0001)) {
        // log out the threshold message
        console.log(
          chalk.bold.red(
            `Threshold hit on currency: ${ticker.pair} | at price: ${ticker.bid}`
          )
        );
        // set a new staring price
        baseprices[ticker.pair] = parseFloat(ticker.bid);
      }
    } else {
      baseprices[ticker.pair] = parseFloat(ticker.bid);
    }
    // general log of prices to see it working
    console.log(chalk.cyan('Threshold is 0.01 percent so 0.0001 fraction'));
    console.log(chalk.yellow('COMPARING BID: first price | '), baseprices);
    console.log(chalk.green('COMPARING BID: current price | '), ticker);
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
