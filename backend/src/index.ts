import express from 'express';
import dotenv from 'dotenv';
import { SemaphoreService } from './semaphore_service';
import Debug from 'debug';

import apiRoute from './routes/api'

dotenv.config({ path: '../.env' });

const log = Debug('app:log');
const app = express();


// Hacks to make BigInt serializable
declare global {
    interface BigInt {
        toJSON(): string;
    }
}
BigInt.prototype.toJSON = function (): string {
    return this.toString() + 'n';
};

app.use(express.json());
app.use('/api', apiRoute);
if (!process.env.TEST) {
    app.listen(80);
}   

export default app;
