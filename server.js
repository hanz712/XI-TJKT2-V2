const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ambil URL dan KEY dari Environment Variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.get("/", (req, res) => {
  res.json({ status: true, message: "Backend XI TJKT 2 berjalan 🚀" });
});

app.get("/api/absensi", async (req, res) => {
  try {
    const { data, error } = await supabase.from("absensi").select("*, siswa(nama)");
    if (error) throw error;
    res.json({ status: true, data });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

app.post("/api/absensi", async (req, res) => {
  try {
    const { siswa_id, status, tanggal } = req.body;
    const tgl = tanggal || new Date().toISOString().split("T")[0];
    const { data, error } = await supabase.from("absensi").insert([{ siswa_id, status, tanggal: tgl }]).select();
    if (error) throw error;
    res.status(201).json({ status: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

