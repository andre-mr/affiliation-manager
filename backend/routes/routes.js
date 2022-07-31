const transactionsController = require("../controllers/transactions-controller.js");
const updateController = require("../controllers/update-controller.js");
const amazonController = require("../controllers/amazon-controller.js");

function setupRoutes(app) {
  app.get("/", function (req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Utilize a aplicação web apropriada. :)");
    res.send();
  });

  app.use(function (req, res, next) {
    if (req.query.apiKey && req.query.apiKey == process.env.API_KEY) {
      next();
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.write(JSON.stringify([]));
      res.send();
    }
  });

  app.get("/queries", async function (req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.write(JSON.stringify(queriesList));
    res.send();
  });

  app.get("/awin", transactionsController.getTransactionsList);

  app.get("/amazon", amazonController.getAmazonData);

  app.get("/awin/update", updateController.updateServer);

  app.get("*", function (req, res) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Caminho não encontrado.");
    res.send();
  });
}

const queriesList = {
  "/awin": "Awin",
  "/amazon": "Amazon",
};

module.exports = {
  setupRoutes,
};