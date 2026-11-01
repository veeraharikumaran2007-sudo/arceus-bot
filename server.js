import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { waService } from './src/whatsapp.js';
import { router as apiRouter } from './src/routes.js';
import { scheduler } from './src/cron.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health check (Pure JSON API - Zero Website)
app.get('/', (req, res) => {
  res.json({
    service: "Arceus Bot Engine",
    status: "ONLINE",
    mode: "Headless Background Microservice",
    version: "1.0.0"
  });
});

// Mount API routes
app.use('/api', apiRouter);

// Start WhatsApp Bot, Scheduler & Server
async function startServer() {
  console.log('----------------------------------------------------');
  console.log('⚡ Starting Arceus Bot Engine (WhatsApp & Gym Automation)...');
  console.log('----------------------------------------------------');

  try {
    // 1. Initialize WhatsApp connection
    await waService.init();

    // 2. Start automated scheduler (Birthdays, Expiry Reminders)
    scheduler.start();

    // 3. Start API Server
    app.listen(PORT, () => {
      console.log(`\n🚀 Arceus Bot Server is LIVE!`);
      console.log(`🔌 API Base:  http://localhost:${PORT}/api\n`);
      console.log('Press Ctrl+C to stop.');
    });
  } catch (error) {
    console.error('❌ Failed to start Arceus Bot:', error);
    process.exit(1);
  }
}

startServer();
