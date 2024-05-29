import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import todosRouter from './routes/todos.route.js';
import { connectDB } from './database/index.js';
import cookieParser from 'cookie-parser';

await connectDB(process.env.MONGODB_URI);

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.send('Looks good!');
});

app.use('/api/todos', todosRouter);

app.listen(process.env.PORT, () => console.log(`Server is running on PORT:${process.env.PORT}`));
