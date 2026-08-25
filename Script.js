/* =========================================
   XI TJKT 2 - CLASS PORTAL
   SCRIPT.JS
========================================= */


/* =========================================
   DATA SISWA
========================================= */

const students = [
  "Afdal Maulana Febrian",
  "Alisya Nur Fajriah",
  "Almuzaki Yansyah",
  "Ardan Bi Adhar",
  "Arya Rizal Setiawan",
  "Barry Alfian Nubarok",
  "Bintan Senja Nur Adinda",
  "Candra Winata",
  "Delia Azzahra",
  "Dillah Umairoh",
  "Fahira Azrin Evelyna Putri",
  "Fajar Tawakal",
  "Farhan Putra Karsono",
  "Handriyansah",
  "Ilham Adi Saputra",
  "Ilyas Azis",
  "Lucky Kim",
  "Lutfi Khairul Anwar",
  "Moch. Tubagus Helmi",
  "Muhamad Kamal Maulana D.P.",
  "Muhammad Fiky Fauzan",
  "Muhammad Maulana Rizky",
  "Muhammad Rezky Pradhita",
  "Nabila Nurul Mozayyanah",
  "Raihan Ramdani",
  "Rais Trisnandar",
  "Rama Dermawan",
  "Ramdani",
  "Revandra Octa Anggara",
  "Reza Ripandi",
  "Rifki Hariyanto",
  "Rizky Suwandi Fahrezi",
  "Ryamizard Tangguh Prabandaru",
  "Wina Putri Maharani",
  "Zaskia Adya Rhiskheiya",
  "Zedhyasa Yudha Buana"
];


/* =========================================
   GLOBAL
========================================= */

let attendanceData = {};


const pageTitles = {

  dashboard:
    "Dashboard",

  students:
    "Daftar Siswa",

  schedule:
    "Jadwal Pelajaran",

  attendance:
    "Absensi XI TJKT 2",

  statistics:
    "Statistik",

  major:
    "Tentang TJKT",

  homeroom:
    "Wali Kelas",

  notifications:
    "Notifikasi"

};


/* =========================================
   DOM READY
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    setupNavigation();

    setupSidebar();

    setupStudents();

    setupAttendance();

    setupSearch();

    setupNotifications();

    setToday();

    loadAttendance();

    updateAttendance();

    updateStudentCount();

  }
);


/* =========================================
   NAVIGATION
========================================= */

function setupNavigation() {

  const navItems =
    document.querySelectorAll(
      ".nav-item"
    );


  const pages =
    document.querySelectorAll(
      ".page"
    );


  const pageTitle =
    document.getElementById(
      "pageTitle"
    );


  navItems.forEach(item => {

    item.addEventListener(
      "click",
      () => {

        const target =
          item.dataset.page;


        if (!target) return;


        navItems.forEach(nav => {

          nav.classList.remove(
            "active"
          );

        });


        item.classList.add(
          "active"
        );


        pages.forEach(page => {

          page.classList.remove(
            "active"
          );

        });


        const targetPage =
          document.getElementById(
            target
          );


        if (targetPage) {

          targetPage.classList.add(
            "active"
          );

        }


        if (pageTitle) {

          pageTitle.textContent =
            pageTitles[target] ||
            "XI TJKT 2";

        }


        window.scrollTo({

          top: 0,

          behavior: "smooth"

        });


        closeSidebar();

      }

    );

  });

}


/* =========================================
   SIDEBAR MOBILE
========================================= */

function setupSidebar() {

  const menuBtn =
    document.getElementById(
      "menuBtn"
    );


  const sidebar =
    document.getElementById(
      "sidebar"
    );


  if (!menuBtn || !sidebar)
    return;


  menuBtn.addEventListener(
    "click",
    () => {

      sidebar.classList.toggle(
        "open"
      );

    }
  );

}


function closeSidebar() {

  const sidebar =
    document.getElementById(
      "sidebar"
    );


  if (sidebar) {

    sidebar.classList.remove(
      "open"
    );

  }

}


/* =========================================
   DAFTAR SISWA
========================================= */

function setupStudents() {

  const table =
    document.getElementById(
      "studentTable"
    );


  if (!table) return;


  renderStudents(
    students
  );

}


function renderStudents(list) {

  const table =
    document.getElementById(
      "studentTable"
    );


  if (!table) return;


  table.innerHTML = "";


  list.forEach(
    (name) => {

      const row =
        document.createElement(
          "tr"
        );


      row.innerHTML = `

        <td>
          ${students.indexOf(name) + 1}
        </td>

        <td class="student-name">
          ${escapeHTML(name)}
        </td>

        <td>
          XI TJKT 2
        </td>

        <td>
          <span class="status status-belum">
            Aktif
          </span>
        </td>

      `;


      table.appendChild(
        row
      );

    }
  );

}


