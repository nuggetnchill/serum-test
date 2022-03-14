import { Connection, PublicKey } from '@solana/web3.js';
import { Market, MARKETS } from '@project-serum/serum';

let connection = new Connection('https://solana-api.projectserum.com');
let defaultMarketAddress = new PublicKey('9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT');
let defaultProgramAddress = new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");


export const getAllMarkets = () => {
    let filterDeprecated = MARKETS.filter(
         ({deprecated}) => {
        return !deprecated
    })
    return filterDeprecated
}

export const getMarketData = async (address, programId) => {
    let bids = [];
    let asks = [];
    if (address) {
        let marketAddress = address ? new PublicKey(address) : defaultMarketAddress
        let programAddress = programId ? new PublicKey(programId) : defaultProgramAddress
        let market = await Market.load(connection, marketAddress, {}, programAddress);
    
        let loadBidsData = await market.loadBids(connection);
        let loadAsksData = await market.loadAsks(connection);
        for (let [price, size] of loadBidsData.getL2(10)) {
            bids.push({price, size})
            }
        for (let [price, size] of loadAsksData.getL2(10)) {
            asks.push({price, size})
            }
        }
    return {bids, asks}
}

export const getBestOffer = async (address, programId) => {
    let data = await getMarketData(address, programId);
    let bid = data.bids[0] && data.bids[0].price;
    let ask = data.asks[0] && data.asks[0].price;

    return{bid, ask}
}

export const getExpectedFillPrice = async (address, programId) => {
    //currently just for bids which is Buy
    let orderBook
    if (address) {
        let bids = [];
        let asks = [];
        let marketAddress = address ? new PublicKey(address) : defaultMarketAddress
        let programAddress = programId ? new PublicKey(programId) : defaultProgramAddress
        let market = await Market.load(connection, marketAddress, {}, programAddress);
        let loadBidsData = await market.loadBids(connection);
        let loadAsksData = await market.loadAsks(connection);
        
        bids = loadBidsData.getL2(100).map(([price, size]) => [price, size]);
        asks = loadAsksData.getL2(100).map(([price, size]) => [price, size]);

        orderBook = {bids, asks};
    }

    let spentCost = 0;
    let avgPrice = 0;
    let cost = 1000; // quantity of the fromToken to spend 
    let price, sizeAtLevel, costAtLevel

    if (orderBook) {    
        for ([price, sizeAtLevel] of orderBook.bids) {
            costAtLevel = (orderBook ? 1 : price) * sizeAtLevel;
            if (spentCost + costAtLevel > cost) {
                avgPrice += (cost - spentCost) * price;
                spentCost = cost;
                break;
            }
            avgPrice += costAtLevel * price;
            spentCost += costAtLevel;
        }
        const totalAvgPrice = avgPrice / Math.min(cost, spentCost);
        console.log("here: ", totalAvgPrice)
        return totalAvgPrice;
    }
}
