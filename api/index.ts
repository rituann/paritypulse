import express from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));

const httpServer = createServer(app);
const ready = registerRoutes(httpServer, app);

export default async function handler(req: any, res: any) {
  await ready;
  app(req, res);
}
