import express from 'express';
import http from 'http';
import mainRoutes from './src/Routes/index';
import globalError from './src/middleware/errorMiddleware';
import limiter from './src/middleware/rateLimit';
import { handleWebhook } from './src/Controller/paymentController';
import { initializeSocket } from './src/config/socket';

const app = express();
const server = http.createServer(app);

// Initialize socket 
initializeSocket(server);

app.use('/api/payment/webhook', express.raw({ type: 'application/json' }), handleWebhook);
app.use(express.json());
app.use('/api', mainRoutes);

app.use(globalError);
app.use(limiter);

server.listen(3000, () => {
  console.log('Server up and running on port: 3000');
});

