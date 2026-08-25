const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-client');

const app = express();

app.use(cors());
app.use(express.json());

// 1. Hubungkan ke Supabase (mengambil dari Environment Variables Vercel)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Sajikan file statis frontend (Style.css, Script.js, dll)
app.use(express.static(path.join(__dirname)));

// 3. Route Utama: Tampilkan halaman Frontend (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. Contoh Route API untuk cek status backend
app.get('/api/status', (req, res) => {
  res.json({ status: true, message: 'Backend & Supabase terhubung! 🚀' });
});

// Tulis Endpoint API kamu yang lain di bawah ini (misal: /api/data)

// Export app untuk Vercel Serverless
module.exports = app;


