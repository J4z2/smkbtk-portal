/*
 * SMK Bandar Tasik Kesuma — v12 source package
 * Classic script: global functions support the existing inline HTML handlers.
 * Keep at the end of index.html; no build step or JavaScript modules required.
 * Original demo logic is preserved. See README.md and docs/PROTOTYPE-NOTES.md.
 */

// Configuration and demo session state
const KEY = "smk-seri-bestari-coex-v7-fixed";
const today = "2026-07-10";
let role = "parent";
let currentUser = null;
let selectedChildId = "SMK2026-001";
let teacherSelectedStudent = "SMK2026-002";
let teacherGradeFilterSubject = "Bahasa Melayu";
let teacherGradeFilterGrade = "all";
let superGradeFilterSubject = "Bahasa Melayu";
let superGradeFilterGrade = "all";
let superGradeFilterForm = "all";
let photoData = "";

// Original demo records
const seed = {
  school: {
    name: "SMK Bandar Tasik Kesuma",
    session: "2026",
    term: "Penggal 1",
    classes: [
      { id: "5M", name: "Tingkatan 5 Melor" },
      { id: "5A", name: "Tingkatan 5 Anggerik" },
      { id: "4M", name: "Tingkatan 4 Melor" },
    ],
    subjects: [
      "Bahasa Melayu",
      "Bahasa Inggeris",
      "Matematik",
      "Sains",
      "Sejarah",
      "Pendidikan Islam",
    ],
    activities: ["Badminton", "Kelab STEM", "Kadet Remaja Sekolah"],
  },
  accounts: {
    parents: [
      {
        id: "P001",
        name: "Puan Noraini Binti Ismail",
        email: "parent@smkseribestari.edu.my",
        phone: "012-888 7312",
        password: "parent123",
        childIds: ["SMK2026-001", "SMK2026-004"],
        address: "Taman Ayer Keroh Heights, Melaka",
      },
    ],
    teachers: [
      {
        id: "T001",
        name: "Norlila binti omar",
        email: "guru@smkseribestari.edu.my",
        password: "guru123",
        roles: ["Guru Kelas", "Guru Bahasa Melayu"],
        classes: ["5M"],
        subjects: ["Bahasa Melayu"],
        canAttendance: true,
        active: true,
      },
      {
        id: "T002",
        name: "Encik Hafiz Bin Rahman",
        email: "hafiz@smkseribestari.edu.my",
        password: "hafiz123",
        roles: ["Guru Matematik"],
        classes: ["5M", "5A"],
        subjects: ["Matematik"],
        canAttendance: false,
        active: true,
      },
    ],
    super: [
      {
        id: "SA001",
        name: "Super Admin Sekolah",
        email: "admin@smkseribestari.edu.my",
        password: "admin123",
      },
    ],
  },
  students: [
    {
      id: "SMK2026-001",
      name: "Aisyah Sofea Binti Ahmad",
      classId: "5M",
      guardianId: "P001",
      guardian: "Puan Noraini Binti Ismail",
      guardianPhone: "012-888 7312",
      photo: "",
      status: "active",
      gender: "Perempuan",
      attendanceEntries: {
        "2026-06-01": "P",
        "2026-06-02": "P",
        "2026-06-03": "P",
        "2026-06-04": "P",
        "2026-06-05": "P",
        "2026-06-08": "P",
        "2026-06-09": "P",
        "2026-06-10": "P",
        "2026-06-11": "P",
        "2026-06-12": "P",
        "2026-06-15": "P",
        "2026-06-16": "P",
        "2026-06-17": "P",
        "2026-06-18": "P",
        "2026-06-19": "P",
        "2026-06-22": "P",
        "2026-06-23": "L",
        "2026-06-24": "P",
        "2026-06-25": "P",
        "2026-06-26": "P",
        "2026-06-29": "P",
        "2026-06-30": "P",
      },
      attendanceNotes: { "2026-06-23": "Lewat kerana urusan klinik" },
      scores: {
        "Bahasa Melayu": 88,
        "Bahasa Inggeris": 80,
        "Matematik": 75,
        "Sains": 91,
        "Sejarah": 83,
        "Pendidikan Islam": 86,
      },
      co: 78,
      activities: [
        {
          name: "Badminton",
          detail: "Naib Johan, Kejohanan Badminton MSSD",
          score: 82,
          status: "Perak",
        },
        {
          name: "Kelab STEM",
          detail: "Menyertai pertandingan inovasi sekolah",
          score: 76,
          status: "Aktif",
        },
        {
          name: "Kadet Remaja Sekolah",
          detail: "Kehadiran latihan mingguan yang baik",
          score: 75,
          status: "Hadir",
        },
      ],
      comment:
        "Menunjukkan komitmen yang baik dalam kelas dan aktiviti sekolah.",
      discipline: "Tiada rekod disiplin",
      support:
        "Kekalkan latihan Matematik selama 20 minit, tiga kali seminggu.",
      report: {
        session: "2026",
        term: "Penggal 1",
        status: "published",
        submittedAt: "2026-06-28T10:20:00",
        approvedAt: "2026-06-29T09:15:00",
        publishedAt: "2026-06-30T08:30:00",
        approvedBy: "Super Admin Sekolah",
      },
      history: [
        { term: "Penggal 3 2025", avg: 80, attendance: 93, co: 74 },
        { term: "Penggal 2 2025", avg: 77, attendance: 91, co: 71 },
      ],
    },
    {
      id: "SMK2026-004",
      name: "Adam Danish Bin Ahmad",
      classId: "5A",
      guardianId: "P001",
      guardian: "Puan Noraini Binti Ismail",
      guardianPhone: "012-888 7312",
      photo: "",
      status: "active",
      gender: "Lelaki",
      attendanceEntries: {
        "2026-06-01": "P",
        "2026-06-02": "P",
        "2026-06-03": "P",
        "2026-06-04": "P",
        "2026-06-05": "P",
        "2026-06-08": "P",
        "2026-06-09": "P",
        "2026-06-10": "P",
        "2026-06-11": "P",
        "2026-06-12": "MC",
        "2026-06-15": "P",
        "2026-06-16": "P",
        "2026-06-17": "P",
        "2026-06-18": "P",
        "2026-06-19": "P",
        "2026-06-22": "P",
        "2026-06-23": "P",
        "2026-06-24": "P",
        "2026-06-25": "P",
        "2026-06-26": "P",
        "2026-06-29": "P",
        "2026-06-30": "P",
      },
      attendanceNotes: { "2026-06-12": "Sijil cuti sakit diterima" },
      scores: {
        "Bahasa Melayu": 78,
        "Bahasa Inggeris": 72,
        "Matematik": 84,
        "Sains": 76,
        "Sejarah": 74,
        "Pendidikan Islam": 80,
      },
      co: 73,
      activities: [
        {
          name: "Bola Sepak",
          detail: "Mewakili rumah sukan sekolah",
          score: 78,
          status: "Aktif",
        },
        {
          name: "Kelab Robotik",
          detail: "Menyertai bengkel asas robotik",
          score: 70,
          status: "Aktif",
        },
        {
          name: "Pengakap",
          detail: "Melengkapkan latihan asas",
          score: 71,
          status: "Hadir",
        },
      ],
      comment:
        "Mempunyai potensi yang baik. Perlu terus meningkatkan ketelitian dalam tugasan bertulis.",
      discipline: "Tiada rekod disiplin",
      support: "Galakkan semakan kerja bertulis sebelum dihantar.",
      report: {
        session: "2026",
        term: "Penggal 1",
        status: "published",
        submittedAt: "2026-06-28T10:20:00",
        approvedAt: "2026-06-29T09:15:00",
        publishedAt: "2026-06-30T08:30:00",
        approvedBy: "Super Admin Sekolah",
      },
      history: [
        { term: "Penggal 3 2025", avg: 76, attendance: 90, co: 69 },
        { term: "Penggal 2 2025", avg: 73, attendance: 89, co: 67 },
      ],
    },
    {
      id: "SMK2026-002",
      name: "Muhammad Irfan Bin Zulkifli",
      classId: "5M",
      guardianId: "P002",
      guardian: "Encik Zulkifli Bin Omar",
      guardianPhone: "012-977 2031",
      photo: "",
      status: "active",
      gender: "Lelaki",
      attendanceEntries: {
        "2026-06-01": "P",
        "2026-06-02": "P",
        "2026-06-03": "A",
        "2026-06-04": "P",
        "2026-06-05": "P",
        "2026-06-08": "P",
        "2026-06-09": "A",
        "2026-06-10": "P",
        "2026-06-11": "P",
        "2026-06-12": "P",
        "2026-06-15": "P",
        "2026-06-16": "P",
        "2026-06-17": "P",
        "2026-06-18": "P",
        "2026-06-19": "P",
        "2026-06-22": "P",
        "2026-06-23": "P",
        "2026-06-24": "P",
        "2026-06-25": "P",
        "2026-06-26": "P",
        "2026-06-29": "P",
        "2026-06-30": "P",
      },
      attendanceNotes: {
        "2026-06-03": "Tiada makluman",
        "2026-06-09": "Urusan keluarga",
      },
      scores: {
        "Bahasa Melayu": 73,
        "Bahasa Inggeris": 76,
        "Matematik": 82,
        "Sains": 79,
        "Sejarah": 70,
        "Pendidikan Islam": 77,
      },
      co: 72,
      activities: [
        {
          name: "Sepak Takraw",
          detail: "Latihan pasukan sekolah",
          score: 79,
          status: "Aktif",
        },
        {
          name: "Kelab Bahasa",
          detail: "Penglibatan biasa",
          score: 69,
          status: "Aktif",
        },
      ],
      comment: "Perlu meningkatkan fokus semasa sesi ulang kaji.",
      discipline: "Tiada rekod disiplin",
      support: "Perlu hadir sesi bimbingan Matematik mingguan.",
      report: {
        session: "2026",
        term: "Penggal 1",
        status: "submitted",
        submittedAt: "2026-07-05T14:10:00",
      },
      history: [{ term: "Penggal 3 2025", avg: 74, attendance: 88, co: 70 }],
    },
    {
      id: "SMK2026-003",
      name: "Siti Nur Balqis Binti Rahim",
      classId: "5M",
      guardianId: "P003",
      guardian: "Puan Rahimah Binti Hassan",
      guardianPhone: "013-463 7012",
      photo: "",
      status: "active",
      gender: "Perempuan",
      attendanceEntries: {
        "2026-06-01": "P",
        "2026-06-02": "P",
        "2026-06-03": "P",
        "2026-06-04": "P",
        "2026-06-05": "P",
        "2026-06-08": "P",
        "2026-06-09": "P",
        "2026-06-10": "P",
        "2026-06-11": "P",
        "2026-06-12": "P",
        "2026-06-15": "P",
        "2026-06-16": "P",
        "2026-06-17": "P",
        "2026-06-18": "P",
        "2026-06-19": "P",
        "2026-06-22": "P",
        "2026-06-23": "P",
        "2026-06-24": "P",
        "2026-06-25": "P",
        "2026-06-26": "P",
        "2026-06-29": "P",
        "2026-06-30": "P",
      },
      attendanceNotes: {},
      scores: {
        "Bahasa Melayu": 90,
        "Bahasa Inggeris": 87,
        "Matematik": 88,
        "Sains": 92,
        "Sejarah": 86,
        "Pendidikan Islam": 91,
      },
      co: 85,
      activities: [
        {
          name: "Badminton",
          detail: "Mewakili daerah",
          score: 90,
          status: "Emas",
        },
        {
          name: "Kelab STEM",
          detail: "Ketua projek inovasi",
          score: 84,
          status: "Aktif",
        },
      ],
      comment: "Sangat aktif dan memberi kerjasama yang baik dalam kelas.",
      discipline: "Tiada rekod disiplin",
      support: "Teruskan kepimpinan positif dalam aktiviti kelas.",
      report: { session: "2026", term: "Penggal 1", status: "draft" },
      history: [{ term: "Penggal 3 2025", avg: 86, attendance: 96, co: 81 }],
    },
  ],
  announcements: [
    {
      id: "ANN-001",
      title: "Laporan Penggal 1 telah diterbitkan",
      body: "Ibu bapa boleh menyemak dan mencetak laporan anak melalui portal mulai 30 Jun 2026.",
      category: "Akademik",
      date: "2026-06-30",
    },
    {
      id: "ANN-002",
      title: "Hari Perjumpaan Ibu Bapa dan Guru",
      body: "Tempahan slot dibuka untuk 18 Julai 2026. Sila pilih slot yang bersesuaian dalam portal.",
      category: "Perjumpaan",
      date: "2026-07-02",
    },
    {
      id: "ANN-003",
      title: "Cuti tambahan negeri",
      body: "Sekolah akan ditutup pada 12 Julai 2026. Kelas bersambung seperti biasa pada 13 Julai.",
      category: "Makluman",
      date: "2026-07-03",
    },
  ],
  meetings: [],
  audit: [
    {
      id: "AUD-001",
      at: "2026-07-06T09:12:00",
      actor: "Super Admin Sekolah",
      action: "Menyemak status operasi sistem.",
      type: "info",
    },
    {
      id: "AUD-002",
      at: "2026-07-05T14:10:00",
      actor: "Norlila binti omar",
      action: "Menghantar laporan Muhammad Irfan Bin Zulkifli untuk semakan.",
      type: "green",
    },
    {
      id: "AUD-003",
      at: "2026-06-30T08:30:00",
      actor: "Super Admin Sekolah",
      action: "Menerbitkan laporan Penggal 1 untuk Aisyah Sofea Binti Ahmad.",
      type: "gold",
    },
  ],
  absenceRequests: [],
  consent: {
    privacyPolicy: true,
    guardianConsent: true,
    lastReview: "2026-01-05",
  },
};

// Tingkatan 1–6 demo migration and subject profiles
const FORM_CLASS_BLUEPRINTS = [
  { id: "1A", name: "Tingkatan 1 Amanah", form: 1, band: "lower" },
  { id: "2B", name: "Tingkatan 2 Bestari", form: 2, band: "lower" },
  { id: "3C", name: "Tingkatan 3 Cemerlang", form: 3, band: "lower" },
  { id: "4M", name: "Tingkatan 4 Melor", form: 4, band: "upper" },
  { id: "5M", name: "Tingkatan 5 Melor", form: 5, band: "upper" },
  { id: "5A", name: "Tingkatan 5 Anggerik", form: 5, band: "upper" },
  { id: "6R", name: "Tingkatan 6 Rendah", form: 6, band: "form6" },
  { id: "6A", name: "Tingkatan 6 Atas", form: 6, band: "form6" },
];
const FORM_SUBJECTS = {
  lower: [
    "Bahasa Melayu",
    "Bahasa Inggeris",
    "Matematik",
    "Sains",
    "Sejarah",
    "Geografi",
    "Reka Bentuk dan Teknologi",
    "Pendidikan Islam",
  ],
  upper: [
    "Bahasa Melayu",
    "Bahasa Inggeris",
    "Matematik",
    "Sains",
    "Sejarah",
    "Pendidikan Islam",
  ],
  form6: [
    "Pengajian Am",
    "Bahasa Melayu",
    "MUET",
    "Sejarah",
    "Ekonomi",
    "Geografi",
  ],
};
function rawClassBand(d, classId) {
  const c = d.school.classes.find((x) => x.id === classId);
  return (
    c?.band ||
    (Number(c?.form) <= 3 ? "lower" : Number(c?.form) === 6 ? "form6" : "upper")
  );
}
function rawSubjectsForClass(d, classId) {
  return [
    ...(d.school.subjectProfiles?.[rawClassBand(d, classId)] ||
      d.school.subjects ||
      []),
  ];
}
function makeDemoScores(subjects, base, step = 3) {
  return Object.fromEntries(
    subjects.map((s, i) => [
      s,
      Math.max(35, Math.min(96, base + ((i % 4) - 1) * step)),
    ]),
  );
}
function makeDemoStudent(id, name, classId, guardianId, guardian, phone, base) {
  const subjects = rawSubjectsForClass(
    {
      school: {
        classes: FORM_CLASS_BLUEPRINTS,
        subjectProfiles: FORM_SUBJECTS,
        subjects: [],
      },
    },
    classId,
  );
  return {
    id,
    name,
    classId,
    guardianId,
    guardian,
    guardianPhone: phone,
    photo: "",
    status: "active",
    gender:
      name.includes("Nur") || name.includes("Alya") ? "Perempuan" : "Lelaki",
    attendanceEntries: {
      "2026-06-01": "P",
      "2026-06-02": "P",
      "2026-06-03": "P",
      "2026-06-04": "P",
      "2026-06-05": "P",
      "2026-06-08": "P",
      "2026-06-09": "P",
      "2026-06-10": "P",
    },
    attendanceNotes: {},
    scores: makeDemoScores(subjects, base),
    co: Math.max(55, base - 4),
    activities: [
      {
        name: "Aktiviti sekolah",
        detail: "Penglibatan mengikut peringkat tingkatan",
        score: Math.max(55, base - 4),
        status: "Aktif",
      },
    ],
    comment:
      "Menunjukkan perkembangan yang konsisten mengikut tahap pembelajaran.",
    discipline: "Tiada rekod disiplin",
    support: "Teruskan latihan berkala dan semakan bersama guru.",
    report: {
      session: "2026",
      term: "Penggal 1",
      status: "published",
      submittedAt: "2026-06-28T10:20:00",
      approvedAt: "2026-06-29T09:15:00",
      publishedAt: "2026-06-30T08:30:00",
      approvedBy: "Super Admin Sekolah",
    },
    history: [
      {
        term: "Penggal terdahulu",
        avg: Math.max(35, base - 5),
        attendance: 92,
        co: Math.max(50, base - 7),
      },
    ],
  };
}
function migratePortalData(d) {
  d.school = d.school || {};
  d.school.name = "SMK Bandar Tasik Kesuma";
  d.school.classes = Array.isArray(d.school.classes) ? d.school.classes : [];
  FORM_CLASS_BLUEPRINTS.forEach((bp) => {
    const c = d.school.classes.find((x) => x.id === bp.id);
    if (c) {
      c.form = Number(c.form || bp.form);
      c.band = c.band || bp.band;
    } else d.school.classes.push({ ...bp });
  });
  d.school.classes.sort(
    (a, b) =>
      Number(a.form || 99) - Number(b.form || 99) ||
      String(a.name).localeCompare(String(b.name), "ms"),
  );
  d.school.examTimeline = mergeExamTimeline(d.school.examTimeline);
  d.school.subjectProfiles =
    d.school.subjectProfiles || JSON.parse(JSON.stringify(FORM_SUBJECTS));
  Object.keys(FORM_SUBJECTS).forEach((k) => {
    d.school.subjectProfiles[k] = Array.from(
      new Set([...(d.school.subjectProfiles[k] || []), ...FORM_SUBJECTS[k]]),
    );
  });
  d.school.subjects = Array.from(
    new Set(Object.values(d.school.subjectProfiles).flat()),
  );
  d.accounts = d.accounts || { parents: [], teachers: [], super: [] };
  d.accounts.parents = d.accounts.parents || [];
  d.accounts.teachers = d.accounts.teachers || [];
  const mainTeacher = d.accounts.teachers.find((x) => x.id === "T001");
  if (mainTeacher) mainTeacher.name = "Norlila binti omar";
  (d.audit || []).forEach((x) => {
    if (x.actor === "Cikgu Farah Binti Salleh") x.actor = "Norlila binti omar";
  });
  const parentDefs = [
    {
      id: "P101",
      name: "Puan Salmah Binti Musa",
      email: "parent.lower@smkseribestari.edu.my",
      phone: "012-111 1101",
      password: "parent123",
      childIds: ["SMK2026-101", "SMK2026-201", "SMK2026-301"],
      address: "Melaka",
    },
    {
      id: "P401",
      name: "Encik Rahman Bin Idris",
      email: "parent.form4@smkseribestari.edu.my",
      phone: "012-444 4401",
      password: "parent123",
      childIds: ["SMK2026-401"],
      address: "Melaka",
    },
    {
      id: "P601",
      name: "Puan Mariam Binti Daud",
      email: "parent.form6@smkseribestari.edu.my",
      phone: "012-666 6601",
      password: "parent123",
      childIds: ["SMK2026-601"],
      address: "Melaka",
    },
  ];
  parentDefs.forEach((x) => {
    if (!d.accounts.parents.some((p) => p.id === x.id || p.email === x.email))
      d.accounts.parents.push(x);
  });
  const demos = [
    makeDemoStudent(
      "SMK2026-101",
      "Amir Hakim Bin Roslan",
      "1A",
      "P101",
      "Puan Salmah Binti Musa",
      "012-111 1101",
      68,
    ),
    makeDemoStudent(
      "SMK2026-201",
      "Nur Alya Binti Roslan",
      "2B",
      "P101",
      "Puan Salmah Binti Musa",
      "012-111 1101",
      74,
    ),
    makeDemoStudent(
      "SMK2026-301",
      "Danish Irfan Bin Roslan",
      "3C",
      "P101",
      "Puan Salmah Binti Musa",
      "012-111 1101",
      79,
    ),
    makeDemoStudent(
      "SMK2026-401",
      "Aqil Firdaus Bin Rahman",
      "4M",
      "P401",
      "Encik Rahman Bin Idris",
      "012-444 4401",
      71,
    ),
    makeDemoStudent(
      "SMK2026-601",
      "Nur Hanim Binti Daud",
      "6R",
      "P601",
      "Puan Mariam Binti Daud",
      "012-666 6601",
      77,
    ),
  ];
  demos.forEach((s) => {
    if (!d.students.some((x) => x.id === s.id)) d.students.push(s);
  });
  if (
    !d.accounts.teachers.some(
      (x) => x.email === "guru.demo@smkseribestari.edu.my",
    )
  )
    d.accounts.teachers.push({
      id: "T006",
      name: "Cikgu Demo Semua Tingkatan",
      email: "guru.demo@smkseribestari.edu.my",
      password: "guru123",
      roles: ["Guru Kelas"],
      classes: FORM_CLASS_BLUEPRINTS.map((x) => x.id),
      subjects: d.school.subjects.slice(),
      canAttendance: true,
      active: true,
    });
  d.students.forEach((s) => {
    s.status = s.status || "active";
    s.attendanceEntries = s.attendanceEntries || {};
    s.attendanceNotes = s.attendanceNotes || {};
    s.scores = s.scores || {};
    s.activities = s.activities || [];
    s.history = s.history || [];
    s.report = s.report || {
      session: d.school.session || "2026",
      term: d.school.term || "Penggal 1",
      status: "draft",
    };
  });
  return d;
}

