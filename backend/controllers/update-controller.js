// import awinService from '../services/awin-service.js';
// import dotenv from 'dotenv';
// dotenv.config();
// const dotenv = require('dotenv').config();
const awinService = require("../services/awin-service.js");

async function updateServer(req, res) {
  let result = await awinService.updateRecentTransactions();
  if (result) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Servidor atualizado");
    res.send();
  } else {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Erro na atualização.");
    res.send();
  }
}

// export default {
//   updateServer
// }
module.exports = {
  updateServer,
};
