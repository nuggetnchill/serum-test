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
            bids.push([price, size])
            }
        for (let [price, size] of loadAsksData.getL2(10)) {
            asks.push([price, size])
            }
        }
    return {bids, asks}
}

export const getBestOffer = async (address, programId) => {
    let bid;
    let ask;
    if (address) {
        let marketAddress = address ? new PublicKey(address) : defaultMarketAddress
        let programAddress = programId ? new PublicKey(programId) : defaultProgramAddress
        let market = await Market.load(connection, marketAddress, {}, programAddress);
    
        let loadBidsData = await market.loadBids(connection);
        let loadAsksData = await market.loadAsks(connection);
        for (let [price, size] of loadBidsData.getL2(1)) {
            bid = price;
            }
        for (let [price, size] of loadAsksData.getL2(1)) {
            ask = price
            }
        }
    return{bid, ask}
}