/* =========================================
   SEARCH SISWA
========================================= */

function setupSearch() {

  const search =
    document.getElementById(
      "studentSearch"
    );


  if (!search) return;


  search.addEventListener(
    "input",
    () => {

      const keyword =
        search.value
          .toLowerCase()
          .trim();


      const filtered =
        students.filter(
          name =>
            name
              .toLowerCase()
              .includes(keyword)
        );


      renderStudents(
        filtered
      );

    }
  );

}


/* =========================================
   ABSENSI
========================================= */

function setupAttendance() {

  const table =
    document.getElementById(
      "attendanceTable"
    );


  if (!table) return;


  renderAttendance();


  const dateInput =
    document.getElementById(
      "attendanceDate"
    );


  if (dateInput) {

    dateInput.addEventListener(
      "change",
      () => {

        loadAttendance();

        renderAttendance();

        updateAttendance();

      }
    );

  }


  const saveBtn =
    document.getElementById(
      "saveAttendance"
    );


  if (saveBtn) {

    saveBtn.addEventListener(
      "click",
      () => {

        saveAttendance();

        showToast(
          "Absensi berhasil disimpan"
        );

      }
    );

  }


  const allPresent =
    document.getElementById(
      "allPresent"
    );


  if (allPresent) {

    allPresent.addEventListener(
      "click",
      () => {

        markAllPresent();

      }
    );

  }

}


/* =========================================
   RENDER ABSENSI
========================================= */

function renderAttendance() {

  const table =
    document.getElementById(
      "attendanceTable"
    );


  if (!table) return;


  table.innerHTML = "";


  students.forEach(
    (name, index) => {

      const current =
        attendanceData[index] ||
        "";


      const row =
        document.createElement(
          "tr"
        );


      row.innerHTML = `

        <td>
          ${index + 1}
        </td>


        <td>

          <span class="student-name">
            ${escapeHTML(name)}
          </span>

        </td>


        <td>

          <input
            type="radio"
            class="attendance-radio"
            name="student-${index}"
            value="Hadir"
            data-index="${index}"
            ${current === "Hadir"
              ? "checked"
              : ""}
          >

        </td>


        <td>

          <input
            type="radio"
            class="attendance-radio"
            name="student-${index}"
            value="Sakit"
            data-index="${index}"
            ${current === "Sakit"
              ? "checked"
              : ""}
          >

        </td>


        <td>

          <input
            type="radio"
            class="attendance-radio"
            name="student-${index}"
            value="Izin"
            data-index="${index}"
            ${current === "Izin"
              ? "checked"
              : ""}
          >

        </td>


        <td>

          <input
            type="radio"
            class="attendance-radio"
            name="student-${index}"
            value="Alpa"
            data-index="${index}"
            ${current === "Alpa"
              ? "checked"
              : ""}
          >

        </td>

      `;


      table.appendChild(
        row
      );

    }
  );


  const radios =
    document.querySelectorAll(
      ".attendance-radio"
    );


  radios.forEach(
    radio => {

      radio.addEventListener(
        "change",
        event => {

          const index =
            Number(
              event.target
                .dataset
                .index
            );


          attendanceData[index] =
            event.target.value;


          updateAttendance();

        }
      );

    }
  );

}


/* =========================================
   TANGGAL HARI INI
========================================= */

