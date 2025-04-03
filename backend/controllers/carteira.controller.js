// Controller para as operações relacionadas às carteiras

// Criar uma nova carteira
exports.createWallet = async (req, res) => {
  try {
    const { nome } = req.body;
    
    if (!nome) {
      return res.status(400).json({ error: 'Nome da carteira é obrigatório' });
    }
    
    const newWallet = {
      userId: req.userId, // Associar ao usuário atual
      nome,
      ativos: [],
      saldoTotal: 0,
      aporteTotal: 0,
      lucro: 0,
      percentualLucro: 0,
      dataCriacao: new Date()
    };
    
    const result = await req.db.collection('carteiras').insertOne(newWallet);
    
    // Registrar no histórico
    await req.db.collection('historico').insertOne({
      userId: req.userId, // Associar ao usuário atual
      tipo: 'criacao',
      descricao: `Criou a carteira ${nome}`,
      valor: 0,
      data: new Date(),
      carteiraId: result.insertedId,
      carteiraNome: nome
    });
    
    res.status(201).json({
      id: result.insertedId,
      ...newWallet
    });
  } catch (error) {
    console.error('Erro ao criar carteira:', error);
    res.status(500).json({ error: 'Erro ao criar carteira' });
  }
};

// Adicionar um aporte de criptomoeda na carteira
exports.addAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, quantidade, valorUnitario } = req.body;
    
    if (!nome || !quantidade || !valorUnitario) {
      return res.status(400).json({ error: 'Nome, quantidade e valor unitário são obrigatórios' });
    }
    
    // Buscar a carteira
    const wallet = await req.db.collection('carteiras').findOne({ _id: new req.ObjectId(id) });
    
    if (!wallet) {
      return res.status(404).json({ error: 'Carteira não encontrada' });
    }
    
    // Buscar usuário para verificar saldo
    const user = await req.db.collection('usuarios').findOne({});
    
    const valorTotal = quantidade * valorUnitario;
    
    if (valorTotal > user.saldoReais) {
      return res.status(400).json({ error: 'Saldo em reais insuficiente para este aporte' });
    }
    
    // Atualizar saldo do usuário
    await req.db.collection('usuarios').updateOne(
      {},
      { 
        $inc: { 
          saldoReais: -valorTotal,
          aporteTotal: valorTotal 
        } 
      }
    );
    
    // Verificar se o ativo já existe na carteira
    const existingAssetIndex = wallet.ativos.findIndex(a => a.nome === nome);
    
    let updatedAtivos = [...wallet.ativos];
    
    if (existingAssetIndex >= 0) {
      // Atualizar ativo existente
      const existingAsset = wallet.ativos[existingAssetIndex];
      const newQuantity = existingAsset.quantidade + quantidade;
      const newTotal = existingAsset.valorTotal + valorTotal;
      const newAvgPrice = newTotal / newQuantity;
      
      updatedAtivos[existingAssetIndex] = {
        ...existingAsset,
        quantidade: newQuantity,
        valorUnitario: newAvgPrice,
        valorTotal: newTotal
      };
    } else {
      // Adicionar novo ativo
      updatedAtivos.push({
        nome,
        quantidade,
        valorUnitario,
        valorTotal,
        percentual: 0
      });
    }
    
    // Atualizar totais da carteira
    const newAporteTotal = wallet.aporteTotal + valorTotal;
    const newSaldoTotal = wallet.saldoTotal + valorTotal;
    
    // Recalcular percentuais
    updatedAtivos = updatedAtivos.map(ativo => ({
      ...ativo,
      percentual: (ativo.valorTotal / newSaldoTotal) * 100
    }));
    
    // Atualizar a carteira
    await req.db.collection('carteiras').updateOne(
      { _id: new req.ObjectId(id) },
      { 
        $set: { 
          ativos: updatedAtivos,
          saldoTotal: newSaldoTotal,
          aporteTotal: newAporteTotal,
          lucro: newSaldoTotal - newAporteTotal,
          percentualLucro: ((newSaldoTotal - newAporteTotal) / newAporteTotal) * 100
        } 
      }
    );
    
    // Registrar no histórico
    await req.db.collection('historico').insertOne({
      tipo: 'compra',
      descricao: `Comprou ${quantidade} ${nome}`,
      valor: valorTotal,
      data: new Date(),
      carteiraId: new req.ObjectId(id),
      carteiraNome: wallet.nome
    });
    
    res.json({
      message: `Compra de ${quantidade} ${nome} realizada com sucesso`,
      saldoRestante: user.saldoReais - valorTotal
    });
  } catch (error) {
    console.error('Erro ao adicionar ativo:', error);
    res.status(500).json({ error: 'Erro ao adicionar ativo' });
  }
};