// Browser persistence and demo reset
function clone(v) {
  return JSON.parse(JSON.stringify(v));
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    return migratePortalData(d && d.students ? d : clone(seed));
  } catch (e) {
    return migratePortalData(clone(seed));
  }
}
function data() {
  return window.__smkData || (window.__smkData = load());
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(data()));
  } catch (e) {
    window.__storageUnavailable = true;
  }
}
function resetDemo() {
  if (!confirm("Tetapkan semula semua data demo pada pelayar ini?")) return;
  window.__smkData = clone(seed);
  save();
  selectedChildId = "SMK2026-001";
  teacherSelectedStudent = "SMK2026-002";
  toast("Data demo telah ditetapkan semula.");
  refresh();
}
// Shared formatting, grades and analytics helpers
function esc(v) {
  return String(v ?? "").replace(
    /[&<>'"]/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        c
      ],
  );
}
function initials(name) {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();
}
function average(s) {
  const vals = Object.values(s.scores);
  return vals.length
    ? Math.round(vals.reduce((a, b) => a + Number(b), 0) / vals.length)
    : 0;
}
function grade(n) {
  return coexRule(n).grade;
}
function gradeClass(g) {
  return String(g).startsWith("A")
    ? ""
    : String(g).startsWith("B")
      ? "b"
      : String(g).startsWith("C")
        ? "c"
        : "d";
}
function gradeStarHtml(g) {
  if (["C", "C+", "B", "B+", "A-", "A"].includes(g))
    return '<span class="grade-star silver" aria-hidden="true">★</span>';
  if (g === "A+")
    return '<span class="grade-star gold" aria-hidden="true">★</span>';
  return "";
}
function gradeBadgeFromRule(rule, size = "") {
  const tone = toneForGear(rule.gear || 5);
  const extra = size ? ` ${size}` : "";
  return `<span class="grade-pill${extra}" style="--grade-bg:${tone.color};--grade-fg:${tone.fg || "#fff"}">${gradeStarHtml(rule.grade)}<span>${esc(rule.grade)}</span></span>`;
}
function gradeBadgeFromMark(mark, size = "") {
  return gradeBadgeFromRule(coexRule(Number(mark)), size);
}
function canonicalGradeOrder() {
  return ["A+", "A", "A-", "B+", "B", "C+", "C", "D", "E", "G"];
}
function subjectNamesFrom(students) {
  const set = new Set();
  students.forEach((s) =>
    Object.keys(s.scores || {}).forEach((sub) => set.add(sub)),
  );
  return [...set].sort((a, b) => a.localeCompare(b, "ms"));
}
function studentsByForm(students, form = "all") {
  return form === "all"
    ? students
    : students.filter((s) => String(formLevelOf(s)) === String(form));
}
function subjectGradeSummary(students, subject, form = "all") {
  const pool = studentsByForm(students, form).filter(
    (s) => s.active !== false && s.scores && s.scores[subject] != null,
  );
  const counts = Object.fromEntries(canonicalGradeOrder().map((g) => [g, 0]));
  pool.forEach((s) => {
    const g = grade(Number(s.scores[subject] || 0));
    counts[g] = (counts[g] || 0) + 1;
  });
  const avg = pool.length
    ? Math.round(
        pool.reduce((sum, s) => sum + Number(s.scores[subject] || 0), 0) /
          pool.length,
      )
    : 0;
  return { pool, counts, avg };
}
function filterStudentsBySubjectGrade(
  students,
  subject,
  gradeFilter = "all",
  form = "all",
) {
  const summary = subjectGradeSummary(students, subject, form);
  return gradeFilter === "all"
    ? summary.pool
    : summary.pool.filter(
        (s) => grade(Number(s.scores[subject] || 0)) === gradeFilter,
      );
}
function gradeOptionsHtml(selected = "all", includeAll = true) {
  const list = (includeAll ? [["all", "Semua gred"]] : []).concat(
    canonicalGradeOrder().map((g) => [g, g]),
  );
  return list
    .map(
      ([v, l]) =>
        `<option value="${v}" ${v === selected ? "selected" : ""}>${l}</option>`,
    )
    .join("");
}
function gradeChipRowHtml(counts, active = "all") {
  return `<div class="grade-chip-row">${canonicalGradeOrder()
    .map(
      (g) =>
        `<span class="grade-chip ${active === g ? "active" : ""}">${gradeBadgeFromRule({ grade: g, gear: (data().school?.coex?.rules || defaultCoexRules()).find((r) => r.grade === g)?.gear || 5 }, "small")}<b>${counts[g] || 0} murid</b></span>`,
    )
    .join("")}</div>`;
}
function analyticsStudentRowsHtml(students, subject, gradeFilter = "all") {
  const rows = filterStudentsBySubjectGrade(
    students,
    subject,
    gradeFilter,
  ).sort(
    (a, b) => Number(b.scores[subject] || 0) - Number(a.scores[subject] || 0),
  );
  return rows.length
    ? rows
        .map(
          (s) =>
            `<div class="analytics-row">${studentPhoto(s)}<div class="meta"><strong>${esc(s.name)}</strong><span>${esc(className(s.classId))} · ${esc(subject)} · ${gradeBadgeFromMark(s.scores[subject], "small")}</span></div><div class="score">${s.scores[subject]}%</div></div>`,
        )
        .join("")
    : '<div class="empty-state">Tiada murid padan dengan tapisan semasa.</div>';
}
function teacherGradeFilterSectionHtml(t, students) {
  const subjects = subjectNamesFrom(students);
  if (!subjects.length) return "";
  if (!subjects.includes(teacherGradeFilterSubject))
    teacherGradeFilterSubject = subjects[0];
  const summary = subjectGradeSummary(students, teacherGradeFilterSubject),
    matches = filterStudentsBySubjectGrade(
      students,
      teacherGradeFilterSubject,
      teacherGradeFilterGrade,
    );
  return `<section class="panel" style="margin-top:16px"><div class="panel-head"><div><h3>Penapisan murid mengikut gred subjek</h3><p class="panel-sub">Guru boleh tapis murid mengikut subjek dan gred untuk monitor kumpulan sasaran dengan lebih cepat.</p></div></div><div class="analytics-toolbar"><div class="field"><label>Pilih subjek</label><select onchange="teacherGradeFilterSubject=this.value;renderTeacher()">${subjects.map((sub) => `<option ${sub === teacherGradeFilterSubject ? "selected" : ""}>${esc(sub)}</option>`).join("")}</select></div><div class="field"><label>Pilih gred</label><select onchange="teacherGradeFilterGrade=this.value;renderTeacher()">${gradeOptionsHtml(teacherGradeFilterGrade, true)}</select></div></div><div class="analytics-mini-grid"><div class="analytics-mini-card"><span>Purata subjek</span><strong>${summary.avg}%</strong><small>${esc(teacherGradeFilterSubject)} untuk semua murid dalam akses guru</small></div><div class="analytics-mini-card"><span>Jumlah murid</span><strong>${summary.pool.length}</strong><small>Mempunyai markah bagi ${esc(teacherGradeFilterSubject)}</small></div><div class="analytics-mini-card"><span>Padanan tapisan</span><strong>${matches.length}</strong><small>${teacherGradeFilterGrade === "all" ? "Semua gred" : `Gred ${teacherGradeFilterGrade}`}</small></div><div class="analytics-mini-card"><span>Gred tertinggi</span><strong>${canonicalGradeOrder().find((g) => (summary.counts[g] || 0) > 0) || "-"}</strong><small>Gred terbaik yang wujud dalam subjek ini</small></div></div>${gradeChipRowHtml(summary.counts, teacherGradeFilterGrade)}<div class="grid-2" style="margin-top:16px"><section class="panel" style="margin:0"><div class="panel-head"><div><h3>Pecahan gred ${esc(teacherGradeFilterSubject)}</h3><p class="panel-sub">Bilangan murid bagi setiap gred untuk subjek ini.</p></div></div><div class="coex-table-wrap"><table class="report-table analytics-table"><thead><tr><th>Gred</th><th>Bilangan murid</th></tr></thead><tbody>${canonicalGradeOrder()
    .map(
      (g) =>
        `<tr><td>${gradeBadgeFromRule({ grade: g, gear: (data().school?.coex?.rules || defaultCoexRules()).find((r) => r.grade === g)?.gear || 5 }, "small")}</td><td>${summary.counts[g] || 0}</td></tr>`,
    )
    .join(
      "",
    )}</tbody></table></div><div class="analytics-note">Contoh bacaan: jika pilih Bahasa Melayu dan gred A, sistem akan tunjuk berapa ramai murid yang mendapat A dalam subjek tersebut beserta senarai murid.</div></section><section class="panel" style="margin:0"><div class="panel-head"><div><h3>Senarai murid padan tapisan</h3><p class="panel-sub">${teacherGradeFilterGrade === "all" ? "Semua murid" : "Murid dengan gred " + teacherGradeFilterGrade} untuk ${esc(teacherGradeFilterSubject)}.</p></div></div><div class="analytics-list">${analyticsStudentRowsHtml(students, teacherGradeFilterSubject, teacherGradeFilterGrade)}</div></section></div></section>`;
}
function superGradeAnalyticsSectionHtml(students) {
  const subjects = subjectNamesFrom(students);
  if (!subjects.length) return "";
  if (!subjects.includes(superGradeFilterSubject))
    superGradeFilterSubject = subjects[0];
  const summary = subjectGradeSummary(
      students,
      superGradeFilterSubject,
      superGradeFilterForm,
    ),
    matches = filterStudentsBySubjectGrade(
      students,
      superGradeFilterSubject,
      superGradeFilterGrade,
      superGradeFilterForm,
    ),
    forms = [1, 2, 3, 4, 5, 6].filter((f) =>
      students.some(
        (s) =>
          formLevelOf(s) === f &&
          s.scores &&
          s.scores[superGradeFilterSubject] != null,
      ),
    ),
    overallAvg = students.length
      ? Math.round(
          students.reduce((sum, s) => sum + average(s), 0) / students.length,
        )
      : 0;
  return `<section class="panel" style="margin-top:16px"><div class="panel-head"><div><h3>Analitik penuh data pelajar</h3><p class="panel-sub">Pentadbir boleh tapis subjek, tingkatan dan gred untuk melihat purata sekolah serta bilangan murid bagi setiap gred.</p></div></div><div class="analytics-toolbar analytics-toolbar-3"><div class="field"><label>Pilih subjek</label><select onchange="superGradeFilterSubject=this.value;renderSuper()">${subjects.map((sub) => `<option ${sub === superGradeFilterSubject ? "selected" : ""}>${esc(sub)}</option>`).join("")}</select></div><div class="field"><label>Filter tingkatan</label><select onchange="superGradeFilterForm=this.value;renderSuper()"><option value="all" ${superGradeFilterForm === "all" ? "selected" : ""}>Semua tingkatan</option>${[1, 2, 3, 4, 5, 6].map((f) => `<option value="${f}" ${String(superGradeFilterForm) === String(f) ? "selected" : ""}>Tingkatan ${f}</option>`).join("")}</select></div><div class="field"><label>Filter gred</label><select onchange="superGradeFilterGrade=this.value;renderSuper()">${gradeOptionsHtml(superGradeFilterGrade, true)}</select></div></div><div class="analytics-mini-grid"><div class="analytics-mini-card"><span>Purata satu sekolah</span><strong>${overallAvg}%</strong><small>Purata keseluruhan semua murid aktif di sekolah</small></div><div class="analytics-mini-card"><span>Purata subjek</span><strong>${summary.avg}%</strong><small>${esc(superGradeFilterSubject)} ${superGradeFilterForm === "all" ? "untuk semua tingkatan" : `bagi Tingkatan ${superGradeFilterForm}`}</small></div><div class="analytics-mini-card"><span>Jumlah murid ditapis</span><strong>${summary.pool.length}</strong><small>Mempunyai markah dalam skop tapisan semasa</small></div><div class="analytics-mini-card"><span>Padanan gred</span><strong>${matches.length}</strong><small>${superGradeFilterGrade === "all" ? "Semua gred" : `Gred ${superGradeFilterGrade}`}</small></div></div>${gradeChipRowHtml(summary.counts, superGradeFilterGrade)}<div class="grid-2" style="margin-top:16px"><section class="panel" style="margin:0"><div class="panel-head"><div><h3>Pecahan gred ikut tingkatan</h3><p class="panel-sub">Bilangan murid yang mendapat A, B, C dan gred lain bagi ${esc(superGradeFilterSubject)}.</p></div></div><div class="coex-table-wrap"><table class="report-table analytics-table"><thead><tr><th>Tingkatan</th><th>Bil murid</th><th>Purata</th>${canonicalGradeOrder()
    .map((g) => `<th>${g}</th>`)
    .join("")}</tr></thead><tbody>${forms
    .map((form) => {
      const d = subjectGradeSummary(
        students,
        superGradeFilterSubject,
        String(form),
      );
      return `<tr><td>Tingkatan ${form}</td><td>${d.pool.length}</td><td>${d.avg}%</td>${canonicalGradeOrder()
        .map((g) => `<td>${d.counts[g] || 0}</td>`)
        .join("")}</tr>`;
    })
    .join(
      "",
    )}<tr><td><strong>Keseluruhan</strong></td><td><strong>${summary.pool.length}</strong></td><td><strong>${summary.avg}%</strong></td>${canonicalGradeOrder()
    .map((g) => `<td><strong>${summary.counts[g] || 0}</strong></td>`)
    .join(
      "",
    )}</tr></tbody></table></div><div class="analytics-note">Section ini sesuai untuk pentadbir melihat purata satu sekolah dan mengenal pasti berapa ramai murid mendapat gred A, A-, B+, C dan seterusnya mengikut setiap subjek.</div></section><section class="panel" style="margin:0"><div class="panel-head"><div><h3>Senarai murid ikut tapisan</h3><p class="panel-sub">${superGradeFilterGrade === "all" ? "Semua murid" : "Murid dengan gred " + superGradeFilterGrade} bagi ${esc(superGradeFilterSubject)}${superGradeFilterForm === "all" ? "" : " · Tingkatan " + superGradeFilterForm}.</p></div></div><div class="analytics-list">${analyticsStudentRowsHtml(studentsByForm(students, superGradeFilterForm), superGradeFilterSubject, superGradeFilterGrade)}</div></section></div></section>`;
}

function subjectAlphabetList(s) {
  return Object.keys(s.scores)
    .slice()
    .sort((a, b) => a.localeCompare(b, "ms"))
    .map((sub) => `<span class="subject-chip"><i></i>${esc(sub)}</span>`)
    .join("");
}
function heroSubjectListHtml(s) {
  return Object.entries(s.scores)
    .sort((a, b) => a[0].localeCompare(b[0], "ms"))
    .map(([sub, mark]) => {
      const rule = coexRule(Number(mark)),
        tone = toneForGear(rule.gear);
      return `<div class="coex-subject-item"><div class="coex-subject-name"><strong>${esc(sub)}</strong><span>${esc(tone.name)} · Gear ${rule.gear}</span></div><div class="coex-subject-mark">${mark}%<small>${esc(rule.grade)}</small></div><div>${gradeBadgeFromRule(rule, "small")}</div></div>`;
    })
    .join("");
}
function trendGraphHtml(s) {
  const base = s.history
    .slice()
    .reverse()
    .map((h) => Number(h.avg));
  const current = average(s);
  const values = [
    Math.max(46, (base[0] || current) - 3),
    Math.max(50, base[0] || current - 2),
    Math.max(48, (base[1] || base[0] || current) - 4),
    Math.max(52, current - 8),
    Math.max(55, current - 4),
    Math.min(97, current + 2),
    current,
  ];
  const max = 100,
    min = 40,
    startX = 18,
    endX = 446,
    h = 100;
  const pts = values.map((v, i) => {
    const x = Math.round(startX + i * ((endX - startX) / (values.length - 1)));
    const y = Math.round(h - ((v - min) / (max - min)) * 68 - 18);
    return [x, Math.max(18, Math.min(86, y))];
  });
  const line = "M" + pts.map((p) => p.join(",")).join(" L");
  const area = `M${startX},100 L${pts.map((p) => p.join(",")).join(" L")} L${endX},100 Z`;
  const endPoint = pts[pts.length - 1];
  const bubbleX = Math.min(384, Math.max(294, endPoint[0] - 44));
  const subjects = Object.keys(s.scores).sort((a, b) =>
    a.localeCompare(b, "ms"),
  );
  return `<div class="trend-card"><svg viewBox="0 0 480 100" preserveAspectRatio="none" aria-label="Graf perkembangan akademik"><defs><linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#dbe8f6"></stop><stop offset="100%" stop-color="#edf3f9"></stop></linearGradient><filter id="carShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#19324f" flood-opacity=".28"></feDropShadow></filter></defs><text x="446" y="14" text-anchor="end" font-size="9.5" font-weight="800" fill="#73859a">100%</text><path d="${area}" fill="url(#trendFill)"></path><path d="${line}" fill="none" stroke="#4f7fc6" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"></path>${pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="3.3" fill="#fff" stroke="#4f7fc6" stroke-width="2"></circle>`).join("")}<g filter="url(#carShadow)"><g transform="translate(-15,-16)"><path d="M4 12 L8 6 Q9 4 12 4 H20 Q23 4 25 7 L28 12 H31 Q33 12 33 14 V20 Q33 22 31 22 H3 Q1 22 1 20 V15 Q1 12 4 12Z" fill="#e83b3b" stroke="#9e2222" stroke-width="1"></path><path d="M10 6 H20 Q21 6 23 9 L24 12 H7 L9 8 Q9 6 10 6Z" fill="#9fdcf7"></path><path d="M28 13 H32 V17 H28Z" fill="#ffe188"></path><circle cx="9" cy="22" r="4" fill="#26364b"></circle><circle cx="25" cy="22" r="4" fill="#26364b"></circle><circle cx="9" cy="22" r="1.7" fill="#d6dee7"></circle><circle cx="25" cy="22" r="1.7" fill="#d6dee7"></circle></g><animateMotion dur="2.4s" begin="0s" fill="freeze" restart="always" calcMode="paced" path="${line}"></animateMotion></g><g transform="translate(${bubbleX},${Math.max(8, endPoint[1] - 30)})"><rect x="0" y="0" width="62" height="20" rx="10" fill="#ffffff" stroke="#d8e4f0"></rect><text x="31" y="13.2" text-anchor="middle" font-size="9.5" font-weight="800" fill="#123f70">${current}%</text></g></svg><div class="trend-caption"><span>Perkembangan semasa anak anda</span><span>Purata keseluruhan Penggal 1: <strong>${current}%</strong></span></div><div class="trend-detail"><div class="trend-info-card"><h4>Apa maksud 84% ini?</h4><p><strong>${current}%</strong> ialah purata keseluruhan markah akademik anak anda bagi Penggal 1.</p><div class="trend-metric-grid"><div class="trend-metric"><b>${subjects.length} subjek</b><span>Subjek yang dimasukkan dalam kiraan purata</span></div><div class="trend-metric"><b>0% – 100%</b><span>Skala graf prestasi akademik</span></div></div></div><div class="trend-info-card"><h4>Subjek yang dinilai</h4><ul class="trend-bullet-list">${subjects.map((sub) => `<li><i></i><span>${esc(sub)}</span></li>`).join("")}</ul></div></div></div>`;
}
// Exam timeline and eligibility certificates
function defaultExamTimeline() {
  return {
    form4: [
      {
        key: "tov",
        label: "PAT Tingkatan 3",
        date: "2025-11-12",
        locked: false,
      },
      {
        key: "pat",
        label: "Awal Tingkatan 4",
        date: "2026-01-18",
        locked: false,
      },
      {
        key: "ppt",
        label: "Pentaksiran Tingkatan 4",
        date: "2026-05-14",
        locked: false,
      },
      {
        key: "trial",
        label: "Percubaan SPM",
        date: "2026-08-20",
        locked: true,
      },
      { key: "spm", label: "SPM sebenar", date: "2026-11-23", locked: true },
    ],
    form5: [
      {
        key: "tov",
        label: "PAT Tingkatan 4",
        date: "2025-11-19",
        locked: false,
      },
      {
        key: "pat",
        label: "Awal Tingkatan 5",
        date: "2026-01-17",
        locked: false,
      },
      {
        key: "ppt",
        label: "Diagnostik Tingkatan 5",
        date: "2026-03-21",
        locked: false,
      },
      {
        key: "trial",
        label: "Percubaan SPM",
        date: "2026-08-20",
        locked: true,
      },
      { key: "spm", label: "SPM sebenar", date: "2026-11-23", locked: true },
    ],
  };
}
function mergeExamTimeline(src) {
  const def = defaultExamTimeline(),
    out = {};
  Object.keys(def).forEach((form) => {
    out[form] = def[form].map((item) => ({
      ...item,
      ...(((src && src[form]) || []).find((x) => x.key === item.key) || {}),
    }));
  });
  return out;
}
function ensureExamTimelineData() {
  const d = data();
  d.school.examTimeline = mergeExamTimeline(d.school.examTimeline);
  return d.school.examTimeline;
}
function examTimelineForStudent(s) {
  const form = formLevelOf(s);
  const all = ensureExamTimelineData();
  return all[form >= 5 ? "form5" : form === 4 ? "form4" : "form5"];
}
function examTimelineHtml(s) {
  const items = examTimelineForStudent(s),
    cp = assessmentProfile(s).currentKey,
    currentIndex = Math.max(
      0,
      items.findIndex((x) => x.key === cp),
    );
  return `<div class="exam-timeline"><div class="coex-section-head" style="margin-bottom:0"><div><h3>Jejak peperiksaan & paras murid</h3><p>Visual ini menunjukkan peperiksaan yang telah dilalui murid dan kedudukan semasa dalam laluan SPM.</p></div></div><div class="exam-track">${items.map((item, i) => `<div class="exam-step ${i < currentIndex ? "done" : ""} ${i === currentIndex ? "current" : ""}">${i === currentIndex ? '<div class="exam-car" aria-hidden="true"><span class="car-right">🚗</span></div>' : ""}<span class="exam-tag">${i < currentIndex ? "Selesai" : i === currentIndex ? "Paras semasa" : "Seterusnya"}</span><h4>${esc(item.label)}</h4><p>Tarikh: <strong>${fmtDate(item.date)}</strong><br>${i < currentIndex ? "Peperiksaan ini telah dilalui." : i === currentIndex ? "Markah semasa anak anda sedang dirujuk pada checkpoint ini." : "Checkpoint masa hadapan untuk dipantau oleh sekolah."}</p></div>`).join("")}</div><div class="exam-note">Tarikh peperiksaan bukan rasmi boleh dikemas kini oleh super admin dalam modul COEx. Cikgu hanya memasukkan markah, manakala ibu bapa melihat paparan ini secara baca sahaja.</div></div>`;
}
function universityCertificateEligible(s) {
  const lms = coexLms(s, assessmentProfile(s).currentKey);
  return lms.applicable && lms.eligible;
}
function openEligibilityCertificate(id) {
  const s = getStudent(id),
    lms = coexLms(s, assessmentProfile(s).currentKey),
    bmRule = coexRule(lms.bmMark),
    sejRule = coexRule(lms.sejMark);
  openModal(
    "Ganjaran e-Certificate",
    `<div class="certificate-card"><div class="certificate-confetti"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="certificate-game-top"><div class="certificate-badge-level">5</div><div class="certificate-subtitle">Achievement Unlocked</div><div class="certificate-seal">★</div><h3>LEVEL UP</h3></div><p><strong>Tahniah, ${esc(s.name)}!</strong> Anda telah mencapai keputusan yang membanggakan dalam Bahasa Melayu dan Sejarah. Usaha, disiplin dan kesungguhan anda telah membuka pencapaian baharu ini. Teruskan momentum yang baik dan sasarkan tahap prestasi yang lebih tinggi.</p><div class="certificate-grade-row"><span class="grade-pill" style="--grade-bg:${toneForGear(bmRule.gear).color};--grade-fg:${toneForGear(bmRule.gear).fg || "#fff"}">${gradeStarHtml(bmRule.grade)}<span>Bahasa Melayu ${lms.bmMark}% · ${bmRule.grade}</span></span><span class="grade-pill" style="--grade-bg:${toneForGear(sejRule.gear).color};--grade-fg:${toneForGear(sejRule.gear).fg || "#fff"}">${gradeStarHtml(sejRule.grade)}<span>Sejarah ${lms.sejMark}% · ${sejRule.grade}</span></span></div><div class="certificate-rewards"><div class="certificate-reward"><b>+100</b><span>Poin pencapaian<br>untuk milestone akademik</span></div><div class="certificate-reward"><b>+1</b><span>e-Certificate dibuka<br>sebagai ganjaran digital</span></div><div class="certificate-reward"><b>LMS</b><span>Status layak masuk universiti<br>dalam prototaip portal</span></div></div><div class="certificate-callout"><strong>Pencapaian hebat!</strong> Anda telah memenuhi syarat kelulusan Bahasa Melayu dan Sejarah. Ini ialah satu langkah penting dalam perjalanan akademik anda menuju pendidikan tinggi.</div><div class="actions" style="justify-content:center;margin-top:18px;position:relative;z-index:1"><button class="btn btn-outline" onclick="closeModal()">Tutup</button><button class="btn btn-primary" onclick="closeModal()">Teruskan</button></div></div>`,
  );
}
function maybeOpenCoexNavigationPopup() {
  if (currentUser?.role !== "parent") return;
  const s = getStudent(selectedChildId);
  if (!s || !universityCertificateEligible(s)) return;
  openModal(
    "Reward dibuka!",
    `<div class="certificate-card" style="padding:22px"><div class="certificate-confetti"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="certificate-game-top"><div class="certificate-badge-level" style="width:92px;height:92px;font-size:40px">★</div><div class="certificate-subtitle">New reward available</div><h3 style="margin-top:2px">e-Certificate Unlocked</h3></div><p>${esc(s.name)} lulus Bahasa Melayu dan Sejarah. Murid kini membuka ganjaran khas berbentuk e-Certificate yang boleh dilihat dalam portal.</p><div class="actions" style="justify-content:center;margin-top:16px;position:relative;z-index:1"><button class="btn btn-outline" onclick="closeModal()">Nanti</button><button class="btn btn-primary" onclick="closeModal();openEligibilityCertificate('${s.id}')">Buka reward</button></div></div>`,
  );
}
function afterViewActivated(view) {
  if (view === "parent-coex") setTimeout(maybeOpenCoexNavigationPopup, 260);
}
function saveExamTimeline() {
  const store = ensureExamTimelineData();
  ["form4", "form5"].forEach((form) => {
    store[form].forEach((item) => {
      if (item.locked) return;
      const input = document.getElementById(`exam-${form}-${item.key}`);
      if (input && input.value) item.date = input.value;
    });
  });
  audit("Mengemas kini tarikh peperiksaan dalam modul COEx.", "info");
  save();
  toast("Tarikh peperiksaan berjaya dikemas kini.");
  refresh();
}
function examTimelineManagerHtml() {
  const timelines = ensureExamTimelineData();
  return `<section class="coex-section"><div class="coex-section-head"><div><h3>Jadual peperiksaan untuk animasi pelajar</h3><p>Super admin menetapkan tarikh peperiksaan. Guru hanya memasukkan markah, dan ibu bapa hanya melihat visual perjalanan peperiksaan.</p></div><button class="btn btn-primary btn-sm" onclick="saveExamTimeline()">Simpan tarikh</button></div><div class="grid-2" style="margin-top:14px">${["form4", "form5"].map((form) => `<section class="panel" style="margin:0"><div class="panel-head"><div><h3>${form === "form4" ? "Tingkatan 4" : "Tingkatan 5"}</h3><p class="panel-sub">Tarikh boleh diubah untuk peperiksaan dalaman sekolah.</p></div></div>${timelines[form].map((item) => `<div class="field" style="margin-top:12px"><label>${esc(item.label)} ${item.locked ? "· Tetap" : ""}</label><input id="exam-${form}-${item.key}" type="date" value="${item.date}" ${item.locked ? 'readonly class="read-only"' : ""}></div>`).join("")}<div class="import-hint">Percubaan SPM dan SPM sebenar ditetapkan sebagai rujukan tetap dalam prototaip ini, manakala peperiksaan lain boleh dikemas kini mengikut jadual sekolah.</div></section>`).join("")}</div></section>`;
}
function miniJourneyLadder(fromGear, toGear, targetGear = 11) {
  const toLevel = journeyLevelFromGear(toGear),
    targetLevel = journeyLevelFromGear(targetGear);
  return `<div class="mini-journey">${Array.from({ length: 6 }, (_, i) => {
    const level = i + 1,
      meta = journeyLevelMeta(level);
    return `<div class="mini-journey-step ${level <= toLevel ? "reached" : ""} ${level === toLevel ? "current" : ""} ${level === targetLevel ? "target" : ""}" style="--mini-color:${meta.color};--mini-soft:${meta.soft};--mini-fg:${meta.fg}"><div class="mini-top">${level === toLevel ? '<span class="car-right">🚗</span>' : level === targetLevel ? "◆" : ""}</div><div class="mini-box"><b>Level ${level}</b><strong>Gear ${meta.range}</strong></div><span>${meta.name}</span></div>`;
  }).join(
    "",
  )}</div><div class="trend-caption"><span>Rujukan: <strong>Gear ${fromGear}</strong></span><span>Semasa: <strong>Gear ${toGear}</strong></span></div>`;
}

