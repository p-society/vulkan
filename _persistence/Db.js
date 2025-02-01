import mongoose from 'mongoose';

class DatabaseManager {
    constructor(connString) {
        this.connString = connString;
        this.isConnected = false;
    }

    async connect() {
        try {
            await mongoose.connect(this.connString, { useNewUrlParser: true, useUnifiedTopology: true });
            this.isConnected = true;
            console.log('✅ Connected to the database successfully.');
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            this.isConnected = false;
            throw new Error('Database connection failed.');
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            this.isConnected = false;
            console.log('✅ Disconnected from the database successfully.');
        } catch (error) {
            console.error('❌ Failed to disconnect from the database:', error);
            throw new Error('Failed to disconnect from the database.');
        }
    }

    checkConnection() {
        if (this.isConnected) {
            console.log('✅ The database is connected.');
        } else {
            console.log('❌ The database is not connected.');
        }
    }

    listenForConnectionEvents() {
        mongoose.connection.on('connected', () => {
            console.log('Database connection established.');
        });
        mongoose.connection.on('error', (err) => {
            console.error('Database connection error:', err);
        });
        mongoose.connection.on('disconnected', () => {
            console.log('Database connection disconnected.');
        });
    }
}

export default DatabaseManager;