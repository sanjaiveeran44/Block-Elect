import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import electionRoute from "./routes/electionRoutes.js";
import { provider } from "./config/contract.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", electionRoute);

app.get("/", (req, res) => {
  console.log("Server is runnig ");
  res.json({ success: true, message: "Voting dApp Backend API is running" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
    data: null,
  });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Contract Address: ${process.env.CONTRACT_ADDRESS}`);
  console.log(`RPC URL: ${process.env.RPC_URL}`);

  console.log("RPC:", process.env.RPC_URL);
  console.log("Contract Address:", process.env.CONTRACT_ADDRESS);

  //0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

});
