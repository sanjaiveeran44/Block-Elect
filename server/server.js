import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import electionRoutes from "./routes/electionRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", electionRoutes);

app.get("/", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Contract Address: ${process.env.CONTRACT_ADDRESS}`);
  console.log(`RPC URL: ${process.env.RPC_URL}`);
});
