
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const carteiraRoutes = require('./routes/carteira.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const historicoRoutes = require('./routes/historico.routes');
const graficosRoutes = require('./routes/graficos.routes');
const authRoutes = require('./routes/auth.routes');
const criptoRoutes = require('./routes/cripto.routes');
const authMiddleware = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cryptomanager';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
let db;

async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db();
    
    // Inicializar dados se necessário
    await initializeData(db);
    
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

// Inicialização de dados
async function initializeData(db) {
  // Create collections if they don't exist
  if (!(await db.listCollections({ name: 'usuarios' }).hasNext())) {
    await db.createCollection('usuarios');
    console.log('Usuarios collection created');
  }
  
  if (!(await db.listCollections({ name: 'carteiras' }).hasNext())) {
    await db.createCollection('carteiras');
    console.log('Carteiras collection created');
  }
  
  if (!(await db.listCollections({ name: 'historico' }).hasNext())) {
    await db.createCollection('historico');
    console.log('Historico collection created');
  }
  
  if (!(await db.listCollections({ name: 'criptomoedas' }).hasNext())) {
    await db.createCollection('criptomoedas');
    console.log('Criptomoedas collection created');
    
    // Inicializar com algumas criptomoedas populares
    const defaultCryptos = [
      {
        nome: 'Bitcoin',
        simbolo: 'BTC',
        precoAtual: 64000,
        variacao24h: 2.5,
        marketCap: 1200000000000,
        volume24h: 30000000000,
        ultimaAtualizacao: new Date()
      },
      {
        nome: 'Ethereum',
        simbolo: 'ETH',
        precoAtual: 3100,
        variacao24h: 3.2,
        marketCap: 380000000000,
        volume24h: 15000000000,
        ultimaAtualizacao: new Date()
      },
      {
        nome: 'Solana',
        simbolo: 'SOL',
        precoAtual: 118,
        variacao24h: 5.8,
        marketCap: 55000000000,
        volume24h: 3500000000,
        ultimaAtualizacao: new Date()
      },
      {
        nome: 'Cardano',
        simbolo: 'ADA',
        precoAtual: 0.45,
        variacao24h: 1.2,
        marketCap: 16000000000,
        volume24h: 500000000,
        ultimaAtualizacao: new Date()
      },
      {
        nome: 'Polkadot',
        simbolo: 'DOT',
        precoAtual: 6.8,
        variacao24h: 2.1,
        marketCap: 9000000000,
        volume24h: 350000000,
        ultimaAtualizacao: new Date()
      },
      {
        nome: 'Avalanche',
        simbolo: 'AVAX',
        precoAtual: 35,
        variacao24h: 4.3,
        marketCap: 13000000000,
        volume24h: 750000000,
        ultimaAtualizacao: new Date()
      },
      {
        nome: 'Ripple',
        simbolo: 'XRP',
        precoAtual: 0.58,
        variacao24h: 1.5,
        marketCap: 31000000000,
        volume24h: 1200000000,
        ultimaAtualizacao: new Date()
      },
      {
        nome: 'Polygon',
        simbolo: 'MATIC',
        precoAtual: 0.68,
        variacao24h: 2.8,
        marketCap: 7000000000,
        volume24h: 380000000,
        ultimaAtualizacao: new Date()
      },
      {
        nome: 'Aave',
        simbolo: 'AAVE',
        precoAtual: 93,
        variacao24h: 3.7,
        marketCap: 1400000000,
        volume24h: 140000000,
        ultimaAtualizacao: new Date()
      },
      {
        nome: 'Uniswap',
        simbolo: 'UNI',
        precoAtual: 7.2,
        variacao24h: 2.9,
        marketCap: 5500000000,
        volume24h: 260000000,
        ultimaAtualizacao: new Date()
      }
    ];
    
    await db.collection('criptomoedas').insertMany(defaultCryptos);
    console.log('Criptomoedas initialized with default values');
  }
}

// Make DB available to routes
app.use((req, res, next) => {
  req.db = db;
  req.ObjectId = ObjectId;
  next();
});

// Public Routes
app.use('/auth', authRoutes);
app.use('/cripto', criptoRoutes);

// Protected Routes (require authentication)
app.use('/carteira', authMiddleware, carteiraRoutes);
app.use('/usuario', authMiddleware, usuarioRoutes);
app.use('/historico', authMiddleware, historicoRoutes);
app.use('/graficos', authMiddleware, graficosRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API do Gerenciador de Carteiras de Criptomoedas' });
});

// Start server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(console.error);

module.exports = app;
