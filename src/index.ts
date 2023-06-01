import app from './config/express';
import db from './config/db';

const PORT = process.env.PORT || 4000;

// Conexión a la base de datos
db.once('open', () => {
  console.log('Connected to MongoDB');

  // Iniciar el servidor después de establecer la conexión con la base de datos
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