// Vender um ativo por real
exports.sellAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, quantidade, valorUnitario } = req.body;
    
    if (!nome || !quantidade || !valorUnitario) {
      return res.status(400).json({ error: 'Nome, quantidade e valor unitário são obrigatórios' });
    }
    
    // Buscar a carteira
    const wallet = await req.db.collection('carteiras').findOne({ _id: new req.ObjectId(id) });
    
    if (!wallet) {
      return res.status(404).json({ error: 'Carteira não encontrada' });
    }
    
    // Verificar se o ativo existe na carteira
    const existingAssetIndex = wallet.ativos.findIndex(a => a.nome === nome);
    
    if (existingAssetIndex === -1) {
      return res.status(404).json({ error: `Ativo ${nome} não encontrado na carteira` });
    }
    
    const existingAsset = wallet.ativos[existingAssetIndex];
    
    if (existingAsset.quantidade < quantidade) {
      return res.status(400).json({ error: `Quantidade insuficiente de ${nome} para venda` });
    }
    
    const valorVenda = quantidade * valorUnitario;
    const valorCusto = quantidade * existingAsset.valorUnitario;
    const lucroVenda = valorVenda - valorCusto;
    
    // Atualizar saldo do usuário
    await req.db.collection('usuarios').updateOne(
      {},
      { $inc: { saldoReais: valorVenda } }
    );
    
    // Atualizar ativo na carteira
    let updatedAtivos = [...wallet.ativos];
    updatedAtivos[existingAssetIndex] = {
      ...existingAsset,
      quantidade: existingAsset.quantidade - quantidade,
      valorTotal: (existingAsset.quantidade - quantidade) * existingAsset.valorUnitario
    };
    
    // Remover ativo se quantidade for zero
    if (updatedAtivos[existingAssetIndex].quantidade === 0) {
      updatedAtivos = updatedAtivos.filter((_, index) => index !== existingAssetIndex);
    }
    
    // Recalcular totais da carteira
    const newSaldoTotal = updatedAtivos.reduce((sum, a) => sum + a.valorTotal, 0);
    
    // Recalcular percentuais
    if (newSaldoTotal > 0) {
      updatedAtivos = updatedAtivos.map(ativo => ({
        ...ativo,
        percentual: (ativo.valorTotal / newSaldoTotal) * 100
      }));
    }
    
    // Atualizar a carteira
    await req.db.collection('carteiras').updateOne(
      { _id: new req.ObjectId(id) },
      { 
        $set: { 
          ativos: updatedAtivos,
          saldoTotal: newSaldoTotal,
          lucro: newSaldoTotal - wallet.aporteTotal,
          percentualLucro: wallet.aporteTotal > 0 ? ((newSaldoTotal - wallet.aporteTotal) / wallet.aporteTotal) * 100 : 0
        } 
      }
    );
    
    // Registrar no histórico
    await req.db.collection('historico').insertOne({
      tipo: 'venda',
      descricao: `Vendeu ${quantidade} ${nome}`,
      valor: valorVenda,
      lucro: lucroVenda,
      data: new Date(),
      carteiraId: new req.ObjectId(id),
      carteiraNome: wallet.nome
    });
    
    const resultMessage = lucroVenda >= 0 
      ? `Venda realizada com lucro de R$ ${lucroVenda.toFixed(2)}` 
      : `Venda realizada com prejuízo de R$ ${Math.abs(lucroVenda).toFixed(2)}`;
    
    res.json({
      message: `Venda de ${quantidade} ${nome} realizada com sucesso. ${resultMessage}`,
      lucroVenda,
      saldoAtualizado: valorVenda
    });
  } catch (error) {
    console.error('Erro ao vender ativo:', error);
    res.status(500).json({ error: 'Erro ao vender ativo' });
  }
};

// Listar ativos de uma carteira
exports.getAssets = async (req, res) => {
  try {
    const { id } = req.params;
    
    const wallet = await req.db.collection('carteiras').findOne(
      { _id: new req.ObjectId(id) },
      { projection: { ativos: 1 } }
    );
    
    if (!wallet) {
      return res.status(404).json({ error: 'Carteira não encontrada' });
    }
    
    res.json(wallet.ativos);
  } catch (error) {
    console.error('Erro ao listar ativos:', error);
    res.status(500).json({ error: 'Erro ao listar ativos' });
  }
};

// Mostrar saldo, aporte e lucro da carteira
exports.getWalletBalance = async (req, res) => {
  try {
    const { id } = req.params;
    
    const wallet = await req.db.collection('carteiras').findOne(
      { _id: new req.ObjectId(id) },
      { projection: { saldoTotal: 1, aporteTotal: 1, lucro: 1, percentualLucro: 1 } }
    );
    
    if (!wallet) {
      return res.status(404).json({ error: 'Carteira não encontrada' });
    }
    
    res.json({
      saldoTotal: wallet.saldoTotal,
      aporteTotal: wallet.aporteTotal,
      lucro: wallet.lucro,
      percentualLucro: wallet.percentualLucro
    });
  } catch (error) {
    console.error('Erro ao obter saldo da carteira:', error);
    res.status(500).json({ error: 'Erro ao obter saldo da carteira' });
  }
};

// Obter todas as carteiras
exports.getAllWallets = async (req, res) => {
  try {
    // Filtrar carteiras pelo userId
    const wallets = await req.db.collection('carteiras')
      .find({ userId: req.userId })
      .toArray();
    res.json(wallets);
  } catch (error) {
    console.error('Erro ao listar carteiras:', error);
    res.status(500).json({ error: 'Erro ao listar carteiras' });
  }
};

// Obter uma carteira específica
exports.getWallet = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Adiciona verificação de propriedade da carteira
    const wallet = await req.db.collection('carteiras').findOne({ 
      _id: new req.ObjectId(id),
      userId: req.userId // Verificar se a carteira pertence ao usuário
    });
    
    if (!wallet) {
      return res.status(404).json({ error: 'Carteira não encontrada' });
    }
    
    res.json(wallet);
  } catch (error) {
    console.error('Erro ao obter carteira:', error);
    res.status(500).json({ error: 'Erro ao obter carteira' });
  }
};
