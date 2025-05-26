import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import viewRoutes from './routes/view.js';
import giveAccessRoutes from './routes/giveAccess.js';
import uploadRoutes from './routes/upload.js';
import historyRoutes from './routes/history.js';
import walletRoutes from './routes/wallet.js';
import onchainRoutes from './routes/onchain.js';

const app = express();

const configureMiddleware = () => {
  app.use(cors({ origin: 'http://localhost:3000' })); // 👈 allow frontend
  app.use(bodyParser.json());
  app.use(express.json());
};

const configureRoutes = () => {
  app.use('/api/giveAccess', giveAccessRoutes);
  app.use('/api/view', viewRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/history', historyRoutes);
  app.use('/api/wallet', walletRoutes);
  app.use("/api/onchain", onchainRoutes);

  
  app.get('/', (req, res) => {
    res.send('👋 Hello from the server!');
  });
};

const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://bvigneshvicky0:pb64qLuJJt9smZva@cluster0.4srfsrf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

const startServer = () => {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};
// 🛠 CALL THE FUNCTIONS HERE
configureMiddleware();
configureRoutes();
connectToDatabase();
startServer();
