const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());


// ========================================
// DATABASE
// ========================================

// Struktur project:
//
// XI-TJKT2-V2/
// ├── Backend/
// │   ├── package.json
// │   └── server.js
// ├── Database.json
// └── frontend/
//     ├── index.html
//     ├── Style.css
//     └── Script.js

// Database.json berada satu tingkat di atas
// folder Backend.

const databasePath = path.join(
  __dirname,
  "..",
  "Database.json"
);


// ========================================
// CEK / BUAT DATABASE
// ========================================

function initializeDatabase() {

  if (!fs.existsSync(databasePath)) {

    const initialDatabase = {
      absensi: []
    };

    fs.writeFileSync(
      databasePath,
      JSON.stringify(
        initialDatabase,
        null,
        2
      ),
      "utf8"
    );

    console.log(
      "Database.json belum ada."
    );

    console.log(
      "Database baru berhasil dibuat."
    );

  }

}


// Jalankan pengecekan database
initializeDatabase();


// ========================================
// BACA DATABASE
// ========================================

function readDatabase() {

  try {

    const file =
      fs.readFileSync(
        databasePath,
        "utf8"
      );

    return JSON.parse(file);

  } catch (error) {

    console.error(
      "Gagal membaca database:",
      error.message
    );

    return {
      absensi: []
    };

  }

}


// ========================================
// SIMPAN DATABASE
// ========================================

function saveDatabase(database) {

  try {

    fs.writeFileSync(
      databasePath,
      JSON.stringify(
        database,
        null,
        2
      ),
      "utf8"
    );

    return true;

  } catch (error) {

    console.error(
      "Gagal menyimpan database:",
      error.message
    );

    return false;

  }

}


// ========================================
// ROUTE UTAMA
// ========================================

app.get("/", (req, res) => {

  res.json({

    status: true,

    message:
      "Backend XI TJKT 2 berjalan 🚀",

    database:
      "Connected",

    port:
      PORT

  });

});


// ========================================
// GET SEMUA DATA ABSENSI
// ========================================

app.get(
  "/api/absensi",
  (req, res) => {

    const database =
      readDatabase();

    res.json({

      status: true,

      data:
        database.absensi

    });

  }
);


// ========================================
// TAMBAH DATA ABSENSI
// ========================================

app.post(
  "/api/absensi",
  (req, res) => {

    try {

      const {
        nama,
        kelas,
        status
      } = req.body;


      // Validasi

      if (!nama || !status) {

        return res.status(400).json({

          status: false,

          message:
            "Nama dan status wajib diisi"

        });

      }


      const database =
        readDatabase();


      // Data absensi baru

      const absensiBaru = {

        id:
          Date.now(),

        nama:
          String(nama),

        kelas:
          kelas
            ? String(kelas)
            : "XI TJKT 2",

        status:
          String(status),

        tanggal:
          new Date().toISOString()

      };


      // Masukkan ke database

      database.absensi.push(
        absensiBaru
      );


      // Simpan

      const berhasil =
        saveDatabase(database);


      if (!berhasil) {

        return res.status(500).json({

          status: false,

          message:
            "Gagal menyimpan data absensi"

        });

      }


      res.status(201).json({

        status: true,

        message:
          "Absensi berhasil disimpan",

        data:
          absensiBaru

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        status: false,

        message:
          "Terjadi kesalahan pada server"

      });

    }

  }
);


// ========================================
// HAPUS DATA ABSENSI
// ========================================

app.delete(
  "/api/absensi/:id",
  (req, res) => {

    try {

      const id =
        Number(req.params.id);


      const database =
        readDatabase();


      const jumlahSebelum =
        database.absensi.length;


      database.absensi =
        database.absensi.filter(
          (item) =>
            item.id !== id
        );


      // Data tidak ditemukan

      if (
        database.absensi.length ===
        jumlahSebelum
      ) {

        return res.status(404).json({

          status: false,

          message:
            "Data absensi tidak ditemukan"

        });

      }


      // Simpan perubahan

      const berhasil =
        saveDatabase(database);


      if (!berhasil) {

        return res.status(500).json({

          status: false,

          message:
            "Gagal menyimpan perubahan"

        });

      }


      res.json({

        status: true,

        message:
          "Data absensi berhasil dihapus"

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        status: false,

        message:
          "Terjadi kesalahan pada server"

      });

    }

  }
);


// ========================================
// CEK JUMLAH ABSENSI
// ========================================

app.get(
  "/api/absensi/count",
  (req, res) => {

    const database =
      readDatabase();


    res.json({

      status: true,

      total:
        database.absensi.length

    });

  }
);


// ========================================
// 404
// ========================================

app.use(
  (req, res) => {

    res.status(404).json({

      status: false,

      message:
        "Endpoint tidak ditemukan"

    });

  }
);


// ========================================
// ERROR HANDLER
// ========================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    console.error(
      "Server Error:",
      error
    );


    res.status(500).json({

      status: false,

      message:
        "Terjadi kesalahan pada server"

    });

  }
);


// ========================================
// START SERVER
// ========================================

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log("");

    console.log(
      "========================================"
    );

    console.log(
      "       XI TJKT 2 - BACKEND"
    );

    console.log(
      "========================================"
    );

    console.log(
      `Server : http://localhost:${PORT}`
    );

    console.log(
      `API    : http://localhost:${PORT}/api/absensi`
    );

    console.log(
      `Database : ${databasePath}`
    );

    console.log(
      "========================================"
    );

    console.log(
      "Backend siap digunakan 🚀"
    );

    console.log("");

  }
);