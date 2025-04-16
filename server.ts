import express from 'express'
import mainRoutes from './src/Routes/index'

const app = express();

app.use(express.json());

app.use('/api', mainRoutes);

app.listen(3000, () => {
    console.log('Server up and running on port: 3000');
  });