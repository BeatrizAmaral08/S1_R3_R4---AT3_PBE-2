import { Router } from "express";
import clienteController from "../controllers/clienteController.js";

const clienteRoutes = Router();

clienteRoutes.post('/', clienteController.criar);

export default clienteRoutes;