import express from 'express'
import mainRoutes from './src/Routes/index'
import globalError from './src/middleware/errorMiddleware';
import limiter from './src/middleware/rateLimit';
import { handleWebhook } from './src/Controller/paymentController';
const app = express();


app.use('/api/payment/webhook', express.raw({ type: 'application/json' }), handleWebhook);



app.use(express.json());

app.use('/api', mainRoutes);

// Global Error Handling Middleware For Express
app.use(globalError);


app.use(limiter)

app.listen(3000, () => {
    console.log('Server up and running on port: 3000');
  });