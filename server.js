const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Inisialisasi Supabase menggunakan Environment Variables Vercel
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// 1. Melayani file statis (index.html, Style.css, Script.js)
app.use(express.static(__dirname));

// 2. Route Utama (Menampilkan Frontend index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. Endpoint API Cek Status Server & Supabase
app.get('/api/status', async (req, res) => {
  try {
    res.json({ 
      status: true, 
      message: 'Backend XI TJKT 2 & Supabase Berhasil Terhubung! 🚀' 
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

// Tambahkan Endpoint API kamu lainnya di sini (Contoh: /api/data)

// Port lokal (opsional jika dijalankan di komputer)
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

// Export app untuk Vercel Serverless
module.exports = app;
