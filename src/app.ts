import express, { Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import router from './routers/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Valex API');
});

export default app;
