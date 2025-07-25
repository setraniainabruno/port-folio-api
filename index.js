require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
  origin: 'https://monportfolio-str.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Configuration Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

app.get('/',(res, req)=>{
  res.status(200).json({message:"Serveur tourne bien"})
})

app.post('/api/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }
  try {
    const info = await transporter.sendMail({
      from: `"Setraniaina Bruno" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    res.status(200).json({ success: true, message: 'Email envoyé avec succès' });
  } catch (error) {
    res.status(500).json({ error: "Échec de l'envoi de l'email" });
  }
});


// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port : ${PORT}`);
});