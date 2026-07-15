import { app } from "./app.js";
import { env } from "./config/env.js";

const PORT = env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Balivio API Server is running in [${env.NODE_ENV}] mode`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`🔗 Frontend allowed origin: ${env.FRONTEND_URL}`);
});

// Handle graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log("💤 HTTP server closed. Process exiting.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
