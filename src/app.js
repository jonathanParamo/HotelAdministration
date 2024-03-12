import express from 'express';
import morgan from 'morgan';
import userRoute from "./routes/user.routes.js";

const app = express();

//settings
app.set('port', 4000);

//middlewares
app.use(morgan('dev'));

app.use(userRoute)

export default app;
