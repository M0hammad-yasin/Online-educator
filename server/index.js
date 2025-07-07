//convert from commonjs to module
import config from "dotenv";
config.config();
import { app } from "./src/app.js";
import envVar from "./src/Config/config.js";

import prisma from "./src/Prisma/prisma.client.js";
// const port = 3000;
const PORT = envVar.port ;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  prisma.$connect().then(() => {
    console.log("Connected to database");
  });
});