// Class and assessment helpers
function classRecord(id) {
  return (
    data().school.classes.find((c) => c.id === id) || {
      id,
      name: id,
      form: Number(String(id).match(/\d+/)?.[0] || 5),
      band: "upper",
    }
  );
}
function className(id) {
  return classRecord(id).name || id;
}
function formLevelOf(studentOrClass) {
  const id =
    typeof studentOrClass === "string"
      ? studentOrClass
      : studentOrClass?.classId;
  return Number(
    classRecord(id).form || String(id || "5").match(/\d+/)?.[0] || 5,
  );
}
function formBandOf(studentOrClass) {
  const c = classRecord(
    typeof studentOrClass === "string"
      ? studentOrClass
      : studentOrClass?.classId,
  );
  return (
    c.band ||
    (Number(c.form) <= 3 ? "lower" : Number(c.form) === 6 ? "form6" : "upper")
  );
}
function subjectsForClass(classId) {
  const band = formBandOf(classId);
  return [
    ...(data().school.subjectProfiles?.[band] || data().school.subjects || []),
  ];
}
function syncStudentSubjects(student, classId) {
  const next = subjectsForClass(classId),
    old = { ...(student.scores || {}) };
  student.scores = Object.fromEntries(
    next.map((sub) => [sub, Number(old[sub] ?? 0)]),
  );
  if (student.coex) delete student.coex;
  return student;
}
function assessmentProfile(s) {
  const form = formLevelOf(s);
  if (form <= 3)
    return {
      form,
      program: "Menengah Rendah",
      goal: "sasaran akhir tahun",
      journeyTitle: "Meter perkembangan akademik",
      destination: `Sasaran Tingkatan ${Math.min(4, form + 1)}`,
      lmsApplicable: false,
      currentKey: "trial",
      referenceKey: "pat",
      labels: {
        tov: `Diagnostik Awal Tingkatan ${form}`,
        pat: `Pentaksiran Pertengahan Tingkatan ${form}`,
        ppt: `Pentaksiran 2 Tingkatan ${form}`,
        trial: `Pentaksiran Akhir Tingkatan ${form}`,
        target: `Sasaran Tingkatan ${Math.min(4, form + 1)}`,
      },
      comparisons: [
        {
          title: `Perkembangan awal Tingkatan ${form}`,
          from: "tov",
          to: "pat",
          endLabel: `Pertengahan Tingkatan ${form}`,
          description:
            "Bandingkan kedudukan awal tahun dengan prestasi pertengahan tahun.",
        },
        {
          title: `Pencapaian akhir Tingkatan ${form}`,
          from: "pat",
          to: "trial",
          endLabel: `Akhir Tingkatan ${form}`,
          description:
            "Lihat sama ada murid meningkat, kekal atau menurun sebelum naik ke tingkatan seterusnya.",
        },
      ],
    };
  if (form === 4)
    return {
      form,
      program: "Menengah Atas, Persediaan SPM",
      goal: "sasaran Tingkatan 5",
      journeyTitle: "Meter perkembangan Tingkatan 4",
      destination: "Sasaran Tingkatan 5",
      lmsApplicable: true,
      currentKey: "trial",
      referenceKey: "pat",
      labels: {
        tov: "TOV Tingkatan 4",
        pat: "PPT Tingkatan 4",
        ppt: "Pentaksiran 2 Tingkatan 4",
        trial: "PAT Tingkatan 4",
        target: "Sasaran Tingkatan 5",
      },
      comparisons: [
        {
          title: "Perkembangan awal Tingkatan 4",
          from: "tov",
          to: "pat",
          endLabel: "PPT Tingkatan 4",
          description:
            "Bandingkan asas permulaan dengan pencapaian pertengahan tahun.",
        },
        {
          title: "Pencapaian akhir Tingkatan 4",
          from: "pat",
          to: "trial",
          endLabel: "PAT Tingkatan 4",
          description:
            "Hujung tahun murid boleh melihat gred dan Gear sebelum memasuki Tingkatan 5.",
        },
      ],
    };
  if (form === 5)
    return {
      form,
      program: "Menengah Atas, SPM",
      goal: "sasaran SPM",
      journeyTitle: "Meter perjalanan ke sasaran SPM",
      destination: "Target SPM",
      lmsApplicable: true,
      currentKey: "trial",
      referenceKey: "tov",
      labels: {
        tov: "PAT Tingkatan 4",
        pat: "Diagnostik Tingkatan 5",
        ppt: "PPT Tingkatan 5",
        trial: "Percubaan SPM",
        target: "Target SPM",
      },
      comparisons: [
        {
          title: "Peralihan Tingkatan 4 ke Tingkatan 5",
          from: "tov",
          to: "pat",
          endLabel: "Awal Tingkatan 5",
          description:
            "Bandingkan pencapaian akhir Tingkatan 4 dengan kedudukan awal Tingkatan 5.",
        },
        {
          title: "Kemajuan Tingkatan 5",
          from: "pat",
          to: "trial",
          endLabel: "Percubaan SPM",
          description:
            "Nilai sama ada prestasi bergerak ke arah yang betul sebelum peperiksaan SPM.",
        },
      ],
    };
  return {
    form: 6,
    program: "Tingkatan 6, Persediaan STPM",
    goal: "sasaran STPM",
    journeyTitle: "Meter perkembangan Tingkatan 6",
    destination: "Sasaran STPM",
    lmsApplicable: false,
    currentKey: "trial",
    referenceKey: "pat",
    labels: {
      tov: "Diagnostik Tingkatan 6",
      pat: "Semester 1",
      ppt: "Semester 2",
      trial: "Semester 3",
      target: "Sasaran STPM",
    },
    comparisons: [
      {
        title: "Perkembangan semester awal",
        from: "tov",
        to: "pat",
        endLabel: "Semester 1",
        description: "Bandingkan tahap diagnostik dengan prestasi Semester 1.",
      },
      {
        title: "Perkembangan menuju STPM",
        from: "pat",
        to: "trial",
        endLabel: "Semester 3",
        description:
          "Bandingkan prestasi antara semester untuk melihat hala tuju menuju sasaran STPM.",
      },
    ],
  };
}
function checkpointNameForStudent(s, key) {
  return assessmentProfile(s).labels[key] || checkpointName(key);
}
function statusPill(status) {
  const map = {
    draft: ["Draf", "gray"],
    submitted: ["Menunggu semakan", "gold"],
    approved: ["Diluluskan", "blue"],
    published: ["Diterbitkan", "green"],
    archived: ["Diarkib", "red"],
    active: ["Aktif", "green"],
  };
  const x = map[status] || [status, "gray"];
  return `<span class="pill ${x[1]}">${x[0]}</span>`;
}
function attendanceStats(s) {
  const vals = Object.values(s.attendanceEntries || {});
  const count = vals.length;
  const present = vals.filter((v) => v === "P" || v === "L").length;
  return {
    count,
    present,
    rate: count ? Math.round((present / count) * 100) : 0,
    absent: vals.filter((v) => v === "A" || v === "MC" || v === "U").length,
  };
}
function fmtDate(d) {
  return new Intl.DateTimeFormat("ms-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(d + "T12:00:00"));
}
function fmtDateTime(d) {
  return new Intl.DateTimeFormat("ms-MY", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d));
}
function audit(action, type = "info") {
  const actor = currentUser?.name || "Sistem";
  data().audit.unshift({
    id: "AUD-" + Date.now(),
    at: new Date().toISOString(),
    actor,
    action,
    type,
  });
  data().audit = data().audit.slice(0, 80);
  save();
}
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(window.__toast);
  window.__toast = setTimeout(() => el.classList.remove("show"), 2900);
}
function studentPhoto(s, cls = "tiny-avatar") {
  return `<div class="${cls}">${s.photo ? `<img src="${s.photo}" alt="${esc(s.name)}">` : esc(initials(s.name))}</div>`;
}
function getStudent(id) {
  return data().students.find((s) => s.id === id);
}
function activeStudents() {
  return data().students.filter((s) => s.status === "active");
}
function currentParent() {
  return data().accounts.parents.find((p) => p.id === currentUser?.id);
}
function currentTeacher() {
  return data().accounts.teachers.find((t) => t.id === currentUser?.id);
}
function parentStudents() {
  const p = currentParent();
  return data().students.filter((s) => p?.childIds.includes(s.id));
}
function teacherStudents() {
  const t = currentTeacher();
  return activeStudents().filter((s) => t?.classes.includes(s.classId));
}
// Authentication demo, dashboard navigation and shared actions
function openAuth(target = "parent") {
  document.getElementById("landing").classList.add("hidden");
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("auth").classList.remove("hidden");
  switchRole(target);
  window.scrollTo(0, 0);
}
function backHome(e) {
  e.preventDefault();
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("landing").classList.remove("hidden");
  window.scrollTo(0, 0);
}
function switchRole(newRole) {
  role = newRole;
  document
    .querySelectorAll(".role-tab")
    .forEach((x) => x.classList.toggle("active", x.dataset.role === role));
  const config = {
    parent: {
      title: "Log masuk ibu bapa",
      desc: "Semak laporan, kehadiran, makluman, dan rekod untuk semua anak di sekolah.",
      label: "E-mel ibu bapa atau ID pelajar",
      id: "parent@smkseribestari.edu.my",
      pass: "parent123",
      btn: "Masuk sebagai ibu bapa",
      demo: '<strong>Akses demo:</strong><br>E-mel: parent@smkseribestari.edu.my<br>Kata laluan: parent123<br><span class="muted">Demo T5: parent@smkseribestari.edu.my. Demo T1-T3: parent.lower@smkseribestari.edu.my. Demo T4: parent.form4@smkseribestari.edu.my. Demo T6: parent.form6@smkseribestari.edu.my. Semua menggunakan parent123.</span>',
    },
    teacher: {
      title: "Log masuk guru",
      desc: "Akses kelas, subjek, kehadiran, serta laporan yang ditugaskan kepada anda.",
      label: "E-mel guru",
      id: "guru@smkseribestari.edu.my",
      pass: "guru123",
      btn: "Masuk sebagai guru",
      demo: '<strong>Akses demo:</strong><br>E-mel: guru@smkseribestari.edu.my<br>Kata laluan: guru123<br><span class="muted">Semua tingkatan: guru.demo@smkseribestari.edu.my / guru123</span>',
    },
    super: {
      title: "Log masuk super admin",
      desc: "Urus operasi sekolah, rekod pelajar, akses guru, kelulusan, audit, dan data asas.",
      label: "E-mel super admin",
      id: "admin@smkseribestari.edu.my",
      pass: "admin123",
      btn: "Masuk sebagai super admin",
      demo: "<strong>Akses demo:</strong><br>E-mel: admin@smkseribestari.edu.my<br>Kata laluan: admin123",
    },
  }[role];
  document.getElementById("auth-title").textContent = config.title;
  document.getElementById("auth-desc").textContent = config.desc;
  document.getElementById("login-label").textContent = config.label;
  document.getElementById("login-id").value = config.id;
  document.getElementById("login-pass").value = config.pass;
  document.getElementById("login-button").textContent = config.btn;
  document.getElementById("demo-creds").innerHTML = config.demo;
}
function handleLogin(e) {
  e.preventDefault();
  const id = document.getElementById("login-id").value.trim().toLowerCase();
  const pass = document.getElementById("login-pass").value;
  let account = null;
  if (role === "parent") {
    account = data().accounts.parents.find(
      (x) => x.email.toLowerCase() === id && x.password === pass,
    );
    if (!account && id === "smk2026-001" && pass === "1234")
      account = data().accounts.parents[0];
  }
  if (role === "teacher")
    account = data().accounts.teachers.find(
      (x) => x.email.toLowerCase() === id && x.password === pass && x.active,
    );
  if (role === "super")
    account = data().accounts.super.find(
      (x) => x.email.toLowerCase() === id && x.password === pass,
    );
  if (!account) {
    toast(
      "Maklumat log masuk tidak sepadan. Gunakan akses demo yang dipaparkan.",
    );
    return;
  }
  currentUser = { role, id: account.id, name: account.name };
  if (role === "parent") selectedChildId = account.childIds[0];
  if (role === "teacher")
    teacherSelectedStudent =
      teacherStudents().find((s) => s.report.status !== "published")?.id ||
      teacherStudents()[0]?.id;
  showDashboard(role);
}
function showDashboard(r) {
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("landing").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  ["parent", "teacher", "super"].forEach((x) =>
    document.getElementById("nav-" + x).classList.toggle("hidden", x !== r),
  );
  const details = {
    parent: { pill: "Portal ibu bapa", initial: "PN", role: "Ibu bapa" },
    teacher: { pill: "Panel guru", initial: "CF", role: "Guru" },
    super: { pill: "Panel super admin", initial: "SA", role: "Super admin" },
  }[r];
  document.getElementById("role-pill").textContent = details.pill;
  document.getElementById("profile-avatar").textContent = details.initial;
  document.getElementById("profile-name").textContent = currentUser.name;
  document.getElementById("profile-role").textContent = details.role;
  setView(
    r === "parent"
      ? "parent-home"
      : r === "teacher"
        ? "teacher-home"
        : "super-home",
    document.querySelector("#nav-" + r + " .nav-link"),
  );
  window.scrollTo(0, 0);
}
function titleFor(view) {
  return (
    {
      "parent-home": ["Portal Ibu Bapa", "Dashboard anak"],
      "parent-report": ["Portal Ibu Bapa", "Laporan akademik"],
      "parent-coex": ["Portal Ibu Bapa", "Metrik Prestasi Pelajar"],
      "parent-attendance": ["Portal Ibu Bapa", "Kehadiran anak"],
      "parent-communication": ["Portal Ibu Bapa", "Makluman & perjumpaan"],
      "parent-profile": ["Portal Ibu Bapa", "Profil keluarga"],
      "teacher-home": ["Panel Guru", "Ringkasan kelas"],
      "teacher-report": ["Panel Guru", "Rekod laporan pelajar"],
      "teacher-coex": ["Panel Guru", "Rekod Prestasi Pelajar"],
      "teacher-attendance": ["Panel Guru", "Kehadiran harian"],
      "teacher-students": ["Panel Guru", "Pelajar saya"],
      "super-home": ["Panel Super Admin", "Operasi sekolah"],
      "super-approvals": ["Panel Super Admin", "Kelulusan laporan"],
      "super-students": ["Panel Super Admin", "Pelajar & penjaga"],
      "super-teachers": ["Panel Super Admin", "Akses guru"],
      "super-master": ["Panel Super Admin", "Data sekolah"],
      "super-audit": ["Panel Super Admin", "Audit & privasi"],
      "super-coex": ["Panel Super Admin", "Tetapan COEx"],
      "super-interventions": ["Panel Super Admin", "Intervensi murid"],
    }[view] || ["Portal", "Dashboard"]
  );
}
function setView(view, el) {
  document.querySelectorAll(".view").forEach((x) => x.classList.add("hidden"));
  document.getElementById("view-" + view)?.classList.remove("hidden");
  document
    .querySelectorAll(".nav-link")
    .forEach((x) => x.classList.remove("active"));
  if (el) el.classList.add("active");
  const t = titleFor(view);
  document.getElementById("crumb").textContent = t[0];
  document.getElementById("page-title").textContent = t[1];
  document.getElementById("top-action").textContent = view.startsWith("parent")
    ? "Cetak laporan"
    : "Pusat tindakan";
  refresh();
  toggleSidebar(false);
  window.scrollTo(0, 0);
  setTimeout(() => afterViewActivated(view), 120);
}
function topAction() {
  const visible =
    [...document.querySelectorAll(".view")].find(
      (x) => !x.classList.contains("hidden"),
    )?.id || "";
  if (visible.includes("parent")) window.print();
  else if (visible === "view-super-approvals")
    setView(
      "super-approvals",
      document.querySelector("#nav-super .nav-link:nth-child(2)"),
    );
  else toast("Gunakan tindakan yang tersedia dalam paparan ini.");
}
function toggleSidebar(force) {
  const s = document.getElementById("sidebar");
  s.classList.toggle(
    "open",
    typeof force === "boolean" ? force : !s.classList.contains("open"),
  );
}
function logout() {
  currentUser = null;
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("landing").classList.remove("hidden");
  toast("Anda telah log keluar daripada portal.");
  window.scrollTo(0, 0);
}
function refresh() {
  if (!currentUser) return;
  renderParent();
  renderTeacher();
  renderSuper();
  renderCoexViews();
}

// Parent views and actions
function renderParent() {
  if (currentUser.role !== "parent") return;
  const children = parentStudents();
  if (!children.some((s) => s.id === selectedChildId))
    selectedChildId = children[0]?.id;
  const s = getStudent(selectedChildId);
  if (!s) return;
  const a = attendanceStats(s),
    avg = average(s),
    alerts = [];
  if (a.rate < 80)
    alerts.push([
      "danger",
      "Kehadiran memerlukan perhatian",
      "Rekod kehadiran semasa " +
        a.rate +
        "%. Sila hubungi guru kelas untuk tindakan lanjut.",
    ]);
  if (Object.values(s.scores).some((x) => x < 70))
    alerts.push(["warn", "Sokongan pembelajaran disyorkan", s.support]);
  if (s.report.status === "published")
    alerts.push([
      "success",
      "Laporan Penggal 1 tersedia",
      "Laporan rasmi telah diterbitkan pada " +
        fmtDate(s.report.publishedAt.slice(0, 10)) +
        ".",
    ]);
  const childOptions = children
    .map(
      (x) =>
        `<option value="${x.id}" ${x.id === s.id ? "selected" : ""}>${esc(x.name.split(" ")[0])} · ${className(x.classId)}</option>`,
    )
    .join("");
  document.getElementById("view-parent-home").innerHTML =
    `<div class="student-banner"><div class="student-info">${studentPhoto(s, "student-photo")}<div><strong>${esc(s.name)}</strong><span>${esc(s.id)} · ${esc(className(s.classId))} · Penjaga: ${esc(s.guardian)}</span></div></div><div class="child-switch"><label>Pilih anak</label><select onchange="changeChild(this.value)">${childOptions}</select></div></div><div class="stats" style="margin-top:16px"><article class="stat"><div class="stat-top"><small>Purata akademik</small><div class="stat-icon">▦</div></div><b>${avg}%</b><span>${avg >= 80 ? "Kedudukan prestasi baik" : "Perlu sokongan berterusan"}</span></article><article class="stat"><div class="stat-top"><small>Kehadiran</small><div class="stat-icon green">◷</div></div><b>${a.rate}%</b><span>${a.present} daripada ${a.count} hari direkodkan</span></article><article class="stat"><div class="stat-top"><small>Gear semasa</small><div class="stat-icon gold">★</div></div><b>Gear ${coexOverallRule(s, assessmentProfile(s).currentKey).gear}</b><span>${grade(coexAverage(s, assessmentProfile(s).currentKey))} · ${coexZoneGroup(coexOverallRule(s, assessmentProfile(s).currentKey)).zone}</span></article><article class="stat"><div class="stat-top"><small>Status laporan</small><div class="stat-icon purple">✓</div></div><b style="font-size:18px;margin-top:11px">${statusPill(s.report.status)}</b><span>${s.report.status === "published" ? "Sedia untuk disemak" : "Dalam proses sekolah"}</span></article></div><div class="grid-2-1" style="margin-top:16px"><section class="panel"><div class="panel-head"><div><h3>Prestasi akademik</h3><p class="panel-sub">Ringkasan markah Penggal 1, sesi ${s.report.session}</p></div><button class="btn btn-secondary btn-sm no-print" onclick="setView('parent-report',document.querySelector('#nav-parent .nav-link:nth-child(2)'))">Lihat laporan penuh</button></div><div>${Object.entries(
      s.scores,
    )
      .slice(0, 5)
      .map(
        ([sub, mark], i) =>
          `<div class="progress-row"><span>${esc(sub)}</span><div class="bar"><div class="fill ${["", "green", "gold", "purple", "red"][i]}" style="width:${mark}%"></div></div><strong>${mark}%</strong></div>`,
      )
      .join(
        "",
      )}</div>${trendGraphHtml(s)}</section><section class="panel"><div class="panel-head"><div><h3>Kehadiran bulan Jun</h3><p class="panel-sub">Rekod harian yang telah dihantar oleh guru kelas</p></div></div><div class="donut-row"><div class="donut" style="background:conic-gradient(var(--green) 0 ${a.rate}%,#edf2f5 ${a.rate}% 100%)"><div><b>${a.rate}%</b><span>hadir</span></div></div><div><strong style="color:var(--navy);font-size:14px">${a.present} hari hadir</strong><p class="muted" style="font-size:11px;line-height:1.5">${a.absent} rekod tidak hadir atau MC. Lihat sebab dan hantar makluman dalam halaman kehadiran.</p><button class="btn btn-outline btn-sm no-print" onclick="setView('parent-attendance',document.querySelector('#nav-parent .nav-link:nth-child(3)'))">Lihat rekod</button></div></div></section></div><div class="grid-2" style="margin-top:16px"><section class="panel"><div class="panel-head"><div><h3>Perkara yang memerlukan perhatian</h3><p class="panel-sub">Pemerhatian berdasarkan data semasa anak anda.</p></div></div><div class="notice-list">${alerts.map((x) => `<div class="notice ${x[0]}"><strong>●</strong><div><strong>${x[1]}</strong><br>${x[2]}</div></div>`).join("")}</div></section><section class="panel"><div class="panel-head"><div><h3>Ulasan dan sokongan guru</h3><p class="panel-sub">Catatan akademik dan cadangan untuk di rumah.</p></div></div><div class="timeline"><div class="timeline-row"><div class="timeline-mark"><i class="timeline-dot"></i></div><div><strong>Ulasan guru kelas</strong><p>${esc(s.comment)}</p><span>Dikemas kini bersama laporan Penggal 1</span></div></div><div class="timeline-row"><div class="timeline-mark"><i class="timeline-dot" style="background:#dca230"></i></div><div><strong>Cadangan sokongan</strong><p>${esc(s.support)}</p><span>Cadangan untuk keluarga</span></div></div><div class="timeline-row"><div class="timeline-mark"><i class="timeline-dot" style="background:#35a476"></i></div><div><strong>Disiplin</strong><p>${esc(s.discipline)}</p><span>Rekod semasa sekolah</span></div></div></div></section></div>`;
  document.getElementById("view-parent-report").innerHTML = parentReportHtml(s);
  document.getElementById("view-parent-attendance").innerHTML =
    parentAttendanceHtml(s);
  document.getElementById("view-parent-communication").innerHTML =
    parentCommunicationHtml(s);
  document.getElementById("view-parent-profile").innerHTML =
    parentProfileHtml();
}
function changeChild(id) {
  selectedChildId = id;
  refresh();
}
function parentReportHtml(s) {
  const report = s.report,
    hist = [...s.history].reverse();
  if (report.status !== "published") {
    return `<div class="section-title"><div><h2>Laporan akademik ${esc(s.name)}</h2><p>Rekod laporan akan tersedia selepas sekolah meluluskan dan menerbitkannya.</p></div>${statusPill(report.status)}</div><div class="notice warn"><strong>!</strong><div><strong>Laporan belum diterbitkan.</strong><br>Guru sedang melengkapkan laporan atau pentadbir sedang menjalankan semakan. Markah terperinci hanya akan dipaparkan selepas penerbitan rasmi.</div></div>`;
  }
  return `<div class="section-title"><div><h2>Laporan akademik ${esc(s.name)}</h2><p>Markah rasmi, status penerbitan, dan rekod perkembangan antara penggal.</p></div><div class="actions no-print"><button class="btn btn-outline" onclick="window.print()">🖨 Cetak laporan</button><button class="btn btn-secondary" onclick="toast('PDF laporan akan dijana oleh sistem backend pada versi produksi.')">⇩ Muat turun PDF</button></div></div><div class="notice ${report.status === "published" ? "success" : "warn"}"><strong>●</strong><div><strong>${report.status === "published" ? "Laporan rasmi diterbitkan" : "Laporan sedang diproses"}</strong><br>${report.status === "published" ? `Diluluskan oleh ${esc(report.approvedBy)} pada ${fmtDate(report.publishedAt.slice(0, 10))}.` : "Guru sedang melengkapkan atau menunggu semakan pentadbir."}</div></div><div class="grid-2-1" style="margin-top:16px"><section class="panel"><div class="panel-head"><div><h3>Markah Penggal 1</h3><p class="panel-sub">Sesi akademik ${esc(report.session)} · ${esc(className(s.classId))}</p></div>${statusPill(report.status)}</div><table class="report-table"><thead><tr><th>Subjek</th><th>Markah</th><th>Gred</th><th>Prestasi</th></tr></thead><tbody>${Object.entries(
    s.scores,
  )
    .sort((a, b) => a[0].localeCompare(b[0], "ms"))
    .map(([sub, mark]) => {
      const note =
        mark >= 85
          ? "Sangat baik, teruskan prestasi."
          : mark >= 70
            ? "Baik, kekalkan usaha konsisten."
            : mark >= 55
              ? "Perlu latihan tambahan secara berkala."
              : "Perlu intervensi dan sokongan guru.";
      return `<tr><td>${esc(sub)}</td><td><strong>${mark}%</strong></td><td>${gradeBadgeFromMark(mark, "small")}</td><td>${note}</td></tr>`;
    })
    .join(
      "",
    )}</tbody></table><div class="notice info" style="margin-top:16px"><strong>i</strong><div>Purata keseluruhan: <strong>${average(s)}%</strong>. Gred C dan ke atas dipaparkan bersama bintang, dan warna gred mengikut warna COEx.</div></div></section><aside class="panel"><div class="panel-head"><div><h3>Status kelulusan</h3><p class="panel-sub">Setiap laporan melalui rekod proses sekolah.</p></div></div><div class="timeline"><div class="timeline-row"><div class="timeline-mark"><i class="timeline-dot" style="background:${report.status === "draft" ? "#aeb9c5" : "#2f78c3"}"></i></div><div><strong>Draf guru</strong><p>Laporan disediakan berdasarkan markah dan rekod pelajar.</p><span>${report.submittedAt ? "Selesai" : "Dalam proses"}</span></div></div><div class="timeline-row"><div class="timeline-mark"><i class="timeline-dot" style="background:${["approved", "published"].includes(report.status) ? "#2f78c3" : "#dca230"}"></i></div><div><strong>Semakan pentadbir</strong><p>Pentadbir menyemak ketepatan dan kelengkapan laporan.</p><span>${report.approvedAt ? fmtDateTime(report.approvedAt) : "Menunggu kelulusan"}</span></div></div><div class="timeline-row"><div class="timeline-mark"><i class="timeline-dot" style="background:${report.status === "published" ? "#35a476" : "#aeb9c5"}"></i></div><div><strong>Terbit kepada ibu bapa</strong><p>Laporan boleh dilihat oleh penjaga yang berdaftar.</p><span>${report.publishedAt ? fmtDateTime(report.publishedAt) : "Belum diterbitkan"}</span></div></div></div></aside></div><section class="panel" style="margin-top:16px"><div class="panel-head"><div><h3>Trend perkembangan</h3><p class="panel-sub">Perbandingan keputusan terdahulu dengan penggal semasa.</p></div></div><table class="report-table"><thead><tr><th>Penggal</th><th>Purata akademik</th><th>Kehadiran</th></tr></thead><tbody>${hist.map((h) => `<tr><td>${esc(h.term)}</td><td>${h.avg}%</td><td>${h.attendance}%</td></tr>`).join("")}<tr><td><strong>Penggal 1 2026</strong></td><td><strong>${average(s)}%</strong></td><td><strong>${attendanceStats(s).rate}%</strong></td></tr></tbody></table></section>`;
}
function calendarHtml(s, month = 6, year = 2026) {
  const first = new Date(year, month - 1, 1).getDay();
  const total = new Date(year, month, 0).getDate();
  const weekdays = ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"];
  let h = weekdays.map((x) => `<div class="dayname">${x}</div>`).join("");
  for (let i = 0; i < first; i++) h += '<div class="day empty"></div>';
  for (let d = 1; d <= total; d++) {
    const key = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      st = s.attendanceEntries[key] || "";
    const label = st ? `${d} · ${st}` : d;
    h += `<div class="day ${st}" title="${esc(s.attendanceNotes?.[key] || "")}" onclick="showAttendanceDay('${s.id}','${key}')">${label}</div>`;
  }
  return h;
}
function parentAttendanceHtml(s) {
  const st = attendanceStats(s);
  const events = Object.entries(s.attendanceEntries)
    .filter(([, v]) => v !== "P")
    .sort()
    .reverse();
  return `<div class="section-title"><div><h2>Kehadiran ${esc(s.name)}</h2><p>Rekod harian, makluman ketidakhadiran, dan trend hadir bagi bulan Jun 2026.</p></div><span class="pill ${st.rate >= 90 ? "green" : st.rate >= 80 ? "gold" : "red"}">${st.rate}% kehadiran</span></div><div class="grid-2-1"><section class="panel"><div class="panel-head"><div><h3>Jun 2026</h3><p class="panel-sub">Klik pada tarikh untuk melihat status dan nota berkaitan.</p></div></div><div class="calendar">${calendarHtml(s)}</div><div class="calendar-legend"><span><i style="background:#e5f8ee"></i>Hadir</span><span><i style="background:#fff3dc"></i>Lewat</span><span><i style="background:#ffeded"></i>Tidak hadir</span><span><i style="background:#eee8ff"></i>MC</span></div></section><aside class="panel"><div class="panel-head"><div><h3>Ringkasan bulan</h3><p class="panel-sub">Rekod berdasarkan hari persekolahan yang dimasukkan.</p></div></div><div class="donut-row"><div class="donut" style="background:conic-gradient(var(--green) 0 ${st.rate}%,#edf2f5 ${st.rate}% 100%)"><div><b>${st.rate}%</b><span>hadir</span></div></div><div><strong style="font-size:14px;color:var(--navy)">${st.present} hari hadir</strong><p class="muted" style="font-size:11px;line-height:1.5">${st.absent} hari direkodkan sebagai tidak hadir atau MC.</p></div></div></aside></div><div class="grid-2" style="margin-top:16px"><section class="panel"><div class="panel-head"><div><h3>Rekod yang memerlukan makluman</h3><p class="panel-sub">Status selain hadir penuh bagi bulan semasa.</p></div></div><div class="list">${events.length ? events.map(([d, v]) => `<div class="item"><div class="item-icon">${v === "MC" ? "✚" : v === "A" ? "!" : "◷"}</div><div class="item-main"><strong>${fmtDate(d)} · ${v === "MC" ? "Cuti sakit" : v === "A" ? "Tidak hadir" : "Lewat"}</strong><span>${esc(s.attendanceNotes?.[d] || "Tiada nota direkodkan")}</span></div>${v === "A" ? '<span class="pill red">Tindakan</span>' : '<span class="pill gray">Direkod</span>'}</div>`).join("") : '<div class="empty-state">Tiada rekod luar biasa untuk bulan ini.</div>'}</div></section><section class="panel"><div class="panel-head"><div><h3>Maklumkan ketidakhadiran</h3><p class="panel-sub">Permohonan akan direkodkan untuk semakan guru kelas.</p></div></div><form onsubmit="submitAbsenceRequest(event)"><div class="field"><label>Tarikh</label><input required id="absence-date" type="date" min="2026-01-01" max="2026-12-31"></div><div class="field"><label>Sebab ketidakhadiran</label><select id="absence-reason"><option>Urusan keluarga</option><option>Rawatan kesihatan</option><option>MC / sijil sakit</option><option>Lain-lain</option></select></div><div class="field"><label>Nota ringkas</label><textarea id="absence-note" rows="3" placeholder="Contoh: Temujanji rawatan di klinik pada waktu pagi."></textarea></div><div class="field"><label class="checkline"><input id="absence-doc" type="checkbox"> Dokumen sokongan akan dihantar kepada pihak sekolah.</label></div><button class="btn btn-primary" style="width:100%;margin-top:16px">Hantar makluman</button></form></section></div>`;
}
function submitAbsenceRequest(e) {
  e.preventDefault();
  const date = document.getElementById("absence-date").value;
  if (!date) {
    toast("Pilih tarikh ketidakhadiran.");
    return;
  }
  const req = {
    id: "ABS-" + Date.now(),
    studentId: selectedChildId,
    date,
    reason: document.getElementById("absence-reason").value,
    note: document.getElementById("absence-note").value.trim(),
    document: document.getElementById("absence-doc").checked,
    status: "submitted",
    from: currentUser.name,
  };
  data().absenceRequests.unshift(req);
  audit(
    `Menghantar makluman ketidakhadiran untuk ${getStudent(selectedChildId).name}, ${fmtDate(date)}.`,
    "gold",
  );
  save();
  toast("Makluman ketidakhadiran telah dihantar untuk semakan.");
  e.target.reset();
  refresh();
}
function showAttendanceDay(studentId, date) {
  const s = getStudent(studentId),
    st = s.attendanceEntries[date] || "Belum direkodkan";
  const names = {
    P: "Hadir",
    A: "Tidak hadir",
    L: "Lewat",
    MC: "Cuti sakit",
    U: "Urusan rasmi",
  };
  openModal(
    `Status kehadiran · ${fmtDate(date)}`,
    `<div class="notice info"><strong>●</strong><div><strong>${names[st] || st}</strong><br>${esc(s.attendanceNotes?.[date] || "Tiada nota tambahan direkodkan untuk tarikh ini.")}</div></div><div class="actions" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-primary" onclick="closeModal()">Tutup</button></div>`,
  );
}
function parentCommunicationHtml(s) {
  const p = currentParent();
  const existing = data().meetings.filter((m) => m.parentId === p.id);
  return `<div class="section-title"><div><h2>Makluman & perjumpaan</h2><p>Pengumuman sekolah, tindakan yang perlu dibuat, dan tempahan slot guru.</p></div><button class="btn btn-primary no-print" onclick="openMeetingModal()">Tempah perjumpaan</button></div><div class="grid-2-1"><section class="panel"><div class="panel-head"><div><h3>Pengumuman sekolah</h3><p class="panel-sub">Makluman semasa yang diterbitkan kepada keluarga.</p></div></div><div class="list">${data()
    .announcements.map(
      (a) =>
        `<div class="item"><div class="item-icon">${a.category === "Akademik" ? "▦" : a.category === "Perjumpaan" ? "◉" : "i"}</div><div class="item-main"><strong>${esc(a.title)}</strong><span>${esc(a.body)}<br><small>${esc(a.category)} · ${fmtDate(a.date)}</small></span></div></div>`,
    )
    .join(
      "",
    )}</div></section><aside class="panel"><div class="panel-head"><div><h3>Perjumpaan saya</h3><p class="panel-sub">Slot yang anda telah tempah dengan guru.</p></div></div>${existing.length ? `<div class="list">${existing.map((m) => `<div class="item"><div class="item-icon">◷</div><div class="item-main"><strong>${esc(m.topic)}</strong><span>${fmtDate(m.date)} · ${esc(m.slot)}<br>Status: ${m.status === "booked" ? "Disahkan" : "Menunggu"}</span></div></div>`).join("")}</div>` : '<div class="empty-state">Belum ada perjumpaan yang ditempah.</div>'}</aside></div><section class="panel" style="margin-top:16px"><div class="panel-head"><div><h3>Hubungi sekolah</h3><p class="panel-sub">Gunakan saluran rasmi untuk pertanyaan berhubung anak anda.</p></div></div><div class="grid-3"><div class="role-box"><i>☎</i><div><strong>Pejabat sekolah</strong><span>06-123 4567<br>Isnin hingga Jumaat, 8.00 pagi hingga 4.30 petang</span></div></div><div class="role-box"><i>✉</i><div><strong>E-mel rasmi</strong><span>smkseribestari@moe.edu.my<br>Untuk pertanyaan bukan kecemasan.</span></div></div><div class="role-box"><i>◉</i><div><strong>Guru kelas</strong><span>Tempah slot melalui portal supaya rekod komunikasi tersusun.</span></div></div></div></section>`;
}
function parentProfileHtml() {
  const p = currentParent(),
    children = parentStudents();
  return `<div class="section-title"><div><h2>Profil keluarga</h2><p>Maklumat penjaga yang dikaitkan dengan rekod pelajar di sekolah.</p></div></div><div class="grid-2"><section class="panel"><div class="panel-head"><div><h3>Maklumat penjaga utama</h3><p class="panel-sub">Perubahan penting perlu disahkan oleh pihak pentadbiran sekolah.</p></div></div><form onsubmit="saveParentProfile(event)"><div class="field"><label>Nama penuh</label><input id="parent-name" value="${esc(p.name)}" required></div><div class="field"><label>Nombor telefon</label><input id="parent-phone" value="${esc(p.phone)}" required></div><div class="field"><label>Alamat</label><textarea id="parent-address" rows="3">${esc(p.address || "")}</textarea></div><button class="btn btn-primary" style="margin-top:16px">Simpan maklumat</button></form></section><section class="panel"><div class="panel-head"><div><h3>Anak yang dikaitkan</h3><p class="panel-sub">Akses anda hanya diberikan kepada pelajar yang dipautkan oleh sekolah.</p></div></div><div class="student-list">${children.map((s) => `<div class="student-row">${studentPhoto(s)}<div class="student-meta"><strong>${esc(s.name)}</strong><span>${esc(s.id)} · ${esc(className(s.classId))}</span></div>${statusPill(s.status)}</div>`).join("")}</div><div class="notice info" style="margin-top:16px"><strong>i</strong><div>Untuk tambah atau buang akses penjaga, hubungi pejabat sekolah dengan dokumen sokongan yang berkaitan.</div></div></section></div>`;
}
function saveParentProfile(e) {
  e.preventDefault();
  const p = currentParent();
  p.name = document.getElementById("parent-name").value.trim();
  p.phone = document.getElementById("parent-phone").value.trim();
  p.address = document.getElementById("parent-address").value.trim();
  data()
    .students.filter((s) => s.guardianId === p.id)
    .forEach((s) => {
      s.guardian = p.name;
      s.guardianPhone = p.phone;
    });
  currentUser.name = p.name;
  audit("Mengemas kini maklumat profil keluarga.", "info");
  save();
  toast("Maklumat keluarga telah disimpan untuk semakan sekolah.");
  refresh();
}
function openMeetingModal() {
  const s = getStudent(selectedChildId);
  openModal(
    "Tempah perjumpaan guru",
    `<form onsubmit="bookMeeting(event)"><div class="field"><label>Anak</label><input value="${esc(s.name)} · ${esc(className(s.classId))}" class="read-only" readonly></div><div class="field"><label>Topik perbincangan</label><select id="meeting-topic"><option>Perkembangan akademik</option><option>Kehadiran</option><option>Kokurikulum</option><option>Sokongan pembelajaran</option><option>Perkara lain</option></select></div><div class="field"><label>Tarikh</label><select id="meeting-date"><option value="2026-07-18">18 Julai 2026</option><option value="2026-07-25">25 Julai 2026</option></select></div><div class="field"><label>Slot masa</label><select id="meeting-slot"><option>9.00 pagi - 9.15 pagi</option><option>9.20 pagi - 9.35 pagi</option><option>10.00 pagi - 10.15 pagi</option><option>11.00 pagi - 11.15 pagi</option></select></div><div class="actions" style="justify-content:flex-end;margin-top:18px"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn btn-primary">Sahkan tempahan</button></div></form>`,
  );
}
function bookMeeting(e) {
  e.preventDefault();
  const p = currentParent(),
    s = getStudent(selectedChildId);
  data().meetings.unshift({
    id: "MEET-" + Date.now(),
    parentId: p.id,
    studentId: s.id,
    topic: document.getElementById("meeting-topic").value,
    date: document.getElementById("meeting-date").value,
    slot: document.getElementById("meeting-slot").value,
    status: "booked",
  });
  audit(`Menempah perjumpaan guru untuk ${s.name}.`, "info");
  save();
  closeModal();
  toast("Slot perjumpaan anda telah ditempah.");
  refresh();
}

