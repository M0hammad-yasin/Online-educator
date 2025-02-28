//convert from commonjs to module
import { app } from "./src/app.js";
import config from "./src/config/config.js";

import prisma from "./src/Prisma/prisma.client.js";
// const port = 3000;
const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  prisma.$connect().then(() => {
    console.log("Connected to database");
  });
});
