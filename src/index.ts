// index.ts: contains and bootstraps the API

import express from 'express';
import { acronymRouter } from './routes/acronymRouter';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()


//Express application bootstraping
const app = express();

// DB connection
 
mongoose.connect(`${process.env.MONGO_URL}`, () => {
    console.log('connected to DB !');
});


// Middleware for handling json

app.use(express.json());

// Router to handle Acronym requests
app.use(acronymRouter);

// HTTP listener
app.listen(process.env.PORT, () => {
    console.log('Server is up and running !!!');
});