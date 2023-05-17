import React from "react";
import { Space } from "antd";
import { Link } from "react-router-dom";

export const Nav = () => {
    return (
      <nav>
        <Space size={50}>
          <Link to="/table" replace>Курс валют</Link>
          <Link to="/calculator" replace>Калькулятор валюты</Link>
        </Space>
      </nav>
    )
  }