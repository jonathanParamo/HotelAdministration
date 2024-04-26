import express from "express";
import morgan from "morgan";
import userRoute from "./routes/user.routes.js";
import roomRoute from "./routes/room.routes.js";
import reservationRoute from "./routes/reservation.routes.js";
import cleaningHistory from "./routes/cleaningHistory.routes.js"

const app = express();

//settings
app.set("port", 4000);

//middlewares
app.use(morgan("dev"));
app.use(express.json());

//routes
app.use(userRoute)
app.use(roomRoute)
app.use(reservationRoute)
app.use(cleaningHistory)

export default app;
