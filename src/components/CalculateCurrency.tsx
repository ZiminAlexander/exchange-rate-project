import React from "react";
import { useState, useEffect } from "react";
import { Button, Select, Input, Space } from "antd";

export const CalculateCurrency = ({ baseCurrencyOptions, loadData}: { baseCurrencyOptions: object[] , loadData: Function})=> {
    const [firstCurrency, setFirstCurrency] = useState("RUB");
    const [firstCurrencyValue, setFirstCurrencyValue] = useState(0.00);
    const [secondCurrency, setSecondCurrency] = useState("USD");
    const [dataOfCurrency, setDataOfCurrency] = useState({ rates: {} });
    const [secondCurrencyValue, setSecondCurrencyValue] = useState(0.00);
    const splitDataOfCurrency: [string, number][] = Object.entries(dataOfCurrency.rates);
  
    const findRate = (): number => {
      let result = 0;
      splitDataOfCurrency.map(
        ([name, value]) => {
          if (name === firstCurrency) {
            result = 1 / value;
          }
        }
      )
      return result;
    }
  
    const calculateResult = () => {
      setSecondCurrencyValue(findRate() * firstCurrencyValue);
    }
    
    useEffect(() => calculateResult(), [firstCurrency, firstCurrencyValue, secondCurrency, dataOfCurrency])
    useEffect(() => loadData(secondCurrency, setDataOfCurrency), [secondCurrency])
    
    return (
      <div className='calculator-currency'>
        <Space direction="vertical" align='center'>
          <div className='block-title-3'>
            Калькулятор валюты
          </div>
          <div className='calc-text'>
            Перевести из
          </div>
          <div>
            <Space>
            <Input style={{ width: "180px" }} type="number" defaultValue={firstCurrencyValue}
              onChange={(event) => setFirstCurrencyValue(Number(event.target.value))}
            />
            <Select
              value={firstCurrency}
              onChange={(value) => setSecondCurrency(value)}
              options={baseCurrencyOptions}
            />
            </Space>
          </div>
          <div className='calc-text'> в </div>
          <div>
            <Space>
            <Select
              value={secondCurrency}
              onChange={(value) => setSecondCurrency(value)}
              options={baseCurrencyOptions}
            />
            <div className='second-currency-value'> {secondCurrencyValue.toFixed(2)} </div>
            </Space>
          </div>
          <Button type="default"
            onClick={() => {
              const intermediateValue = secondCurrency;
              setSecondCurrency(firstCurrency);
              setFirstCurrency(intermediateValue);
            }}
          >
            &#8596;
          </Button>
        </Space>
      </div>
    )
  }