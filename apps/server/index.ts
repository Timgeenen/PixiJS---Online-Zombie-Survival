import connectDB from '@Config/db';
import router from '@Routes/index';

const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', router);

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`server listening on ${process.env.PORT}`);
});
