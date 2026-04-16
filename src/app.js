import express from 'express';
import createRouter from './routes/index.js';
import errorMiddleware from './middlewares/error.middleware.js';

const createApp = (container) => {
  const app = express();
  app.use(express.json());
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api', createRouter(container));
  app.use(errorMiddleware);
  return app;
};

export default createApp;
