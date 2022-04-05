// import express from 'express';
// const app = express();
// import cors from 'cors';

const app = require('express')();
const cors = require('cors');
app.use(cors());

const port = 3001;

app.get('/queries', async function (req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.write(JSON.stringify(
    {
      "/transactions": "Transações"
    }
  ));
  res.send();
});

app.get('/transactions', async function (req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.write(JSON.stringify(
    [{
      "id": 1034924972,
      "platformName": "Awin",
      "advertiserName": 17629,
      "commissionAmount": 3.90,
      "saleAmount": 129.90,
      "clickRefs": "Laura",
      "publisherUrl": "https://www.facebook.com/lucas.guerra.awin",
      "transactionDate": "04-01-2022 20:54",
      "commissionStatus": "pending"
    }, {
      "id": 1034924973,
      "platformName": "Awin",
      "advertiserName": "Loja A",
      "commissionAmount": 3.8,
      "saleAmount": 129.90,
      "clickRefs": "Laura",
      "publisherUrl": "https://www.facebook.com/lucas.guerra.awin",
      "transactionDate": "05-01-2022 20:54",
      "commissionStatus": "pending"
    }]
  ));
  res.send();
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});