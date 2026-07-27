import tsconfigPaths from 'tsconfig-paths';
import path from 'path';

// Register tsconfig paths for @/* alias resolution at Vercel serverless runtime
try {
  tsconfigPaths.register({
    baseUrl: path.resolve(__dirname, '..'),
    paths: {
      '@/*': ['./src/*'],
    },
  });
} catch (err) {
  console.warn('tsconfig-paths registration info:', err);
}

import app from '../src/app';

export default function handler(req: any, res: any) {
  return app(req, res);
}
