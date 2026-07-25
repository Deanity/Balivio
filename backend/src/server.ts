import 'dotenv/config';
import app from './app';
import { env } from '@/config/env';

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Balivio API is running`);
  console.log(`   PORT     : ${env.PORT}`);
  console.log(`   ENV      : ${env.NODE_ENV}`);
  console.log(`   Health   : http://localhost:${env.PORT}/health`);
  console.log(`   API Base : http://localhost:${env.PORT}/api/v1`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚡ SIGTERM received shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('⚡ SIGINT received shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default server;
