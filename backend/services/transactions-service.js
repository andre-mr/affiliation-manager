const transactionsDb = require("../database/transactions-db.js");

async function getTransactions(startDate, endDate) {
  if (!startDate) {
    startDate = createDefaultDate(0);
  }
  if (!endDate) {
    endDate = createDefaultDate(30);
  }

  try {
    return await transactionsDb.getTransactionsDb(startDate, endDate);
  } catch (error) {
    throw new Error(error.message);
  }
}

function createDefaultDate(daysAgo) {
  let targetDate = new Date();
  if (daysAgo > 0) {
    targetDate = new Date(targetDate - 1000 * 60 * 60 * 24 * daysAgo);
  }
  let targetDateStr = `${targetDate.getFullYear()}-${(targetDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${targetDate.getDate().toString().padStart(2, "0")}`;
  return targetDateStr;
}

module.exports = {
  getTransactions,
};