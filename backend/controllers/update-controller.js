const awinService = require("../services/awin-service.js");

async function updateServer(req, res) {
  let result = await awinService.updateRecentTransactions();
  if (result) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Servidor atualizado");
    res.send();
    setTimeout(() => { process.kill(process.pid) }, 2000); // clear cpanel node multiple NPROC usage
  } else {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Erro na atualização.");
    res.send();
    setTimeout(() => { process.kill(process.pid) }, 100); // clear cpanel node multiple NPROC usage
  }
}

async function updateServerAll(req, res) {
  let result = await awinService.updateAllTransactions();
  if (result) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Servidor atualizado");
    res.send();
    setTimeout(() => { process.kill(process.pid) }, 2000); // clear cpanel node multiple NPROC usage
  } else {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Erro na atualização.");
    res.send();
    setTimeout(() => { process.kill(process.pid) }, 100); // clear cpanel node multiple NPROC usage
  }
}

module.exports = {
  updateServer,
  updateServerAll,
};