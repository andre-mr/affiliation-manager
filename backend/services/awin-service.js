// import fetch from 'node-fetch';
// import awinDb from '../database/awin-db.js';
// import dotenv from 'dotenv';
// dotenv.config();
// const dotenv = require('dotenv').config();
const fetch = require("node-fetch");
const awinDb = require("../database/awin-db.js");

const urlAwin = process.env.AWIN_URL;

const publishers = [
  {
    id: process.env.AWIN_PUBLISHER1_ID,
    name: process.env.AWIN_PUBLISHER1_NAME,
  },
  {
    id: process.env.AWIN_PUBLISHER2_ID,
    name: process.env.AWIN_PUBLISHER2_NAME,
  },
];

const headers = {
  Authorization: process.env.AWIN_TOKEN,
};

async function getTransactions(startDate, endDate) {
  console.log(`requesting transactions from ${startDate} to ${endDate}...`);
  let url = "";
  let transactions = [];

  for (const publisher of publishers) {
    url = `${urlAwin}${publisher.id}/transactions/?timezone=UTC&startDate=${startDate}T00%3A00%3A00&endDate=${endDate}T23%3A59%3A59`;
    await fetch(url, { method: "GET", headers: headers })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.length > 0) {
          for (const transaction of json) {
            transactions.push([
              transaction.id,
              1,
              transaction.advertiserId,
              transaction.publisherId,
              transaction.commissionStatus,
              transaction.commissionAmount?.amount,
              transaction.saleAmount?.amount,
              transaction.clickRefs == null
                ? null
                : transaction.clickRefs?.clickRef,
              transaction.clickDate,
              transaction.transactionDate,
              transaction.validationDate,
              transaction.publisherUrl,
            ]);
          }
        }
      });
  }

  console.log(`${transactions.length} transactions collected!`);
  if (!transactions.length || transactions.length <= 0) {
    return;
  }

  try {
    await awinDb.insertTransactionsDb(transactions);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAdvertisers() {
  console.log("requesting advertisers list...");
  let url = "";
  let advertisers = [];

  for (const publisher of publishers) {
    url = `${urlAwin}${publisher.id}/programmes?relationship=joined`;
    await fetch(url, { method: "GET", headers: headers })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        for (const advertiser of json) {
          advertisers.push([advertiser.id, advertiser.name]);
        }
      });
  }
  try {
    await awinDb.insertAdvertisersDb(advertisers);
  } catch (error) {
    throw new Error(error.message);
  }
  console.log(`updated ${advertisers.length} advertisers!`);
}

async function updateRecentTransactions() {
  console.log("updating transactions from the last 30 days...");
  return await updateTransactions(1);
}

async function updateAllTransactions() {
  console.log("updating advertisers and all time transactions...");
  await getAdvertisers();
  let today = new Date();
  let awinStartDate = new Date("2020/04/01");
  let allTimeMonths = Math.ceil(
    (today - awinStartDate) / (1000 * 60 * 60 * 24 * 30)
  );
  return await updateTransactions(allTimeMonths);
}

async function updateTransactions(months) {
  let dateBefore = new Date();
  dateBefore = new Date(dateBefore.getTime() + 1000 * 60 * 60 * 24); // +1 day, guaranteed last transactions even with time zone differences
  let endMonth = dateBefore;
  let startMonth = new Date(endMonth.getTime() - 1000 * 60 * 60 * 24 * 30);

  for (let i = 1; i <= months; i++) {
    await getTransactions(
      `${startMonth.getFullYear()}-${(startMonth.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${startMonth.getDate().toString().padStart(2, "0")}`,
      `${endMonth.getFullYear()}-${(endMonth.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${endMonth.getDate().toString().padStart(2, "0")}`
    );

    endMonth = new Date(endMonth.getTime() - 1000 * 60 * 60 * 24 * 30);
    startMonth = new Date(endMonth.getTime() - 1000 * 60 * 60 * 24 * 30);
    await sleep(5000);
  }
  let dateAfter = new Date();
  dateAfter = new Date(dateAfter.getTime() + 1000 * 60 * 60 * 24);
  console.log(
    "database updated successfully in " +
      parseInt((dateAfter - dateBefore) / 1000) +
      " seconds!"
  );
  return true;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//export default { getTransactions, getAdvertisers, updateRecentTransactions, updateAllTransactions }
module.exports = {
  getTransactions,
  getAdvertisers,
  updateRecentTransactions,
  updateAllTransactions,
};
