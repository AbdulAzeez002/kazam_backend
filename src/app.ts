import dotenv from "dotenv";
dotenv.config();
import { client } from "./config/redis";
import router from "./routes/routes";
import { app, server } from "./config/socket";
import cors from "cors";
import connectToMongoDB from "./config/db";

// Port for server
const port = process.env.PORT || 6000;
const frontendUrl = process.env.FRONTEND_URL ?? "";
// Connecting to Redis
client.connect();

// Connecting to MongoDb
connectToMongoDB();

// Allow requests only from localhost:3000
const corsOptions = {
  origin: frontendUrl,
};

// Cors Middleware
app.use(cors(corsOptions));

app.use("/", router);

// Handle connection event
client.on("connect", () => {
  console.log("Connected to Redisssw");
});

// Handle error event
client.on("error", (err) => {
  console.error("Redis error:", err);
});

process.on("SIGINT", () => {
  client.quit();
  console.log("Redis connection closed");
  process.exit();
});

// Creating express server at port
server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
