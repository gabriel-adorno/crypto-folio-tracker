
// Controller para as operações relacionadas aos gráficos

// Retorna dados para um gráfico de pizza, mostrando a porcentagem de cada ativo dentro da carteira
exports.getWalletPieChart = async (req, res) => {
  try {
    const { id } = req.params;
    
    const wallet = await req.db.collection('carteiras').findOne({ _id: new req.ObjectId(id) });
    
    if (!wallet) {
      return res.status(404).json({ error: 'Carteira não encontrada' });
    }
    
    // Cores para o gráfico
    const colors = [
      '#00e4ca', '#9b87f5', '#ff9332', '#1199fa', '#2ebd85', '#ff4c4c',
      '#00b8d9', '#6554c0', '#ff8800', '#36b37e', '#ff5630', '#6554c0'
    ];
    
    const chartData = {
      labels: wallet.ativos.map(a => a.nome),
      data: wallet.ativos.map(a => a.percentual),
      backgroundColor: wallet.ativos.map((_, index) => colors[index % colors.length])
    };
    
    res.json(chartData);
  } catch (error) {
    console.error('Erro ao gerar gráfico de pizza da carteira:', error);
    res.status(500).json({ error: 'Erro ao gerar gráfico de pizza da carteira' });
  }
};

// Retorna dados para um gráfico de pizza, mostrando a distribuição percentual dos ativos no total do usuário
exports.getGeneralPieChart = async (req, res) => {
  try {
    const wallets = await req.db.collection('carteiras').find({}).toArray();
    
    const totalValue = wallets.reduce((sum, wallet) => sum + wallet.saldoTotal, 0);
    
    if (totalValue === 0) {
      return res.json({
        labels: [],
        data: [],
        backgroundColor: []
      });
    }
    
    const walletData = wallets.map(wallet => ({
      name: wallet.nome,
      value: wallet.saldoTotal,
      percentage: (wallet.saldoTotal / totalValue) * 100
    }));
    
    // Cores para o gráfico
    const colors = [
      '#00e4ca', '#9b87f5', '#ff9332', '#1199fa', '#2ebd85', '#ff4c4c',
      '#00b8d9', '#6554c0', '#ff8800', '#36b37e', '#ff5630', '#6554c0'
    ];
    
    const chartData = {
      labels: walletData.map(w => w.name),
      data: walletData.map(w => w.percentage),
      backgroundColor: walletData.map((_, index) => colors[index % colors.length])
    };
    
    res.json(chartData);
  } catch (error) {
    console.error('Erro ao gerar gráfico de pizza geral:', error);
    res.status(500).json({ error: 'Erro ao gerar gráfico de pizza geral' });
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
    
    // Obter histórico de transações da carteira
    const history = await req.db.collection('historico')
      .find({ carteiraId: new req.ObjectId(id) })
      .sort({ data: 1 })
      .toArray();
    
    // Gerar dados para 6 meses
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);
    
    const months = [];
    const aporteData = [];
    const saldoData = [];
    
    // Nomes dos meses em português
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    let currentDate = new Date(startDate);
    let aporteAccumulated = 0;
    let saldoAccumulated = 0;
    
    while (currentDate <= endDate) {
      const month = monthNames[currentDate.getMonth()];
      const year = currentDate.getFullYear();
      const monthLabel = `${month}/${year.toString().substr(2, 2)}`;
      
      // Filtrar transações do mês atual
      const monthTransactions = history.filter(transaction => {
        const transactionDate = new Date(transaction.data);
        return transactionDate.getMonth() === currentDate.getMonth() && 
               transactionDate.getFullYear() === currentDate.getFullYear();
      });
      
      // Calcular aporte e saldo para o mês
      for (const transaction of monthTransactions) {
        if (transaction.tipo === 'compra') {
          aporteAccumulated += transaction.valor;
          saldoAccumulated += transaction.valor;
        } else if (transaction.tipo === 'venda') {
          saldoAccumulated -= transaction.valor - transaction.lucro;
        }
      }
      
      months.push(monthLabel);
      aporteData.push(aporteAccumulated);
      saldoData.push(saldoAccumulated);
      
      // Avançar para o próximo mês
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // Dados para o gráfico
    const chartData = {
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
    };
    
    res.json(chartData);
  } catch (error) {
    console.error('Erro ao gerar gráfico de desempenho da carteira:', error);
    res.status(500).json({ error: 'Erro ao gerar gráfico de desempenho da carteira' });
  }
};

// Retorna dados para um gráfico de linha ou barras, mostrando a relação entre aporte e saldo geral
exports.getGeneralPerformanceChart = async (req, res) => {
  try {
    // Obter histórico de transações
    const history = await req.db.collection('historico')
      .find({})
      .sort({ data: 1 })
      .toArray();
    
    // Gerar dados para 6 meses
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);
    
    const months = [];
    const aporteData = [];
    const saldoData = [];
    
    // Nomes dos meses em português
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    let currentDate = new Date(startDate);
    let aporteAccumulated = 0;
    let saldoAccumulated = 0;
    
    while (currentDate <= endDate) {
      const month = monthNames[currentDate.getMonth()];
      const year = currentDate.getFullYear();
      const monthLabel = `${month}/${year.toString().substr(2, 2)}`;
      
      // Filtrar transações do mês atual
      const monthTransactions = history.filter(transaction => {
        const transactionDate = new Date(transaction.data);
        return transactionDate.getMonth() === currentDate.getMonth() && 
               transactionDate.getFullYear() === currentDate.getFullYear();
      });
      
      // Calcular aporte e saldo para o mês
      for (const transaction of monthTransactions) {
        if (transaction.tipo === 'compra') {
          aporteAccumulated += transaction.valor;
          saldoAccumulated += transaction.valor;
        } else if (transaction.tipo === 'venda') {
          saldoAccumulated -= transaction.valor - (transaction.lucro || 0);
        } else if (transaction.tipo === 'deposito') {
          saldoAccumulated += transaction.valor;
        } else if (transaction.tipo === 'saque') {
          saldoAccumulated -= transaction.valor;
        }
      }
      
      months.push(monthLabel);
      aporteData.push(aporteAccumulated);
      saldoData.push(saldoAccumulated);
      
      // Avançar para o próximo mês
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // Dados para o gráfico
    const chartData = {
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
    };
    
    res.json(chartData);
  } catch (error) {
    console.error('Erro ao gerar gráfico de desempenho geral:', error);
    res.status(500).json({ error: 'Erro ao gerar gráfico de desempenho geral' });
  }
};
