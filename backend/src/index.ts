import express from 'express';
import { SemaphoreService } from './services/semaphore_service';
import Debug from 'debug';

import apiRoute from './routes/api'
import * as fs from 'fs';
import * as https from 'https';

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

// Hacks to make express.json() work with BigInt
app.use(express.json({
    reviver(key, value){
        if (typeof value === 'string' && value.match(/^[0-9]+n$/))
            return BigInt(value.slice(0, -1));
        return value;
    }
}));

app.use('/api', apiRoute);

if (!process.env.TEST) {
    app.use(express.static('static'));
    app.use('/*', express.static('static/404.html'));
    if (!process.env.PROD) {
        app.listen(80);
    } else {
        const privateKey  = fs.readFileSync('cert/server.key', 'utf8');
        const certificate = fs.readFileSync('cert/server.crt', 'utf8');
        const credentials = {key: privateKey, cert: certificate};
        const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(443);
    }
}

export default app;
