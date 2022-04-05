// import mysql from 'mysql2/promise.js';
const mysql = require("mysql2/promise.js");

const selectQueries = {
  transactionList: `SELECT transaction.id, platform.name as platformName, advertiser.name AS advertiserName, transaction.commissionAmount, transaction.saleAmount, transaction.clickRefs, transaction.publisherUrl, DATE_FORMAT(CONVERT_TZ(transaction.transactionDate, '+00:00', '${process.env.TIME_ZONE}'), '%d/%m/%Y %H:%i') AS transactionDate, transaction.commissionStatus FROM transaction INNER JOIN advertiser ON transaction.advertiserId = advertiser.id INNER JOIN platform ON transaction.platformId = platform.id WHERE DATE(transaction.transactionDate) >= 'startDate' AND DATE(transaction.transactionDate) <= 'endDate' ORDER BY transaction.transactionDate DESC`,
};

async function getTransactionsDb(startDate, endDate) {
  return sqlSelect(
    selectQueries.transactionList
      .replace("startDate", startDate)
      .replace("endDate", endDate)
  );
}

async function sqlSelect(selectStatement) {
  let queryResult;
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    [queryResult] = await connection.execute(selectStatement);
    connection.end();
  } catch (error) {
    [queryResult] = [];
  }
  return queryResult;
}

// export default { getTransactionsDb, sqlSelect };
module.exports = { getTransactionsDb, sqlSelect };
