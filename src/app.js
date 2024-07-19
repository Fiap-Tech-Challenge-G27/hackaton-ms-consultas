import express, { json } from 'express';
import api from "./api/index.js";
import 'dotenv/config';

const app = express();

app.use("", api)
app.use(json());

export default app