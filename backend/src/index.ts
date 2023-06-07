import express from 'express';
import dotenv from 'dotenv';
import { SemaphoreService } from './semaphore_service';
import Debug from 'debug';

import apiRoute from './routes/api'

dotenv.config({ path: '../.env' });

const log = Debug('app:log');
const app = express();

app.use(express.json());
app.use('/api', apiRoute);
app.listen(80);

export default app;
