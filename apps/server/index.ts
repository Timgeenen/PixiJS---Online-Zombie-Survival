import connectDB from '@Config/db';
import { errorHandler } from '@Middleware/errorMiddleware';
import router from '@Routes/index';
import { createServer } from 'http';
import { SocketInstance } from './sockets';
import logger from '@Utils/logger';

const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = {
    origin: [
        process.env.NODE_ENV === 'production'
            ? process.env.CLIENT_URL
            : process.env.CLIENT_LOCALHOST,
        'http://192.168.0.165:5500',
        'http://192.168.0.179:5500',
    ],
    credentials: true,
};

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/api', router);

connectDB();

app.use(errorHandler);

const socket = new SocketInstance(httpServer);
socket.init();

//Handle uncaught errors
process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err}`);
    process.exit(1);
});

// Handle unhandled promise rejections (async errors outside Express)
process.on('unhandledRejection', (err) => {
    if (err instanceof Error) {
        logger.error(`Unhandled Promise Rejection: ${err.message}`);
    } else {
        logger.error(`Unhandled Promise Rejection (not instanceof Error): ${err}`);
    }
    process.exit(1);
});
const PORT = Number(process.env.PORT) || 3000;
httpServer.listen(PORT, () => {
    logger.info(`server listening on port ${process.env.PORT}`);
});
