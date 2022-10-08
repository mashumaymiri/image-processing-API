import express from "express";
import routes from "./Routes/Routes";

const app = express();

app.use("/api", routes);

app.listen(3000);
