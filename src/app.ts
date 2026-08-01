import express from "express";
import "express-async-error";

const app = express();

app.use(express.json());

export { app };
