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
/**
 * Checks if the threshold is hit either up or down
 * If it is, it returns true or false
 * @param {number} baseprice
 * @param {number} currentprice
 * @param {number} threshold
 * @returns {boolean} returns true or false
 */
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

/**
 * This is the brains
 * It gets the tickers, the filters to the specific currency pairs
 * Then it goes through the currency pairs:
 * 1.  adds a price in the dictionary
 * 2.  keeps reading until the threshold hits (either up or down)
 *
 * When it hits, it will use that price as the new starting price
 * @param {string[]} currencies list of currencies as an array of strings
 * @param {UpholdBot} upholdBot instance of UpholdBot class
 */
async function PriceBotOscillator(
  currencies: string[],
  upholdBot: UpholdBot
): Promise<void> {
  await upholdBot.getTickers();
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
    // instead of using an infinite loop, just did a recursive call spaced by 5 seconds
    // this allows it to keep running without stopping invoking every 5 seconds
    start(currencies);
  }, 5000);
}
// you can add as many currencies as you want
start(['BTCUSD']);
