import express, { type Express } from 'express';
import createRouter from './routes/index.js';
import errorMiddleware from './middlewares/error.middleware.js';
import type { Container } from './container/index.js';

const createApp = (container: Container): Express => {
  const app = express();
  app.use(express.json());
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api', createRouter(container));
  app.use(errorMiddleware);
  return app;
};

export default createApp;
