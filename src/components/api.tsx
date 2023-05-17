export const api = (baseCurrency: string) => {

    const url = "https://api.exchangerate.host/latest?base=" + baseCurrency;
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "	application/json; charset=utf-8",
      }
    }
  
    return fetch(url, options);
  }