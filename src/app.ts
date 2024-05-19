import express, { Express, Request, Response } from "express";
import fs from "fs";
import bodyParser from "body-parser";
import scenariosRoutor from "./router/scenarios";
import vehiclesRouter from "./router/vehicles";
const app: Express = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
import cors from "cors";
app.use(bodyParser.json());
app.use(cors());
app.use("/scenarios", scenariosRoutor);
app.use("/vehicles", vehiclesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
