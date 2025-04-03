
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const carteiraRoutes = require('./routes/carteira.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const historicoRoutes = require('./routes/historico.routes');
const graficosRoutes = require('./routes/graficos.routes');
const authRoutes = require('./routes/auth.routes');
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
}

// Make DB available to routes
app.use((req, res, next) => {
  req.db = db;
  req.ObjectId = ObjectId;
  next();
});

// Public Routes
app.use('/auth', authRoutes);

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
