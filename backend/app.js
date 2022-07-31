const dotenv = require("dotenv").config();
const app = require("express")();
const cors = require("cors");
const routes = require("./routes/routes.js");
const tasksService = require("./services/tasks-service.js");
const port = process.env.PORT || 3000;

app.use(cors());
routes.setupRoutes(app);
tasksService.scheduleTasks();

app.listen(port, () => {
  console.log(`server listening on port ${port}...`);
});