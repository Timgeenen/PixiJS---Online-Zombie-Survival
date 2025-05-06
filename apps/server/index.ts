import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import router from '@Routes/index';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', router)

app.listen(process.env.PORT, () => {
    console.log(`server listening on ${process.env.PORT}`);
});
