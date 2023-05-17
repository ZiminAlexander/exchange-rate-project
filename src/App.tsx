import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import './App.css';

import { Nav } from './components/Nav';
import { api } from './components/api';
import { CalculateCurrency } from './components/CalculateCurrency';
import { TableCurrency } from './components/TableCurrency';

const App = () => {

  const [dataOfCurrency, setData] = useState({ rates: {} });
  const [baseCurrency, setbaseCurrency] = useState("USD");
  const [intervalID, setIntervalID]: [intervalID: NodeJS.Timer | undefined, setIntervalID: Function] = useState();

  const loadData = (currentCurrency: string, setData: Function) => {
    const apiAnswer = api(currentCurrency);
    apiAnswer
      .then(response => response.json())
      .then(result => {
        setData(result);
      })
      .catch(error => console.log("error", error));
  }

  useEffect(() => {
    loadData(baseCurrency, setData);
    if (!!intervalID) { clearInterval(intervalID) };
    const currentInterval = setInterval(() => loadData(baseCurrency, setData), 10000);
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
    ([name], ): object => (
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
        <Route path="/calculator" children={() => <CalculateCurrency baseCurrencyOptions={baseCurrencyOptions} loadData={loadData} />} />
      </Switch>
    </Router>
  );
}

export default App;
