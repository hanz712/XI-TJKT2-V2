const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();

/* =========================================
   MIDDLEWARE
========================================= */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* =========================================
   SUPABASE
========================================= */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(
    supabaseUrl,
    supabaseKey
  );
}


/* =========================================
   STATIC FRONTEND
========================================= */

app.use(
  express.static(__dirname, {
    index: false
  })
);


/* =========================================
   FRONTEND
========================================= */

app.get('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, 'index.html')
  );
});


/* =========================================
   API STATUS
========================================= */

app.get('/api/status', (req, res) => {

  res.json({
    status: true,
    backend: 'online',
    supabase: supabase
      ? 'configured'
      : 'not configured',
    message:
      'Backend XI TJKT 2 berhasil berjalan! 🚀'
  });

});


/* =========================================
   API CONFIG TEST
   Untuk mengecek Environment Variables
========================================= */

app.get('/api/config-test', (req, res) => {

  const url = process.env.SUPABASE_URL || '';

  res.json({
    supabaseUrlConfigured:
      Boolean(process.env.SUPABASE_URL),

    supabaseKeyConfigured:
      Boolean(process.env.SUPABASE_KEY),

    supabaseUrl: url
      ? url.replace(
          /^(.{8}).*(\.supabase\.co.*)$/,
          '$1...$2'
        )
      : null
  });

});


/* =========================================
   API SUPABASE TEST
========================================= */

app.get('/api/supabase-test', async (req, res) => {

  if (!supabase) {

    return res.status(500).json({
      status: false,
      message:
        'Supabase belum dikonfigurasi. Periksa SUPABASE_URL dan SUPABASE_KEY di Environment Variables Vercel.'
    });

  }

  try {

    const { data, error } =
      await supabase
        .from('siswa')
        .select('*')
        .limit(1);

    if (error) {

      return res.status(500).json({
        status: false,
        message:
          'Supabase terhubung tetapi query gagal.',
        error: error.message
      });

    }

    res.json({
      status: true,
      message:
        'Supabase berhasil terhubung! 🚀',
      data: data
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      error: error.message
    });

  }

});


/* =========================================
   API SISWA
========================================= */

app.get('/api/siswa', async (req, res) => {

  if (!supabase) {

    return res.status(500).json({
      status: false,
      message:
        'Supabase belum dikonfigurasi.'
    });

  }

  try {

    const { data, error } =
      await supabase
        .from('siswa')
        .select('*')
        .order('no_absen', {
          ascending: true
        });

    if (error) {

      return res.status(500).json({
        status: false,
        error: error.message
      });

    }

    res.json({
      status: true,
      data: data
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      error: error.message
    });

  }

});


/* =========================================
   API JADWAL
========================================= */

app.get('/api/jadwal', async (req, res) => {

  if (!supabase) {

    return res.status(500).json({
      status: false,
      message:
        'Supabase belum dikonfigurasi.'
    });

  }

  try {

    const { data, error } =
      await supabase
        .from('jadwal')
        .select('*');

    if (error) {

      return res.status(500).json({
        status: false,
        error: error.message
      });

    }

    res.json({
      status: true,
      data: data
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      error: error.message
    });

  }

});


/* =========================================
   API ABSENSI
========================================= */

app.get('/api/absensi', async (req, res) => {

  if (!supabase) {

    return res.status(500).json({
      status: false,
      message:
        'Supabase belum dikonfigurasi.'
    });

  }

  try {

    const { data, error } =
      await supabase
        .from('absensi')
        .select('*')
        .order('tanggal', {
          ascending: false
        });

    if (error) {

      return res.status(500).json({
        status: false,
        error: error.message
      });

    }

    res.json({
      status: true,
      data: data
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      error: error.message
    });

  }

});


/* =========================================
   API 404
========================================= */

app.use('/api', (req, res) => {

  res.status(404).json({
    status: false,
    message:
      'API endpoint tidak ditemukan.'
  });

});


/* =========================================
   ERROR HANDLER
========================================= */

app.use((err, req, res, next) => {

  console.error(err);

  res.status(500).json({
    status: false,
    message:
      'Terjadi kesalahan pada server.',
    error: err.message
  });

});


/* =========================================
   LOCAL SERVER
========================================= */

const PORT = process.env.PORT || 3000;

if (require.main === module) {

  app.listen(PORT, () => {

    console.log(
      `Server XI TJKT 2 berjalan di http://localhost:${PORT}`
    );

  });

}


/* =========================================
   VERCEL
========================================= */

module.exports = app;