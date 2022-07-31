const mysql = require("mysql2/promise.js");

async function insertTransactionsDb(values) {
  sqlInsert(
    "INSERT INTO transaction (id, platformId, advertiserId, publisherId, commissionStatus, commissionAmount, " +
      "saleAmount, clickRefs, clickDate, transactionDate, validationDate, publisherUrl) VALUES ? " +
      "ON DUPLICATE KEY UPDATE commissionStatus = VALUES(commissionStatus)",
    values
  );
}

async function insertAdvertisersDb(values) {
  sqlInsert("INSERT IGNORE INTO advertiser (id, name) VALUES ?", values);
}

async function updateAdvertisersDb(values) {
  sqlInsert(
    "INSERT INTO advertiser (id, name) VALUES ? " +
      "ON DUPLICATE KEY UPDATE name = VALUES(name)",
    values
  );
}

async function sqlInsert(insertStatement, values) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  let result = await connection.query(
    insertStatement,
    [values],
    function (err) {
      if (err) throw err;
      connection.end();
      return false;
    }
  );
  connection.end();
  return true;
}

module.exports = {
  insertTransactionsDb,
  insertAdvertisersDb,
  updateAdvertisersDb,
};