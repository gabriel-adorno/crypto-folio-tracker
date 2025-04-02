
// Controller para operações relacionadas a gráficos

// Retorna dados para um gráfico de pizza, mostrando a porcentagem de cada ativo dentro da carteira
exports.getWalletPieChart = async (req, res) => {
  try {
    const { id } = req.params;
    
    const wallet = await req.db.collection('carteiras').findOne({ _id: new req.ObjectId(id) });
    
    if (!wallet) {
      return res.status(404).json({ error: 'Carteira não encontrada' });
    }
    
    if (!wallet.ativos || wallet.ativos.length === 0) {
      return res.json({ labels: [], data: [], backgroundColor: [] });
    }
    
    // Definir cores para os ativos
    const colors = [
      '#00e4ca', '#9b87f5', '#ff9332', '#1199fa', '#2ebd85', '#ff4c4c',
      '#00b8d9', '#6554c0', '#ff8800', '#36b37e', '#ff5630', '#6554c0'
    ];
    
    // Formatar dados para o gráfico de pizza
    const labels = wallet.ativos.map(a => a.nome);
    const data = wallet.ativos.map(a => a.percentual);
    const backgroundColor = wallet.ativos.map((_, index) => colors[index % colors.length]);
    
    res.json({
      labels,
      data,
      backgroundColor
    });
  } catch (error) {
    console.error('Erro ao obter dados para gráfico de pizza:', error);
    res.status(500).json({ error: 'Erro ao obter dados para gráfico de pizza' });
  }
};

// Retorna dados para um gráfico de pizza, mostrando a distribuição percentual dos ativos no total do usuário
exports.getGeneralPieChart = async (req, res) => {
  try {
    const wallets = await req.db.collection('carteiras').find({}).toArray();
    
    if (!wallets || wallets.length === 0) {
      return res.json({ labels: [], data: [], backgroundColor: [] });
    }
    
    // Calcular valor total de todas as carteiras
    const totalValue = wallets.reduce((sum, wallet) => sum + wallet.saldoTotal, 0);
    
    if (totalValue === 0) {
      return res.json({ labels: [], data: [], backgroundColor: [] });
    }
    
    // Calcular percentual de cada carteira
    const walletData = wallets.map(wallet => ({
      name: wallet.nome,
      value: wallet.saldoTotal,
      percentage: (wallet.saldoTotal / totalValue) * 100
    }));
    
    // Definir cores para as carteiras
    const colors = [
      '#00e4ca', '#9b87f5', '#ff9332', '#1199fa', '#2ebd85', '#ff4c4c',
      '#00b8d9', '#6554c0', '#ff8800', '#36b37e', '#ff5630', '#6554c0'
    ];
    
    res.json({
      labels: walletData.map(w => w.name),
      data: walletData.map(w => w.percentage),
      backgroundColor: walletData.map((_, index) => colors[index % colors.length])
    });
  } catch (error) {
    console.error('Erro ao obter dados para gráfico de pizza geral:', error);
    res.status(500).json({ error: 'Erro ao obter dados para gráfico de pizza geral' });
  }
};

// Retorna dados para um gráfico de linha ou barras, mostrando a relação entre aporte e saldo da carteira
exports.getWalletPerformanceChart = async (req, res) => {
  try {
    const { id } = req.params;
    
    const wallet = await req.db.collection('carteiras').findOne({ _id: new req.ObjectId(id) });
    
    if (!wallet) {
      return res.status(404).json({ error: 'Carteira não encontrada' });
    }
    
    // Buscar histórico de operações da carteira
    const history = await req.db.collection('historico')
      .find({ carteiraId: new req.ObjectId(id) })
      .sort({ data: 1 })
      .toArray();
    
    // Para fins de demonstração, vamos simular dados de 6 meses
    // Em uma aplicação real, isso seria calculado a partir do histórico
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    
    // Simular crescimento gradual do aporte e saldo
    const aporteData = [
      wallet.aporteTotal * 0.3, 
      wallet.aporteTotal * 0.5, 
      wallet.aporteTotal * 0.7, 
      wallet.aporteTotal * 0.8, 
      wallet.aporteTotal * 0.9, 
      wallet.aporteTotal
    ];
    
    const saldoData = [
      wallet.aporteTotal * 0.28, 
      wallet.aporteTotal * 0.48, 
      wallet.aporteTotal * 0.75, 
      wallet.aporteTotal * 0.9, 
      wallet.aporteTotal * 1.05, 
      wallet.saldoTotal
    ];
    
    res.json({
      labels: months,
      datasets: [
        {
          label: 'Aporte',
          data: aporteData,
          borderColor: '#9b87f5',
          backgroundColor: 'rgba(155, 135, 245, 0.1)',
        },
        {
          label: 'Saldo',
          data: saldoData,
          borderColor: '#00e4ca',
          backgroundColor: 'rgba(0, 228, 202, 0.1)',
        }
      ]
    });
  } catch (error) {
    console.error('Erro ao obter dados para gráfico de performance:', error);
    res.status(500).json({ error: 'Erro ao obter dados para gráfico de performance' });
  }
};

// Retorna dados para um gráfico de linha ou barras, mostrando a relação entre aporte e saldo geral
exports.getGeneralPerformanceChart = async (req, res) => {
  try {
    // Buscar todas as carteiras
    const wallets = await req.db.collection('carteiras').find({}).toArray();
    
    if (!wallets || wallets.length === 0) {
      return res.json({
        labels: [],
        datasets: []
      });
    }
    
    // Calcular totais
    const totalAporte = wallets.reduce((sum, wallet) => sum + wallet.aporteTotal, 0);
    const totalSaldo = wallets.reduce((sum, wallet) => sum + wallet.saldoTotal, 0);
    
    // Para fins de demonstração, vamos simular dados de 6 meses
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    
    // Simular crescimento gradual do aporte e saldo
    const aporteData = [
      totalAporte * 0.3, 
      totalAporte * 0.5, 
      totalAporte * 0.7, 
      totalAporte * 0.8, 
      totalAporte * 0.9, 
      totalAporte
    ];
    
    const saldoData = [
      totalAporte * 0.28, 
      totalAporte * 0.48, 
      totalAporte * 0.75, 
      totalAporte * 0.9, 
      totalAporte * 1.05, 
      totalSaldo
    ];
    
    res.json({
      labels: months,
      datasets: [
        {
          label: 'Aporte Total',
          data: aporteData,
          borderColor: '#9b87f5',
          backgroundColor: 'rgba(155, 135, 245, 0.1)',
        },
        {
          label: 'Saldo Total',
          data: saldoData,
          borderColor: '#00e4ca',
          backgroundColor: 'rgba(0, 228, 202, 0.1)',
        }
      ]
    });
  } catch (error) {
    console.error('Erro ao obter dados para gráfico de performance geral:', error);
    res.status(500).json({ error: 'Erro ao obter dados para gráfico de performance geral' });
  }
};
