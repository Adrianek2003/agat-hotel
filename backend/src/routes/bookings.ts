import { Router } from "express";
import { createBooking } from "../controllers/bookingsController";

export const bookingsRouter = Router();

bookingsRouter.post("/", createBooking);
