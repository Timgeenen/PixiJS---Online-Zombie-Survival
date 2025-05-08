import mongoose from 'mongoose';

export default function connectDB() {
    try {
        const connectionString = process.env.MONGO_URI;
        if (!connectionString) {
            throw new Error('MongoDB: connection string not found');
        }
        mongoose.connect(connectionString);
    } catch (error) {
        console.error('Could not connect to database: ', error);
        process.exit(1);
    }
}