// Teacher views, reports and attendance
function renderTeacher() {
  if (currentUser.role !== "teacher") return;
  const t = currentTeacher(),
    students = teacherStudents();
  if (!students.some((s) => s.id === teacherSelectedStudent))
    teacherSelectedStudent = students[0]?.id;
  const pending = students.filter(
    (s) => s.report.status !== "published",
  ).length;
  const sorted = students.slice().sort((a, b) => average(b) - average(a));
  const high = sorted.slice(0, 3),
    low = sorted.slice().reverse().slice(0, 3);
  document.getElementById("view-teacher-home").innerHTML =
    `<div class="section-title"><div><h2>Selamat datang, ${esc(t.name.split(" ").slice(0, 2).join(" "))}</h2><p>Anda hanya boleh mengakses kelas dan komponen laporan yang ditugaskan kepada anda.</p></div><span class="pill blue">${t.roles.join(" · ")}</span></div><div class="grid-3"><div class="role-box"><i>◫</i><div><strong>Akses kelas</strong><span>${t.classes.map(className).join(", ")}</span></div></div><div class="role-box"><i>▦</i><div><strong>Akses subjek</strong><span>${t.subjects.join(", ") || "Tiada akses subjek"}</span></div></div><div class="role-box"><i>◷</i><div><strong>Rekod kehadiran</strong><span>${t.canAttendance ? "Dibenarkan untuk kelas yang ditugaskan" : "Tidak ditugaskan"}</span></div></div></div><div class="stats" style="margin-top:16px"><article class="stat"><div class="stat-top"><small>Pelajar dalam akses</small><div class="stat-icon">♙</div></div><b>${students.length}</b><span>pelajar aktif dalam kelas anda</span></article><article class="stat"><div class="stat-top"><small>Laporan belum diterbit</small><div class="stat-icon gold">◷</div></div><b>${pending}</b><span>draf atau menunggu semakan</span></article><article class="stat"><div class="stat-top"><small>Rekod kehadiran</small><div class="stat-icon green">✓</div></div><b>${t.canAttendance ? "Aktif" : "Tiada"}</b><span>akses kehadiran kelas</span></article><article class="stat"><div class="stat-top"><small>Permohonan ibu bapa</small><div class="stat-icon purple">✉</div></div><b>${data().absenceRequests.filter((x) => students.some((s) => s.id === x.studentId) && x.status === "submitted").length}</b><span>makluman untuk disemak</span></article></div><div class="teacher-monitor-grid"><section class="monitor-card"><h3>High performer student</h3><p>Guru kelas boleh terus kenal pasti murid yang konsisten cemerlang untuk dikekalkan momentumnya.</p><div class="student-list">${high.map((s) => `<div class="student-row">${studentPhoto(s)}<div class="student-meta"><strong>${esc(s.name)}</strong><span>${esc(className(s.classId))} · Purata ${average(s)}% · Gear ${coexOverallRule(s, assessmentProfile(s).currentKey).gear}</span><div class="monitor-badge-row"><span class="monitor-badge">${gradeBadgeFromMark(average(s), "small")}</span><span class="monitor-badge">Kehadiran ${attendanceStats(s).rate}%</span></div></div><button class="btn btn-outline btn-sm" onclick="selectTeacherStudent('${s.id}')">Monitor</button></div>`).join("") || '<div class="empty-state">Tiada data murid.</div>'}</div></section><section class="monitor-card"><h3>Low performance student</h3><p>Guru kelas boleh fokus pada murid yang perlukan support lebih awal, sama ada dari markah atau kehadiran.</p><div class="student-list">${low.map((s) => `<div class="student-row">${studentPhoto(s)}<div class="student-meta"><strong>${esc(s.name)}</strong><span>${esc(className(s.classId))} · Purata ${average(s)}% · Gear ${coexOverallRule(s, assessmentProfile(s).currentKey).gear}</span><div class="monitor-badge-row"><span class="monitor-badge">${gradeBadgeFromMark(average(s), "small")}</span><span class="monitor-badge">Kehadiran ${attendanceStats(s).rate}%</span></div></div><button class="btn btn-outline btn-sm" onclick="selectTeacherStudent('${s.id}')">Support</button></div>`).join("") || '<div class="empty-state">Tiada data murid.</div>'}</div></section></div>${teacherGradeFilterSectionHtml(t, students)}<div class="grid-2-1" style="margin-top:16px"><section class="panel"><div class="panel-head"><div><h3>Pelajar yang perlu tindakan</h3><p class="panel-sub">Keutamaan berdasarkan status laporan dan kehadiran.</p></div><button class="btn btn-secondary btn-sm" onclick="setView('teacher-report',document.querySelector('#nav-teacher .nav-link:nth-child(2)'))">Buka rekod laporan</button></div><div class="student-list">${
      students
        .filter(
          (s) =>
            s.report.status !== "published" || attendanceStats(s).rate < 90,
        )
        .map((s) => teacherStudentRow(s, true))
        .join("") ||
      '<div class="empty-state">Tiada pelajar yang memerlukan tindakan segera.</div>'
    }</div></section><aside class="panel"><div class="panel-head"><div><h3>Makluman ibu bapa</h3><p class="panel-sub">Permohonan ketidakhadiran yang dihantar melalui portal.</p></div></div><div class="list">${
      data()
        .absenceRequests.filter((x) =>
          students.some((s) => s.id === x.studentId),
        )
        .slice(0, 4)
        .map((x) => {
          const st = getStudent(x.studentId);
          return `<div class="item"><div class="item-icon">✉</div><div class="item-main"><strong>${esc(st?.name || x.studentId)}</strong><span>${fmtDate(x.date)} · ${esc(x.reason)}<br>${esc(x.note || "Tiada nota")}</span></div></div>`;
        })
        .join("") || '<div class="empty-state">Tiada makluman baharu.</div>'
    }</div></aside></div>`;
  document.getElementById("view-teacher-report").innerHTML = teacherReportHtml(
    t,
    students,
  );
  document.getElementById("view-teacher-attendance").innerHTML =
    teacherAttendanceHtml(t, students);
  document.getElementById("view-teacher-students").innerHTML =
    teacherStudentsHtml(t, students);
}
function teacherStudentRow(s, showAction = false) {
  const st = attendanceStats(s);
  return `<div class="student-row">${studentPhoto(s)}<div class="student-meta"><strong>${esc(s.name)}</strong><span>${esc(s.id)} · Kehadiran ${st.rate}% · ${statusPill(s.report.status)}</span></div>${showAction ? `<button class="btn btn-outline btn-sm" onclick="selectTeacherStudent('${s.id}')">Semak</button>` : ""}</div>`;
}
function selectTeacherStudent(id) {
  teacherSelectedStudent = id;
  setView(
    "teacher-report",
    document.querySelector("#nav-teacher .nav-link:nth-child(2)"),
  );
}
function teacherReportHtml(t, students) {
  const s = getStudent(teacherSelectedStudent) || students[0];
  if (!s)
    return '<div class="empty-state">Tiada pelajar dalam akses anda.</div>';
  const canEditAll = t.roles.includes("Guru Kelas");
  const isFinal = s.report.status === "published";
  const subjectRows = Object.entries(s.scores)
    .map(([sub, val]) => {
      const editable = (t.subjects.includes(sub) || canEditAll) && !isFinal;
      return `<div class="score-input"><label>${esc(sub)} ${editable ? "" : "· Lihat sahaja"}</label><input ${editable ? "" : 'readonly class="read-only"'} type="number" min="0" max="100" data-subject="${esc(sub)}" value="${val}"></div>`;
    })
    .join("");
  return `<div class="section-title"><div><h2>Rekod laporan pelajar</h2><p>Simpan sebagai draf atau hantar untuk semakan pentadbir. Rekod diterbitkan hanya selepas kelulusan.</p></div>${statusPill(s.report.status)}</div><div class="grid-2-1"><section class="panel"><div class="panel-head"><div><h3>Maklumat laporan</h3><p class="panel-sub">Sila lengkapkan komponen yang berada dalam skop akses anda.</p></div></div><form onsubmit="saveTeacherReport(event,'draft')"><div class="form-grid"><div class="field"><label>Pilih pelajar</label><select id="teacher-student-select" onchange="teacherSelectedStudent=this.value;renderTeacher()">${students.map((x) => `<option value="${x.id}" ${x.id === s.id ? "selected" : ""}>${esc(x.name)} · ${esc(className(x.classId))}</option>`).join("")}</select></div><div class="field"><label>Status laporan</label><input value="${s.report.status === "published" ? "Telah diterbitkan" : s.report.status === "approved" ? "Diluluskan" : s.report.status === "submitted" ? "Menunggu semakan" : "Draf"}" class="read-only" readonly></div><div class="field span-2"><label>Markah akademik</label><div class="score-inputs">${subjectRows}</div><div class="form-help">Guru hanya boleh mengubah subjek dan kelas yang telah diberikan oleh pentadbir.</div></div><div class="field"><label>Kehadiran (%)</label><input id="teacher-attendance-score" type="number" min="0" max="100" value="${attendanceStats(s).rate}" ${t.canAttendance && !isFinal ? "" : 'readonly class="read-only"'}></div><div class="field"><label>Mata kokurikulum</label><input id="teacher-co-score" type="number" min="0" max="100" value="${s.co}" ${canEditAll && !isFinal ? "" : 'readonly class="read-only"'}></div><div class="field span-2"><label>Ulasan guru kelas</label><textarea id="teacher-comment" rows="4" ${canEditAll && !isFinal ? "" : 'readonly class="read-only"'}>${esc(s.comment)}</textarea></div><div class="field span-2"><label>Cadangan sokongan untuk keluarga</label><textarea id="teacher-support" rows="3" ${canEditAll && !isFinal ? "" : 'readonly class="read-only"'}>${esc(s.support)}</textarea></div></div><div class="actions" style="justify-content:flex-end;margin-top:19px"><button type="button" class="btn btn-outline" onclick="saveTeacherReport(null,'draft')" ${isFinal ? "disabled" : ""}>Simpan draf</button><button type="button" class="btn btn-primary" onclick="saveTeacherReport(null,'submitted')" ${isFinal ? "disabled" : ""}>Hantar untuk semakan</button></div></form></section><aside class="panel"><div class="panel-head"><div><h3>Aliran laporan</h3><p class="panel-sub">Proses penerbitan yang boleh dikesan.</p></div></div><div class="timeline"><div class="timeline-row"><div class="timeline-mark"><i class="timeline-dot" style="background:#2f78c3"></i></div><div><strong>Guru simpan rekod</strong><p>Data boleh disimpan sebagai draf sebelum dihantar.</p><span>${s.report.submittedAt ? fmtDateTime(s.report.submittedAt) : "Belum dihantar"}</span></div></div><div class="timeline-row"><div class="timeline-mark"><i class="timeline-dot" style="background:${["approved", "published"].includes(s.report.status) ? "#2f78c3" : "#dca230"}"></i></div><div><strong>Pentadbir semak</strong><p>Pemeriksaan kelengkapan, markah, dan ulasan.</p><span>${s.report.approvedAt ? fmtDateTime(s.report.approvedAt) : "Menunggu semakan"}</span></div></div><div class="timeline-row"><div class="timeline-mark"><i class="timeline-dot" style="background:${s.report.status === "published" ? "#35a476" : "#aeb9c5"}"></i></div><div><strong>Ibu bapa melihat laporan</strong><p>Hanya laporan diterbitkan dapat dilihat dari akaun penjaga.</p><span>${s.report.publishedAt ? fmtDateTime(s.report.publishedAt) : "Belum diterbitkan"}</span></div></div></div><div class="notice info" style="margin-top:17px"><strong>i</strong><div>Setiap perubahan direkodkan dalam audit trail sistem.</div></div></aside></div>`;
}
function saveTeacherReport(e, status) {
  if (e) e.preventDefault();
  const s = getStudent(teacherSelectedStudent),
    t = currentTeacher();
  if (!s) return;
  if (s.report.status === "published") {
    toast("Laporan yang telah diterbitkan tidak boleh diubah oleh guru.");
    return;
  }
  let changed = false;
  document
    .querySelectorAll("#view-teacher-report [data-subject]")
    .forEach((input) => {
      const sub = input.dataset.subject;
      if (!input.readOnly) {
        s.scores[sub] = Math.max(0, Math.min(100, Number(input.value) || 0));
        changed = true;
      }
    });
  const attendanceInput = document.getElementById("teacher-attendance-score");
  if (t.canAttendance && attendanceInput) {
    const target = Math.max(
      0,
      Math.min(100, Number(attendanceInput.value) || 0),
    );
    adjustAttendanceToRate(s, target);
    changed = true;
  }
  const co = document.getElementById("teacher-co-score");
  if (t.roles.includes("Guru Kelas") && co) {
    s.co = Math.max(0, Math.min(100, Number(co.value) || 0));
    s.comment =
      document.getElementById("teacher-comment").value.trim() || s.comment;
    s.support =
      document.getElementById("teacher-support").value.trim() || s.support;
    changed = true;
  }
  if (status === "submitted") {
    s.report.status = "submitted";
    s.report.submittedAt = new Date().toISOString();
    audit(`Menghantar laporan ${s.name} untuk semakan pentadbir.`, "green");
    toast("Laporan dihantar untuk semakan pentadbir.");
  } else {
    if (s.report.status !== "published") s.report.status = "draft";
    audit(`Menyimpan draf laporan ${s.name}.`, "info");
    toast(
      changed
        ? "Draf laporan telah disimpan."
        : "Tiada perubahan baharu direkodkan.",
    );
  }
  save();
  renderTeacher();
  renderSuper();
}
function adjustAttendanceToRate(s, target) {
  const keys = Object.keys(s.attendanceEntries);
  if (!keys.length) return;
  const shouldPresent = Math.round((keys.length * target) / 100);
  keys.forEach((k, i) => {
    s.attendanceEntries[k] = i < shouldPresent ? "P" : "A";
  });
  s.attendanceNotes = s.attendanceNotes || {};
}
function teacherAttendanceHtml(t, students) {
  const date = "2026-07-06";
  return `<div class="section-title"><div><h2>Kehadiran harian</h2><p>Rekod kehadiran untuk kelas yang ditugaskan kepada anda pada ${fmtDate(date)}.</p></div>${t.canAttendance ? '<span class="pill green">Akses dibenarkan</span>' : '<span class="pill red">Tiada akses</span>'}</div>${
    !t.canAttendance
      ? '<div class="notice danger"><strong>!</strong><div>Akaun anda tidak ditugaskan untuk merekod kehadiran. Hubungi super admin jika tugasan perlu dikemas kini.</div></div>'
      : `<section class="panel"><div class="panel-head"><div><h3>${t.classes.map(className).join(", ")}</h3><p class="panel-sub">Simpan rekod selepas menyemak semua pelajar.</p></div><button class="btn btn-secondary btn-sm" onclick="markAllPresent()">Tanda semua hadir</button></div><form onsubmit="saveDailyAttendance(event)"><table class="report-table"><thead><tr><th>Pelajar</th><th>Status</th><th>Nota ringkas</th></tr></thead><tbody>${students
          .map((s) => {
            const v = s.attendanceEntries[date] || "P";
            return `<tr><td><strong>${esc(s.name)}</strong><br><small class="muted">${esc(s.id)} · ${esc(className(s.classId))}</small></td><td><select class="attendance-status" data-id="${s.id}"><option value="P" ${v === "P" ? "selected" : ""}>Hadir</option><option value="L" ${v === "L" ? "selected" : ""}>Lewat</option><option value="A" ${v === "A" ? "selected" : ""}>Tidak hadir</option><option value="MC" ${v === "MC" ? "selected" : ""}>MC</option><option value="U" ${v === "U" ? "selected" : ""}>Urusan rasmi</option></select></td><td><input class="attendance-note" data-id="${s.id}" value="${esc(s.attendanceNotes?.[date] || "")}" placeholder="Contoh: Makluman ibu bapa diterima"></td></tr>`;
          })
          .join(
            "",
          )}</tbody></table><div class="actions" style="justify-content:flex-end;margin-top:18px"><button class="btn btn-primary">Simpan kehadiran hari ini</button></div></form></section>`
  }`;
}
function markAllPresent() {
  document
    .querySelectorAll(".attendance-status")
    .forEach((s) => (s.value = "P"));
  toast("Semua pelajar telah ditanda hadir. Sila simpan rekod.");
}
function saveDailyAttendance(e) {
  e.preventDefault();
  const date = "2026-07-06";
  document.querySelectorAll(".attendance-status").forEach((sel) => {
    const s = getStudent(sel.dataset.id);
    s.attendanceEntries[date] = sel.value;
    s.attendanceNotes = s.attendanceNotes || {};
    const note = document
      .querySelector(`.attendance-note[data-id="${sel.dataset.id}"]`)
      ?.value.trim();
    if (note) s.attendanceNotes[date] = note;
    else delete s.attendanceNotes[date];
  });
  audit(`Menyimpan rekod kehadiran untuk ${fmtDate(date)}.`, "green");
  save();
  toast("Kehadiran harian telah disimpan.");
  renderTeacher();
  renderParent();
  renderSuper();
}
function teacherStudentsHtml(t, students) {
  return `<div class="section-title"><div><h2>Pelajar saya</h2><p>Senarai pelajar aktif dalam kelas yang ditugaskan kepada anda.</p></div></div><section class="panel"><div class="panel-head"><div><h3>Carian dan status pelajar</h3><p class="panel-sub">Pilih pelajar untuk menyemak laporan dalam skop akses anda.</p></div><div class="filter-row"><input id="teacher-search" placeholder="Cari nama atau ID" oninput="filterStudentRows('teacher-roster',this.value)"><select onchange="filterTeacherClass(this.value)"><option value="">Semua kelas</option>${t.classes.map((c) => `<option value="${c}">${esc(className(c))}</option>`).join("")}</select></div></div><div class="student-list" id="teacher-roster">${students.map((s) => `<div class="student-row" data-search="${esc((s.name + " " + s.id + " " + s.classId).toLowerCase())}" data-class="${s.classId}">${studentPhoto(s)}<div class="student-meta"><strong>${esc(s.name)}</strong><span>${esc(s.id)} · ${esc(className(s.classId))} · Purata ${average(s)}%</span></div>${statusPill(s.report.status)}<button class="btn btn-outline btn-sm" onclick="selectTeacherStudent('${s.id}')">Rekod</button></div>`).join("")}</div></section>`;
}
function filterStudentRows(container, q) {
  q = q.toLowerCase();
  document
    .querySelectorAll("#" + container + " .student-row")
    .forEach((x) =>
      x.classList.toggle("hidden", !x.dataset.search.includes(q)),
    );
}
function filterTeacherClass(c) {
  document
    .querySelectorAll("#teacher-roster .student-row")
    .forEach((x) => x.classList.toggle("hidden", !!c && x.dataset.class !== c));
}

