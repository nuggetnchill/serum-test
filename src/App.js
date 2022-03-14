import React, { useState, useEffect } from 'react';
import './App.css';
import 'antd/dist/antd.css';

import { SelectMarketDropdown } from './components/SelectMarketDropdown.js';

import { getMarketData, getBestOffer, getExpectedFillPrice } from './utils/markets';

import { InputNumber, Spin } from 'antd';


function App() {
  let [loading, setLoading] = useState(false);
  let [selectedMarket, setSelectedMarket] = useState([]);
  let [bids, setBids] = useState([]);
  let [asks, setAsks] = useState([]);
  let [buySell, setBuySell] = useState({});

  const onSelectMarket = (e) => {
    setSelectedMarket(e);
  };

  const getBidsAsks = async () => {
    let data = await getMarketData(selectedMarket[1], selectedMarket[2]);
    await setBids(data.bids);
    await setAsks(data.asks);
    console.log( bids, asks)
  };

  const getBuySell = async () => {
    setLoading(true);
    let data = await getBestOffer(selectedMarket[1], selectedMarket[2]);
    await setBuySell(data);
    setLoading(false);    
  };

  const currencyFormat = (num) => {
    if (num) {
      return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
  };

  useEffect(() => {
    // getBidsAsks()
    getBuySell();
    // const interval = setInterval(async () => {
    //   let data = await getBestOffer(selectedMarket[1], selectedMarket[2])
    //   await setBuySell(data)
    // },10000);
    getExpectedFillPrice(selectedMarket[1], selectedMarket[2])

  }, [selectedMarket]);

  return (
    <div className='App'>
      <SelectMarketDropdown
        onSelectMarket={onSelectMarket}
        selectedMarket={selectedMarket}
      />
      <h2>Trading Pair: {selectedMarket[0]}</h2>
      {loading && <Spin/>}
      {buySell && <h3>Sell: {currencyFormat(buySell.bid)} </h3> }
      {buySell && <h3>Buy: {currencyFormat(buySell.ask)} </h3>}
      <div style={{display:'flex', justifyContent:'center', gap:'1rem'}}>
      <p>token A </p>
      <InputNumber style={{width: 100}} placeholder='0' disabled={false} onChange={(e)=>{console.log(e)}}/>
      <p>token B </p>
      <InputNumber style={{width: 100}} placeholder='0' />

      </div>
    </div>
  );
}

export default App;
