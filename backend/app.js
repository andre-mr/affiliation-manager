// import dotenv from 'dotenv';
// dotenv.config();
const dotenv = require("dotenv").config();

// import express from 'express';
// const app = express();
const app = require("express")();

// import cors from 'cors';
// app.use(cors());
const cors = require("cors");
app.use(cors());

// import routes from './routes/routes.js';
// routes.setupRoutes(app);
const routes = require("./routes/routes.js");
routes.setupRoutes(app);

// import tasksService from './services/tasks-service.js';
const tasksService = require("./services/tasks-service.js");
tasksService.scheduleTasks();

// const port = process.env.PORT || 3000;
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server listening on port ${port}...`);
});
