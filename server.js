const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARE
// ========================================
app.use(cors());
app.use(express.json());

// ========================================
// SUPABASE DATABASE SETUP
// ========================================
// Masukkan URL dan ANON KEY Supabase Anda di sini
const SUPABASE_URL = process.env.SUPABASE_URL || "https://xyz.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "your-anon-key";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ========================================
// ROUTE UTAMA
// ========================================
app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Backend XI TJKT 2 (Supabase) berjalan 🚀",
  });
});

// ========================================
// GET SEMUA DATA ABSENSI
// ========================================
app.get("/api/absensi", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("absensi")
      .select("*, siswa(nama)");

    if (error) throw error;

    res.json({
      status: true,
      data: data,
    });
  } catch (error) {
    console.error("Gagal mengambil data:", error.message);
    res.status(500).json({
      status: false,
      message: "Gagal mengambil data absensi",
    });
  }
});

// ========================================
// TAMBAH DATA ABSENSI
// ========================================
app.post("/api/absensi", async (req, res) => {
  try {
    const { siswa_id, status, tanggal } = req.body;

    if (!siswa_id || !status) {

      return res.status(400).json({
        status: false,
        message: "Siswa ID dan status wajib diisi",
      });
    }

    const tgl = tanggal || new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("absensi")
      .insert([{ siswa_id, status, tanggal: tgl }])
      .select();

    if (error) throw error;

    res.status(201).json({
      status: true,
      message: "Absensi berhasil disimpan",
      data: data[0],
    });
  } catch (error) {
    console.error("Gagal menyimpan:", error.message);
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat menyimpan absensi",
    });
  }
});

// ========================================
// HAPUS DATA ABSENSI
// ========================================
app.delete("/api/absensi/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("absensi").delete().eq("id", id);

    if (error) throw error;

    res.json({
      status: true,
      message: "Data absensi berhasil dihapus",
    });
  } catch (error) {
    console.error("Gagal menghapus:", error.message);
    res.status(500).json({
      status: false,
      message: "Gagal menghapus data absensi",
    });
  }
});

// ========================================
// EXPORT FOR VERCEL (SERVERLESS) & LOKAL
// ========================================
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

// WAJIB UNTUK VERCEL:
module.exports = app;
