import express from 'express';
const router = express.Router();

import {obtenerCitas,crearCita,obtenerCitaPorId} from '../controllers/citaController.js'
// Rutas para las citas
router.get('/', obtenerCitas);
router.post('/solicitar',crearCita);
router.get('/:id', obtenerCitaPorId);

export default router;
