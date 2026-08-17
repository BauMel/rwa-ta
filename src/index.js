const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const killPort = require("kill-port");
const { ethers } = require("ethers");
const { getErc20Snapshot } = require("./config/getContract");

require("dotenv").config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3001;

const checkPort = async (port, maxPort = 65535) => {
  if (port > maxPort) {
    throw new Error("No available ports found");
  }

  try {
    await killPort(port, "tcp");
    await killPort(port, "udp");
    return port;
  } catch (err) {
    return checkPort(port + 1, maxPort);
  }
};

(async () => {
  const safePort = await checkPort(PORT);
  const getPort = (await import("get-port")).default; // dynamic import
  const final_port = await getPort({ port: safePort });

  console.log(`Port ${final_port} is free. Ready to start server.`);

  // Middleware
  app.use(cors({ origin: `http://localhost:${final_port}` }));
  app.use(express.json());
  app.use(morgan("dev"));

  // Routes
  app.use("/api/items", require("./routes/items"));
  app.use("/api/stats", require("./routes/stats"));

  /**
   * @route    GET /api/BaudouinApiTest
   * @desc     Reads the public state of the USDC ERC-20 contract on Ethereum mainnet
   * @author   Baudouin Meli
   * @access   public
   * @param    {Request}  req  - Optional query param `holder` (Ethereum address)
   * @param    {Response} res  - Express response object
   * @returns  {JSON}          { success, source, data: { name, symbol, decimals, totalSupply, blockNumber, ... } }
   * @throws   400 if `holder` is an invalid address, 502 if the RPC call fails
   *
   * @example
   * // Example request
   * curl "http://localhost:3001/api/BaudouinApiTest?holder=0x28C6c06298d514Db089934071355E5743bf21d60"
   *
   * // Example response
   * {
   *   "success": true,
   *   "source": "ethereum-mainnet",
   *   "data": { "symbol": "USDC", "totalSupply": "49573...", "blockNumber": 25774771 }
   * }
   */
  app.get("/api/BaudouinApiTest", async (req, res) => {
    const { holder } = req.query;

    if (holder && !ethers.isAddress(holder)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid holder address" });
    }

    try {
      const data = await getErc20Snapshot(holder);

      console.log("\n=== [BaudouinApiTest] On-chain data ===");
      console.table(data);

      return res.json({ success: true, source: "ethereum-mainnet", data });
    } catch (err) {
      console.error("[BaudouinApiTest] RPC error:", err.message);
      return res.status(502).json({
        success: false,
        error: "Failed to read contract data",
        details: err.message,
      });
    }
  });

  require("./config/dbHandler.js").connect();

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
  }

  // Start server
  app.listen(final_port, () => {
    console.log(`Backend running on http://localhost:${final_port}`);
  });
})();
