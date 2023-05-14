import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import './App.css';
// import { ANSWEROFSERVER } from './ANSWEROFSERVER';

const App = () => {

  const [dataOfCurrency, setData] = useState({ rates: {} });
  const [baseCurrency, setbaseCurrency] = useState("USD");

  const loadData = (baseCurrency: string) => {
    const apiAnswer = api(baseCurrency);
    apiAnswer
      .then(response => response.json())
      .then(result => {
        setData(result);
      })
      .catch(error => console.log("error", error));
  }
  useEffect(() => loadData(baseCurrency), [baseCurrency])
  // setInterval(() => loadData(baseCurrency), 10000);
  // useEffect(() => { setData(ANSWEROFSERVER) }, [])

  const splitDataOfCurrency: [string, number][] = Object.entries(dataOfCurrency.rates);
  const currencyArray = splitDataOfCurrency.map(
    ([name, value], index): React.ReactNode => (
      <tr key={index}>
        <td>{name}</td>
        <td>{(1 / value).toFixed(2)}</td>
      </tr>
    )
  )
  const baseCurrencyOptions = splitDataOfCurrency.map(
    ([name], index): React.ReactNode => (
      <option value={name} key={index}>
        {name}
      </option>
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

const api = (baseCurrency?: string) => {
  const app_id = "e70a7eeeb30b4858bd1a3961d6fac905";
  const url = `https://openexchangerates.org/api/latest.json?app_id=${app_id}${(!!baseCurrency) ? ("&base=" + baseCurrency) : ""}`;
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
    currencyArray: React.ReactNode, baseCurrency: string,
    setbaseCurrency: Function, baseCurrencyOptions: React.ReactNode, loadData: Function
  }) => {

  return (
    <div className='table-currency'>
      <table>
        <thead>
          <tr>
            <th>Код Валюты</th>
            <th>Курс в базовой валюте</th>
          </tr>
        </thead>
        <tbody>
          {currencyArray}
        </tbody>
      </table>
      <div>
        <div className='base-currency-changer'>Выберите базовую валюту</div>
        <select
          size={10}
          value={baseCurrency}
          onChange={(event) => setbaseCurrency(event.target.value)}
        >
          {baseCurrencyOptions}
        </select>
        <div>
          <button onClick={() => loadData(baseCurrency)}>
            Обновить курс валют
          </button>
        </div>
      </div>
    </div>

  )
}

const CalculateCurrency = ({ baseCurrencyOptions }: { baseCurrencyOptions: React.ReactNode }) => {
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

  useEffect(() => { calculateResult() }, [firstCurrency, firstCurrencyValue, secondCurrency])
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
        <input type="number" defaultValue={firstCurrencyValue}
          onChange={(event) => setFirstCurrencyValue(Number(event.target.value))}
        />
        <select
          value={firstCurrency}
          onChange={(event) => setFirstCurrency(event.target.value)}
        >
          {baseCurrencyOptions}
        </select>
      </div>
      <div> в </div>
      <div>
        <select
          value={secondCurrency}
          onChange={(event) => setSecondCurrency(event.target.value)}
        >
          {baseCurrencyOptions}
        </select>
        <div className='second-currency-value'> {secondCurrencyValue.toFixed(2)} </div>
      </div>
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