function setToday() {

  const input =
    document.getElementById(
      "attendanceDate"
    );


  if (!input) return;


  if (!input.value) {

    const today =
      new Date();


    const year =
      today.getFullYear();


    const month =
      String(
        today.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const day =
      String(
        today.getDate()
      ).padStart(
        2,
        "0"
      );


    input.value =
      `${year}-${month}-${day}`;

  }

}


/* =========================================
   STORAGE KEY
========================================= */

function getStorageKey() {

  const dateInput =
    document.getElementById(
      "attendanceDate"
    );


  const date =
    dateInput?.value ||
    "default";


  return (
    `xi-tjkt-2-attendance-${date}`
  );

}


/* =========================================
   LOAD ABSENSI
========================================= */

function loadAttendance() {

  const key =
    getStorageKey();


  const saved =
    localStorage.getItem(
      key
    );


  if (saved) {

    try {

      attendanceData =
        JSON.parse(
          saved
        );

    }

    catch {

      attendanceData = {};

    }

  }

  else {

    attendanceData = {};

  }


  renderAttendance();

  updateAttendance();

}


/* =========================================
   SAVE ABSENSI
========================================= */

function saveAttendance() {

  const key =
    getStorageKey();


  localStorage.setItem(
    key,
    JSON.stringify(
      attendanceData
    )
  );


  updateAttendance();

}


/* =========================================
   SEMUA HADIR
========================================= */

function markAllPresent() {

  attendanceData = {};


  students.forEach(
    (_, index) => {

      attendanceData[index] =
        "Hadir";

    }
  );


  renderAttendance();

  updateAttendance();


  showToast(
    "Semua siswa ditandai hadir"
  );

}


/* =========================================
   UPDATE ABSENSI
========================================= */

function updateAttendance() {

  let hadir = 0;

  let sakit = 0;

  let izin = 0;

  let alpa = 0;

  let belum = 0;


  students.forEach(
    (_, index) => {

      const status =
        attendanceData[index];


      switch (status) {

        case "Hadir":

          hadir++;

          break;


        case "Sakit":

          sakit++;

          break;


        case "Izin":

          izin++;

          break;


        case "Alpa":

          alpa++;

          break;


        default:

          belum++;

      }

    }
  );


  setText(
    "summaryHadir",
    hadir
  );


  setText(
    "summarySakit",
    sakit
  );


  setText(
    "summaryIzin",
    izin
  );


  setText(
    "summaryAlpa",
    alpa
  );


  setText(
    "summaryBelum",
    belum
  );


  setText(
    "totalHadir",
    hadir
  );


  setText(
    "statHadir",
    hadir
  );


  setText(
    "statIzin",
    izin
  );


  setText(
    "statAlpa",
    alpa
  );


  const total =
    students.length;


  updateProgress(
    "hadirPercent",
    "hadirProgress",
    hadir,
    total
  );


  updateProgress(
    "sakitPercent",
    "sakitProgress",
    sakit,
    total
  );


  updateProgress(
    "izinPercent",
    "izinProgress",
    izin,
    total
  );


  updateProgress(
    "alpaPercent",
    "alpaProgress",
    alpa,
    total
  );

}


/* =========================================
   UPDATE JUMLAH SISWA
========================================= */

function updateStudentCount() {

  setText(
    "totalStudents",
    students.length
  );

}


/* =========================================
   PROGRESS
========================================= */

function updateProgress(
  textId,
  barId,
  value,
  total
) {

  const percent =
    total > 0
      ? Math.round(
          (value / total) * 100
        )
      : 0;


  setText(
    textId,
    `${percent}%`
  );


  const bar =
    document.getElementById(
      barId
    );


  if (bar) {

    bar.style.width =
      `${percent}%`;

  }

}


/* =========================================
   NOTIFIKASI
========================================= */

function setupNotifications() {

  const button =
    document.getElementById(
      "notificationBtn"
    );


  if (!button) return;


  button.addEventListener(
    "click",
    () => {

      openPage(
        "notifications"
      );

    }
  );

}


/* =========================================
   BUKA HALAMAN
========================================= */

function openPage(target) {

  const pages =
    document.querySelectorAll(
      ".page"
    );


  const navItems =
    document.querySelectorAll(
      ".nav-item"
    );


  pages.forEach(
    page => {

      page.classList.remove(
        "active"
      );

    }
  );


  navItems.forEach(
    item => {

      item.classList.remove(
        "active"
      );

    }
  );


  const targetPage =
    document.getElementById(
      target
    );


  const targetNav =
    document.querySelector(
      `.nav-item[data-page="${target}"]`
    );


  if (targetPage) {

    targetPage.classList.add(
      "active"
    );

  }


  if (targetNav) {

    targetNav.classList.add(
      "active"
    );

  }


  setText(
    "pageTitle",
    pageTitles[target] ||
    "XI TJKT 2"
  );


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });


  closeSidebar();

}


/* =========================================
   BUKA TENTANG TJKT
========================================= */

function openMajorPage() {

  openPage(
    "major"
  );

}


/* =========================================
   BUKA WALI KELAS
========================================= */

function openHomeroomPage() {

  openPage(
    "homeroom"
  );

}


/* =========================================
   TOAST
========================================= */

function showToast(message) {

  const toast =
    document.getElementById(
      "toast"
    );


  const toastMessage =
    document.getElementById(
      "toastMessage"
    );


  if (!toast) return;


  if (toastMessage) {

    toastMessage.textContent =
      message;

  }


  toast.classList.add(
    "show"
  );


  setTimeout(
    () => {

      toast.classList.remove(
        "show"
      );

    },
    2500
  );

}


/* =========================================
   HELPER TEXT
========================================= */

function setText(
  id,
  value
) {

  const element =
    document.getElementById(
      id
    );


  if (element) {

    element.textContent =
      value;

  }

}


/* =========================================
   SECURITY / HTML ESCAPE
========================================= */

function escapeHTML(text) {

  return String(text)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}