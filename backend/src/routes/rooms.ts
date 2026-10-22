import { Router } from "express";
import { listRooms } from "../controllers/roomsController";

export const roomsRouter = Router();

roomsRouter.get("/", listRooms);
