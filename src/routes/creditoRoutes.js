
import express from 'express';
const router = express.Router();

import {aprobarCredito,registrarPagoSemanal,solicitarCredito} from '../controllers/creditoController.js';
// Rutas para los créditos
router.post('/aprobar/:_id', aprobarCredito);
router.post('/pago/:_id', registrarPagoSemanal);
router.post('/solicitar', solicitarCredito);

// router.delete('/:id', creditosController.eliminarCredito);

export default  router;
