import express from 'express'


const app = express();

app.use(express.json());


app.listen(3000, () => {
    console.log('Server up and running on port: 3000');
  });