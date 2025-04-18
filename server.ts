import express from 'express'
import mainRoutes from './src/Routes/index'
import globalError from './src/middleware/errorMiddleware';
import limiter from './src/middleware/rateLimit';
const app = express();

app.use(express.json());

app.use('/api', mainRoutes);

// Global Error Handling Middleware For Express
app.use(globalError);


app.use(limiter)

app.listen(3000, () => {
    console.log('Server up and running on port: 3000');
  });