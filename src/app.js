import express from "express";
import path from "path";
import cors from "cors";

import { UI, setQueues } from "bull-board";

import Queue from "./lib/Queue";

setQueues(Queue.allQueue.map((queue) => queue.bull));

import routes from "./routes";

import "./database";

import authStaticFiles from "./app/middlewares/authStaticFiles";

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use("/admin/queues", UI);
    this.server.use(express.json());
    this.server.use(
      "/t/files",
      authStaticFiles,
      express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
    );
  }

  routes() {
    this.server.use("/v1", routes);
  }
}

export default new App().server;
