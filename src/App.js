import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import 'antd/dist/antd.css';

import { SelectMarketDropdown } from './components/SelectMarketDropdown.js';

import { getMarketData, getBestOffer, getExpectedFillPrice } from './utils/markets';

import { InputNumber, Spin } from 'antd';


function App() {
  let [loading, setLoading] = useState(false);
  let [selectedMarket, setSelectedMarket] = useState([]);
  let [fromToken, setFromToken] = useState();
  let [toToken, setToToken] = useState();
  let [bids, setBids] = useState([]);
  let [asks, setAsks] = useState([]);
  let [buySell, setBuySell] = useState();
  let [test, setTest] = useState(0);
  let inputA = useRef();
  let inputB = useRef();

  const onSelectMarket = (e) => {
    setSelectedMarket(e);
    let tradingPair = e[0].split('/');
    setFromToken(tradingPair[0]);
    setToToken(tradingPair[1]);
  };

  const getBidsAsks = async () => {
    let data = await getMarketData(selectedMarket[1], selectedMarket[2]);
    setBids(data.bids);
    setAsks(data.asks);
    console.log("getBidsAks() running" ,bids, asks)
  };

  const getBuySell = async () => {
    setLoading(true);
    let data = await getBestOffer(selectedMarket[1], selectedMarket[2]);
    setBuySell(data);
    setLoading(false);    
  };

  const currencyFormat = (num) => {
    if (num) {
      return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " " + toToken;
    }
  };

  const onInputChange = async (e) => {
    let avgPrice = await getExpectedFillPrice(selectedMarket[1], selectedMarket[2], e)
    inputB.current.disabled = true;

    setTest(avgPrice * e)

  }

  useEffect(() => {
    // getBidsAsks()
    getBuySell();
    // const interval = setInterval(async () => {
    //   let data = await getBestOffer(selectedMarket[1], selectedMarket[2])
    //   await setBuySell(data)
    // },10000);

  }, [selectedMarket]);

  return (
    <div className='App'>
      <SelectMarketDropdown
        onSelectMarket={onSelectMarket}
        selectedMarket={selectedMarket}
      />
      <p>Trading Pair: {selectedMarket[0]}</p>
      {loading && <Spin/>}
      {selectedMarket.length > 0 && <h3>Buy {fromToken} for {currencyFormat(buySell.ask)} </h3>}
      {selectedMarket.length > 0 && <h3>Sell {fromToken} for {currencyFormat(buySell.bid)} </h3> }
      <div style={{display:'flex', justifyContent:'center', gap:'1rem'}}>
      <p>{fromToken} </p>
      <InputNumber style={{width: 100}} placeholder='0' disabled={false} min={0} ref={inputA} onChange={(input)=>{onInputChange(input)}}/>
      <p>{toToken}</p>
      <InputNumber style={{width: 100}} placeholder='0' disabled={false} min={0} ref={inputB} value={test} />

      </div>
    </div>
  );
}

export default App;
