const cluster = require("cluster");
const express = require("express");
const { setupMaster } = require("@socket.io/sticky");

const WORKERS_COUNT = 4;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < WORKERS_COUNT; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });

  const health = function(req, res) {
    if (req.method === 'GET' && req.url === '/health') {
      // Respond with OK
      res.status(200).send('OK');
    }
  }

  const app = express();

  app.use(health);

  setupMaster(app, {
    loadBalancingMethod: "least-connection", // either "random", "round-robin" or "least-connection"
  });

  const PORT = process.env.PORT || 3005;

  app.listen(PORT, () =>
    console.log(`server listening at http://localhost:${PORT}`)
  );
} else {
  console.log(`Worker ${process.pid} started`);
  require("./index");
}
