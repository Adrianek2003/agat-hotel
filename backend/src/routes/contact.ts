import { Router } from "express";
import { createContactMessage } from "../controllers/contactController";

export const contactRouter = Router();

contactRouter.post("/", createContactMessage);
