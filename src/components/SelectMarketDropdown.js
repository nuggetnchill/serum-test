import React from 'react';
import { getAllMarkets } from '../utils/markets';
import {Select} from 'antd';
const { Option, OptGroup } = Select;

export const SelectMarketDropdown = ({onSelectMarket,selectedMarket}) =>{
    let markets = getAllMarkets();
return(

<Select
        showSearch
        size={'large'}
        style={{ width: 200 }}
        listHeight={400}
        placeholder={'Select market'}
        optionFilterProp="name"
        onSelect={onSelectMarket}
        value={selectedMarket}
      >
        <OptGroup label="Markets">
          {markets.map(({address, name, programId}, i) => (
            <Option
              value={[name,address.toBase58(),programId.toBase58()]}
              key={i}
              name={name}
            >
              {name}
            </Option>
          ))}
        </OptGroup>
      </Select>
)
}