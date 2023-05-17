import React from "react";
import { Button, Table, Select, Space } from "antd";

export const TableCurrency = ({ currencyArray, baseCurrency, setbaseCurrency, baseCurrencyOptions, loadData }:
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
        <Space align='start' size={20}>
          <div className='rate-table'>
            <Space direction="vertical" align='center'>
              <div className='block-title'>Курс валют</div>
              <Table dataSource={currencyArray} columns={tableTitles} />
            </Space>
          </div>
          <div className='right-panel'>
            <div className='block-title-2'>Выберите базовую валюту</div>
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
        </Space>
      </div>
  
    )
  }