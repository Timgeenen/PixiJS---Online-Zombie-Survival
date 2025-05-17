import connectDB from '@Config/db';
import { errorHandler } from '@Middleware/errorMiddleware';
import router from '@Routes/index';

const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

const corsOptions = {
    origin:
        process.env.NODE_ENV === 'production'
            ? process.env.CLIENT_URL
            : process.env.CLIENT_LOCALHOST,
    credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/api', router);

connectDB();

app.use(errorHandler);

//Handle uncaught errors
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
});

// Handle unhandled promise rejections (async errors outside Express)
process.on('unhandledRejection', (err) => {
    if (err instanceof Error) {
        console.error('Unhandled Promise Rejection:', err.message);
    } else {
        console.error('Unhandled Promise Rejection (not instanceof Error): ', err);
    }
    process.exit(1);
});

app.listen(process.env.PORT, () => {
    console.log(`server listening on ${process.env.PORT}`);
});
