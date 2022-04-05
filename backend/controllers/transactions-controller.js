// import transactionsService from '../services/transactions-service.js';
const transactionsService = require("../services/transactions-service.js");

async function getTransactionsList(req, res) {
  let result = await transactionsService.getTransactions(
    req.query.startDate,
    req.query.endDate
  );
  if (result) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.write(JSON.stringify(result));
    res.send();
  } else {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Erro na consulta.");
    res.send();
  }
}

// export default {
//   getTransactionsList
// }
module.exports = {
  getTransactionsList,
};
