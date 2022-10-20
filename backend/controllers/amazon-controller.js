const amazonService = require("../services/amazon-service.js");

async function getAmazonData(req, res) {
  let result = await amazonService.getAmazonData(
    req.query.startDate,
    req.query.endDate
  );

  if (result) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.write(JSON.stringify(result));
    res.send();
    setTimeout(() => { process.kill(process.pid) }, 2000); // clear cpanel node multiple NPROC usage
  } else {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Erro na consulta.");
    res.send();
    setTimeout(() => { process.kill(process.pid) }, 100); // clear cpanel node multiple NPROC usage
  }
}

module.exports = {
  getAmazonData,
};