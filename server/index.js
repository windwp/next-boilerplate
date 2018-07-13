// server.js
const next = require("next");
const glob = require("glob");
const cookiesMiddleware = require("universal-cookie-express");
const compression = require("compression");
const clientRoutes = require("../src/routes");
const path = require("path");
const express = require("express");
const bodyParser = require('body-parser');

const port = parseInt(process.env.PORT, 10) || 3000;
const clientApp = next({ dev: process.env.NODE_ENV !== "production", dir: "./src" });

// mongodb connect
const config = require("./config/config");
const mongoose = require('mongoose');

mongoose.connect(config.db);
const db = mongoose.connection;
db.on('error', () => {
  throw new Error(`unable to connect to database at  + ${config.db}`);
});

const models = glob.sync(`${config.root}/server/models/*.js`);
models.forEach((model) => {
  // eslint-disable-next-line 
  require(model);
});

// With express

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
const apiRoutes = glob.sync(`${config.root}/server/routes/*.js`);
apiRoutes.forEach((routePath) => {
  // eslint-disable-next-line 
  require(path.resolve(routePath))(app);
});

const handler = clientRoutes.getRequestHandler(clientApp);
clientApp.prepare().then(() => {
  console.log(`> Ready on http://localhost:${port}`)
  app
    .use(cookiesMiddleware())
    .use(compression())
    .use('/static', express.static(path.join(__dirname, '../static')))
    .use(handler)
    .listen(port);
});
