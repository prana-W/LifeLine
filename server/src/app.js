import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import checkHealth from './controllers/checkHealth.controller.js';
import {errorHandler} from './middlewares/index.js';
import morgan from 'morgan';
import pharmacyAuthRouter from './routes/pharmacyAuth.routes.js';
import pharmacyRouter from './routes/pharmacy.routes.js';
import visitorsRouter from './routes/visitors.routes.js';
import hospitalAuthRouter from './routes/hospitalAuth.routes.js';
import hospitalRouter from './routes/hospital.routes.js';
import userAuthRouter from './routes/userAuth.routes.js';
import userRouter from './routes/user.routes.js';
import path from "path";

const app = express();

const skipMorgan = (req) => {
    const ignoredPaths = ['/socket.io', '/favicon.ico', '__webpack_hmr', '/api/v1/visitors'];
    return ignoredPaths.some((path) => req.originalUrl.startsWith(path));
};

app.use(morgan('dev', {skip: skipMorgan}));

const allowedOrigins = process.env.CORS_ORIGIN.split(',') || [];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

// API Routes

app.get('/', checkHealth);
app.get('/api/v1/check-health', checkHealth);
app.use('/api/v1/visitors', visitorsRouter);

// Authentication Routes

app.use('/api/v1/pharmacy/auth', pharmacyAuthRouter);
app.use('/api/v1/hospital/auth', hospitalAuthRouter);
app.use('/api/v1/user/auth', userAuthRouter);

// Routes

app.use('/api/v1/pharmacy', pharmacyRouter);
app.use('/api/v1/hospital', hospitalRouter);
app.use('/api/v1/user', userRouter);

// Error Handling
app.use(errorHandler());

export default app;
