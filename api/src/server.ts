import { app } from "./app.js";
import { env } from "./config/env.js";
import { colors } from "./utils/colorUtils.js";

const PORT = env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(colors.green(`🚀 Balivio API Server is running in [${colors.bold(env.NODE_ENV)}] mode`));
  console.log(colors.cyan(`📡 Listening on http://localhost:${colors.bold(PORT)}`));
  console.log(colors.gray(`🔗 Frontend allowed origin: ${env.FRONTEND_URL}`));
});

// Handle graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(colors.yellow(`\n🛑 Received ${signal}. Shutting down gracefully...`));
  server.close(() => {
    console.log(colors.red("💤 HTTP server closed. Process exiting."));
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
