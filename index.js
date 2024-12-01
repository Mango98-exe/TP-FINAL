const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model.js");
const productRoute = require("./routes/product.route.js");
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/products", productRoute);

// Clave secreta para firmar tokens (cámbiala en producción)
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;
const MONGO_URI = process.env.MONGO_URI;

// Modelado de datos usando Mongoose (no Joi)
const integranteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, minlength: 2 },
  apellido: { type: String, required: true, minlength: 2 },
  dni: { type: String, required: true, minlength: 8, maxlength: 8 },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
});

const Integrante = mongoose.model('Integrante', integranteSchema);

// Middleware para verificar tokens
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
    req.user = decoded;
    next();
  });
};

// Rutas
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === '1234') {
    const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Autenticación exitosa', token });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

// Obtener integrantes (requiere token)
app.get('/integrantes', verifyToken, async (req, res) => {
  const integrantes = await Integrante.find();
  res.json(integrantes);
});

// Agregar un integrante (sin token)
app.post('/integrantes/agregar', async (req, res) => {
  const { nombre, apellido, dni, email } = req.body;
  const nuevoIntegrante = new Integrante({ nombre, apellido, dni, email });
  await nuevoIntegrante.save();
  res.status(201).json(nuevoIntegrante);
});

// Actualizar un integrante (requiere token)
app.put('/integrantes/:email', verifyToken, async (req, res) => {
  const { apellido } = req.body;
  const integrante = await Integrante.findOneAndUpdate(
    { email: req.params.email },
    { apellido },
    { new: true }
  );
  integrante
    ? res.json({ message: 'Apellido actualizado', integrante })
    : res.status(404).json({ error: 'No se encontró al integrante con ese email' });
});

// Eliminar un integrante (requiere token)
app.delete('/integrantes/:dni', verifyToken, async (req, res) => {
  const integrante = await Integrante.findOneAndDelete({ dni: req.params.dni });
  integrante
    ? res.json({ message: 'Integrante eliminado', integrante })
    : res.status(404).json({ error: 'No se encontró al integrante con ese DNI' });
});

app.get("/", (req, res) => {
  res.send("Start Node API Server");
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Conectado a la base de datos!");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Conexión fallida");
  });
