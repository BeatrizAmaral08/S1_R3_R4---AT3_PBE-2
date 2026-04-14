import { Router } from "express";
import clienteController from "../controllers/clienteController.js";

const clienteRoutes = Router();

clienteRoutes.post('/', clienteController.criar);
clienteRoutes.put('/:id', clienteController.editar);
clienteRoutes.delete('/:id', clienteController.deletar);
clienteRoutes.get('/', clienteController.selecionar);

export default clienteRoutes;