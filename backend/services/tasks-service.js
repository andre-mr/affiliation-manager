const cron = require("node-cron");
const awin = require("./awin-service.js");

function scheduleTasks() {
  cron.schedule(`1 0 0 * * *`, () => {
    console.log(`updating all transactions every day at 00h00m01s`);
    awin.updateAllTransactions();
  });
}

module.exports = {
  scheduleTasks,
};