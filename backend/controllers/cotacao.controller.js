
// Controller para operações relacionadas às cotações

// Obter a cotação atual do dólar
exports.getCotacaoDolar = async (req, res) => {
  try {
    // Buscar a cotação mais recente
    const cotacao = await req.db.collection('cotacoes').findOne(
      { moeda: 'USD' },
      { sort: { data: -1 } }
    );
    
    if (!cotacao) {
      return res.status(404).json({ error: 'Cotação do dólar não encontrada' });
    }
    
    res.json(cotacao);
  } catch (error) {
    console.error('Erro ao obter cotação do dólar:', error);
    res.status(500).json({ error: 'Erro ao obter cotação do dólar' });
  }
};

// Atualizar a cotação do dólar
exports.updateCotacaoDolar = async (req, res) => {
  try {
    const { valor } = req.body;
    
    if (!valor || valor <= 0) {
      return res.status(400).json({ error: 'Valor inválido para cotação' });
    }
    
    // Inserir nova cotação
    await req.db.collection('cotacoes').insertOne({
      moeda: 'USD',
      valor,
      data: new Date()
    });
    
    res.json({
      message: 'Cotação do dólar atualizada com sucesso',
      valor
    });
  } catch (error) {
    console.error('Erro ao atualizar cotação do dólar:', error);
    res.status(500).json({ error: 'Erro ao atualizar cotação do dólar' });
  }
};
