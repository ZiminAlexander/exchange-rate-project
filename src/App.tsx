import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import './App.css';
import { Button, Table, Select, Input } from "antd";

const App = () => {

  const [dataOfCurrency, setData] = useState({ rates: {} });
  const [baseCurrency, setbaseCurrency] = useState("USD");
  const [intervalID, setIntervalID]: [intervalID: NodeJS.Timer | undefined, setIntervalID: Function] = useState();

  const loadData = (baseCurrency: string) => {
    const apiAnswer = api(baseCurrency);
    apiAnswer
      .then(response => response.json())
      .then(result => {
        setData(result);
      })
      .catch(error => console.log("error", error));
  }
  useEffect(() => {
    loadData(baseCurrency);
    if (!!intervalID) { clearInterval(intervalID) };
    const currentInterval = setInterval(() => loadData(baseCurrency), 10000);
    setIntervalID(currentInterval);
  }, [baseCurrency])


  const splitDataOfCurrency: [string, number][] = Object.entries(dataOfCurrency.rates);
  const currencyArray = splitDataOfCurrency.map(
    ([name, value], index): object => (
      {
        key: index,
        currencyCode: name,
        baseRate: value,
      }
    )
  )
  const baseCurrencyOptions = splitDataOfCurrency.map(
    ([name], index): object => (
      {
        value: name,
        label: name,
      }
    )
  )

  return (
    <Router>
      <Nav />
      <Switch>
        <Route exact path="/">
          <Redirect to="/table" />
        </Route>
        <Route exact path="/table" children={() => <TableCurrency currencyArray={currencyArray}
          baseCurrency={baseCurrency}
          setbaseCurrency={setbaseCurrency}
          baseCurrencyOptions={baseCurrencyOptions}
          loadData={loadData}
        />} />
        <Route path="/calculator" children={() => <CalculateCurrency baseCurrencyOptions={baseCurrencyOptions} />} />
      </Switch>
    </Router>
  );
}

const api = (baseCurrency: string) => {

  const url = "https://api.exchangerate.host/latest?base=" + baseCurrency;
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "	application/json; charset=utf-8",
    }
  }

  return fetch(url, options);
}

const TableCurrency = ({ currencyArray, baseCurrency, setbaseCurrency, baseCurrencyOptions, loadData }:
  {
    currencyArray: object[], baseCurrency: string,
    setbaseCurrency: Function, baseCurrencyOptions: object[], loadData: Function
  }) => {

  const tableTitles = [
    {
      title: 'Код валюты',
      dataIndex: 'currencyCode',
      key: 'currencyCode',
    },
    {
      title: 'Курс в базовой валюте',
      dataIndex: 'baseRate',
      key: 'baseRate',
    },
  ];


  return (
    <div className='table-currency'>
      <Table dataSource={currencyArray} columns={tableTitles} />
      <div className='right-panel'>
        <div className='base-currency-changer'>Выберите базовую валюту</div>
        <Select
          size="middle"
          optionFilterProp="children"
          placeholder="Выберите базовую валюту"
          value={baseCurrency}
          onChange={(value) => setbaseCurrency(value)}
          options={baseCurrencyOptions}
        />
        <div>
          <Button type="default" onClick={() => loadData(baseCurrency)}>
            Обновить курс валют
          </Button>
        </div>
      </div>
    </div>

  )
}

const CalculateCurrency = ({ baseCurrencyOptions }: { baseCurrencyOptions: object[] }) => {
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

  const loadData = (secondCurrency: string) => {
    const apiAnswer = api(secondCurrency);
    apiAnswer
      .then(response => response.json())
      .then(result => {
        setDataOfCurrency(result);
      })
      .catch(error => console.log("error", error));
  }

  useEffect(() => calculateResult(), [firstCurrency, firstCurrencyValue, secondCurrency, dataOfCurrency])
  useEffect(() => loadData(secondCurrency), [secondCurrency])
  return (
    <div className='calculator-currency'>
      <div>
        Калькулятор валюты
      </div>
      <div>
        Перевести из
      </div>
      <div>
        <Input type="number" defaultValue={firstCurrencyValue}
          onChange={(event) => setFirstCurrencyValue(Number(event.target.value))}
        />
        <Select
          value={firstCurrency}
          onChange={(value) => setSecondCurrency(value)}
          options={baseCurrencyOptions}
        />
      </div>
      <div> в </div>
      <div>
        <Select
          value={secondCurrency}
          onChange={(value) => setSecondCurrency(value)}
          options={baseCurrencyOptions}
        />
        <div className='second-currency-value'> {secondCurrencyValue.toFixed(2)} </div>
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
    </div>
  )
}

const Nav = () => {
  return (
    <nav>
      <Link to="/table" replace>Курс валют</Link>
      <Link to="/calculator" replace>Калькулятор валюты</Link>
    </nav>
  )
}

export default App;
