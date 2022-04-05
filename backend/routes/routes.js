// import transactionsController from '../controllers/transactions-controller.js';
// import updateController from '../controllers/update-controller.js';
const transactionsController = require("../controllers/transactions-controller.js");
const updateController = require("../controllers/update-controller.js");

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

  app.get("/transactions", transactionsController.getTransactionsList);

  app.get("/clickrefs", transactionsController.getTransactionsList);

  app.get("/update", updateController.updateServer);

  app.get("*", function (req, res) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Caminho não encontrado.");
    res.send();
  });
}

const queriesList = {
  "/transactions": "Transações",
  "/clickrefs": "Cliques (em desenv.)",
};

// export default {
//   setupRoutes
// }
module.exports = {
  setupRoutes,
};