// Administrator views and school management
function renderSuper() {
  if (currentUser.role !== "super") return;
  const students = data().students,
    active = activeStudents(),
    reports = active.filter((s) => s.report.status === "submitted"),
    photos = active.filter((s) => !!s.photo).length;
  document.getElementById("view-super-home").innerHTML =
    `<div class="section-title"><div><h2>Ringkasan operasi sekolah</h2><p>Pantau kelengkapan data, proses laporan, akses pengguna, dan rekod penting sistem.</p></div><div class="actions"><button class="btn btn-secondary no-print" onclick="openImportModal()">⇧ Import data pelajar</button><button class="btn btn-outline no-print" onclick="exportData()">⇩ Eksport data demo</button></div></div><div class="kpi"><article class="quick-kpi"><span>Pelajar aktif</span><strong>${active.length}</strong></article><article class="quick-kpi"><span>Laporan menunggu semakan</span><strong>${reports.length}</strong></article><article class="quick-kpi"><span>Foto pasport lengkap</span><strong>${active.length ? Math.round((photos / active.length) * 100) : 0}%</strong></article></div><div class="grid-2-1" style="margin-top:16px"><section class="panel"><div class="panel-head"><div><h3>Kesihatan data sekolah</h3><p class="panel-sub">Metrik operasi untuk tindakan pentadbiran.</p></div></div><div class="progress-row"><span>Profil pelajar lengkap</span><div class="bar"><div class="fill green" style="width:${profileCompleteness()}%"></div></div><strong>${profileCompleteness()}%</strong></div><div class="progress-row"><span>Foto pasport</span><div class="bar"><div class="fill blue" style="width:${active.length ? Math.round((photos / active.length) * 100) : 0}%"></div></div><strong>${active.length ? Math.round((photos / active.length) * 100) : 0}%</strong></div><div class="progress-row"><span>Laporan diterbitkan</span><div class="bar"><div class="fill gold" style="width:${active.length ? Math.round((active.filter((s) => s.report.status === "published").length / active.length) * 100) : 0}%"></div></div><strong>${active.length ? Math.round((active.filter((s) => s.report.status === "published").length / active.length) * 100) : 0}%</strong></div><div class="progress-row"><span>Akses guru aktif</span><div class="bar"><div class="fill purple" style="width:${teacherAccessRate()}%"></div></div><strong>${teacherAccessRate()}%</strong></div><div class="notice ${reports.length ? "warn" : "success"}" style="margin-top:18px"><strong>${reports.length ? "!" : "✓"}</strong><div>${reports.length ? `Terdapat ${reports.length} laporan menunggu semakan. Buka Kelulusan laporan untuk tindakan.` : "Tiada laporan menunggu semakan pada masa ini."}</div></div><div class="import-hint no-print">Untuk memudahkan kerja pentadbir, butang import data pelajar melalui spreadsheet turut disediakan terus pada panel ini.</div></section><aside class="panel"><div class="panel-head"><div><h3>Audit terkini</h3><p class="panel-sub">Aktiviti terbaharu direkodkan sistem.</p></div><button class="btn btn-ghost btn-sm" onclick="setView('super-audit',document.querySelector('#nav-super .nav-link:nth-child(6)'))">Lihat semua</button></div>${auditHtml(data().audit.slice(0, 5))}</aside></div><div class="grid-2" style="margin-top:16px"><section class="panel"><div class="panel-head"><div><h3>Keutamaan tindakan</h3><p class="panel-sub">Isu yang patut dipantau pada hari ini.</p></div></div><div class="notice-list">${reports.length ? `<div class="notice warn"><strong>!</strong><div><strong>${reports.length} laporan untuk semakan</strong><br>Kelulusan perlu dibuat sebelum ibu bapa melihat laporan.</div></div>` : ""}${data().absenceRequests.filter((x) => x.status === "submitted").length ? `<div class="notice info"><strong>i</strong><div><strong>${data().absenceRequests.filter((x) => x.status === "submitted").length} makluman ketidakhadiran</strong><br>Guru kelas perlu menyemak makluman daripada ibu bapa.</div></div>` : ""}<div class="notice ${photos < active.length ? "warn" : "success"}"><strong>${photos < active.length ? "!" : "✓"}</strong><div><strong>Foto pasport: ${photos}/${active.length}</strong><br>${photos < active.length ? "Lengkapkan foto pelajar melalui modul Pelajar & penjaga." : "Semua pelajar aktif mempunyai foto pasport."}</div></div></div></section><section class="panel"><div class="panel-head"><div><h3>Maklumat sesi semasa</h3><p class="panel-sub">Data master yang digunakan oleh semua rekod.</p></div></div><div class="list"><div class="item"><div class="item-icon">▦</div><div class="item-main"><strong>Sesi akademik ${esc(data().school.session)}</strong><span>${esc(data().school.term)}</span></div></div><div class="item"><div class="item-icon">◫</div><div class="item-main"><strong>${data().school.classes.length} kelas aktif</strong><span>${data()
      .school.classes.map((x) => x.name)
      .join(
        ", ",
      )}</span></div></div><div class="item"><div class="item-icon">♙</div><div class="item-main"><strong>${data().accounts.teachers.filter((x) => x.active).length} guru dengan akses aktif</strong><span>Kawalan akses diurus melalui modul Akses guru.</span></div></div></div></section></div>${superGradeAnalyticsSectionHtml(active)}`;
  document.getElementById("view-super-approvals").innerHTML =
    superApprovalsHtml(reports);
  document.getElementById("view-super-students").innerHTML =
    superStudentsHtml(students);
  document.getElementById("view-super-teachers").innerHTML =
    superTeachersHtml();
  document.getElementById("view-super-master").innerHTML = superMasterHtml();
  document.getElementById("view-super-audit").innerHTML = superAuditHtml();
}
function profileCompleteness() {
  const a = activeStudents();
  if (!a.length) return 0;
  return Math.round(
    (a.filter(
      (s) => s.name && s.id && s.classId && s.guardian && s.guardianPhone,
    ).length /
      a.length) *
      100,
  );
}
function teacherAccessRate() {
  const x = data().accounts.teachers;
  return x.length
    ? Math.round((x.filter((t) => t.active).length / x.length) * 100)
    : 0;
}
function auditHtml(items) {
  return `<div class="audit-list">${items.map((a) => `<div class="audit-row"><i class="audit-dot" style="background:${a.type === "green" ? "#2b9d70" : a.type === "gold" ? "#dba332" : a.type === "red" ? "#d55353" : "#2f78c3"}"></i><div><strong>${esc(a.actor)}</strong> ${esc(a.action)}<span>${fmtDateTime(a.at)}</span></div></div>`).join("") || '<div class="empty-state">Tiada aktiviti direkodkan.</div>'}</div>`;
}
function superApprovalsHtml(reports) {
  const all = activeStudents().filter((s) =>
    ["submitted", "approved", "published"].includes(s.report.status),
  );
  return `<div class="section-title"><div><h2>Kelulusan laporan</h2><p>Semak laporan yang dihantar oleh guru sebelum menerbitkan kepada penjaga berdaftar.</p></div><span class="pill gold">${reports.length} menunggu semakan</span></div><section class="panel"><div class="panel-head"><div><h3>Senarai laporan</h3><p class="panel-sub">Pentadbir boleh meluluskan dan menerbitkan laporan dalam proses berasingan.</p></div><div class="filter-row"><input placeholder="Cari nama atau ID" oninput="filterStudentRows('approval-list',this.value)"></div></div><div class="student-list" id="approval-list">${all.map((s) => `<div class="student-row" data-search="${esc((s.name + " " + s.id).toLowerCase())}">${studentPhoto(s)}<div class="student-meta"><strong>${esc(s.name)}</strong><span>${esc(s.id)} · ${esc(className(s.classId))} · Dihantar: ${s.report.submittedAt ? fmtDateTime(s.report.submittedAt) : "Tiada rekod"}</span></div>${statusPill(s.report.status)}<div class="actions">${s.report.status === "submitted" ? `<button class="btn btn-secondary btn-sm" onclick="approveReport('${s.id}')">Luluskan</button>` : ""}${s.report.status === "approved" ? `<button class="btn btn-success btn-sm" onclick="publishReport('${s.id}')">Terbitkan</button>` : ""}<button class="btn btn-outline btn-sm" onclick="reviewReport('${s.id}')">Semak</button></div></div>`).join("") || '<div class="empty-state">Tiada laporan dalam aliran kelulusan pada masa ini.</div>'}</div></section>`;
}
function reviewReport(id) {
  const s = getStudent(id);
  openModal(
    "Semakan laporan pelajar",
    `<div class="student-row">${studentPhoto(s)}<div class="student-meta"><strong>${esc(s.name)}</strong><span>${esc(s.id)} · ${esc(className(s.classId))}</span></div>${statusPill(s.report.status)}</div><table class="report-table" style="margin-top:16px"><thead><tr><th>Subjek</th><th>Markah</th><th>Gred</th></tr></thead><tbody>${Object.entries(
      s.scores,
    )
      .map(
        ([x, y]) =>
          `<tr><td>${esc(x)}</td><td>${y}%</td><td>${gradeBadgeFromMark(y, "small")}</td></tr>`,
      )
      .join(
        "",
      )}</tbody></table><div class="notice info" style="margin-top:15px"><strong>i</strong><div><strong>Ulasan guru:</strong><br>${esc(s.comment)}</div></div><div class="actions" style="justify-content:flex-end;margin-top:17px"><button class="btn btn-outline" onclick="closeModal()">Tutup</button>${s.report.status === "submitted" ? `<button class="btn btn-primary" onclick="approveReport('${s.id}');closeModal()">Luluskan laporan</button>` : ""}${s.report.status === "approved" ? `<button class="btn btn-success" onclick="publishReport('${s.id}');closeModal()">Terbitkan laporan</button>` : ""}</div>`,
  );
}
function approveReport(id) {
  const s = getStudent(id);
  if (s.report.status !== "submitted") {
    toast("Laporan ini tidak berada dalam status menunggu semakan.");
    return;
  }
  s.report.status = "approved";
  s.report.approvedAt = new Date().toISOString();
  s.report.approvedBy = currentUser.name;
  audit(`Meluluskan laporan ${s.name}.`, "green");
  save();
  toast("Laporan telah diluluskan. Anda boleh menerbitkannya kepada ibu bapa.");
  refresh();
}
function publishReport(id) {
  const s = getStudent(id);
  if (s.report.status !== "approved") {
    toast("Laporan perlu diluluskan dahulu.");
    return;
  }
  s.report.status = "published";
  s.report.publishedAt = new Date().toISOString();
  audit(`Menerbitkan laporan ${s.name} kepada penjaga berdaftar.`, "gold");
  save();
  toast("Laporan telah diterbitkan kepada ibu bapa.");
  refresh();
}
function superStudentsHtml(students) {
  const active = students.filter((s) => s.status === "active"),
    archived = students.filter((s) => s.status === "archived");
  return `<div class="section-title"><div><h2>Pelajar & penjaga</h2><p>Daftar, kemas kini, pindah kelas, arkib, dan cari rekod pelajar dengan lebih cepat.</p></div><div class="actions"><button class="btn btn-secondary no-print" onclick="openImportModal()">⇧ Import spreadsheet</button><button class="btn btn-primary no-print" onclick="openStudentModal()">+ Tambah pelajar</button></div></div><div class="stats"><article class="stat"><div class="stat-top"><small>Pelajar aktif</small><div class="stat-icon">♙</div></div><b>${active.length}</b><span>boleh diakses oleh guru</span></article><article class="stat"><div class="stat-top"><small>Diarkibkan</small><div class="stat-icon gold">◫</div></div><b>${archived.length}</b><span>graduasi atau pindah keluar</span></article><article class="stat"><div class="stat-top"><small>Foto pasport</small><div class="stat-icon green">◉</div></div><b>${active.filter((x) => x.photo).length}</b><span>profil dengan foto</span></article><article class="stat"><div class="stat-top"><small>Penjaga dipautkan</small><div class="stat-icon purple">⌁</div></div><b>${new Set(active.map((x) => x.guardianId)).size}</b><span>akaun penjaga direkodkan</span></article></div><section class="panel" style="margin-top:16px"><div class="panel-head"><div><h3>Rekod pelajar</h3><p class="panel-sub">Status aktif membolehkan guru melihat pelajar dalam kelas yang ditugaskan.</p></div><div class="filter-row"><input placeholder="Cari nama, ID atau penjaga" oninput="filterStudentRows('super-student-list',this.value)"><select onchange="filterSuperStatus(this.value)"><option value="">Semua status</option><option value="active">Aktif</option><option value="archived">Diarkibkan</option></select></div></div><div class="student-list" id="super-student-list">${students.map((s) => `<div class="student-row" data-search="${esc((s.name + " " + s.id + " " + s.guardian).toLowerCase())}" data-status="${s.status}">${studentPhoto(s)}<div class="student-meta"><strong>${esc(s.name)}</strong><span>${esc(s.id)} · ${esc(className(s.classId))} · Penjaga: ${esc(s.guardian)} · ${esc(s.guardianPhone)}</span></div>${statusPill(s.status)}<div class="actions"><button class="btn btn-outline btn-sm" onclick="openStudentModal('${s.id}')">Edit</button><button class="btn btn-secondary btn-sm" onclick="openMoveClassModal('${s.id}')">Pindah kelas</button><button class="btn ${s.status === "active" ? "btn-danger" : "btn-success"} btn-sm" onclick="toggleStudentArchive('${s.id}')">${s.status === "active" ? "Arkib" : "Pulihkan"}</button></div></div>`).join("")}</div></section>`;
}
function filterSuperStatus(v) {
  document
    .querySelectorAll("#super-student-list .student-row")
    .forEach((x) =>
      x.classList.toggle("hidden", !!v && x.dataset.status !== v),
    );
}
function openStudentModal(id = null) {
  const s = id ? getStudent(id) : null;
  const classes = data()
    .school.classes.slice()
    .sort(
      (a, b) =>
        Number(a.form) - Number(b.form) || a.name.localeCompare(b.name, "ms"),
    );
  openModal(
    s ? "Kemaskini pelajar" : "Daftar pelajar baharu",
    `<form onsubmit="saveStudentModal(event,'${id || ""}')"><div class="form-grid"><div class="field"><label>Nama penuh pelajar</label><input id="student-name" value="${esc(s?.name || "")}" required></div><div class="field"><label>ID pelajar</label><input id="student-id" value="${esc(s?.id || nextStudentId())}" ${s ? 'readonly class="read-only"' : ""} required></div><div class="field"><label>Kelas</label><select id="student-class" onchange="updateStudentFormPreview()">${classes.map((c) => `<option value="${c.id}" ${s?.classId === c.id ? "selected" : ""}>Tingkatan ${c.form} · ${esc(c.name.replace(/^Tingkatan \d+\s*/, ""))}</option>`).join("")}</select><div class="form-help" id="student-form-preview"></div></div><div class="field"><label>Jantina</label><select id="student-gender"><option ${s?.gender === "Lelaki" ? "selected" : ""}>Lelaki</option><option ${s?.gender === "Perempuan" ? "selected" : ""}>Perempuan</option></select></div><div class="field"><label>Nama penjaga</label><input id="student-guardian" value="${esc(s?.guardian || "")}" required></div><div class="field"><label>Nombor telefon penjaga</label><input id="student-phone" value="${esc(s?.guardianPhone || "")}" required></div><div class="field span-2"><label>Foto pasport pelajar</label><div class="upload-box">JPG atau PNG sahaja, maksimum 2 MB.<br><label for="student-photo-input">Pilih gambar</label><input type="file" id="student-photo-input" accept="image/png,image/jpeg" onchange="previewStudentPhoto(event)"><div class="photo-preview" id="student-photo-preview">${s?.photo ? `<img src="${s.photo}" alt="Pratonton foto">` : "◉"}</div></div></div></div><div class="actions" style="justify-content:flex-end;margin-top:18px"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn btn-primary">${s ? "Simpan perubahan" : "Daftar pelajar"}</button></div></form>`,
  );
  photoData = s?.photo || "";
  setTimeout(updateStudentFormPreview, 0);
}
function updateStudentFormPreview() {
  const el = document.getElementById("student-class"),
    out = document.getElementById("student-form-preview");
  if (!el || !out) return;
  const c = classRecord(el.value),
    band =
      c.band === "lower"
        ? "Menengah Rendah"
        : c.band === "form6"
          ? "Tingkatan 6"
          : "Menengah Atas";
  out.textContent = `${band} · ${subjectsForClass(el.value).length} subjek profil akan digunakan.`;
}
function nextStudentId() {
  const nums = data()
    .students.map((s) => parseInt(String(s.id).split("-").pop(), 10))
    .filter(Number.isFinite);
  return "SMK2026-" + String(Math.max(...nums, 0) + 1).padStart(3, "0");
}
function previewStudentPhoto(e) {
  const f = e.target.files?.[0];
  if (!f) return;
  if (!["image/jpeg", "image/png"].includes(f.type)) {
    toast("Hanya fail JPG atau PNG dibenarkan.");
    e.target.value = "";
    return;
  }
  if (f.size > 2 * 1024 * 1024) {
    toast("Saiz gambar melebihi 2 MB.");
    e.target.value = "";
    return;
  }
  const r = new FileReader();
  r.onload = () => {
    photoData = r.result;
    document.getElementById("student-photo-preview").innerHTML =
      `<img src="${photoData}" alt="Pratonton foto">`;
  };
  r.readAsDataURL(f);
}
function saveStudentModal(e, id) {
  e.preventDefault();
  const d = data(),
    name = document.getElementById("student-name").value.trim(),
    studentId = document.getElementById("student-id").value.trim(),
    guardian = document.getElementById("student-guardian").value.trim(),
    phone = document.getElementById("student-phone").value.trim(),
    classId = document.getElementById("student-class").value;
  let s = id ? getStudent(id) : null;
  if (
    !s &&
    d.students.some((x) => x.id.toLowerCase() === studentId.toLowerCase())
  ) {
    toast("ID pelajar ini telah digunakan.");
    return;
  }
  if (!s) {
    const parentId = "P" + Date.now();
    s = {
      id: studentId,
      name,
      classId,
      guardianId: parentId,
      guardian,
      guardianPhone: phone,
      photo: photoData,
      status: "active",
      gender: document.getElementById("student-gender").value,
      attendanceEntries: {},
      attendanceNotes: {},
      scores: Object.fromEntries(subjectsForClass(classId).map((x) => [x, 0])),
      co: 0,
      activities: [],
      comment: "Rekod baharu. Ulasan akan dikemas kini oleh guru kelas.",
      discipline: "Tiada rekod disiplin",
      support: "Belum ada cadangan sokongan.",
      report: {
        session: d.school.session,
        term: d.school.term,
        status: "draft",
      },
      history: [],
    };
    d.students.push(s);
    d.accounts.parents.push({
      id: parentId,
      name: guardian,
      email: "",
      phone,
      password: "",
      childIds: [studentId],
      address: "",
    });
    audit(
      `Mendaftarkan pelajar Tingkatan ${formLevelOf(s)}: ${name}.`,
      "green",
    );
    toast("Pelajar baharu berjaya didaftarkan.");
  } else {
    const changedClass = s.classId !== classId;
    s.name = name;
    s.classId = classId;
    s.gender = document.getElementById("student-gender").value;
    s.guardian = guardian;
    s.guardianPhone = phone;
    s.photo = photoData;
    if (changedClass) syncStudentSubjects(s, classId);
    audit(`Mengemas kini profil pelajar: ${name}.`, "info");
    toast("Profil pelajar telah dikemas kini.");
  }
  save();
  closeModal();
  refresh();
}
function openMoveClassModal(id) {
  const s = getStudent(id);
  openModal(
    "Pindah kelas pelajar",
    `<div class="notice info"><strong>i</strong><div><strong>${esc(s.name)}</strong><br>${esc(s.id)} kini berada di ${esc(className(s.classId))}.</div></div><form onsubmit="moveStudentClass(event,'${id}')"><div class="field"><label>Kelas baharu</label><select id="move-class">${data()
      .school.classes.slice()
      .sort(
        (a, b) =>
          Number(a.form) - Number(b.form) || a.name.localeCompare(b.name, "ms"),
      )
      .map(
        (c) =>
          `<option value="${c.id}" ${c.id === s.classId ? "selected" : ""}>Tingkatan ${c.form} · ${esc(c.name.replace(/^Tingkatan \d+\s*/, ""))}</option>`,
      )
      .join(
        "",
      )}</select></div><div class="field"><label>Sebab pertukaran</label><input id="move-reason" placeholder="Contoh: Naik tingkatan atau pertukaran kelas" required></div><div class="actions" style="justify-content:flex-end;margin-top:18px"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn btn-primary">Simpan pertukaran</button></div></form>`,
  );
}
function moveStudentClass(e, id) {
  e.preventDefault();
  const s = getStudent(id),
    oldId = s.classId,
    old = className(oldId),
    newId = document.getElementById("move-class").value;
  s.classId = newId;
  if (
    formBandOf(oldId) !== formBandOf(newId) ||
    formLevelOf(oldId) !== formLevelOf(newId)
  )
    syncStudentSubjects(s, newId);
  audit(
    `Memindahkan ${s.name} dari ${old} ke ${className(s.classId)}. Sebab: ${document.getElementById("move-reason").value.trim()}`,
    "info",
  );
  save();
  closeModal();
  toast("Kelas dan profil akademik pelajar telah dikemas kini.");
  refresh();
}
function toggleStudentArchive(id) {
  const s = getStudent(id);
  const target = s.status === "active" ? "archived" : "active";
  if (
    !confirm(
      target === "archived"
        ? `Arkibkan ${s.name}? Pelajar tidak lagi muncul pada akses guru.`
        : `Pulihkan ${s.name} sebagai pelajar aktif?`,
    )
  )
    return;
  s.status = target;
  audit(
    `${target === "archived" ? "Mengarkibkan" : "Memulihkan"} pelajar ${s.name}.`,
    target === "archived" ? "red" : "green",
  );
  save();
  toast(
    target === "archived"
      ? "Pelajar telah diarkibkan."
      : "Pelajar telah dipulihkan sebagai aktif.",
  );
  refresh();
}
function openImportModal() {
  openModal(
    "Import data pelajar melalui spreadsheet",
    `<div class="notice info"><strong>i</strong><div>Gunakan format: <strong>nama,id,kelas,penjaga,telefon,jantina</strong>. Kelas mesti menggunakan kod seperti 2A, 2B atau 3A.</div></div><div class="file-import" style="margin-top:15px"><label for="csv-import">Pilih fail spreadsheet / CSV</label><input id="csv-import" type="file" accept=".csv,text/csv" onchange="previewCsv(event)"><p id="csv-preview" class="form-help">Tiada fail dipilih.</p></div><div class="actions" style="justify-content:flex-end;margin-top:18px"><button class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn btn-primary" id="csv-save-btn" disabled onclick="importCsv()">Import data pelajar</button></div>`,
  );
}
let csvRows = [];
function previewCsv(e) {
  const f = e.target.files?.[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    const lines = String(r.result)
      .split(/\r?\n/)
      .filter((x) => x.trim());
    csvRows = lines
      .slice(lines[0].toLowerCase().includes("nama") ? 1 : 0)
      .map((x) => x.split(",").map((y) => y.trim()))
      .filter((x) => x.length >= 5);
    document.getElementById("csv-preview").textContent =
      `${csvRows.length} rekod ditemui. Semak format sebelum import.`;
    document.getElementById("csv-save-btn").disabled = !csvRows.length;
  };
  r.readAsText(f);
}
function importCsv() {
  let added = 0;
  csvRows.forEach((r) => {
    const [name, id, classId, guardian, phone, gender = ""] = r;
    if (
      !name ||
      !id ||
      !data().school.classes.some((c) => c.id === classId) ||
      data().students.some((s) => s.id === id)
    )
      return;
    const parentId = "P" + Date.now() + added;
    data().students.push({
      id,
      name,
      classId,
      guardianId: parentId,
      guardian,
      guardianPhone: phone,
      photo: "",
      status: "active",
      gender,
      attendanceEntries: {},
      attendanceNotes: {},
      scores: Object.fromEntries(subjectsForClass(classId).map((x) => [x, 0])),
      co: 0,
      activities: [],
      comment: "Rekod baharu. Ulasan akan dikemas kini oleh guru kelas.",
      discipline: "Tiada rekod disiplin",
      support: "Belum ada cadangan sokongan.",
      report: {
        session: data().school.session,
        term: data().school.term,
        status: "draft",
      },
      history: [],
    });
    data().accounts.parents.push({
      id: parentId,
      name: guardian,
      email: "",
      phone,
      password: "",
      childIds: [id],
      address: "",
    });
    added++;
  });
  audit(`Mengimport ${added} rekod pelajar melalui CSV.`, "green");
  save();
  closeModal();
  toast(`${added} rekod pelajar berjaya diimport.`);
  refresh();
}
function superTeachersHtml() {
  const t = data().accounts.teachers;
  return `<div class="section-title"><div><h2>Akses guru</h2><p>Tetapkan peranan, kelas, subjek, dan hak kehadiran bagi setiap akaun guru.</p></div><button class="btn btn-primary no-print" onclick="openTeacherModal()">+ Tambah guru</button></div><section class="panel"><div class="panel-head"><div><h3>Senarai guru admin</h3><p class="panel-sub">Akses guru harus terhad kepada tugasan sebenar mereka.</p></div></div><table class="report-table"><thead><tr><th>Guru</th><th>Peranan & akses</th><th>Kelas</th><th>Subjek</th><th>Status</th><th></th></tr></thead><tbody>${t.map((x) => `<tr><td><strong>${esc(x.name)}</strong><br><small class="muted">${esc(x.email)}</small></td><td>${esc(x.roles.join(", "))}<br><small class="muted">Kehadiran: ${x.canAttendance ? "Dibenarkan" : "Tidak dibenarkan"}</small></td><td>${x.classes.map(className).join(", ") || "Tiada"}</td><td>${x.subjects.join(", ") || "Tiada"}</td><td>${statusPill(x.active ? "active" : "archived")}</td><td class="table-actions"><button class="btn btn-outline btn-sm" onclick="openTeacherModal('${x.id}')">Edit</button></td></tr>`).join("")}</tbody></table></section>`;
}
function openTeacherModal(id = null) {
  const t = id ? data().accounts.teachers.find((x) => x.id === id) : null;
  const classChecks = data()
    .school.classes.map(
      (c) =>
        `<label class="checkline"><input type="checkbox" name="tclass" value="${c.id}" ${t?.classes.includes(c.id) ? "checked" : ""}> ${esc(c.name)}</label>`,
    )
    .join("");
  const subjectChecks = data()
    .school.subjects.map(
      (s) =>
        `<label class="checkline"><input type="checkbox" name="tsubject" value="${esc(s)}" ${t?.subjects.includes(s) ? "checked" : ""}> ${esc(s)}</label>`,
    )
    .join("");
  openModal(
    t ? "Kemaskini akses guru" : "Tambah akses guru",
    `<form onsubmit="saveTeacherModal(event,'${id || ""}')"><div class="form-grid"><div class="field"><label>Nama guru</label><input id="teacher-name" value="${esc(t?.name || "")}" required></div><div class="field"><label>E-mel</label><input id="teacher-email" type="email" value="${esc(t?.email || "")}" required></div><div class="field"><label>Kata laluan demo</label><input id="teacher-password" value="${esc(t?.password || "guru123")}" required></div><div class="field"><label>Status akaun</label><select id="teacher-active"><option value="true" ${t?.active !== false ? "selected" : ""}>Aktif</option><option value="false" ${t?.active === false ? "selected" : ""}>Tidak aktif</option></select></div><div class="field span-2"><label>Peranan</label><input id="teacher-roles" value="${esc(t?.roles.join(", ") || "Guru Subjek")}" placeholder="Contoh: Guru Kelas, Guru Bahasa Melayu" required><div class="form-help">Gunakan koma untuk memisahkan beberapa peranan.</div></div><div class="field"><label>Kelas ditugaskan</label><div style="display:grid;gap:7px;margin-top:4px">${classChecks}</div></div><div class="field"><label>Subjek dibenarkan</label><div style="display:grid;gap:7px;margin-top:4px">${subjectChecks}</div></div><div class="field span-2"><label class="checkline"><input type="checkbox" id="teacher-attendance-right" ${t?.canAttendance ? "checked" : ""}> Benarkan guru merekod kehadiran untuk kelas yang ditugaskan.</label></div></div><div class="actions" style="justify-content:flex-end;margin-top:18px"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn btn-primary">Simpan akses</button></div></form>`,
  );
}
function saveTeacherModal(e, id) {
  e.preventDefault();
  const name = document.getElementById("teacher-name").value.trim(),
    email = document.getElementById("teacher-email").value.trim().toLowerCase();
  let t = id ? data().accounts.teachers.find((x) => x.id === id) : null;
  if (
    !t &&
    data().accounts.teachers.some((x) => x.email.toLowerCase() === email)
  ) {
    toast("E-mel guru ini telah digunakan.");
    return;
  }
  const vals = (arr) =>
    [...document.querySelectorAll(arr)]
      .filter((x) => x.checked)
      .map((x) => x.value);
  if (!t) {
    t = {
      id: "T" + Date.now(),
      name,
      email,
      password: "",
      roles: [],
      classes: [],
      subjects: [],
      canAttendance: false,
      active: true,
    };
    data().accounts.teachers.push(t);
  }
  t.name = name;
  t.email = email;
  t.password = document.getElementById("teacher-password").value;
  t.roles = document
    .getElementById("teacher-roles")
    .value.split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  t.classes = vals('input[name="tclass"]');
  t.subjects = vals('input[name="tsubject"]');
  t.canAttendance = document.getElementById("teacher-attendance-right").checked;
  t.active = document.getElementById("teacher-active").value === "true";
  audit(`${id ? "Mengemas kini" : "Menambah"} akses guru: ${name}.`, "info");
  save();
  closeModal();
  toast("Akses guru telah disimpan.");
  refresh();
}
function superMasterHtml() {
  const sc = data().school,
    formCounts = [1, 2, 3, 4, 5, 6].map((form) => ({
      form,
      classes: sc.classes.filter((c) => Number(c.form) === form).length,
      students: activeStudents().filter((s) => formLevelOf(s) === form).length,
    }));
  const profileLabel = {
    lower: "Tingkatan 1 hingga 3",
    upper: "Tingkatan 4 dan 5",
    form6: "Tingkatan 6",
  };
  return `<div class="section-title"><div><h2>Data sekolah Tingkatan 1 hingga 6</h2><p>Struktur kelas, subjek dan profil penilaian kini menyokong Menengah Rendah, Menengah Atas dan Tingkatan 6.</p></div></div><div class="stats">${formCounts.map((x) => `<article class="stat"><div class="stat-top"><small>Tingkatan ${x.form}</small><div class="stat-icon ${x.form === 6 ? "purple" : x.form >= 4 ? "gold" : "green"}">${x.form}</div></div><b>${x.students}</b><span>${x.classes} kelas aktif</span></article>`).join("")}</div><div class="grid-2" style="margin-top:16px"><section class="panel"><div class="panel-head"><div><h3>Sesi akademik</h3><p class="panel-sub">Data ini muncul pada laporan dan dashboard semua tingkatan.</p></div></div><form onsubmit="saveSchoolSettings(event)"><div class="field"><label>Sesi akademik</label><input id="school-session" value="${esc(sc.session)}" required></div><div class="field"><label>Penggal atau semester semasa</label><select id="school-term">${["Penggal 1", "Penggal 2", "Penggal 3", "Semester 1", "Semester 2", "Semester 3"].map((x) => `<option ${sc.term === x ? "selected" : ""}>${x}</option>`).join("")}</select></div><button class="btn btn-primary" style="margin-top:16px">Simpan data sesi</button></form></section><section class="panel"><div class="panel-head"><div><h3>Kelas aktif</h3><p class="panel-sub">Kelas disusun mengikut Tingkatan 1 hingga Tingkatan 6.</p></div><button class="btn btn-secondary btn-sm" onclick="openClassModal()">+ Tambah kelas</button></div><div class="list">${sc.classes
    .slice()
    .sort(
      (a, b) =>
        Number(a.form) - Number(b.form) || a.name.localeCompare(b.name, "ms"),
    )
    .map(
      (c) =>
        `<div class="item"><div class="item-icon">${c.form}</div><div class="item-main"><strong>${esc(c.name)}</strong><span>Tingkatan ${c.form} · Kod ${esc(c.id)} · ${activeStudents().filter((s) => s.classId === c.id).length} pelajar aktif</span></div><button class="btn btn-danger btn-sm" onclick="deleteClass('${c.id}')">Padam</button></div>`,
    )
    .join(
      "",
    )}</div></section></div><section class="panel" style="margin-top:16px"><div class="panel-head"><div><h3>Profil subjek mengikut peringkat</h3><p class="panel-sub">Subjek baharu boleh ditugaskan kepada satu peringkat atau semua tingkatan.</p></div><button class="btn btn-secondary btn-sm" onclick="openSubjectModal()">+ Tambah subjek</button></div><div class="grid-3">${Object.entries(
    sc.subjectProfiles,
  )
    .map(
      ([band, subjects]) =>
        `<div><h3 style="margin-bottom:10px">${profileLabel[band]}</h3><div class="list">${subjects.map((sub) => `<div class="item"><div class="item-icon">▦</div><div class="item-main"><strong>${esc(sub)}</strong><span>${profileLabel[band]}</span></div><button class="btn btn-danger btn-sm" onclick="deleteSubject('${esc(sub)}')">Padam</button></div>`).join("")}</div></div>`,
    )
    .join(
      "",
    )}</div></section><section class="panel" style="margin-top:16px"><div class="panel-head"><div><h3>Data kokurikulum</h3><p class="panel-sub">Aktiviti boleh digunakan oleh pelajar Tingkatan 1 hingga Tingkatan 6.</p></div></div><div class="grid-3">${sc.activities.map((a) => `<div class="role-box"><i>★</i><div><strong>${esc(a)}</strong><span>Aktiviti kokurikulum berdaftar</span></div></div>`).join("")}</div></section>`;
}
function saveSchoolSettings(e) {
  e.preventDefault();
  data().school.session = document
    .getElementById("school-session")
    .value.trim();
  data().school.term = document.getElementById("school-term").value;
  data().students.forEach((s) => {
    if (s.report.status === "draft") {
      s.report.session = data().school.session;
      s.report.term = data().school.term;
    }
  });
  audit("Mengemas kini sesi dan penggal sekolah.", "info");
  save();
  toast("Data sesi sekolah telah disimpan.");
  refresh();
}
function openClassModal() {
  openModal(
    "Tambah kelas baharu",
    `<form onsubmit="saveClass(event)"><div class="form-grid"><div class="field"><label>Tingkatan</label><select id="new-class-form">${[1, 2, 3, 4, 5, 6].map((n) => `<option value="${n}">Tingkatan ${n}</option>`).join("")}</select></div><div class="field"><label>Kod kelas</label><input id="new-class-id" placeholder="Contoh: 1A atau 6R" required></div><div class="field span-2"><label>Nama kelas</label><input id="new-class-name" placeholder="Contoh: Tingkatan 1 Amanah" required></div></div><div class="actions" style="justify-content:flex-end;margin-top:18px"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn btn-primary">Tambah kelas</button></div></form>`,
  );
}
function saveClass(e) {
  e.preventDefault();
  const id = document.getElementById("new-class-id").value.trim(),
    name = document.getElementById("new-class-name").value.trim(),
    form = Number(document.getElementById("new-class-form").value),
    band = form <= 3 ? "lower" : form === 6 ? "form6" : "upper";
  if (data().school.classes.some((c) => c.id === id)) {
    toast("Kod kelas ini telah digunakan.");
    return;
  }
  data().school.classes.push({ id, name, form, band });
  data().school.classes.sort(
    (a, b) =>
      Number(a.form) - Number(b.form) || a.name.localeCompare(b.name, "ms"),
  );
  audit(`Menambah kelas Tingkatan ${form}: ${name}.`, "info");
  save();
  closeModal();
  toast("Kelas baharu ditambah.");
  refresh();
}
function deleteClass(id) {
  if (activeStudents().some((s) => s.classId === id)) {
    toast("Kelas ini masih mempunyai pelajar aktif dan tidak boleh dipadam.");
    return;
  }
  if (!confirm("Padam kelas ini?")) return;
  const c = data().school.classes.find((c) => c.id === id);
  data().school.classes = data().school.classes.filter((c) => c.id !== id);
  audit(`Memadam kelas: ${c?.name || id}.`, "red");
  save();
  refresh();
}
function openSubjectModal() {
  openModal(
    "Tambah subjek laporan",
    `<form onsubmit="saveSubject(event)"><div class="field"><label>Nama subjek</label><input id="new-subject" placeholder="Contoh: Geografi" required></div><div class="field"><label>Peringkat</label><select id="new-subject-band"><option value="lower">Tingkatan 1 hingga 3</option><option value="upper">Tingkatan 4 dan 5</option><option value="form6">Tingkatan 6</option><option value="all">Semua tingkatan</option></select></div><div class="actions" style="justify-content:flex-end;margin-top:18px"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn btn-primary">Tambah subjek</button></div></form>`,
  );
}
function saveSubject(e) {
  e.preventDefault();
  const sub = document.getElementById("new-subject").value.trim(),
    band = document.getElementById("new-subject-band").value,
    targets = band === "all" ? ["lower", "upper", "form6"] : [band];
  targets.forEach((k) => {
    if (!data().school.subjectProfiles[k].includes(sub))
      data().school.subjectProfiles[k].push(sub);
  });
  data().school.subjects = Array.from(
    new Set(Object.values(data().school.subjectProfiles).flat()),
  );
  data().students.forEach((s) => {
    if (targets.includes(formBandOf(s)) && !(sub in s.scores))
      s.scores[sub] = 0;
  });
  audit(
    `Menambah subjek laporan ${sub} untuk ${band === "all" ? "semua tingkatan" : band}.`,
    "info",
  );
  save();
  closeModal();
  toast("Subjek baharu telah ditambah.");
  refresh();
}
function deleteSubject(sub) {
  if (!confirm(`Padam subjek ${sub} daripada semua rekod?`)) return;
  Object.keys(data().school.subjectProfiles || {}).forEach(
    (k) =>
      (data().school.subjectProfiles[k] = data().school.subjectProfiles[
        k
      ].filter((x) => x !== sub)),
  );
  data().school.subjects = Array.from(
    new Set(Object.values(data().school.subjectProfiles || {}).flat()),
  );
  data().students.forEach((s) => delete s.scores[sub]);
  data().accounts.teachers.forEach(
    (t) => (t.subjects = t.subjects.filter((x) => x !== sub)),
  );
  audit(`Memadam subjek laporan: ${sub}.`, "red");
  save();
  refresh();
}
function superAuditHtml() {
  const privacy = data().consent;
  return `<div class="section-title"><div><h2>Audit & privasi</h2><p>Jejak perubahan penting dan urus kawalan asas data pelajar dalam prototaip ini.</p></div><div class="actions"><button class="btn btn-secondary no-print" onclick="exportData()">⇩ Eksport JSON</button><button class="btn btn-danger no-print" onclick="resetDemo()">↺ Reset data demo</button></div></div><div class="grid-2-1"><section class="panel"><div class="panel-head"><div><h3>Audit trail</h3><p class="panel-sub">Kemas kini rekod, akses, kelulusan, dan proses lain.</p></div><div class="filter-row"><input placeholder="Cari aktiviti" oninput="filterAudit(this.value)"></div></div><div id="full-audit">${auditHtml(data().audit)}</div></section><aside class="panel"><div class="panel-head"><div><h3>Kawalan privasi</h3><p class="panel-sub">Keperluan asas yang perlu disambungkan kepada backend produksi.</p></div></div><div class="list"><div class="item"><div class="item-icon">✓</div><div class="item-main"><strong>Persetujuan penjaga</strong><span>${privacy.guardianConsent ? "Direkodkan dalam data demo" : "Perlu dikumpulkan"}</span></div></div><div class="item"><div class="item-icon">✓</div><div class="item-main"><strong>Dasar privasi</strong><span>${privacy.privacyPolicy ? "Status diterima dalam data demo" : "Belum diterima"}</span></div></div><div class="item"><div class="item-icon">◷</div><div class="item-main"><strong>Semakan polisi terakhir</strong><span>${fmtDate(privacy.lastReview)}</span></div></div></div><div class="notice warn" style="margin-top:16px"><strong>!</strong><div><strong>Versi ini ialah prototaip frontend.</strong><br>Data berada dalam storan pelayar. Produksi perlu menggunakan pengesahan server, kata laluan terhash, kawalan akses server-side, penyulitan, sandaran, dan semakan PDPA.</div></div></aside></div>`;
}
function filterAudit(q) {
  q = q.toLowerCase();
  const filtered = data().audit.filter((x) =>
    (x.actor + " " + x.action).toLowerCase().includes(q),
  );
  document.getElementById("full-audit").innerHTML = auditHtml(filtered);
}
// Data export and shared modal helpers
function exportData() {
  const blob = new Blob([JSON.stringify(data(), null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "smk-seri-bestari-demo-data.json";
  a.click();
  URL.revokeObjectURL(a.href);
  audit("Mengeksport data demo daripada portal.", "gold");
  save();
  toast("Fail data demo telah dimuat turun.");
}
function openModal(title, body) {
  document.getElementById("modal-root").innerHTML =
    `<div class="modal-backdrop" onclick="if(event.target===this)closeModal()"><div class="modal"><div class="modal-head"><h3>${title}</h3><button class="modal-close" onclick="closeModal()">×</button></div>${body}</div></div>`;
}
function closeModal() {
  document.getElementById("modal-root").innerHTML = "";
}

/* =========================================================
   COEx & Gear Up. Digital interpretation of the client PDF.
   ========================================================= */
let teacherCoexCheckpoint = "trial";
let coexAdminStudentFilter = "";

const COEX_TONES = {
  1: { color: "#000000", fg: "#ffffff", name: "Hitam" },
  2: { color: "#ff0000", fg: "#000000", name: "Merah" },
  3: { color: "#833c0b", fg: "#ffffff", name: "Coklat" },
  4: { color: "#ff9900", fg: "#000000", name: "Oren" },
  5: { color: "#00b0f0", fg: "#001820", name: "Biru muda" },
  6: { color: "#0070c0", fg: "#ffffff", name: "Biru gelap" },
  7: { color: "#91d050", fg: "#102600", name: "Hijau muda" },
  8: { color: "#00b050", fg: "#001b0c", name: "Hijau gelap" },
  9: { color: "#cc66ff", fg: "#240033", name: "Ungu muda" },
  10: { color: "#cc66ff", fg: "#240033", name: "Ungu muda" },
  11: { color: "#7030a0", fg: "#ffffff", name: "Ungu gelap" },
};

// COEx rules, scoring and progression helpers
function defaultCoexRules() {
  return [
    {
      gear: 1,
      min: 0,
      max: 25,
      grade: "G1",
      zone: "Zon Kritikal",
      level: "Belum Bersedia Belajar",
      action:
        "Intervensi individu, kelas pemulihan, libat urus ibu bapa dan pemantauan rapi.",
    },
    {
      gear: 2,
      min: 26,
      max: 39,
      grade: "G2",
      zone: "Zon Risiko",
      level: "Bersedia Belajar",
      action:
        "Bimbingan berfokus, latihan asas, pemantauan berkala dan motivasi berterusan.",
    },
    {
      gear: 3,
      min: 40,
      max: 44,
      grade: "E",
      zone: "Zon Pemulihan",
      level: "Fokus Pembelajaran",
      action:
        "Pengukuhan konsep asas, latihan mengikut topik dan pentaksiran formatif.",
    },
    {
      gear: 4,
      min: 45,
      max: 49,
      grade: "D",
      zone: "Zon Perkembangan",
      level: "Memahami Asas",
      action: "Latihan pengukuhan, sasaran lulus dan peningkatan markah.",
    },
    {
      gear: 5,
      min: 50,
      max: 54,
      grade: "C",
      zone: "Zon Penguasaan",
      level: "Penglibatan Aktif",
      action: "Pengayaan, latihan KBAT asas dan pengekalan prestasi.",
    },
    {
      gear: 6,
      min: 55,
      max: 59,
      grade: "C+",
      zone: "Zon Penguasaan",
      level: "Menguasai Pembelajaran",
      action: "Latihan berpandu, pengayaan dan peningkatan konsisten.",
    },
    {
      gear: 7,
      min: 60,
      max: 64,
      grade: "B",
      zone: "Zon Kecemerlangan",
      level: "Konsisten Cemerlang",
      action:
        "Latihan pengayaan, teknik menjawab, analisis kesilapan dan latihan topikal aras tinggi.",
    },
    {
      gear: 8,
      min: 65,
      max: 69,
      grade: "B+",
      zone: "Zon Kecemerlangan",
      level: "Pembelajaran Kendiri",
      action:
        "Mantapkan pembelajaran kendiri, latihan aras tinggi dan sasaran gred A.",
    },
    {
      gear: 9,
      min: 70,
      max: 79,
      grade: "A-",
      zone: "Zon Ikon",
      level: "Inisiatif Kecemerlangan",
      action:
        "Latih tubi soalan sebenar SPM, bedah kertas, analisis skema dan simulasi peperiksaan.",
    },
    {
      gear: 10,
      min: 80,
      max: 89,
      grade: "A",
      zone: "Zon Ikon",
      level: "Pemimpin Pembelajaran",
      action:
        "Strategi berimpak tinggi untuk meningkatkan A kepada A+ dan membimbing rakan.",
    },
    {
      gear: 11,
      min: 90,
      max: 100,
      grade: "A+",
      zone: "Zon Ikon",
      level: "Pencinta Ilmu",
      action:
        "Program Pecutan A+, latihan KBAT aras tinggi, analisis kesilapan dan simulasi SPM.",
    },
  ];
}
function defaultCoexSettings() {
  return {
    lmsPassMark: 40,
    creditGear: 5,
    purpleGear: 10,
    currentCheckpoint: "trial",
    checkpoints: {
      tov: "Diagnostik",
      pat: "Pentaksiran 1",
      ppt: "Pentaksiran 2",
      trial: "Penilaian Semasa",
      target: "Sasaran",
    },
    rules: defaultCoexRules(),
  };
}
function ensureCoexSettings() {
  if (!data().coexSettings) data().coexSettings = defaultCoexSettings();
  if (!Array.isArray(data().interventions)) data().interventions = [];
  return data().coexSettings;
}
function clampMark(n) {
  return Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
}
function coexRules() {
  return ensureCoexSettings()
    .rules.slice()
    .sort((a, b) => a.min - b.min);
}
function coexRule(mark) {
  mark = clampMark(mark);
  return (
    coexRules().find((r) => mark >= Number(r.min) && mark <= Number(r.max)) ||
    coexRules()[coexRules().length - 1]
  );
}
function toneForGear(gear) {
  return COEX_TONES[gear] || COEX_TONES[1];
}
function checkpointName(key) {
  return ensureCoexSettings().checkpoints[key] || key;
}
function checkpointKeys() {
  return ["tov", "pat", "ppt", "trial", "target"];
}
function deriveMark(base, studentIndex, subjectIndex, offset) {
  const wave = ((studentIndex + 1) * (subjectIndex + 3) * 7) % 9;
  return clampMark(base + offset + (wave - 4));
}
function ensureCoex(s) {
  ensureCoexSettings();
  if (!s.coex) {
    const studentIndex = Math.max(
      0,
      data().students.findIndex((x) => x.id === s.id),
    );
    const subjects = Object.keys(s.scores);
    const cps = {
      tov: { marks: {} },
      pat: { marks: {} },
      ppt: { marks: {} },
      trial: { marks: {} },
      target: { marks: {} },
    };
    subjects.forEach((sub, i) => {
      const current = clampMark(s.scores[sub]);
      cps.tov.marks[sub] = deriveMark(current, studentIndex, i, -11);
      cps.pat.marks[sub] = deriveMark(current, studentIndex, i, -8);
      cps.ppt.marks[sub] = deriveMark(current, studentIndex, i, -5);
      cps.trial.marks[sub] = current;
      let target =
        current < 40
          ? 50
          : current < 55
            ? 65
            : current < 70
              ? 80
              : current < 85
                ? 90
                : 95;
      cps.target.marks[sub] = Math.max(current, clampMark(target));
    });
    if (s.id === "SMK2026-002") {
      const bm = findSubjectKey(cps.trial.marks, ["bahasa melayu", "bm"]);
      const sej = findSubjectKey(cps.trial.marks, ["sejarah"]);
      const bi = findSubjectKey(cps.trial.marks, ["bahasa inggeris"]);
      if (bm) {
        cps.tov.marks[bm] = 38;
        cps.pat.marks[bm] = 40;
        cps.ppt.marks[bm] = 41;
        cps.trial.marks[bm] = 44;
        cps.target.marks[bm] = 60;
      }
      if (sej) {
        cps.tov.marks[sej] = 32;
        cps.pat.marks[sej] = 36;
        cps.ppt.marks[sej] = 40;
        cps.trial.marks[sej] = 36;
        cps.target.marks[sej] = 55;
      }
      if (bi) {
        cps.tov.marks[bi] = 45;
        cps.pat.marks[bi] = 49;
        cps.ppt.marks[bi] = 52;
        cps.trial.marks[bi] = 49;
        cps.target.marks[bi] = 65;
      }
    }
    const status =
      s.report.status === "published"
        ? "published"
        : s.report.status === "submitted"
          ? "submitted"
          : "draft";
    cps.tov.status = "published";
    cps.pat.status = "published";
    cps.ppt.status = "published";
    cps.trial.status = status;
    cps.target.status = s.report.status === "published" ? "published" : "draft";
    cps.tov.updatedAt = "2025-03-18T10:00:00";
    cps.pat.updatedAt = "2025-11-12T10:00:00";
    cps.ppt.updatedAt = "2026-05-25T10:00:00";
    cps.trial.updatedAt = s.report.submittedAt || "2026-07-06T10:00:00";
    cps.target.updatedAt = "2026-01-10T10:00:00";
    s.coex = {
      checkpoints: cps,
      parentAcknowledgedAt: null,
      counsellorNotes: [],
      lastGeneratedAt: new Date().toISOString(),
    };
  }
  checkpointKeys().forEach((cp) => {
    if (!s.coex.checkpoints[cp])
      s.coex.checkpoints[cp] = { marks: {}, status: "draft" };
    Object.keys(s.scores).forEach((sub) => {
      if (s.coex.checkpoints[cp].marks[sub] === undefined) {
        if (cp === "pat") {
          const tov = Number(
            s.coex.checkpoints.tov?.marks?.[sub] ?? s.scores[sub],
          );
          const ppt = Number(
            s.coex.checkpoints.ppt?.marks?.[sub] ?? s.scores[sub],
          );
          s.coex.checkpoints[cp].marks[sub] = clampMark(
            Math.round((tov + ppt) / 2),
          );
        } else {
          s.coex.checkpoints[cp].marks[sub] = clampMark(s.scores[sub]);
        }
      }
    });
  });
  return s.coex;
}
function coexMarks(s, cp) {
  return ensureCoex(s).checkpoints[cp]?.marks || {};
}
function coexAverage(s, cp) {
  const vals = Object.values(coexMarks(s, cp)).map(Number);
  return vals.length
    ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
    : 0;
}
function coexOverallRule(s, cp) {
  return coexRule(coexAverage(s, cp));
}
function coexGearSum(s, cp) {
  return Object.values(coexMarks(s, cp)).reduce(
    (sum, m) => sum + coexRule(m).gear,
    0,
  );
}
function coexPotential(s, cp = "trial") {
  const count = Object.keys(coexMarks(s, cp)).length;
  return count ? Math.round((coexGearSum(s, cp) / (count * 11)) * 100) : 0;
}
function findSubjectKey(marks, needles) {
  return (
    Object.keys(marks).find((k) =>
      needles.some((n) => k.toLowerCase().includes(n)),
    ) || ""
  );
}
function coexLms(s, cp = "trial") {
  const profile = assessmentProfile(s),
    marks = coexMarks(s, cp),
    pass = Number(ensureCoexSettings().lmsPassMark);
  if (!profile.lmsApplicable)
    return {
      applicable: false,
      eligible: true,
      bm: "",
      bmMark: null,
      sej: "",
      sejMark: null,
      pass,
      label: "Tidak berkenaan",
    };
  const bm = findSubjectKey(marks, ["bahasa melayu", "bm"]),
    sej = findSubjectKey(marks, ["sejarah"]);
  const bmMark = bm ? Number(marks[bm]) : 0,
    sejMark = sej ? Number(marks[sej]) : 0;
  return {
    applicable: true,
    eligible: bmMark >= pass && sejMark >= pass,
    bm,
    bmMark,
    sej,
    sejMark,
    pass,
    label: bmMark >= pass && sejMark >= pass ? "LMS" : "TLMS",
  };
}
function coexCredits(s, cp = "trial") {
  const lms = coexLms(s, cp);
  if (lms.applicable && !lms.eligible) return [];
  return Object.entries(coexMarks(s, cp))
    .filter(
      ([, m]) => coexRule(m).gear >= Number(ensureCoexSettings().creditGear),
    )
    .map(([sub, m]) => ({ sub, mark: m, rule: coexRule(m) }));
}
function coexPurple(s, cp = "trial") {
  return Object.entries(coexMarks(s, cp))
    .filter(
      ([, m]) => coexRule(m).gear >= Number(ensureCoexSettings().purpleGear),
    )
    .map(([sub, m]) => ({ sub, mark: m, rule: coexRule(m) }));
}
function gearShift(s, subject, fromCp, toCp) {
  return (
    coexRule(coexMarks(s, toCp)[subject]).gear -
    coexRule(coexMarks(s, fromCp)[subject]).gear
  );
}
function shiftHtml(n) {
  return `<span class="shift ${n > 0 ? "up" : n < 0 ? "down" : "same"}">${n > 0 ? "+" + n : n < 0 ? String(n) : "Kekal"}</span>`;
}
function gearBadge(rule) {
  const t = toneForGear(rule.gear);
  return `<span class="gear-badge" style="--gear-bg:${t.color};--gear-fg:${t.fg}" title="${esc(t.name)} · ${esc(rule.zone)}">G${rule.gear}</span>`;
}
function markWithColor(mark) {
  const r = coexRule(mark),
    t = toneForGear(r.gear);
  return `<span class="coex-value"><i class="coex-swatch" style="--swatch:${t.color}"></i><strong>${mark}%</strong> ${gradeBadgeFromRule(r, "small")}</span>`;
}
function coexStatusPill(status) {
  return statusPill(status || "draft");
}
function coexInterventionForRule(rule, s = null) {
  if (!s) return rule.action;
  const form = formLevelOf(s);
  if (form === 6) return rule.action.replaceAll("SPM", "STPM");
  if (form <= 3)
    return rule.action
      .replaceAll("SPM", "pentaksiran akhir")
      .replace("Program Pecutan A+", "Program Pengayaan Maksimum");
  return rule.action;
}
function coexSubjectRisk(s, cp = "trial") {
  return Object.entries(coexMarks(s, cp))
    .map(([sub, mark]) => {
      const rule = coexRule(mark);
      return {
        sub,
        mark: Number(mark),
        rule,
        action: coexInterventionForRule(rule, s),
        shift: gearShift(s, sub, "ppt", cp),
      };
    })
    .filter((x) => x.rule.gear <= 4 || x.shift < 0)
    .sort((a, b) => a.rule.gear - b.rule.gear || a.shift - b.shift);
}
function coexRewards(s) {
  const profile = assessmentProfile(s),
    lms = coexLms(s),
    credits = coexCredits(s),
    purple = coexPurple(s),
    shift =
      coexOverallRule(s, profile.currentKey).gear -
      coexOverallRule(s, "ppt").gear;
  const out = [];
  if (lms.applicable && lms.eligible)
    out.push({
      type: "gold",
      icon: "✓",
      title: "Layak Mendapat Sijil",
      text: "Bahasa Melayu dan Sejarah melepasi markah kelulusan yang ditetapkan.",
    });
  if (credits.length)
    out.push({
      type: "green",
      icon: "★",
      title: `${credits.length} Subjek pada Gear Kredit`,
      text: credits.map((x) => x.sub).join(", "),
    });
  if (purple.length)
    out.push({
      type: "purple",
      icon: "◆",
      title: "Purple Excellence",
      text: `Pencapaian A atau A+ dalam ${purple.map((x) => x.sub).join(", ")}.`,
    });
  if (shift > 0)
    out.push({
      type: "green",
      icon: "↑",
      title: `Anjakan +${shift} Gear`,
      text: `Gear keseluruhan meningkat pada ${checkpointNameForStudent(s, profile.currentKey)}.`,
    });
  return out;
}
function coexZoneGroup(rule) {
  if (rule.gear === 1)
    return {
      color: toneForGear(1).color,
      name: "Hitam",
      zone: "Kritikal",
      meaning: "Perlu intervensi segera",
      action: "Selamatkan",
    };
  if (rule.gear === 2)
    return {
      color: toneForGear(2).color,
      name: "Merah",
      zone: "Risiko",
      meaning: "Perlu intervensi",
      action: "Bimbing",
    };
  if (rule.gear === 3)
    return {
      color: toneForGear(3).color,
      name: "Coklat",
      zone: "Pemulihan",
      meaning: "Sedang dipulihkan",
      action: "Pulihkan",
    };
  if (rule.gear === 4)
    return {
      color: toneForGear(4).color,
      name: "Oren",
      zone: "Perkembangan",
      meaning: "Hampir menguasai",
      action: "Perkukuh",
    };
  if (rule.gear <= 6)
    return {
      color: toneForGear(6).color,
      name: "Biru",
      zone: "Penguasaan",
      meaning: "Menguasai",
      action: "Kuasakan",
    };
  if (rule.gear <= 8)
    return {
      color: toneForGear(8).color,
      name: "Hijau",
      zone: "Kecemerlangan",
      meaning: "Cemerlang",
      action: "Mantapkan",
    };
  return {
    color: toneForGear(10).color,
    name: "Ungu",
    zone: "Ikon",
    meaning: "Ikon kecemerlangan",
    action: "Maksimumkan",
  };
}
function coexZoneLegend() {
  const rules = [
    coexRule(10),
    coexRule(30),
    coexRule(42),
    coexRule(47),
    coexRule(57),
    coexRule(67),
    coexRule(85),
  ];
  return `<div class="zone-legend">${rules
    .map((r) => {
      const z = coexZoneGroup(r);
      return `<div class="zone-item"><i class="zone-dot" style="--zone-color:${z.color}"></i><div><strong>${z.name} · ${z.zone}</strong><span>${z.meaning}. Tindakan: ${z.action}.</span></div></div>`;
    })
    .join("")}</div>`;
}
function coexMovementSummary(s, fromCp, toCp) {
  const subjects = Object.keys(coexMarks(s, toCp));
  let up = 0,
    down = 0,
    same = 0;
  subjects.forEach((sub) => {
    const delta = gearShift(s, sub, fromCp, toCp);
    if (delta > 0) up++;
    else if (delta < 0) down++;
    else same++;
  });
  return {
    up,
    down,
    same,
    total: subjects.length,
    delta: coexOverallRule(s, toCp).gear - coexOverallRule(s, fromCp).gear,
  };
}
function coexComparisonCard(s, title, fromCp, toCp, endLabel, description) {
  const profile = assessmentProfile(s),
    fromRule = coexOverallRule(s, fromCp),
    toRule = coexOverallRule(s, toCp),
    move = coexMovementSummary(s, fromCp, toCp),
    avgChange = coexAverage(s, toCp) - coexAverage(s, fromCp),
    tone = toneForGear(toRule.gear);
  const state = move.delta > 0 ? "success" : move.delta < 0 ? "danger" : "info";
  const verdict =
    move.delta > 0
      ? `Prestasi meningkat dan berada pada landasan yang lebih baik menuju ${profile.goal}.`
      : move.delta < 0
        ? "Prestasi menurun. Murid perlukan pelan intervensi untuk kembali ke landasan."
        : "Prestasi kekal. Fokus tambahan diperlukan untuk bergerak ke Gear seterusnya.";
  return `<section class="coex-section" style="margin-top:0"><div class="coex-section-head"><div><h3>${esc(title)}</h3><p>${esc(description)}</p></div><span class="coex-chip" style="--chip-color:${tone.color}"><i></i>${tone.name}</span></div><div class="year-compare-head"><div><span class="compare-label">${esc(checkpointNameForStudent(s, fromCp))}</span><strong>${coexAverage(s, fromCp)}%</strong><small>${fromRule.grade} · Gear ${fromRule.gear}</small></div><div class="compare-arrow">→</div><div><span class="compare-label">${esc(endLabel || checkpointNameForStudent(s, toCp))}</span><strong>${coexAverage(s, toCp)}%</strong><small>${toRule.grade} · Gear ${toRule.gear}</small></div></div>${miniJourneyLadder(fromRule.gear, toRule.gear, coexOverallRule(s, "target").gear)}<div class="coex-summary-grid"><div class="coex-summary-item"><span>Gred semasa</span><strong>${toRule.grade}</strong><small>Gear ${toRule.gear} · ${esc(tone.name)}</small></div><div class="coex-summary-item"><span>Anjakan Gear</span><strong>${move.delta > 0 ? "+" + move.delta : move.delta}</strong><small>${move.delta > 0 ? "Meningkat" : move.delta < 0 ? "Menurun" : "Kekal"}</small></div><div class="coex-summary-item"><span>Subjek meningkat</span><strong>${move.up}</strong><small>${move.down} menurun · ${move.same} kekal</small></div><div class="coex-summary-item"><span>Perubahan purata</span><strong>${avgChange > 0 ? "+" + avgChange : avgChange}%</strong><small>${coexAverage(s, fromCp)}% ke ${coexAverage(s, toCp)}%</small></div></div><div class="notice ${state}" style="margin-top:14px"><div>${move.delta > 0 ? "↑" : move.delta < 0 ? "!" : "i"}</div><div><strong>${move.delta > 0 ? "Perkembangan positif" : move.delta < 0 ? "Perlu perhatian" : "Perkembangan stabil"}</strong><div>${verdict}</div></div></div></section>`;
}
function journeyLevelFromGear(gear) {
  return gear <= 2
    ? 1
    : gear <= 4
      ? 2
      : gear <= 6
        ? 3
        : gear <= 8
          ? 4
          : gear <= 10
            ? 5
            : 6;
}
function journeyLevelMeta(level) {
  return [
    {
      level: 1,
      name: "Intervensi",
      range: "1–2",
      color: "#c2410c",
      soft: "#fff1e8",
      fg: "#ffffff",
    },
    {
      level: 2,
      name: "Pemulihan",
      range: "3–4",
      color: "#ff9900",
      soft: "#fff3da",
      fg: "#4f2b00",
    },
    {
      level: 3,
      name: "Penguasaan",
      range: "5–6",
      color: "#0070c0",
      soft: "#e8f4ff",
      fg: "#ffffff",
    },
    {
      level: 4,
      name: "Kecemerlangan",
      range: "7–8",
      color: "#00b050",
      soft: "#e9fbef",
      fg: "#ffffff",
    },
    {
      level: 5,
      name: "Ikon",
      range: "9–10",
      color: "#cc66ff",
      soft: "#f6e9ff",
      fg: "#3b1550",
    },
    {
      level: 6,
      name: "Puncak",
      range: "11",
      color: "#7030a0",
      soft: "#f2e8fa",
      fg: "#ffffff",
    },
  ][level - 1];
}
function openJourneyComparison(studentId) {
  const s = getStudent(studentId),
    profile = assessmentProfile(s),
    ref = coexOverallRule(s, profile.referenceKey),
    current = coexOverallRule(s, profile.currentKey),
    target = coexOverallRule(s, "target"),
    diff = current.gear - ref.gear;
  openModal(
    "Perbandingan perjalanan akademik",
    `<div class="notice info"><div>i</div><div><strong>${esc(profile.journeyTitle)}</strong><div>Bandingan checkpoint rujukan dengan checkpoint semasa untuk melihat perubahan sebelum menuju sasaran akhir.</div></div></div><div class="coex-summary-grid" style="margin-top:16px"><div class="coex-summary-item"><span>${esc(checkpointNameForStudent(s, profile.referenceKey))}</span><strong>${coexAverage(s, profile.referenceKey)}%</strong><small>${ref.grade} · Gear ${ref.gear} · Level ${journeyLevelFromGear(ref.gear)}</small></div><div class="coex-summary-item"><span>${esc(checkpointNameForStudent(s, profile.currentKey))}</span><strong>${coexAverage(s, profile.currentKey)}%</strong><small>${current.grade} · Gear ${current.gear} · Level ${journeyLevelFromGear(current.gear)}</small></div><div class="coex-summary-item"><span>Anjakan Gear</span><strong>${diff > 0 ? `+${diff}` : diff}</strong><small>${diff > 0 ? "Meningkat" : diff < 0 ? "Menurun" : "Kekal"}</small></div><div class="coex-summary-item"><span>Sasaran</span><strong>Gear ${target.gear}</strong><small>Level ${journeyLevelFromGear(target.gear)} · ${esc(profile.destination)}</small></div></div>`,
  );
}
function jumpToRewards() {
  const el = document.getElementById("reward-summary");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
function coexJourney(s) {
  const profile = assessmentProfile(s),
    current = coexOverallRule(s, profile.currentKey),
    target = coexOverallRule(s, "target"),
    reference = coexOverallRule(s, profile.referenceKey);
  const currentLevel = journeyLevelFromGear(current.gear),
    targetLevel = journeyLevelFromGear(target.gear),
    referenceLevel = journeyLevelFromGear(reference.gear),
    delta = current.gear - reference.gear;
  const compareClass = delta > 0 ? "good" : delta < 0 ? "warn" : "";
  const formVisual =
    profile.form === 5
      ? `<div class="journey-phase-row"><div class="journey-phase form4"><small>Visual Tingkatan 4</small><strong>${esc(checkpointNameForStudent(s, profile.referenceKey))}</strong><span>Perbandingan asas semasa Tingkatan 4 sebelum murid melangkah ke Tingkatan 5.</span>${miniJourneyLadder(coexOverallRule(s, "tov").gear, coexOverallRule(s, "pat").gear, target.gear)}</div><div class="journey-phase form5"><small>Visual Tingkatan 5</small><strong>${esc(checkpointNameForStudent(s, profile.currentKey))}</strong><span>Pergerakan semasa murid di Tingkatan 5 menuju ${esc(profile.destination)}.</span>${miniJourneyLadder(coexOverallRule(s, "pat").gear, current.gear, target.gear)}</div></div>`
      : "";
  return `<div class="journey"><div class="journey-ladder">${Array.from(
    { length: 6 },
    (_, i) => {
      const level = i + 1,
        meta = journeyLevelMeta(level);
      return `<div class="ladder-step ${level <= currentLevel ? "reached" : ""} ${level === currentLevel ? "current" : ""} ${level === targetLevel ? "target" : ""}" style="--level:${level};--step-color:${meta.color};--step-soft:${meta.soft};--step-fg:${meta.fg}"><div class="ladder-step-top">${level === currentLevel ? '<div class="journey-car car-animate" aria-hidden="true"><span class="car-right">🚗</span></div>' : ""}${level === targetLevel ? '<div class="journey-flag" aria-hidden="true">◆</div>' : ""}</div><div class="ladder-step-box"><b>Level ${level}</b><strong>Gear ${meta.range}</strong></div><span>${meta.name}</span></div>`;
    },
  ).join(
    "",
  )}</div><div class="journey-caption"><span>Mula · ${esc(checkpointNameForStudent(s, "tov"))}</span><span><strong>Level ${referenceLevel}</strong> pada ${esc(checkpointNameForStudent(s, profile.referenceKey))}, kini <strong>Level ${currentLevel}</strong> (Gear ${current.gear}), sasaran <strong>Level ${targetLevel}</strong> (Gear ${target.gear})</span><span>${esc(profile.destination)}</span></div><div class="journey-compare-strip"><div class="journey-compare-card"><small>${esc(profile.form === 5 ? "Tingkatan 4" : "Checkpoint rujukan")}</small><strong>${coexAverage(s, profile.referenceKey)}%</strong><span>${esc(checkpointNameForStudent(s, profile.referenceKey))} · ${reference.grade} · Gear ${reference.gear} · Level ${referenceLevel}</span></div><div><div class="journey-compare-arrow">→</div><div class="compare-highlight ${compareClass}" style="margin-top:8px">${delta > 0 ? "Naik" : delta < 0 ? "Turun" : "Kekal"} ${delta !== 0 ? Math.abs(delta) + " gear" : "gear"}</div></div><div class="journey-compare-card"><small>${esc(profile.form === 5 ? "Tingkatan 5" : "Checkpoint semasa")}</small><strong>${coexAverage(s, profile.currentKey)}%</strong><span>${esc(checkpointNameForStudent(s, profile.currentKey))} · ${current.grade} · Gear ${current.gear} · Level ${currentLevel}</span></div></div>${formVisual}</div>`;
}
function coexCheckpointChart(s) {
  const cps = checkpointKeys(),
    colors = ["#7c8fa3", "#5e7bdc", "#2b7dbd", "#00a651", "#7030a0"];
  return `<div class="coex-chart" role="img" aria-label="Perbandingan purata markah mengikut checkpoint">${cps
    .map((cp, i) => {
      const avg = coexAverage(s, cp);
      return `<div class="coex-chart-col"><div class="coex-chart-bar" style="--value:${avg};--bar-color:${colors[i]}"><strong>${avg}%</strong></div><span>${esc(checkpointNameForStudent(s, cp))}</span></div>`;
    })
    .join("")}</div>`;
}
function coexMatrix(s) {
  const cps = checkpointKeys(),
    subjects = Object.keys(coexMarks(s, "trial"))
      .slice()
      .sort((a, b) => a.localeCompare(b, "ms"));
  return `<div><div class="subject-chip-list">${subjectAlphabetList(s)}</div><div class="coex-table-wrap"><table class="coex-matrix"><thead><tr><th>Subjek</th>${cps.map((cp, i) => `<th>${esc(checkpointNameForStudent(s, cp))}</th><th>Gred</th><th>Gear</th>${i > 0 && cp !== "target" ? "<th>Anjakan</th>" : ""}`).join("")}<th>Jurang sasaran</th><th>Tindakan dicadang</th></tr></thead><tbody>${subjects
    .map((sub) => {
      const current = Number(coexMarks(s, "trial")[sub]),
        target = Number(coexMarks(s, "target")[sub]),
        rt = coexRule(current);
      return `<tr><td class="subject-cell"><strong>${esc(sub)}</strong><br><small class="muted">${esc(rt.level)}</small></td>${cps
        .map((cp, i) => {
          const mark = Number(coexMarks(s, cp)[sub]),
            rule = coexRule(mark);
          return `<td>${markWithColor(mark)}</td><td>${gradeBadgeFromRule(rule, "small")}</td><td>${gearBadge(rule)}</td>${i > 0 && cp !== "target" ? `<td>${shiftHtml(gearShift(s, sub, cps[i - 1], cp))}</td>` : ""}`;
        })
        .join(
          "",
        )}<td><span class="target-gap">${Math.max(0, target - current)} markah</span></td><td>${esc(coexInterventionForRule(rt, s))}</td></tr>`;
    })
    .join("")}</tbody></table></div></div>`;
}
// Parent COEx view and acknowledgement
function parentCoexHtml(s) {
  ensureCoex(s);
  const profile = assessmentProfile(s),
    currentCp = profile.currentKey,
    current = coexOverallRule(s, currentCp),
    target = coexOverallRule(s, "target"),
    prev = coexOverallRule(s, "ppt"),
    tone = toneForGear(current.gear),
    zone = coexZoneGroup(current),
    lms = coexLms(s, currentCp),
    credits = coexCredits(s, currentCp),
    purple = coexPurple(s, currentCp),
    rewards = coexRewards(s),
    risks = coexSubjectRisk(s, currentCp),
    status = ensureCoex(s).checkpoints[currentCp].status,
    improvement = current.gear - prev.gear;
  const sideStatus = lms.applicable
    ? `<div class="coex-side-row"><span>Status LMS</span><strong>${lms.eligible ? "Layak Mendapat Sijil" : "Tidak Layak Mendapat Sijil"}</strong></div>`
    : `<div class="coex-side-row"><span>Peringkat akademik</span><strong>${esc(profile.program)}</strong></div>`;
  const summary = lms.applicable
    ? `<div class="coex-summary-item"><span>Bahasa Melayu</span><strong>${lms.bmMark}%</strong><small>${lms.bmMark >= lms.pass ? "Lulus syarat LMS" : "Perlu sekurang-kurangnya " + lms.pass + "%"}</small></div><div class="coex-summary-item"><span>Sejarah</span><strong>${lms.sejMark}%</strong><small>${lms.sejMark >= lms.pass ? "Lulus syarat LMS" : "Perlu sekurang-kurangnya " + lms.pass + "%"}</small></div>`
    : `<div class="coex-summary-item"><span>Peringkat</span><strong>T${profile.form}</strong><small>${esc(profile.program)}</small></div><div class="coex-summary-item"><span>Gred semasa</span><strong>${current.grade}</strong><small>${esc(checkpointNameForStudent(s, currentCp))}</small></div>`;
  return `<div class="section-title"><div><h2>Metrik Prestasi Pelajar</h2><p>COEx dan Gear digunakan secara fleksibel untuk Tingkatan 1 hingga Tingkatan 6, dengan checkpoint yang berubah mengikut peringkat akademik.</p></div><div class="actions no-print"><button class="btn btn-outline" onclick="window.print()">Cetak metrik</button><button class="btn btn-primary" onclick="acknowledgeCoex('${s.id}')">${s.coex.parentAcknowledgedAt ? "Telah disahkan" : "Sahkan telah dibaca"}</button></div></div><div class="coex-hero"><div class="coex-hero-main"><div class="gear-orbit" style="--gear-color:${tone.color};--gear-progress:${Math.round((current.gear / 11) * 100)}"><div><b>${current.gear}</b><span>GEAR SEMASA</span></div></div><div class="coex-hero-copy"><h2>${esc(zone.name)} · ${esc(current.level)}</h2><p>Purata ${esc(checkpointNameForStudent(s, currentCp))} ialah <strong>${coexAverage(s, currentCp)}%</strong>. Murid berada dalam ${esc(zone.zone)}. Fokus seterusnya ialah ${esc(zone.action.toLowerCase())} prestasi sehingga mencapai sasaran Gear ${target.gear}.</p><div class="coex-hero-meta"><span class="coex-chip" style="--chip-color:${tone.color}"><i></i>${tone.name} · ${current.grade}</span><span class="coex-chip"><i></i>${improvement > 0 ? "Naik " + improvement + " gear" : improvement < 0 ? "Turun " + Math.abs(improvement) + " gear" : "Gear kekal"}</span><span class="coex-chip"><i></i>${esc(profile.program)} · ${coexStatusPill(status)}</span>${universityCertificateEligible(s) ? `<button class="ecert-button no-print" onclick="openEligibilityCertificate('${s.id}')">🏅 e-Certificate</button>` : ""}</div></div></div><div class="coex-hero-side"><div class="coex-side-summary"><div class="coex-side-row"><span>Potensi akademik digunakan</span><strong>${coexPotential(s, currentCp)}%</strong></div>${sideStatus}<div class="coex-side-row"><span>Gear kredit / A</span><strong>${credits.length} kredit · ${purple.length} A/A+</strong></div></div><div class="coex-side-head"><h4>Senarai subjek & markah</h4><p>Paparan markah murid mengikut warna COEx yang telah ditetapkan.</p></div><div class="coex-subject-scroll"><div class="coex-subject-list">${heroSubjectListHtml(s)}</div></div></div></div><section class="coex-section"><div class="coex-section-head"><div><h3>${esc(profile.journeyTitle)}</h3><p>Tangga enam level menunjukkan kedudukan semasa, perubahan dari checkpoint terdahulu dan sasaran seterusnya.</p></div><div class="journey-tools no-print"><button class="btn btn-outline btn-sm" onclick="openJourneyComparison('${s.id}')">Lihat comparison</button><button class="btn btn-primary btn-sm reward-badge-button" onclick="jumpToRewards()">🏆 Reward</button></div></div>${coexJourney(s)}</section><section class="coex-section">${examTimelineHtml(s)}</section><div class="grid-2" style="margin-top:18px">${profile.comparisons.map((c) => coexComparisonCard(s, c.title, c.from, c.to, c.endLabel, c.description)).join("")}</div><div class="grid-2" style="margin-top:18px"><section class="coex-section" style="margin-top:0"><div class="coex-section-head"><div><h3>Perbandingan checkpoint</h3><p>Label checkpoint disesuaikan mengikut Tingkatan ${profile.form}.</p></div></div>${coexCheckpointChart(s)}</section><section class="coex-section" style="margin-top:0"><div class="coex-section-head"><div><h3>Kelayakan dan sasaran</h3><p>Ringkasan syarat dan jurang menuju ${esc(profile.goal)}.</p></div></div><div class="coex-summary-grid">${summary}<div class="coex-summary-item"><span>Gear ke sasaran</span><strong>${Math.max(0, target.gear - current.gear)}</strong><small>Sasaran keseluruhan Gear ${target.gear}</small></div><div class="coex-summary-item"><span>Jurang purata</span><strong>${Math.max(0, coexAverage(s, "target") - coexAverage(s, currentCp))}</strong><small>Markah diperlukan ke sasaran</small></div></div></section></div><section class="coex-section"><div class="coex-section-head"><div><h3>Matriks prestasi subjek</h3><p>Subjek diatur mengikut abjad. Gred C dan ke atas dipaparkan dengan bintang, dan warna gred mengikut warna COEx.</p></div></div>${coexMatrix(s)}</section><div class="grid-2" style="margin-top:18px"><section id="reward-summary" class="coex-section" style="margin-top:0"><div class="coex-section-head"><div><h3>Ganjaran dan pengiktirafan</h3><p>Ganjaran automatik apabila sasaran tertentu dicapai.</p></div></div><div class="reward-grid">${rewards.length ? rewards.map((r) => `<div class="reward-card ${r.type}"><b>${esc(r.icon)} ${esc(r.title)}</b><p>${esc(r.text)}</p></div>`).join("") : '<div class="empty-state">Belum ada ganjaran dicapai buat masa ini.</div>'}</div></section><section class="coex-section" style="margin-top:0"><div class="coex-section-head"><div><h3>Intervensi dicadangkan</h3><p>Subjek berisiko, Gear menurun atau masih belum stabil.</p></div></div><div class="notice-list">${
    risks.length
      ? risks
          .slice(0, 6)
          .map(
            (r) =>
              `<div class="notice ${r.rule.gear <= 2 ? "danger" : r.rule.gear <= 4 ? "warn" : "info"}"><div>!</div><div><strong>${esc(r.sub)} · Gear ${r.rule.gear}</strong><div>${r.shift < 0 ? `Turun ${Math.abs(r.shift)} Gear. ` : ""}${esc(r.action || coexInterventionForRule(r.rule, s))}</div></div></div>`,
          )
          .join("")
      : `<div class="notice success"><div>✓</div><div><strong>Prestasi stabil</strong><div>Tiada subjek berisiko tinggi dikesan pada checkpoint semasa.</div></div></div>`
  }</div></section></div>`;
}
function acknowledgeCoex(id) {
  const s = getStudent(id);
  ensureCoex(s).parentAcknowledgedAt = new Date().toISOString();
  audit(`Penjaga mengesahkan telah membaca laporan COEx ${s.name}.`, "green");
  save();
  toast("Pengesahan ibu bapa telah direkodkan.");
  renderCoexViews();
}

// Teacher COEx editing and submission
function teacherCoexHtml(t, students) {
  const s = getStudent(teacherSelectedStudent) || students[0];
  if (!s)
    return '<div class="empty-state">Tiada pelajar dalam akses anda.</div>';
  ensureCoex(s);
  const profile = assessmentProfile(s),
    cp = teacherCoexCheckpoint,
    checkpoint = ensureCoex(s).checkpoints[cp],
    isFinal = checkpoint.status === "published",
    canAll = t.roles.includes("Guru Kelas"),
    lms = coexLms(s, cp);
  const rows = Object.keys(coexMarks(s, cp))
    .map((sub) => {
      const mark = Number(coexMarks(s, cp)[sub]),
        rule = coexRule(mark),
        editable =
          !isFinal &&
          (canAll || t.subjects.includes(sub)) &&
          (cp !== "target" || canAll);
      return `<div class="coex-editor-row"><div><strong>${esc(sub)}</strong><br><small class="muted">${editable ? "Boleh dikemas kini" : "Lihat sahaja"}</small></div><div>${editable ? `<input class="coex-mark-input" data-subject="${esc(sub)}" type="number" min="0" max="100" value="${mark}" oninput="previewTeacherCoex()">` : `<span class="readonly-mark">${mark}%</span>`}</div><div data-preview-grade="${esc(sub)}">${gradeBadgeFromRule(rule, "small")}</div><div data-preview-gear="${esc(sub)}">${gearBadge(rule)}</div><div class="editor-action" data-preview-action="${esc(sub)}">${esc(coexInterventionForRule(rule, s))}</div></div>`;
    })
    .join("");
  return `<div class="section-title"><div><h2>Rekod Prestasi Pelajar</h2><p>Masukkan markah mengikut profil Tingkatan 1 hingga Tingkatan 6. Sistem menukar label checkpoint secara automatik berdasarkan kelas pelajar.</p></div>${coexStatusPill(checkpoint.status)}</div><div class="teacher-coex-grid"><section class="coex-section" style="margin-top:0"><div class="coex-section-head"><div><h3>${esc(profile.program)}</h3><p>Guru hanya boleh mengubah subjek dan kelas dalam skop akses mereka.</p></div><span class="pill blue">Tingkatan ${profile.form}</span></div><div class="form-grid" style="margin-bottom:15px"><div class="field"><label>Pilih pelajar</label><select onchange="teacherSelectedStudent=this.value;teacherCoexCheckpoint='trial';renderCoexViews()">${students.map((x) => `<option value="${x.id}" ${x.id === s.id ? "selected" : ""}>${esc(x.name)} · ${esc(className(x.classId))}</option>`).join("")}</select></div><div class="field"><label>Checkpoint</label><select onchange="teacherCoexCheckpoint=this.value;renderCoexViews()">${checkpointKeys()
    .map(
      (key) =>
        `<option value="${key}" ${key === cp ? "selected" : ""}>${esc(checkpointNameForStudent(s, key))}</option>`,
    )
    .join(
      "",
    )}</select></div></div><div class="coex-editor-row" style="font-weight:900;color:#38516c"><div>Mata pelajaran</div><div>Markah</div><div>Gred</div><div>Gear</div><div>Tindakan sistem</div></div>${rows}<div class="actions" style="justify-content:flex-end;margin-top:18px"><button class="btn btn-outline" onclick="saveTeacherCoex('draft')" ${isFinal ? "disabled" : ""}>Simpan draf</button><button class="btn btn-primary" onclick="saveTeacherCoex('submitted')" ${isFinal ? "disabled" : ""}>Hantar untuk semakan</button></div></section><aside><section class="coex-section" style="margin-top:0"><div class="coex-section-head"><div><h3>Pratonton automatik</h3><p>Dikemas kini semasa markah ditaip.</p></div></div><div class="coex-preview"><div class="preview-block"><span>Purata checkpoint</span><strong id="coex-preview-average">${coexAverage(s, cp)}%</strong></div><div class="preview-block"><span>Gear keseluruhan</span><strong id="coex-preview-gear">Gear ${coexOverallRule(s, cp).gear}</strong></div><div class="preview-block"><span>${profile.lmsApplicable ? "Status LMS" : "Profil penilaian"}</span><strong id="coex-preview-lms" style="font-size:15px">${profile.lmsApplicable ? (lms.eligible ? "LMS" : "TLMS") : profile.program}</strong></div><div class="preview-block"><span>Potensi digunakan</span><strong id="coex-preview-potential">${coexPotential(s, cp)}%</strong></div></div></section><section class="coex-section"><div class="coex-section-head"><div><h3>Peraturan checkpoint</h3></div></div><div class="coex-alert ${isFinal ? "success" : ""}"><strong>${isFinal ? "✓" : "i"}</strong><div><strong>${isFinal ? "Checkpoint telah diterbitkan" : "Semakan diperlukan"}</strong><span>${isFinal ? "Markah dikunci untuk menjaga integriti rekod." : "Draf perlu dihantar dan diterbitkan oleh super admin sebelum menjadi rasmi kepada ibu bapa."}</span></div></div></section></aside></div>`;
}
function teacherPreviewMarks() {
  const s = getStudent(teacherSelectedStudent),
    base = { ...coexMarks(s, teacherCoexCheckpoint) };
  document
    .querySelectorAll(".coex-mark-input")
    .forEach((input) => (base[input.dataset.subject] = clampMark(input.value)));
  return base;
}
function previewTeacherCoex() {
  const s = getStudent(teacherSelectedStudent),
    profile = assessmentProfile(s),
    marks = teacherPreviewMarks();
  let total = 0,
    sumGear = 0,
    count = 0;
  Object.entries(marks).forEach(([sub, mark]) => {
    const r = coexRule(mark);
    total += Number(mark);
    sumGear += r.gear;
    count++;
    const g = document.querySelector(
        `[data-preview-grade="${CSS.escape(sub)}"]`,
      ),
      gb = document.querySelector(`[data-preview-gear="${CSS.escape(sub)}"]`),
      a = document.querySelector(`[data-preview-action="${CSS.escape(sub)}"]`);
    if (g) g.textContent = r.grade;
    if (gb) gb.innerHTML = gearBadge(r);
    if (a) a.textContent = coexInterventionForRule(r, s);
  });
  const avg = count ? Math.round(total / count) : 0,
    overall = coexRule(avg),
    potential = count ? Math.round((sumGear / (count * 11)) * 100) : 0;
  const settings = ensureCoexSettings(),
    bm = findSubjectKey(marks, ["bahasa melayu", "bm"]),
    sej = findSubjectKey(marks, ["sejarah"]),
    lms =
      Number(marks[bm] || 0) >= settings.lmsPassMark &&
      Number(marks[sej] || 0) >= settings.lmsPassMark;
  document.getElementById("coex-preview-average").textContent = avg + "%";
  document.getElementById("coex-preview-gear").textContent =
    "Gear " + overall.gear;
  document.getElementById("coex-preview-lms").textContent =
    profile.lmsApplicable ? (lms ? "LMS" : "TLMS") : profile.program;
  document.getElementById("coex-preview-potential").textContent =
    potential + "%";
}
function saveTeacherCoex(status) {
  const s = getStudent(teacherSelectedStudent),
    t = currentTeacher();
  if (!s || !t) return;
  const checkpoint = ensureCoex(s).checkpoints[teacherCoexCheckpoint];
  if (checkpoint.status === "published") {
    toast("Checkpoint diterbitkan dan tidak boleh diubah.");
    return;
  }
  const marks = teacherPreviewMarks();
  Object.entries(marks).forEach(([sub, m]) => {
    if (t.roles.includes("Guru Kelas") || t.subjects.includes(sub))
      checkpoint.marks[sub] = clampMark(m);
  });
  checkpoint.status = status;
  checkpoint.updatedAt = new Date().toISOString();
  checkpoint.updatedBy = t.name;
  if (teacherCoexCheckpoint === "trial")
    Object.assign(s.scores, checkpoint.marks);
  audit(
    `${status === "submitted" ? "Menghantar" : "Menyimpan"} rekod prestasi ${checkpointNameForStudent(s, teacherCoexCheckpoint)} untuk ${s.name}.`,
    status === "submitted" ? "gold" : "info",
  );
  save();
  toast(
    status === "submitted"
      ? "Rekod prestasi dihantar untuk semakan."
      : "Draf prestasi telah disimpan.",
  );
  renderCoexViews();
}
// Administrator COEx review and publication
function coexPendingRecords() {
  const rows = [];
  activeStudents().forEach((s) => {
    ensureCoex(s);
    checkpointKeys().forEach((cp) => {
      const rec = s.coex.checkpoints[cp];
      if (["submitted", "approved"].includes(rec.status))
        rows.push({ s, cp, rec });
    });
  });
  return rows;
}
function approveCoex(id, cp) {
  const s = getStudent(id),
    r = ensureCoex(s).checkpoints[cp];
  r.status = "approved";
  r.approvedAt = new Date().toISOString();
  r.approvedBy = currentUser.name;
  audit(
    `Meluluskan rekod prestasi ${checkpointNameForStudent(s, cp)} untuk ${s.name}.`,
    "green",
  );
  save();
  toast("Rekod prestasi diluluskan.");
  renderCoexViews();
}
function publishCoex(id, cp) {
  const s = getStudent(id),
    r = ensureCoex(s).checkpoints[cp];
  r.status = "published";
  r.publishedAt = new Date().toISOString();
  r.publishedBy = currentUser.name;
  audit(
    `Menerbitkan rekod prestasi ${checkpointNameForStudent(s, cp)} untuk ${s.name}.`,
    "gold",
  );
  save();
  toast("Rekod prestasi diterbitkan kepada ibu bapa.");
  renderCoexViews();
}
function coexDistribution() {
  const d = Array.from({ length: 11 }, () => 0);
  activeStudents().forEach((s) => {
    ensureCoex(s);
    d[coexOverallRule(s, "trial").gear - 1]++;
  });
  return d;
}
function superCoexHtml() {
  const settings = ensureCoexSettings(),
    pending = coexPendingRecords(),
    dist = coexDistribution(),
    coverage = [1, 2, 3, 4, 5, 6].map((form) => ({
      form,
      count: activeStudents().filter((s) => formLevelOf(s) === form).length,
    }));
  return `<div class="section-title"><div><h2>Tetapan Color of Excellence</h2><p>COEx dan Gear menyokong Tingkatan 1 hingga Tingkatan 6. Label checkpoint berubah mengikut peringkat, sementara warna dan Gear kekal konsisten.</p></div><button class="btn btn-primary" onclick="saveCoexSettings()">Simpan tetapan</button></div><div class="stats">${coverage.map((x) => `<article class="stat"><div class="stat-top"><small>Tingkatan ${x.form}</small><div class="stat-icon ${x.form === 6 ? "purple" : x.form >= 4 ? "gold" : "green"}">${x.form}</div></div><b>${x.count}</b><span>pelajar aktif dalam sistem</span></article>`).join("")}</div><div class="grid-2" style="margin-top:16px"><section class="coex-section" style="margin-top:0"><div class="coex-section-head"><div><h3>Ringkasan Gear seluruh sekolah</h3><p>Bilangan pelajar mengikut Gear pada checkpoint semasa profil masing-masing.</p></div></div><div class="coex-chart compact">${dist.map((v, i) => `<div class="coex-chart-col"><div class="coex-chart-bar" style="--value:${Math.min(100, v * 18)};--bar-color:${toneForGear(i + 1).color}"><strong>${v}</strong></div><span>Gear ${i + 1}</span></div>`).join("")}</div></section><section class="coex-section" style="margin-top:0"><div class="coex-section-head"><div><h3>Peraturan utama</h3><p>Ambang Gear terpakai kepada semua tingkatan. LMS hanya digunakan untuk Tingkatan 4 dan 5.</p></div></div><div class="form-grid"><div class="field"><label>Markah lulus LMS, T4 dan T5</label><input id="setting-lms" type="number" min="0" max="100" value="${settings.lmsPassMark}"></div><div class="field"><label>Gear minimum kredit</label><input id="setting-credit" type="number" min="1" max="11" value="${settings.creditGear}"></div><div class="field"><label>Gear ganjaran Purple</label><input id="setting-purple" type="number" min="1" max="11" value="${settings.purpleGear}"></div><div class="field"><label>Kunci checkpoint sistem</label><select id="setting-current">${checkpointKeys()
    .map(
      (cp) =>
        `<option value="${cp}" ${cp === settings.currentCheckpoint ? "selected" : ""}>${esc(checkpointName(cp))}</option>`,
    )
    .join(
      "",
    )}</select></div></div></section></div><section class="coex-section">${examTimelineManagerHtml()}</section><section class="coex-section"><div class="coex-section-head"><div><h3>Kelulusan rekod prestasi</h3><p>Guru menghantar rekod, super admin meluluskan, kemudian menerbitkan kepada ibu bapa.</p></div><span class="pill gold">${pending.length} dalam proses</span></div><div class="student-list">${pending.length ? pending.map((x) => `<div class="student-row">${studentPhoto(x.s)}<div class="student-meta"><strong>${esc(x.s.name)}</strong><span>Tingkatan ${formLevelOf(x.s)} · ${esc(checkpointNameForStudent(x.s, x.cp))} · Purata ${coexAverage(x.s, x.cp)}% · Gear ${coexOverallRule(x.s, x.cp).gear}</span></div>${coexStatusPill(x.rec.status)}<div class="actions">${x.rec.status === "submitted" ? `<button class="btn btn-secondary btn-sm" onclick="approveCoex('${x.s.id}','${x.cp}')">Luluskan</button>` : ""}${x.rec.status === "approved" ? `<button class="btn btn-success btn-sm" onclick="publishCoex('${x.s.id}','${x.cp}')">Terbitkan</button>` : ""}</div></div>`).join("") : '<div class="empty-state">Tiada rekod prestasi menunggu semakan.</div>'}</div></section><section class="coex-section"><div class="coex-section-head"><div><h3>Jadual Gear 1 hingga 11</h3><p>Julat yang sama digunakan sebagai indikator perkembangan T1 hingga T6, selaras dengan konsep COEx.</p></div></div><div class="coex-table-wrap"><table class="coex-matrix rules-table"><thead><tr><th>Gear</th><th>Warna</th><th>Min</th><th>Maks</th><th>Gred</th><th>Zon</th><th>Tahap</th><th>Tindakan guru</th></tr></thead><tbody>${settings.rules
    .map((r, i) => {
      const tone = toneForGear(r.gear);
      return `<tr><td>Gear ${r.gear}</td><td><div class="rule-color" style="--rule-color:${tone.color}" title="${esc(tone.name)}"></div></td><td><input data-rule="${i}" data-field="min" type="number" min="0" max="100" value="${r.min}"></td><td><input data-rule="${i}" data-field="max" type="number" min="0" max="100" value="${r.max}"></td><td><input data-rule="${i}" data-field="grade" value="${esc(r.grade)}"></td><td><input data-rule="${i}" data-field="zone" value="${esc(r.zone)}"></td><td><input data-rule="${i}" data-field="level" value="${esc(r.level)}"></td><td><input data-rule="${i}" data-field="action" value="${esc(r.action)}"></td></tr>`;
    })
    .join("")}</tbody></table></div></section>`;
}
// Intervention risk profiles and follow-up records
function riskProfile(s) {
  ensureCoex(s);
  const risks = coexSubjectRisk(s),
    lms = coexLms(s),
    declines = Object.keys(coexMarks(s, "trial")).filter(
      (sub) => gearShift(s, sub, "ppt", "trial") < 0,
    ),
    worst = risks[0]?.rule || coexOverallRule(s, "trial");
  let score =
    risks.filter((x) => x.rule.gear <= 2).length * 4 +
    risks.filter((x) => x.rule.gear <= 4).length * 2 +
    declines.length +
    (lms.applicable && !lms.eligible ? 6 : 0);
  return {
    risks,
    lms,
    declines,
    worst,
    score,
    priority: score >= 8 ? "high" : score >= 4 ? "medium" : "low",
  };
}
function activeInterventionsFor(id) {
  return data().interventions.filter(
    (x) => x.studentId === id && x.status !== "resolved",
  );
}
function superInterventionsHtml() {
  const list = activeStudents()
    .map((s) => ({ s, p: riskProfile(s) }))
    .filter((x) => x.p.score > 0 || activeInterventionsFor(x.s.id).length)
    .sort((a, b) => b.p.score - a.p.score);
  const counts = {
    high: list.filter((x) => x.p.priority === "high").length,
    medium: list.filter((x) => x.p.priority === "medium").length,
    active: data().interventions.filter((x) => x.status !== "resolved").length,
  };
  return `<div class="section-title"><div><h2>Pusat intervensi murid</h2><p>Utamakan murid berdasarkan zon kritikal, Gear menurun, TLMS bagi Tingkatan 4 dan 5, serta rekod susulan kaunselor.</p></div><span class="pill red">${counts.active} intervensi aktif</span></div><div class="stats"><article class="stat"><div class="stat-top"><small>Keutamaan tinggi</small><div class="stat-icon" style="background:#fff0f1;color:#b42f38">!</div></div><b>${counts.high}</b><span>perlu tindakan segera</span></article><article class="stat"><div class="stat-top"><small>Keutamaan sederhana</small><div class="stat-icon gold">◷</div></div><b>${counts.medium}</b><span>perlu pemantauan berkala</span></article><article class="stat"><div class="stat-top"><small>TLMS</small><div class="stat-icon purple">L</div></div><b>${list.filter((x) => x.p.lms.applicable && !x.p.lms.eligible).length}</b><span>T4 atau T5, BM atau Sejarah belum lulus</span></article><article class="stat"><div class="stat-top"><small>Susulan aktif</small><div class="stat-icon green">✓</div></div><b>${counts.active}</b><span>rekod belum diselesaikan</span></article></div><section class="coex-section"><div class="coex-section-head"><div><h3>Senarai keutamaan</h3><p>Skor risiko ialah alat saringan dalaman, bukan label kekal kepada murid.</p></div><div class="filter-row"><input placeholder="Cari nama atau subjek" oninput="filterInterventionCards(this.value)"></div></div><div class="risk-grid" id="risk-grid">${
    list.length
      ? list
          .map(({ s, p }) => {
            const current = coexOverallRule(s, "trial"),
              tone = toneForGear(current.gear),
              active = activeInterventionsFor(s.id);
            return `<article class="risk-card" data-search="${esc((s.name + " " + p.risks.map((r) => r.sub).join(" ")).toLowerCase())}"><div class="risk-card-head"><div><h4>${esc(s.name)}</h4><p>${esc(s.id)} · ${esc(className(s.classId))} · Gear ${current.gear} · ${tone.name}</p></div><span class="pill ${p.priority === "high" ? "red" : p.priority === "medium" ? "gold" : "green"}">${p.priority === "high" ? "Tinggi" : p.priority === "medium" ? "Sederhana" : "Rendah"}</span></div><div class="risk-subjects">${
              p.risks
                .slice(0, 5)
                .map(
                  (r) =>
                    `<span>${esc(r.sub)} · G${r.rule.gear}${r.shift < 0 ? " ↓" : ""}</span>`,
                )
                .join("") || "<span>Susulan aktif</span>"
            }</div><p>${p.lms.applicable && !p.lms.eligible ? `TLMS. BM ${p.lms.bmMark}%, Sejarah ${p.lms.sejMark}%. ` : ""}${p.declines.length ? `${p.declines.length} subjek menunjukkan Gear menurun.` : "Tiada penurunan Gear baharu."}</p><div class="risk-actions"><span class="priority ${p.priority}">${active.length} intervensi aktif</span><button class="btn btn-primary btn-sm" onclick="openInterventionModal('${s.id}')">Rekod tindakan</button></div></article>`;
          })
          .join("")
      : '<div class="empty-state">Tiada murid memerlukan intervensi semasa.</div>'
  }</div></section><section class="coex-section"><div class="coex-section-head"><div><h3>Rekod susulan</h3><p>Sejarah tindakan guru, kaunselor dan pihak sekolah.</p></div></div><div class="student-list">${
    data().interventions.length
      ? data()
          .interventions.slice()
          .reverse()
          .map((x) => {
            const s = getStudent(x.studentId);
            return `<div class="student-row"><div class="avatar">${initials(s?.name || "Murid")}</div><div class="student-meta"><strong>${esc(s?.name || x.studentId)} · ${esc(x.subject)}</strong><span>${esc(x.type)} · Susulan ${fmtDate(x.followUp)} · ${esc(x.note)}</span></div><span class="pill ${x.status === "resolved" ? "green" : "gold"}">${x.status === "resolved" ? "Selesai" : "Aktif"}</span>${x.status !== "resolved" ? `<button class="btn btn-success btn-sm" onclick="resolveIntervention('${x.id}')">Tandakan selesai</button>` : ""}</div>`;
          })
          .join("")
      : '<div class="empty-state">Belum ada intervensi direkodkan.</div>'
  }</div></section>`;
}
function filterInterventionCards(q) {
  q = String(q || "").toLowerCase();
  document
    .querySelectorAll("#risk-grid .risk-card")
    .forEach(
      (x) => (x.style.display = x.dataset.search.includes(q) ? "" : "none"),
    );
}
function openInterventionModal(id) {
  const s = getStudent(id),
    risk = riskProfile(s),
    subjects = Object.keys(coexMarks(s, "trial"));
  openModal(
    "Rekod intervensi COEx",
    `<form onsubmit="saveIntervention(event,'${id}')"><div class="student-banner" style="margin-bottom:16px"><div class="student-info">${studentPhoto(s)}<div><strong>${esc(s.name)}</strong><span>${esc(s.id)} · Gear ${coexOverallRule(s, "trial").gear} · ${risk.lms.applicable ? (risk.lms.eligible ? "LMS" : "TLMS") : "Profil " + assessmentProfile(s).program}</span></div></div></div><div class="form-grid"><div class="field"><label>Mata pelajaran</label><select id="int-subject">${subjects.map((sub) => `<option ${risk.risks[0]?.sub === sub ? "selected" : ""}>${esc(sub)}</option>`).join("")}</select></div><div class="field"><label>Jenis tindakan</label><select id="int-type"><option>Intervensi akademik</option><option>Sesi kaunseling</option><option>Libat urus ibu bapa</option><option>Kelas pemulihan</option><option>Pecutan peperiksaan akhir</option></select></div><div class="field"><label>Pegawai bertanggungjawab</label><input id="int-owner" value="${esc(currentUser.name)}" required></div><div class="field"><label>Tarikh susulan</label><input id="int-follow" type="date" value="2026-07-24" required></div><div class="field span-2"><label>Nota dan tindakan khusus</label><textarea id="int-note" rows="4" required>${esc(risk.risks[0]?.action || coexInterventionForRule(risk.risks[0]?.rule || coexOverallRule(s, "trial"), s) || "Tetapkan tindakan susulan berdasarkan prestasi checkpoint semasa.")}</textarea></div></div><div class="actions" style="justify-content:flex-end;margin-top:18px"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn btn-primary">Simpan intervensi</button></div></form>`,
  );
}
function saveIntervention(e, id) {
  e.preventDefault();
  const x = {
    id: "INT-" + Date.now(),
    studentId: id,
    subject: document.getElementById("int-subject").value,
    type: document.getElementById("int-type").value,
    owner: document.getElementById("int-owner").value.trim(),
    followUp: document.getElementById("int-follow").value,
    note: document.getElementById("int-note").value.trim(),
    status: "active",
    createdAt: new Date().toISOString(),
  };
  data().interventions.push(x);
  audit(`Merekod intervensi ${x.subject} untuk ${getStudent(id).name}.`, "red");
  save();
  closeModal();
  toast("Intervensi telah direkodkan.");
  renderCoexViews();
}
function resolveIntervention(id) {
  const x = data().interventions.find((i) => i.id === id);
  if (!x) return;
  x.status = "resolved";
  x.resolvedAt = new Date().toISOString();
  audit(
    `Menyelesaikan intervensi ${x.subject} untuk ${getStudent(x.studentId)?.name || x.studentId}.`,
    "green",
  );
  save();
  toast("Intervensi ditandakan selesai.");
  renderCoexViews();
}

function renderCoexViews() {
  ensureCoexSettings();
  data().students.forEach(ensureCoex);
  save();
  if (currentUser?.role === "parent") {
    const s = getStudent(selectedChildId);
    if (s)
      document.getElementById("view-parent-coex").innerHTML = parentCoexHtml(s);
  }
  if (currentUser?.role === "teacher") {
    const t = currentTeacher(),
      students = teacherStudents();
    document.getElementById("view-teacher-coex").innerHTML = teacherCoexHtml(
      t,
      students,
    );
  }
  if (currentUser?.role === "super") {
    document.getElementById("view-super-coex").innerHTML = superCoexHtml();
    document.getElementById("view-super-interventions").innerHTML =
      superInterventionsHtml();
  }
}

// Initialise the default login role
switchRole("parent");
