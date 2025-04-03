
const express = require('express');
const router = express.Router();
const cotacaoController = require('../controllers/cotacao.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Rotas públicas
router.get('/dolar', cotacaoController.getCotacaoDolar);

// Rotas protegidas (apenas admin pode modificar cotações)
router.post('/dolar', authMiddleware, cotacaoController.updateCotacaoDolar);

module.exports = router;
