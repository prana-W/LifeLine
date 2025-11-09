import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import checkHealth from './controllers/checkHealth.controller.js';
import {errorHandler } from './middlewares/index.js';
import morgan from 'morgan';
import pharmacyRouter from './routes/pharmacyAuth.routes.js';
import visitorsRouter from './routes/visitors.routes.js';

const app = express();

const skipMorgan = (req) => {
    const ignoredPaths = ["/socket.io", "/favicon.ico", "__webpack_hmr"];
    return ignoredPaths.some((path) => req.originalUrl.startsWith(path));
};

app.use(morgan("dev", { skip: skipMorgan }));

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

// API Routes

app.get('/', checkHealth);
app.get('/api/v1/check-health', checkHealth);
app.use('/api/v1/pharmacy/auth', pharmacyRouter);
app.use('/api/v1/visitors', visitorsRouter);

// Error Handling
app.use(errorHandler());

export default app;
