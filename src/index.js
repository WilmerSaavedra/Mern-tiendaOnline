// import {app,server} from "./app.js";
import appServer from "./app.js";
import { PORT } from "./config.js";
import { connectDB } from "./db.js";

const { app, server } = appServer;

async function main() {
  try {
    await connectDB();
    server.listen(PORT);
    console.log(`Listening on port http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`)
  } catch (error) {
    console.error(error);
  }
}

main();
