/*
 * Bahasa Melayu / English switch for the portal.
 * The screens are written in Malay. In English mode this file translates
 * text as it appears on the page (a MutationObserver), using an exact
 * phrase dictionary, patterns for text that contains numbers or names,
 * and term lists. Switching back restores the original Malay exactly.
 * Text with no translation stays in Malay.
 */
(function () {
  const STORAGE_KEY = "portal-lang";

  // Exact phrases (trimmed text of one text node or attribute).
  const PHRASES = {
    // Landing page and login
    "Portal Keluarga & Pentadbiran": "Family & Administration Portal",
    Fungsi: "Features",
    "Cara guna": "How it works",
    Hubungi: "Contact",
    "Log masuk portal": "Log in to the portal",
    "Sistem sekolah yang jelas untuk keluarga":
      "A clear school system for families",
    "Perkembangan anak anda, dalam satu paparan yang mudah.":
      "Your child's progress, in one simple view.",
    "Semak laporan akademik, kehadiran, kokurikulum, makluman sekolah, dan ulasan guru melalui portal yang direka untuk ibu bapa, guru, dan pentadbir sekolah.":
      "Check academic reports, attendance, co-curricular activities, school notices and teacher comments in a portal designed for parents, teachers and school administrators.",
    "Akses portal ibu bapa": "Parent portal",
    "Log masuk guru": "Teacher login",
    "1 akaun": "1 account",
    "Untuk lebih daripada seorang anak": "For more than one child",
    "3 peranan": "3 roles",
    "Ibu bapa, guru, pentadbir": "Parents, teachers, administrators",
    "1 rekod": "1 record",
    "Akademik hingga kehadiran": "From academics to attendance",
    "COEx & Gear Up telah dikemas kini": "COEx & Gear Up updated",
    "Kehadiran bulan ini": "Attendance this month",
    "Semua perkara penting, tersusun.": "Everything important, organised.",
    "Portal ini menjadikan rekod sekolah lebih mudah dicapai tanpa membebankan ibu bapa atau guru dengan proses yang rumit.":
      "This portal makes school records easier to reach without burdening parents or teachers with complicated processes.",
    "Dashboard prestasi anak": "Child performance dashboard",
    "Lihat markah, COEx warna, Gear 1 hingga 11, anjakan prestasi, sasaran akademik mengikut tingkatan, kehadiran, dan tindakan sokongan dalam satu pandangan.":
      "See marks, COEx colours, Gears 1 to 11, performance shifts, academic targets by form, attendance and support actions in one view.",
    "COEx & Gear Up": "COEx & Gear Up",
    "Terjemahkan setiap markah kepada gred, warna, Gear, zon tindakan, kredit, ganjaran dan intervensi. LMS dipaparkan khusus untuk Tingkatan 4 dan 5.":
      "Turns every mark into a grade, colour, Gear, action zone, credits, rewards and interventions. LMS is shown for Forms 4 and 5.",
    "Laporan rasmi berstatus": "Official reports with status",
    "Guru menyimpan draf, menghantar untuk semakan, dan pentadbir meluluskan sebelum ibu bapa melihat laporan.":
      "Teachers save drafts and submit for review, and administrators approve before parents see the report.",
    "Kehadiran harian": "Daily attendance",
    "Lihat rekod mengikut hari, sebab ketidakhadiran, trend bulanan, serta hantar makluman kepada sekolah.":
      "See records by day, reasons for absence and monthly trends, and send notices to the school.",
    "Komunikasi keluarga": "Family communication",
    "Terima pengumuman, tempah slot perjumpaan guru, dan hantar permohonan berkaitan kehadiran.":
      "Receive announcements, book meetings with teachers and send attendance requests.",
    "Akses ikut peranan": "Role-based access",
    "Guru hanya mengemas kini kelas dan subjek yang ditugaskan. Pentadbir mengawal pelajar, akses, dan kelulusan.":
      "Teachers only update their assigned class. Administrators control students, access and approvals.",
    "Rekod operasi sekolah": "School operations records",
    "Urus pelajar aktif, pindah kelas, arkib pelajar, foto pasport, audit aktiviti, dan data master sekolah.":
      "Manage active students, class moves, archived students, passport photos, the activity audit and school master data.",
    "Aliran penggunaan portal": "How the portal is used",
    "Setiap pihak hanya melakukan tindakan yang berkaitan dengan peranan mereka.":
      "Everyone only does what their role needs.",
    "Admin mendaftar pelajar": "Admin registers students",
    "Masukkan profil, kelas, penjaga, foto pasport, dan status pelajar.":
      "Enter profile, class, guardian, passport photo and student status.",
    "Guru merekod prestasi": "Teachers record performance",
    "Kemas kini subjek, kehadiran, ulasan kelas, serta aktiviti berkaitan.":
      "Update subjects, attendance, class comments and related activities.",
    "Pentadbir meluluskan": "Administrators approve",
    "Semak laporan yang dihantar sebelum diterbitkan kepada keluarga.":
      "Review submitted reports before they are published to families.",
    "Ibu bapa menerima makluman": "Parents are informed",
    "Semak data, laporan rasmi, kehadiran, dan komunikasi sekolah dalam satu akaun.":
      "Check data, official reports, attendance and school communication in one account.",
    "Portal sekolah yang bermula dengan rekod paling penting.":
      "A school portal that starts with the records that matter most.",
    "Ibu bapa menerima nama pengguna dan kata laluan sementara daripada guru kelas.":
      "Parents receive a username and temporary password from the class teacher.",
    "Maklumat hubungan akan dikemas kini oleh pihak sekolah.":
      "Contact details will be updated by the school.",
    "© 2026 Portal Keluarga & Pentadbiran":
      "© 2026 Family & Administration Portal",
    "Log masuk ibu bapa": "Parent login",
    "Log masuk pentadbir": "Administrator login",
    "Semak laporan, kehadiran, makluman, dan rekod untuk semua anak di sekolah.":
      "Check reports, attendance, notices and records for all your children at the school.",
    "Akses kelas, kehadiran, serta laporan yang ditugaskan kepada anda.":
      "Access your class, attendance and the reports assigned to you.",
    "Urus operasi sekolah, rekod pelajar, akses guru, kelulusan, audit, dan data asas.":
      "Manage school operations, student records, teacher access, approvals, the audit log and master data.",
    "Ibu bapa": "Parent",
    Guru: "Teacher",
    Pentadbir: "Administrator",
    "E-mel, no. telefon atau no. kad pengenalan":
      "Email, phone number or IC number",
    "Kata laluan": "Password",
    "Masuk sebagai ibu bapa": "Log in as parent",
    "Masuk sebagai guru": "Log in as teacher",
    "Masuk sebagai pentadbir": "Log in as administrator",
    "Nama pengguna dan kata laluan sementara diberikan oleh guru kelas. Lupa kata laluan? Hubungi guru kelas anak anda.":
      "Your username and temporary password are given by the class teacher. Forgot your password? Contact your child's class teacher.",
    "Lupa kata laluan? Hubungi pentadbir sistem sekolah.":
      "Forgot your password? Contact the school's system administrator.",
    "Lupa kata laluan? Hubungi super admin sekolah.":
      "Forgot your password? Contact the school's super admin.",
    "← Kembali ke laman sekolah": "← Back to the school page",

    // Navigation and chrome
    "Portal Pengurusan": "Management Portal",
    "Ibu Bapa": "Parents",
    "Dashboard anak": "Child dashboard",
    "Laporan akademik": "Academic report",
    "Metrik Prestasi Pelajar": "Student Performance Metrics",
    Kehadiran: "Attendance",
    "Makluman & perjumpaan": "Notices & meetings",
    "Profil keluarga": "Family profile",
    "Ringkasan kelas": "Class summary",
    "Rekod laporan": "Report records",
    "Rekod Prestasi Pelajar": "Student Performance Records",
    "Pelajar saya": "My students",
    "Super Admin": "Super Admin",
    "Operasi sekolah": "School operations",
    "Kelulusan laporan": "Report approvals",
    "Pelajar & penjaga": "Students & guardians",
    "Akses guru": "Teacher access",
    "Data sekolah": "School data",
    "Audit & privasi": "Audit & privacy",
    "Tetapan COEx": "COEx settings",
    "Intervensi murid": "Student interventions",
    "Log keluar": "Log out",
    "Sesi Akademik": "Academic Session",
    "Portal Ibu Bapa": "Parent Portal",
    "Panel Guru": "Teacher Panel",
    "Panel Super Admin": "Super Admin Panel",
    "Portal ibu bapa": "Parent portal",
    "Panel guru": "Teacher panel",
    "Panel super admin": "Super admin panel",
    "Super admin": "Super admin",
    "Cetak laporan": "Print report",
    "Pusat tindakan": "Action centre",
    "Kehadiran anak": "Child attendance",
    "Rekod laporan pelajar": "Student report records",

    // Common words and buttons
    Batal: "Cancel",
    Tutup: "Close",
    Simpan: "Save",
    Edit: "Edit",
    Padam: "Delete",
    Buang: "Remove",
    Semak: "Review",
    Luluskan: "Approve",
    Terbitkan: "Publish",
    Kembalikan: "Return",
    Aktif: "Active",
    Diarkibkan: "Archived",
    Arkib: "Archive",
    Pulihkan: "Restore",
    Draf: "Draft",
    Diterbitkan: "Published",
    Diluluskan: "Approved",
    "Menunggu semakan": "Awaiting review",
    Tiada: "None",
    Teruskan: "Continue",
    Nanti: "Later",
    Selesai: "Done",
    Seterusnya: "Next",
    Monitor: "Monitor",
    Support: "Support",
    Rekod: "Record",
    Subjek: "Subject",
    Markah: "Mark",
    Gred: "Grade",
    Prestasi: "Performance",
    Kelas: "Class",
    Tingkatan: "Form",
    Status: "Status",
    Tarikh: "Date",
    "Tarikh:": "Date:",
    Nama: "Name",
    "E-mel": "Email",
    Peranan: "Role",
    Pelajar: "Student",
    Anak: "Child",
    Bulan: "Month",
    Slot: "Slot",
    Mula: "Start",
    Tamat: "End",
    Kapasiti: "Capacity",
    Purata: "Average",
    Keseluruhan: "Overall",
    Lelaki: "Male",
    Perempuan: "Female",
    Jantina: "Gender",
    Warna: "Colour",
    Zon: "Zone",
    Tahap: "Level",
    Min: "Min",
    Maks: "Max",
    Sasaran: "Target",
    Peringkat: "Level",
    Penggal: "Term",
    Disiplin: "Discipline",
    Intervensi: "Intervention",
    Kokurikulum: "Co-curriculum",
    "Lihat sahaja": "View only",
    "Boleh dikemas kini": "Editable",
    "Belum ditetapkan": "Not set",
    "Belum diterbitkan": "Not published",
    "Lihat semua": "See all",
    Direkod: "Recorded",
    Hadir: "Present",
    "Tidak hadir": "Absent",
    Lewat: "Late",
    MC: "MC",
    "Cuti sakit": "Sick leave",
    "Urusan rasmi": "Official duty",
    hadir: "present",
    Meningkat: "Up",
    Menurun: "Down",
    Kekal: "Unchanged",
    Tinggi: "High",
    Sederhana: "Medium",
    Rendah: "Low",
    Ditempah: "Booked",
    Dibatalkan: "Cancelled",
    "Ada guru": "Has a teacher",
    Ahd: "Sun",
    Isn: "Mon",
    Sel: "Tue",
    Rab: "Wed",
    Kha: "Thu",
    Jum: "Fri",
    Sab: "Sat",

    // Parent pages
    "Pilih anak": "Choose child",
    "Purata akademik": "Academic average",
    "Kedudukan prestasi baik": "Good standing",
    "Perlu sokongan berterusan": "Needs continued support",
    "Menunggu laporan diterbitkan": "Waiting for the report to be published",
    "Gear semasa": "Current Gear",
    "Status laporan": "Report status",
    "Sedia untuk disemak": "Ready to view",
    "Dalam proses sekolah": "In progress at school",
    "Prestasi akademik": "Academic performance",
    "Lihat laporan penuh": "See full report",
    "Rekod harian yang telah dihantar oleh guru kelas":
      "Daily records sent by the class teacher",
    "Lihat rekod": "See records",
    "Perkara yang memerlukan perhatian": "Things that need attention",
    "Pemerhatian berdasarkan data semasa anak anda.":
      "Observations based on your child's current data.",
    "Ulasan dan sokongan guru": "Teacher comments and support",
    "Catatan akademik dan cadangan untuk di rumah.":
      "Academic notes and suggestions for home.",
    "Ulasan guru kelas": "Class teacher's comment",
    "Cadangan sokongan": "Support suggestions",
    "Cadangan untuk keluarga": "Suggestions for the family",
    "Rekod semasa sekolah": "Current school record",
    "Tiada rekod disiplin": "No discipline record",
    "Kehadiran memerlukan perhatian": "Attendance needs attention",
    "Sokongan pembelajaran disyorkan": "Learning support recommended",
    "Perkembangan semasa anak anda": "Your child's current progress",
    "Purata belum tersedia": "Average not available yet",
    "Purata akan dipaparkan selepas markah diterbitkan oleh sekolah.":
      "The average is shown after the school publishes marks.",
    "Subjek yang dimasukkan dalam kiraan purata":
      "Subjects counted in the average",
    "Skala graf prestasi akademik": "Academic performance graph scale",
    "Subjek yang dinilai": "Subjects assessed",
    "Graf dipaparkan apabila terdapat sekurang-kurangnya dua rekod purata.":
      "The graph appears once there are at least two averages.",
    "Graf perkembangan akademik": "Academic progress graph",
    "Markah rasmi, status penerbitan, dan rekod perkembangan antara penggal.":
      "Official marks, publication status and progress between terms.",
    "Laporan rasmi diterbitkan": "Official report published",
    "Laporan sedang diproses": "Report in progress",
    "Rekod laporan akan tersedia selepas sekolah meluluskan dan menerbitkannya.":
      "The report will be available after the school approves and publishes it.",
    "Laporan belum diterbitkan.": "Report not published yet.",
    "Guru sedang melengkapkan laporan atau pentadbir sedang menjalankan semakan. Markah terperinci hanya akan dipaparkan selepas penerbitan rasmi.":
      "The teacher is completing the report or an administrator is reviewing it. Detailed marks are shown only after official publication.",
    "🖨 Cetak laporan": "🖨 Print report",
    "⇩ Simpan PDF": "⇩ Save as PDF",
    "Purata keseluruhan:": "Overall average:",
    "Status kelulusan": "Approval status",
    "Setiap laporan melalui rekod proses sekolah.":
      "Every report goes through the school's process.",
    "Draf guru": "Teacher draft",
    "Laporan disediakan berdasarkan markah dan rekod pelajar.":
      "The report is prepared from the student's marks and records.",
    "Dalam proses": "In progress",
    "Semakan pentadbir": "Administrator review",
    "Pentadbir menyemak ketepatan dan kelengkapan laporan.":
      "An administrator checks the report is correct and complete.",
    "Menunggu kelulusan": "Waiting for approval",
    "Terbit kepada ibu bapa": "Published to parents",
    "Laporan boleh dilihat oleh penjaga yang berdaftar.":
      "Registered guardians can see the report.",
    "Trend perkembangan": "Progress trend",
    "Perbandingan keputusan terdahulu dengan penggal semasa.":
      "Earlier results compared with the current term.",
    "Sangat baik, teruskan prestasi.": "Very good, keep it up.",
    "Baik, kekalkan usaha konsisten.": "Good, keep up the steady effort.",
    "Perlu latihan tambahan secara berkala.": "Needs regular extra practice.",
    "Perlu intervensi dan sokongan guru.":
      "Needs intervention and teacher support.",
    "Markah belum dimasukkan.": "Mark not entered yet.",
    "Rekod harian, makluman ketidakhadiran, dan trend hadir mengikut bulan.":
      "Daily records, absence notices and monthly attendance trends.",
    "Klik pada tarikh untuk melihat status dan nota berkaitan.":
      "Click a date to see its status and notes.",
    "Ringkasan bulan": "Month summary",
    "Rekod berdasarkan hari persekolahan yang dimasukkan.":
      "Based on the school days recorded.",
    "Rekod yang memerlukan makluman": "Records that need a notice",
    "Status selain hadir penuh bagi bulan semasa.":
      "Anything other than full attendance this month.",
    "Tiada rekod luar biasa untuk bulan ini.": "Nothing unusual this month.",
    "Tiada nota direkodkan": "No note recorded",
    Tindakan: "Action",
    "Maklumkan ketidakhadiran": "Report an absence",
    "Permohonan akan direkodkan untuk semakan guru kelas.":
      "The notice is recorded for the class teacher to review.",
    "Sebab ketidakhadiran": "Reason for absence",
    "Urusan keluarga": "Family matters",
    "Rawatan kesihatan": "Medical treatment",
    "MC / sijil sakit": "MC / medical certificate",
    "Lain-lain": "Other",
    "Nota ringkas": "Short note",
    "Contoh: Temujanji rawatan di klinik pada waktu pagi.":
      "Example: Clinic appointment in the morning.",
    "Hantar makluman": "Send notice",
    "Tiada nota tambahan direkodkan untuk tarikh ini.":
      "No extra note recorded for this date.",
    "Belum direkodkan": "Not recorded yet",
    "Pengumuman sekolah, tindakan yang perlu dibuat, dan tempahan slot guru.":
      "School announcements, things to do and teacher meeting bookings.",
    "Tempah perjumpaan": "Book a meeting",
    "Pengumuman sekolah": "School announcements",
    "Makluman semasa yang diterbitkan kepada keluarga.":
      "Current notices published to families.",
    "Perjumpaan saya": "My meetings",
    "Perjumpaan anak ini dengan guru kelas.":
      "This child's meetings with the class teacher.",
    "Belum ada perjumpaan yang ditempah.": "No meetings booked yet.",
    "Hubungi sekolah": "Contact the school",
    "Gunakan saluran rasmi untuk pertanyaan berhubung anak anda.":
      "Use official channels for questions about your child.",
    "Pejabat sekolah": "School office",
    "E-mel rasmi": "Official email",
    "Untuk pertanyaan bukan kecemasan.": "For non-urgent questions.",
    "Guru kelas": "Class teacher",
    "Tempah slot melalui portal supaya rekod komunikasi tersusun.":
      "Book a slot in the portal so communication is recorded.",
    "Maklumat penjaga yang dikaitkan dengan rekod pelajar di sekolah.":
      "Guardian details linked to student records at the school.",
    "Maklumat penjaga utama": "Main guardian details",
    "Untuk menukar maklumat ini, hubungi pejabat sekolah dengan dokumen sokongan.":
      "To change these details, contact the school office with supporting documents.",
    "Nombor telefon": "Phone number",
    "Tukar kata laluan": "Change password",
    "Anak yang dikaitkan": "Linked children",
    "Akses anda hanya diberikan kepada pelajar yang dipautkan oleh sekolah.":
      "You only have access to students linked by the school.",
    "Untuk tambah atau buang akses penjaga, hubungi pejabat sekolah dengan dokumen sokongan yang berkaitan.":
      "To add or remove guardian access, contact the school office with the relevant documents.",
    "Tempah perjumpaan guru": "Book a teacher meeting",
    "Topik perbincangan": "Topic",
    "Perkembangan akademik": "Academic progress",
    "Sokongan pembelajaran": "Learning support",
    "Perkara lain": "Other matters",
    "Sahkan tempahan": "Confirm booking",

    // COEx (parent and shared)
    "COEx dan Gear digunakan secara fleksibel untuk Tingkatan 1 hingga Tingkatan 6, dengan checkpoint yang berubah mengikut peringkat akademik.":
      "COEx and Gear are used for Forms 1 to 6, with checkpoints that change by academic level.",
    "COEx dan Gear menerangkan prestasi anak anda mengikut checkpoint peperiksaan.":
      "COEx and Gear explain your child's performance at each exam checkpoint.",
    "Metrik belum diterbitkan.": "Metrics not published yet.",
    "Cetak metrik": "Print metrics",
    "Sahkan telah dibaca": "Confirm I have read this",
    "Telah disahkan": "Confirmed",
    "GEAR SEMASA": "CURRENT GEAR",
    "Gear kekal": "Gear unchanged",
    "Potensi akademik digunakan": "Academic potential used",
    "Status LMS": "LMS status",
    "Layak Mendapat Sijil": "Eligible for Certificate (LMS)",
    "Tidak Layak Mendapat Sijil": "Not eligible for Certificate (TLMS)",
    "Peringkat akademik": "Academic level",
    "Gear kredit / A": "Credit Gear / A",
    "Senarai subjek & markah": "Subjects & marks",
    "Paparan markah murid mengikut warna COEx yang telah ditetapkan.":
      "The student's marks in their COEx colours.",
    "Tangga enam level menunjukkan kedudukan semasa, perubahan dari checkpoint terdahulu dan sasaran seterusnya.":
      "The six-level ladder shows the current position, the change since the last checkpoint and the next target.",
    "Lihat comparison": "See comparison",
    "🏆 Reward": "🏆 Reward",
    "🏅 e-Certificate": "🏅 e-Certificate",
    "Jejak peperiksaan & paras murid": "Exam track & student level",
    "Paras semasa": "Current level",
    "Peperiksaan ini telah dilalui.": "This exam has been taken.",
    "Markah semasa anak anda sedang dirujuk pada checkpoint ini.":
      "Your child's current marks refer to this checkpoint.",
    "Checkpoint masa hadapan untuk dipantau oleh sekolah.":
      "A future checkpoint the school will monitor.",
    "Tarikh peperiksaan ditetapkan oleh super admin dalam modul COEx. Guru memasukkan markah, manakala ibu bapa melihat paparan ini secara baca sahaja.":
      "Exam dates are set by the super admin in COEx settings. Teachers enter marks; parents see this view read-only.",
    "Perbandingan checkpoint": "Checkpoint comparison",
    "Perbandingan purata markah mengikut checkpoint":
      "Average marks by checkpoint",
    "Kelayakan dan sasaran": "Eligibility and targets",
    "Lulus syarat LMS": "Meets the LMS requirement",
    "Gear ke sasaran": "Gears to target",
    "Jurang purata": "Average gap",
    "Markah diperlukan ke sasaran": "Marks needed to reach the target",
    "Gred semasa": "Current grade",
    "Matriks prestasi subjek": "Subject performance matrix",
    "Subjek diatur mengikut abjad. Gred C dan ke atas dipaparkan dengan bintang, dan warna gred mengikut warna COEx.":
      "Subjects are in alphabetical order. Grades C and above have a star, and grade colours follow COEx.",
    Anjakan: "Shift",
    "Jurang sasaran": "Gap to target",
    "Tindakan dicadang": "Suggested action",
    "Belum ada markah": "No marks yet",
    "Ganjaran dan pengiktirafan": "Rewards and recognition",
    "Ganjaran automatik apabila sasaran tertentu dicapai.":
      "Automatic rewards when certain targets are reached.",
    "Belum ada ganjaran dicapai buat masa ini.": "No rewards reached yet.",
    "Intervensi dicadangkan": "Suggested interventions",
    "Subjek berisiko, Gear menurun atau masih belum stabil.":
      "Subjects at risk, with falling Gears or not yet stable.",
    "Prestasi stabil": "Stable performance",
    "Tiada subjek berisiko tinggi dikesan pada checkpoint semasa.":
      "No high-risk subjects at the current checkpoint.",
    "Perkembangan positif": "Positive progress",
    "Perlu perhatian": "Needs attention",
    "Perkembangan stabil": "Steady progress",
    "Prestasi kekal. Fokus tambahan diperlukan untuk bergerak ke Gear seterusnya.":
      "Performance is unchanged. Extra focus is needed to reach the next Gear.",
    "Prestasi menurun. Murid perlukan pelan intervensi untuk kembali ke landasan.":
      "Performance has dropped. The student needs an intervention plan to get back on track.",
    "Anjakan Gear": "Gear shift",
    "Subjek meningkat": "Subjects up",
    "Perubahan purata": "Change in average",
    "Bahasa Melayu dan Sejarah melepasi markah kelulusan yang ditetapkan.":
      "Bahasa Melayu and Sejarah are above the pass mark.",
    "◆ Purple Excellence": "◆ Purple Excellence",
    "✓ Layak Mendapat Sijil": "✓ Eligible for Certificate",
    "Perbandingan perjalanan akademik": "Academic journey comparison",
    "Bandingan checkpoint rujukan dengan checkpoint semasa untuk melihat perubahan sebelum menuju sasaran akhir.":
      "Compare the reference checkpoint with the current one to see the change before the final target.",
    "Belum ada markah untuk dibandingkan.": "No marks to compare yet.",
    "Meter perjalanan dipaparkan selepas markah tersedia.":
      "The journey meter appears once marks are available.",
    "Rujukan:": "Reference:",
    "Semasa:": "Current:",
    "Checkpoint rujukan": "Reference checkpoint",
    "Checkpoint semasa": "Current checkpoint",
    "Ganjaran e-Certificate": "e-Certificate reward",
    "Achievement Unlocked": "Achievement Unlocked",
    "LEVEL UP": "LEVEL UP",
    "Anda telah mencapai keputusan yang membanggakan dalam Bahasa Melayu dan Sejarah. Usaha, disiplin dan kesungguhan anda telah membuka pencapaian baharu ini. Teruskan momentum yang baik dan sasarkan tahap prestasi yang lebih tinggi.":
      "You have achieved proud results in Bahasa Melayu and Sejarah. Your effort, discipline and determination have unlocked this new achievement. Keep the momentum going and aim even higher.",
    "Poin pencapaian": "Achievement points",
    "untuk milestone akademik": "for an academic milestone",
    "e-Certificate dibuka": "e-Certificate unlocked",
    "sebagai ganjaran digital": "as a digital reward",
    "Status layak masuk universiti": "University entry eligibility",
    "Pencapaian hebat!": "Great achievement!",
    "Anda telah memenuhi syarat kelulusan Bahasa Melayu dan Sejarah. Ini ialah satu langkah penting dalam perjalanan akademik anda menuju pendidikan tinggi.":
      "You have met the Bahasa Melayu and Sejarah pass requirement. This is an important step towards higher education.",
    "Reward dibuka!": "Reward unlocked!",
    "New reward available": "New reward available",
    "e-Certificate Unlocked": "e-Certificate Unlocked",
    "Buka reward": "Open reward",
    "Status kehadiran": "Attendance status",
    "Notis privasi": "Privacy notice",
    "Saya setuju": "I agree",

    // Account dialogs
    "Tukar kata laluan sementara": "Change your temporary password",
    "Untuk keselamatan, sila tukar kata laluan sementara anda sebelum meneruskan.":
      "For security, please change your temporary password before continuing.",
    "Kata laluan semasa": "Current password",
    "Kata laluan baharu": "New password",
    "Sekurang-kurangnya 8 aksara, mengandungi huruf dan nombor.":
      "At least 8 characters, with letters and numbers.",
    "Sahkan kata laluan baharu": "Confirm new password",
    "Simpan kata laluan": "Save password",

    // Teacher pages
    "Anda hanya boleh mengakses kelas dan komponen laporan yang ditugaskan kepada anda.":
      "You can only access the class and report parts assigned to you.",
    "Guru Kelas": "Class Teacher",
    "Akses kelas": "Class access",
    "Akses subjek": "Subject access",
    "Tiada akses subjek": "No subject access",
    "Rekod kehadiran": "Attendance records",
    "Dibenarkan untuk kelas yang ditugaskan": "Allowed for the assigned class",
    "Pelajar dalam akses": "Students in access",
    "pelajar aktif dalam kelas anda": "active students in your class",
    "Laporan belum diterbit": "Reports not published",
    "draf atau menunggu semakan": "draft or awaiting review",
    "akses kehadiran kelas": "class attendance access",
    "Permohonan ibu bapa": "Parent notices",
    "makluman untuk disemak": "notices to review",
    "High performer student": "High performers",
    "Guru kelas boleh terus kenal pasti murid yang konsisten cemerlang untuk dikekalkan momentumnya.":
      "Class teachers can spot consistently excellent students and help them keep their momentum.",
    "Low performance student": "Students needing support",
    "Guru kelas boleh fokus pada murid yang perlukan support lebih awal, sama ada dari markah atau kehadiran.":
      "Class teachers can focus early on students who need support, from marks or attendance.",
    "Tiada data murid.": "No student data.",
    "Penapisan murid mengikut gred subjek": "Filter students by subject grade",
    "Guru boleh tapis murid mengikut subjek dan gred untuk monitor kumpulan sasaran dengan lebih cepat.":
      "Filter students by subject and grade to monitor target groups faster.",
    "Pilih subjek": "Choose subject",
    "Pilih gred": "Choose grade",
    "Semua gred": "All grades",
    "Purata subjek": "Subject average",
    "Jumlah murid": "Total students",
    "Padanan tapisan": "Filter matches",
    "Gred tertinggi": "Highest grade",
    "Gred terbaik yang wujud dalam subjek ini": "Best grade in this subject",
    "Bilangan murid bagi setiap gred untuk subjek ini.":
      "Number of students per grade in this subject.",
    "Bilangan murid": "Number of students",
    "Contoh bacaan: jika pilih Bahasa Melayu dan gred A, sistem akan tunjuk berapa ramai murid yang mendapat A dalam subjek tersebut beserta senarai murid.":
      "Example: choose Bahasa Melayu and grade A to see how many students got an A in that subject, with the list.",
    "Senarai murid padan tapisan": "Students matching the filter",
    "Tiada murid padan dengan tapisan semasa.":
      "No students match the current filter.",
    "Pelajar yang perlu tindakan": "Students needing action",
    "Keutamaan berdasarkan status laporan dan kehadiran.":
      "Priority based on report status and attendance.",
    "Buka rekod laporan": "Open report records",
    "Tiada pelajar yang memerlukan tindakan segera.":
      "No students need urgent action.",
    "Makluman ibu bapa": "Parent notices",
    "Permohonan ketidakhadiran yang dihantar melalui portal.":
      "Absence notices sent through the portal.",
    "Tiada makluman baharu.": "No new notices.",
    Terima: "Accept",
    Diterima: "Accepted",
    Ditolak: "Rejected",
    "Simpan sebagai draf atau hantar untuk semakan pentadbir. Rekod diterbitkan hanya selepas kelulusan.":
      "Save as a draft or submit for administrator review. Records are published only after approval.",
    "Maklumat laporan": "Report details",
    "Sila lengkapkan komponen yang berada dalam skop akses anda.":
      "Please complete the parts within your access.",
    "Pilih pelajar": "Choose student",
    "Markah akademik": "Academic marks",
    "Guru hanya boleh mengubah subjek dan kelas yang telah diberikan oleh pentadbir.":
      "Teachers can only change the subjects and class assigned by an administrator.",
    "Kehadiran (%)": "Attendance (%)",
    "Dikira daripada rekod kehadiran harian.":
      "Calculated from daily attendance records.",
    "Mata kokurikulum": "Co-curricular score",
    "Cadangan sokongan untuk keluarga": "Support suggestions for the family",
    "Simpan draf": "Save draft",
    "Simpan sasaran": "Save targets",
    "Hantar untuk semakan": "Submit for review",
    "Checkpoint ini ditutup oleh pentadbir. Markah tidak boleh diubah.":
      "This checkpoint has been closed by an administrator. Marks cannot be changed.",
    "Laporan telah dihantar. Hubungi pentadbir jika perlu dikembalikan untuk pembetulan.":
      "The report has been submitted. Contact an administrator if it needs to be returned for correction.",
    "Aliran laporan": "Report flow",
    "Proses penerbitan yang boleh dikesan.": "A traceable publication process.",
    "Guru simpan rekod": "Teacher saves the record",
    "Data boleh disimpan sebagai draf sebelum dihantar.":
      "Data can be saved as a draft before submitting.",
    "Belum dihantar": "Not submitted yet",
    "Pentadbir semak": "Administrator reviews",
    "Pemeriksaan kelengkapan, markah, dan ulasan.":
      "Checks completeness, marks and comments.",
    "Ibu bapa melihat laporan": "Parents see the report",
    "Hanya laporan diterbitkan dapat dilihat dari akaun penjaga.":
      "Only published reports can be seen from guardian accounts.",
    "Setiap perubahan direkodkan dalam audit trail sistem.":
      "Every change is recorded in the system audit trail.",
    "Akses dibenarkan": "Access allowed",
    "Tiada akses": "No access",
    "Simpan rekod selepas menyemak semua pelajar.":
      "Save after checking every student.",
    "Tanda semua hadir": "Mark all present",
    "Contoh: Makluman ibu bapa diterima":
      "Example: Notice received from parent",
    "Simpan kehadiran hari ini": "Save attendance",
    "Tarikh kehadiran": "Attendance date",
    "Senarai pelajar aktif dalam kelas yang ditugaskan kepada anda.":
      "Active students in your assigned class.",
    "Cipta akaun ibu bapa": "Create parent accounts",
    "Carian dan status pelajar": "Search and student status",
    "Pilih pelajar untuk menyemak laporan dalam skop akses anda.":
      "Choose a student to check their report.",
    "Cari nama atau ID": "Search name or ID",
    "Semua kelas": "All classes",
    "Kata laluan penjaga": "Guardian password",
    "Perjumpaan ibu bapa": "Parent meetings",
    "+ Buka slot": "+ Open slot",
    "Belum ada slot dibuka.": "No slots open yet.",
    "Masukkan markah mengikut profil Tingkatan 1 hingga Tingkatan 6. Sistem menukar label checkpoint secara automatik berdasarkan kelas pelajar.":
      "Enter marks for Forms 1 to 6. Checkpoint labels change automatically with the student's class.",
    "Guru hanya boleh mengubah subjek dan kelas dalam skop akses mereka.":
      "Teachers can only change subjects and classes within their access.",
    Checkpoint: "Checkpoint",
    "Mata pelajaran": "Subject",
    "Tindakan sistem": "System action",
    "Pratonton automatik": "Live preview",
    "Dikemas kini semasa markah ditaip.": "Updates as marks are typed.",
    "Purata checkpoint": "Checkpoint average",
    "Gear keseluruhan": "Overall Gear",
    "Profil penilaian": "Assessment profile",
    "Potensi digunakan": "Potential used",
    "Peraturan checkpoint": "Checkpoint rules",
    "Checkpoint telah diterbitkan": "Checkpoint published",
    "Markah dikunci untuk menjaga integriti rekod.":
      "Marks are locked to protect the record.",
    "Semakan diperlukan": "Review needed",
    "Draf perlu dihantar dan diterbitkan oleh super admin sebelum menjadi rasmi kepada ibu bapa.":
      "Drafts must be submitted and published by an administrator before parents see them.",

    // Admin pages
    "Ringkasan operasi sekolah": "School operations summary",
    "Pantau kelengkapan data, proses laporan, akses pengguna, dan rekod penting sistem.":
      "Monitor data completeness, the report process, user access and key system records.",
    "⇧ Import data pelajar": "⇧ Import students",
    "Pelajar aktif": "Active students",
    "Laporan menunggu semakan": "Reports awaiting review",
    "Foto pasport lengkap": "Passport photos complete",
    "Kesihatan data sekolah": "School data health",
    "Metrik operasi untuk tindakan pentadbiran.":
      "Operational metrics for administrative action.",
    "Profil pelajar lengkap": "Complete student profiles",
    "Foto pasport": "Passport photo",
    "Laporan diterbitkan": "Reports published",
    "Akses guru aktif": "Active teacher access",
    "Tiada laporan menunggu semakan pada masa ini.":
      "No reports awaiting review right now.",
    "Untuk memudahkan kerja pentadbir, butang import data pelajar melalui spreadsheet turut disediakan terus pada panel ini.":
      "For convenience, the student spreadsheet import is also available here.",
    "Audit terkini": "Latest audit",
    "Aktiviti terbaharu direkodkan sistem.":
      "Latest activity recorded by the system.",
    "Keutamaan tindakan": "Action priorities",
    "Isu yang patut dipantau pada hari ini.": "Issues to watch today.",
    "Kelulusan perlu dibuat sebelum ibu bapa melihat laporan.":
      "Approval is needed before parents see the report.",
    "Guru kelas perlu menyemak makluman daripada ibu bapa.":
      "Class teachers need to review notices from parents.",
    "Lengkapkan foto pelajar melalui modul Pelajar & penjaga.":
      "Complete student photos in Students & guardians.",
    "Semua pelajar aktif mempunyai foto pasport.":
      "All active students have a passport photo.",
    "Maklumat sesi semasa": "Current session",
    "Data master yang digunakan oleh semua rekod.":
      "Master data used by all records.",
    "Kawalan akses diurus melalui modul Akses guru.":
      "Access is managed in Teacher access.",
    "Analitik penuh data pelajar": "Full student analytics",
    "Pentadbir boleh tapis subjek, tingkatan dan gred untuk melihat purata sekolah serta bilangan murid bagi setiap gred.":
      "Filter by subject, form and grade to see the school average and the number of students per grade.",
    "Filter tingkatan": "Filter by form",
    "Filter gred": "Filter by grade",
    "Semua tingkatan": "All forms",
    "Purata satu sekolah": "School average",
    "Purata keseluruhan murid aktif yang mempunyai markah":
      "Overall average of active students with marks",
    "Jumlah murid ditapis": "Students filtered",
    "Mempunyai markah dalam skop tapisan semasa":
      "Have marks in the current filter",
    "Padanan gred": "Grade matches",
    "Pecahan gred ikut tingkatan": "Grades by form",
    "Bil murid": "Students",
    "Section ini sesuai untuk pentadbir melihat purata satu sekolah dan mengenal pasti berapa ramai murid mendapat gred A, A-, B+, C dan seterusnya mengikut setiap subjek.":
      "Use this to see the school average and how many students got A, A-, B+, C and so on in each subject.",
    "Senarai murid ikut tapisan": "Students by filter",
    "Semak laporan yang dihantar oleh guru sebelum menerbitkan kepada penjaga berdaftar.":
      "Review reports submitted by teachers before publishing them to registered guardians.",
    "Luluskan semua": "Approve all",
    "Terbitkan semua diluluskan": "Publish all approved",
    "Senarai laporan": "Reports",
    "Pentadbir boleh meluluskan dan menerbitkan laporan dalam proses berasingan.":
      "Approving and publishing are separate steps.",
    "Tiada laporan dalam aliran kelulusan pada masa ini.":
      "No reports in the approval flow right now.",
    "Tiada rekod": "No record",
    "Semakan laporan pelajar": "Student report review",
    "Ulasan guru:": "Teacher's comment:",
    "Luluskan laporan": "Approve report",
    "Terbitkan laporan": "Publish report",
    "Daftar, kemas kini, pindah kelas, arkib, dan cari rekod pelajar dengan lebih cepat.":
      "Register, update, move, archive and find student records quickly.",
    "Akaun ibu bapa": "Parent accounts",
    "⇧ Import spreadsheet": "⇧ Import spreadsheet",
    "+ Tambah pelajar": "+ Add student",
    "boleh diakses oleh guru": "visible to teachers",
    "graduasi atau pindah keluar": "graduated or transferred out",
    "profil dengan foto": "profiles with a photo",
    "Penjaga dipautkan": "Linked guardians",
    "akaun penjaga direkodkan": "guardian accounts recorded",
    "Rekod pelajar": "Student records",
    "Status aktif membolehkan guru melihat pelajar dalam kelas yang ditugaskan.":
      "Active students are visible to their class teacher.",
    "Cari nama, ID atau penjaga": "Search name, ID or guardian",
    "Semua status": "All statuses",
    "Pindah kelas": "Move class",
    "Daftar pelajar baharu": "Register new student",
    "Kemaskini pelajar": "Update student",
    "Nama penuh pelajar": "Student's full name",
    "ID pelajar": "Student ID",
    "Kosongkan untuk dijana automatik": "Leave blank to generate automatically",
    "Nama penjaga": "Guardian name",
    "Nombor telefon penjaga": "Guardian phone number",
    "No. kad pengenalan penjaga": "Guardian IC number",
    "Untuk log masuk dan padanan adik-beradik":
      "For login and sibling matching",
    "Foto pasport pelajar": "Student passport photo",
    "JPG atau PNG sahaja, maksimum 2 MB.": "JPG or PNG only, up to 2 MB.",
    "Pilih gambar": "Choose image",
    "Daftar pelajar": "Register student",
    "Simpan perubahan": "Save changes",
    "Pindah kelas pelajar": "Move student",
    "Kelas baharu": "New class",
    "Sebab pertukaran": "Reason for change",
    "Contoh: Naik tingkatan atau pertukaran kelas":
      "Example: Moving up a form or changing class",
    "Simpan pertukaran": "Save change",
    "Import data pelajar melalui spreadsheet":
      "Import students from a spreadsheet",
    "Fail CSV dengan baris tajuk. Lajur wajib:":
      "CSV file with a header row. Required columns:",
    "Kod kelas yang wujud:": "Existing class codes:",
    "Simpan sebagai → CSV UTF-8": "Save as → CSV UTF-8",
    "Pilih fail CSV": "Choose CSV file",
    "Tiada fail dipilih.": "No file chosen.",
    "Import data pelajar": "Import students",
    "Keputusan import": "Import result",
    "Akaun kakitangan": "Staff accounts",
    "Guru kelas, pentadbir dan super admin. Setiap guru kelas mengurus satu kelas.":
      "Class teachers, administrators and super admins. Each class teacher manages one class.",
    "+ Tambah akaun": "+ Add account",
    "Senarai akaun": "Accounts",
    "Kata laluan sementara dipaparkan sekali sahaja semasa akaun dicipta atau ditetapkan semula.":
      "Temporary passwords are shown once, when an account is created or reset.",
    "Reset kata laluan": "Reset password",
    "Tambah akaun kakitangan": "Add staff account",
    "Kemaskini akaun kakitangan": "Update staff account",
    "Kelas (guru kelas sahaja)": "Class (class teachers only)",
    "Tiada kelas": "No class",
    "Status akaun": "Account status",
    "Tidak aktif": "Inactive",
    "Akaun baharu": "New account",
    "Kata laluan sementara": "Temporary password",
    "Kata laluan sementara penjaga": "Guardian temporary password",
    "Kata laluan ini hanya dipaparkan sekali. Cetak atau salin sebelum menutup.":
      "This password is shown only once. Print or copy it before closing.",
    "Cetak slip": "Print slips",
    "Nama pengguna:": "Username:",
    "Kata laluan sementara:": "Temporary password:",
    "Akaun dicipta untuk penjaga yang belum mempunyai akaun. Nama pengguna ialah no. kad pengenalan, telefon atau e-mel penjaga. Slip dengan kata laluan sementara dipaparkan sekali untuk dicetak.":
      "Accounts are created for guardians who don't have one yet. The username is the guardian's IC number, phone or email. Slips with temporary passwords are shown once for printing.",
    "Cipta akaun": "Create accounts",
    "Data sekolah Tingkatan 1 hingga 6": "School data, Forms 1 to 6",
    "Struktur kelas, subjek dan profil penilaian kini menyokong Menengah Rendah, Menengah Atas dan Tingkatan 6.":
      "Classes, subjects and assessment profiles for Lower Secondary, Upper Secondary and Form 6.",
    "Sesi akademik & maklumat sekolah": "Academic session & school details",
    "Data ini muncul pada laporan, dashboard dan laman utama.":
      "Shown on reports, dashboards and the home page.",
    "Sesi akademik": "Academic session",
    "Tarikh dan checkpoint diurus dalam Tetapan COEx.":
      "Dates and checkpoints are managed in COEx settings.",
    "Nama sekolah": "School name",
    "Alamat sekolah": "School address",
    "Telefon pejabat": "Office phone",
    "Waktu pejabat": "Office hours",
    "Simpan data sekolah": "Save school data",
    "Super admin sahaja": "Super admin only",
    "Kelas aktif": "Active classes",
    "Kelas disusun mengikut Tingkatan 1 hingga Tingkatan 6.":
      "Classes in order from Form 1 to Form 6.",
    "+ Tambah kelas": "+ Add class",
    "Profil subjek mengikut peringkat": "Subjects by level",
    "Subjek baharu boleh ditugaskan kepada satu peringkat atau semua tingkatan.":
      "A new subject can go to one level or all forms.",
    "+ Tambah subjek": "+ Add subject",
    "Tingkatan 1 hingga 3": "Forms 1 to 3",
    "Tingkatan 4 dan 5": "Forms 4 and 5",
    "Data kokurikulum": "Co-curricular data",
    "Aktiviti boleh digunakan oleh pelajar Tingkatan 1 hingga Tingkatan 6.":
      "Activities for students in Forms 1 to 6.",
    "Tambah kelas baharu": "Add new class",
    "Kod kelas": "Class code",
    "Contoh: 1A atau 6R": "Example: 1A or 6R",
    "Nama kelas": "Class name",
    "Contoh: Tingkatan 1 Amanah": "Example: Form 1 Amanah",
    "Tambah kelas": "Add class",
    "Tambah subjek laporan": "Add report subject",
    "Nama subjek": "Subject name",
    "Contoh: Geografi": "Example: Geography",
    "Tambah subjek": "Add subject",
    "Jejak perubahan penting dan kawalan privasi data pelajar.":
      "Track important changes and student data privacy controls.",
    "Audit trail": "Audit trail",
    "80 aktiviti terkini: kemas kini rekod, akses, kelulusan, dan proses lain.":
      "Latest 80 activities: record updates, access, approvals and other processes.",
    "Cari aktiviti": "Search activity",
    "Tiada aktiviti direkodkan.": "No activity recorded.",
    "Kawalan privasi": "Privacy controls",
    "Notis privasi dan persetujuan ibu bapa (PDPA).":
      "Privacy notice and parent consent (PDPA).",
    "Draf belum diterbitkan. Ibu bapa belum diminta memberi persetujuan.":
      "Draft not published. Parents have not been asked for consent yet.",
    "Semak & terbitkan notis privasi": "Review & publish privacy notice",
    "Kata laluan disimpan secara hash, nombor kad pengenalan disulitkan, dan setiap perubahan direkodkan dalam log audit pelayan.":
      "Passwords are hashed, IC numbers are encrypted and every change is recorded in the server audit log.",
    "Terbitkan notis privasi": "Publish privacy notice",
    "Tetapan Color of Excellence": "Color of Excellence settings",
    "COEx dan Gear menyokong Tingkatan 1 hingga Tingkatan 6. Label checkpoint berubah mengikut peringkat, sementara warna dan Gear kekal konsisten.":
      "COEx and Gear cover Forms 1 to 6. Checkpoint labels change by level; colours and Gears stay the same.",
    "Simpan tetapan": "Save settings",
    "pelajar aktif dalam sistem": "active students in the system",
    "Ringkasan Gear seluruh sekolah": "Gear summary for the whole school",
    "Bilangan pelajar mengikut Gear pada checkpoint semasa profil masing-masing.":
      "Students per Gear at their current checkpoint.",
    "Peraturan utama": "Main rules",
    "Ambang Gear terpakai kepada semua tingkatan. LMS hanya digunakan untuk Tingkatan 4 dan 5.":
      "Gear thresholds apply to all forms. LMS only applies to Forms 4 and 5.",
    "Markah lulus LMS, T4 dan T5": "LMS pass mark, F4 and F5",
    "Gear minimum kredit": "Minimum credit Gear",
    "Gear ganjaran Purple": "Purple reward Gear",
    "Kunci checkpoint sistem": "System checkpoint",
    "Jadual peperiksaan untuk animasi pelajar":
      "Exam schedule for the student timeline",
    "Super admin menetapkan tarikh peperiksaan bagi setiap tingkatan. Guru hanya memasukkan markah, dan ibu bapa hanya melihat visual perjalanan peperiksaan.":
      "The super admin sets exam dates for each form. Teachers enter marks; parents only see the exam journey.",
    "Simpan tarikh": "Save dates",
    "Kelulusan rekod prestasi": "Performance record approvals",
    "Guru menghantar rekod, super admin meluluskan, kemudian menerbitkan kepada ibu bapa.":
      "Teachers submit records; administrators approve and then publish them to parents.",
    "Tiada rekod prestasi menunggu semakan.":
      "No performance records awaiting review.",
    "Jadual Gear 1 hingga 11": "Gear 1 to 11 table",
    "Julat yang sama digunakan sebagai indikator perkembangan T1 hingga T6, selaras dengan konsep COEx.":
      "The same ranges are used as progress indicators for Forms 1 to 6, in line with COEx.",
    "Tindakan guru": "Teacher action",
    "Pusat intervensi murid": "Student intervention centre",
    "Utamakan murid berdasarkan zon kritikal, Gear menurun, TLMS bagi Tingkatan 4 dan 5, serta rekod susulan kaunselor.":
      "Prioritise students by critical zone, falling Gears, TLMS in Forms 4 and 5, and counsellor follow-ups.",
    "Keutamaan tinggi": "High priority",
    "perlu tindakan segera": "need urgent action",
    "Keutamaan sederhana": "Medium priority",
    "perlu pemantauan berkala": "need regular monitoring",
    TLMS: "TLMS",
    "T4 atau T5, BM atau Sejarah belum lulus":
      "F4 or F5, BM or Sejarah not passed",
    "Susulan aktif": "Active follow-ups",
    "rekod belum diselesaikan": "records not resolved",
    "Senarai keutamaan": "Priority list",
    "Skor risiko ialah alat saringan dalaman, bukan label kekal kepada murid.":
      "The risk score is an internal screening tool, not a permanent label.",
    "Cari nama atau subjek": "Search name or subject",
    "Tiada murid memerlukan intervensi semasa.":
      "No students need intervention right now.",
    "Rekod tindakan": "Record action",
    "Tiada penurunan Gear baharu.": "No new Gear drops.",
    "Rekod susulan": "Follow-up records",
    "Sejarah tindakan guru, kaunselor dan pihak sekolah.":
      "History of actions by teachers, counsellors and the school.",
    "Belum ada intervensi direkodkan.": "No interventions recorded yet.",
    "Tandakan selesai": "Mark resolved",
    "Rekod intervensi COEx": "Record COEx intervention",
    "Jenis tindakan": "Action type",
    "Intervensi akademik": "Academic intervention",
    "Sesi kaunseling": "Counselling session",
    "Libat urus ibu bapa": "Parent engagement",
    "Kelas pemulihan": "Remedial class",
    "Pecutan peperiksaan akhir": "Final exam push",
    "Pegawai bertanggungjawab": "Officer responsible",
    "Tarikh susulan": "Follow-up date",
    "Nota dan tindakan khusus": "Notes and specific actions",
    "Simpan intervensi": "Save intervention",

    // Levels, zones, colours
    Hitam: "Black",
    Merah: "Red",
    Coklat: "Brown",
    Oren: "Orange",
    "Biru muda": "Light blue",
    "Biru gelap": "Dark blue",
    "Hijau muda": "Light green",
    "Hijau gelap": "Dark green",
    "Ungu muda": "Light purple",
    "Ungu gelap": "Dark purple",
    Biru: "Blue",
    Hijau: "Green",
    Ungu: "Purple",
    "Zon Kritikal": "Critical zone",
    "Zon Risiko": "Risk zone",
    "Zon Pemulihan": "Recovery zone",
    "Zon Perkembangan": "Development zone",
    "Zon Penguasaan": "Mastery zone",
    "Zon Kecemerlangan": "Excellence zone",
    "Zon Ikon": "Icon zone",
    Kritikal: "Critical",
    Risiko: "Risk",
    Pemulihan: "Recovery",
    Perkembangan: "Development",
    Penguasaan: "Mastery",
    Kecemerlangan: "Excellence",
    Ikon: "Icon",
    Puncak: "Peak",
    "Belum Bersedia Belajar": "Not ready to learn",
    "Bersedia Belajar": "Ready to learn",
    "Fokus Pembelajaran": "Learning focus",
    "Memahami Asas": "Understands the basics",
    "Penglibatan Aktif": "Active engagement",
    "Menguasai Pembelajaran": "Mastering learning",
    "Konsisten Cemerlang": "Consistently excellent",
    "Pembelajaran Kendiri": "Self-directed learning",
    "Inisiatif Kecemerlangan": "Excellence initiative",
    "Pemimpin Pembelajaran": "Learning leader",
    "Pencinta Ilmu": "Lover of knowledge",
    "Perlu intervensi segera": "Needs urgent intervention",
    "Perlu intervensi": "Needs intervention",
    "Sedang dipulihkan": "Recovering",
    "Hampir menguasai": "Nearly mastered",
    Menguasai: "Mastered",
    Cemerlang: "Excellent",
    "Ikon kecemerlangan": "Icon of excellence",
    "Menengah Rendah": "Lower Secondary",
    "Menengah Atas": "Upper Secondary",
    "Menengah Atas, Persediaan SPM": "Upper Secondary, SPM preparation",
    "Menengah Atas, SPM": "Upper Secondary, SPM",
    "Tingkatan 6, Persediaan STPM": "Form 6, STPM preparation",
    "Meter perkembangan akademik": "Academic progress meter",
    "Meter perjalanan ke sasaran SPM": "Journey meter to the SPM target",
    "Target SPM": "SPM target",
    "Sasaran STPM": "STPM target",
    "Percubaan SPM": "SPM Trial",
    "SPM sebenar": "SPM",
    "STPM sebenar": "STPM",
    "Awal Tingkatan 5": "Start of Form 5",
    "Peralihan Tingkatan 4 ke Tingkatan 5": "From Form 4 to Form 5",
    "Kemajuan Tingkatan 5": "Form 5 progress",
    "Perkembangan semester awal": "Early semester progress",
    "Perkembangan menuju STPM": "Progress towards STPM",
    Diagnostik: "Diagnostic",
    "Pentaksiran 1": "Assessment 1",
    "Pentaksiran 2": "Assessment 2",
    "Penilaian Semasa": "Current assessment",

    // Default COEx actions (rule.action) and their variants
    "Intervensi individu, kelas pemulihan, libat urus ibu bapa dan pemantauan rapi.":
      "Individual intervention, remedial classes, parent engagement and close monitoring.",
    "Bimbingan berfokus, latihan asas, pemantauan berkala dan motivasi berterusan.":
      "Focused guidance, basic practice, regular monitoring and ongoing motivation.",
    "Pengukuhan konsep asas, latihan mengikut topik dan pentaksiran formatif.":
      "Strengthen basic concepts, practice by topic and formative assessment.",
    "Latihan pengukuhan, sasaran lulus dan peningkatan markah.":
      "Reinforcement practice, aim to pass and raise marks.",
    "Pengayaan, latihan KBAT asas dan pengekalan prestasi.":
      "Enrichment, basic higher-order thinking practice and keeping performance up.",
    "Latihan berpandu, pengayaan dan peningkatan konsisten.":
      "Guided practice, enrichment and steady improvement.",
    "Latihan pengayaan, teknik menjawab, analisis kesilapan dan latihan topikal aras tinggi.":
      "Enrichment practice, answering techniques, error analysis and advanced topical practice.",
    "Mantapkan pembelajaran kendiri, latihan aras tinggi dan sasaran gred A.":
      "Strengthen self-directed learning, advanced practice and aim for grade A.",
    "Latih tubi soalan sebenar SPM, bedah kertas, analisis skema dan simulasi peperiksaan.":
      "Drill past SPM questions, paper analysis, marking scheme analysis and exam simulation.",
    "Latih tubi soalan sebenar STPM, bedah kertas, analisis skema dan simulasi peperiksaan.":
      "Drill past STPM questions, paper analysis, marking scheme analysis and exam simulation.",
    "Latih tubi soalan sebenar pentaksiran akhir, bedah kertas, analisis skema dan simulasi peperiksaan.":
      "Drill past final assessment questions, paper analysis, marking scheme analysis and exam simulation.",
    "Strategi berimpak tinggi untuk meningkatkan A kepada A+ dan membimbing rakan.":
      "High-impact strategies to lift A to A+ and coach peers.",
    "Program Pecutan A+, latihan KBAT aras tinggi, analisis kesilapan dan simulasi SPM.":
      "A+ acceleration programme, advanced higher-order thinking practice, error analysis and SPM simulation.",
    "Program Pecutan A+, latihan KBAT aras tinggi, analisis kesilapan dan simulasi STPM.":
      "A+ acceleration programme, advanced higher-order thinking practice, error analysis and STPM simulation.",
    "Program Pengayaan Maksimum, latihan KBAT aras tinggi, analisis kesilapan dan simulasi pentaksiran akhir.":
      "Maximum enrichment programme, advanced higher-order thinking practice, error analysis and final assessment simulation.",
    "Tetapkan tindakan susulan berdasarkan prestasi checkpoint semasa.":
      "Set a follow-up action based on current checkpoint performance.",
    "Menunjukkan perkembangan yang konsisten.": "Shows steady progress.",

    // Toasts and server messages
    "Anda telah log keluar daripada portal.":
      "You have logged out of the portal.",
    "Sesi anda telah tamat. Sila log masuk semula.":
      "Your session has ended. Please log in again.",
    "Maklumat log masuk tidak sepadan.": "Login details do not match.",
    "Kata laluan telah ditukar.": "Password changed.",
    "Kata laluan semasa tidak betul.": "Current password is incorrect.",
    "Kata laluan baharu mesti berbeza.": "The new password must be different.",
    "Anda tiada kebenaran untuk tindakan ini.":
      "You don't have permission for this action.",
    "Rekod tidak dijumpai.": "Record not found.",
    "Sesi tamat. Sila muat semula halaman.":
      "Session expired. Please reload the page.",
    "Terlalu banyak cubaan. Cuba lagi sebentar.":
      "Too many attempts. Try again shortly.",
    "Ralat pelayan. Cuba lagi atau hubungi pentadbir.":
      "Server error. Try again or contact an administrator.",
    "Permintaan gagal.": "Request failed.",
    "Tiada sambungan ke pelayan. Semak internet anda.":
      "Cannot reach the server. Check your internet connection.",
    "Draf laporan telah disimpan.": "Report draft saved.",
    "Laporan dihantar untuk semakan pentadbir.":
      "Report submitted for administrator review.",
    "Kehadiran harian telah disimpan.": "Daily attendance saved.",
    "Laporan telah diluluskan. Anda boleh menerbitkannya kepada ibu bapa.":
      "Report approved. You can now publish it to parents.",
    "Laporan telah diterbitkan kepada ibu bapa.":
      "Report published to parents.",
    "Laporan dikembalikan kepada guru kelas.":
      "Report returned to the class teacher.",
    "Tiada laporan untuk tindakan ini.": "No reports for this action.",
    "Profil pelajar telah dikemas kini.": "Student profile updated.",
    "Pelajar baharu berjaya didaftarkan.": "New student registered.",
    "Kelas pelajar telah dikemas kini.": "Student's class updated.",
    "Pelajar telah diarkibkan.": "Student archived.",
    "Pelajar telah dipulihkan sebagai aktif.": "Student restored as active.",
    "Akaun kakitangan telah disimpan.": "Staff account saved.",
    "Data sekolah telah disimpan.": "School data saved.",
    "Kelas baharu ditambah.": "New class added.",
    "Kelas telah dipadam.": "Class deleted.",
    "Subjek baharu telah ditambah.": "New subject added.",
    "Subjek telah dibuang daripada peringkat ini.":
      "Subject removed from this level.",
    "Tetapan COEx telah disimpan.": "COEx settings saved.",
    "Tarikh peperiksaan berjaya dikemas kini.": "Exam dates updated.",
    "Tiada perubahan tarikh.": "No date changes.",
    "Rekod prestasi diluluskan.": "Performance record approved.",
    "Rekod prestasi diterbitkan kepada ibu bapa.":
      "Performance record published to parents.",
    "Rekod prestasi dihantar untuk semakan.":
      "Performance record submitted for review.",
    "Draf prestasi telah disimpan.": "Performance draft saved.",
    "Sasaran subjek telah disimpan.": "Subject targets saved.",
    "Rekod ini telah dihantar dan tidak boleh diubah oleh guru.":
      "This record has been submitted and can't be changed by the teacher.",
    "Pengesahan ibu bapa telah direkodkan.": "Parent confirmation recorded.",
    "Intervensi telah direkodkan.": "Intervention recorded.",
    "Intervensi ditandakan selesai.": "Intervention marked resolved.",
    "Makluman ketidakhadiran telah dihantar kepada guru kelas.":
      "Absence notice sent to the class teacher.",
    "Makluman telah disemak.": "Notice reviewed.",
    "Pilih tarikh ketidakhadiran.": "Choose the date of absence.",
    "Slot perjumpaan anda telah ditempah.": "Your meeting slot is booked.",
    "Tempahan telah dibatalkan.": "Booking cancelled.",
    "Perjumpaan ditandakan selesai.": "Meeting marked done.",
    "Slot perjumpaan dibuka.": "Meeting slot opened.",
    "Slot dipadam.": "Slot deleted.",
    "Notis privasi telah diterbitkan.": "Privacy notice published.",
    "Benarkan tetingkap timbul untuk mencetak slip.":
      "Allow pop-up windows to print slips.",
    "Pelajar ini tiada penjaga berdaftar.":
      "This student has no registered guardian.",
    "Semua penjaga dalam kelas ini sudah mempunyai akaun, atau tiada IC/telefon/e-mel.":
      "Every guardian in this class already has an account, or has no IC, phone or email.",
    "Slot ini sudah penuh.": "This slot is full.",
    "Slot ini telah ditempah. Batalkan tempahan dahulu.":
      "This slot has bookings. Cancel them first.",
    "Anak ini sudah menempah slot ini.":
      "This child has already booked this slot.",
    "Kelas ini mempunyai pelajar atau laporan dan tidak boleh dipadam.":
      "This class has students or reports and can't be deleted.",
    "Guru ini sudah menjadi guru kelas bagi kelas lain.":
      "This teacher is already class teacher of another class.",
    "Subjek tiada dalam laporan ini.": "That subject isn't in this report.",
    "Checkpoint tidak dijumpai.": "Checkpoint not found.",
    "Laporan tidak dijumpai.": "Report not found.",
    "Kod kelas hanya boleh mengandungi huruf, nombor, - dan _.":
      "Class codes may only contain letters, numbers, - and _.",
    "Hanya fail JPG atau PNG dibenarkan.": "Only JPG or PNG files are allowed.",
    "Saiz gambar melebihi 2 MB.": "The image is larger than 2 MB.",
    "Akaun ini tidak aktif.": "This account is inactive.",
    "Sila tukar kata laluan sementara anda.":
      "Please change your temporary password.",
    "Sila baca dan terima notis privasi.":
      "Please read and accept the privacy notice.",

    // Added after the coverage check: names of things and audit entries.
    "Penjaga": "Guardian",
    ". Gred C dan ke atas dipaparkan bersama bintang, dan warna gred mengikut warna COEx.":
      ". Grades C and above have a star, and grade colours follow COEx.",
    "Bandingkan pencapaian akhir Tingkatan 4 dengan kedudukan awal Tingkatan 5.":
      "Compare the end of Form 4 with the start of Form 5.",
    "Nilai sama ada prestasi bergerak ke arah yang betul sebelum peperiksaan SPM.":
      "Check whether performance is heading the right way before SPM.",
    "Bandingkan asas permulaan dengan pencapaian pertengahan tahun.":
      "Compare the starting point with mid-year results.",
    "Hujung tahun murid boleh melihat gred dan Gear sebelum memasuki Tingkatan 5.":
      "At year end the student can see their grades and Gears before entering Form 5.",
    "Bandingkan kedudukan awal tahun dengan prestasi pertengahan tahun.":
      "Compare the start of the year with mid-year performance.",
    "Lihat sama ada murid meningkat, kekal atau menurun sebelum naik ke tingkatan seterusnya.":
      "See whether the student went up, stayed or went down before moving to the next form.",
    "Bandingkan tahap diagnostik dengan prestasi Semester 1.":
      "Compare the diagnostic level with Semester 1 performance.",
    "Bandingkan prestasi antara semester untuk melihat hala tuju menuju sasaran STPM.":
      "Compare semesters to see the direction towards the STPM target.",
    "Isnin hingga Jumaat, 8.00 pagi hingga 4.30 petang":
      "Monday to Friday, 8.00 am to 4.30 pm",
    "selamatkan": "rescue",
    "bimbing": "guide",
    "pulihkan": "recover",
    "perkukuh": "strengthen",
    "kuasakan": "master",
    "mantapkan": "consolidate",
    "maksimumkan": "maximise",
    "Sistem": "System",
    "Simpan PDF": "Save as PDF",
    "Pilih 'Simpan sebagai PDF' dalam tetingkap cetak":
      "Choose 'Save as PDF' in the print window",
    "Log masuk ke portal.": "Logged in to the portal.",
    "Log masuk ke portal": "Logged in to the portal",
    "Log keluar daripada portal.": "Logged out of the portal.",
    "Log keluar daripada portal": "Logged out of the portal",
    "Menukar kata laluan.": "Changed password.",
    "Menukar kata laluan": "Changed password",
    "Menerima notis privasi.": "Accepted the privacy notice.",
    "Menerima notis privasi": "Accepted the privacy notice",
    "Mengemas kini markah atau ulasan laporan.":
      "Updated report marks or comments.",
    "Mengemas kini markah atau ulasan laporan":
      "Updated report marks or comments",
    "Menghantar laporan untuk semakan.": "Submitted a report for review.",
    "Menghantar laporan untuk semakan": "Submitted a report for review",
    "Meluluskan laporan.": "Approved a report.",
    "Meluluskan laporan": "Approved a report",
    "Menerbitkan laporan kepada ibu bapa.": "Published a report to parents.",
    "Menerbitkan laporan kepada ibu bapa": "Published a report to parents",
    "Mengembalikan laporan kepada guru.": "Returned a report to the teacher.",
    "Mengembalikan laporan kepada guru": "Returned a report to the teacher",
    "Penjaga mengesahkan laporan telah dibaca.":
      "Guardian confirmed reading the report.",
    "Penjaga mengesahkan laporan telah dibaca":
      "Guardian confirmed reading the report",
    "Menyimpan rekod kehadiran.": "Saved attendance records.",
    "Menyimpan rekod kehadiran": "Saved attendance records",
    "Mendaftarkan pelajar baharu.": "Registered a new student.",
    "Mendaftarkan pelajar baharu": "Registered a new student",
    "Mengemas kini profil pelajar.": "Updated a student profile.",
    "Mengemas kini profil pelajar": "Updated a student profile",
    "Memindahkan pelajar ke kelas lain.": "Moved a student to another class.",
    "Memindahkan pelajar ke kelas lain": "Moved a student to another class",
    "Menukar status pelajar.": "Changed a student status.",
    "Menukar status pelajar": "Changed a student status",
    "Mengemas kini foto pelajar.": "Updated a student photo.",
    "Mengemas kini foto pelajar": "Updated a student photo",
    "Menghantar makluman ketidakhadiran.": "Sent an absence notice.",
    "Menghantar makluman ketidakhadiran": "Sent an absence notice",
    "Menyemak makluman ketidakhadiran.": "Reviewed an absence notice.",
    "Menyemak makluman ketidakhadiran": "Reviewed an absence notice",
    "Merekod intervensi murid.": "Recorded a student intervention.",
    "Merekod intervensi murid": "Recorded a student intervention",
    "Menandakan intervensi selesai.": "Marked an intervention resolved.",
    "Menandakan intervensi selesai": "Marked an intervention resolved",
    "Mengemas kini maklumat sekolah.": "Updated school details.",
    "Mengemas kini maklumat sekolah": "Updated school details",
    "Mengemas kini tetapan COEx.": "Updated COEx settings.",
    "Mengemas kini tetapan COEx": "Updated COEx settings",
    "Mengemas kini checkpoint peperiksaan.": "Updated an exam checkpoint.",
    "Mengemas kini checkpoint peperiksaan": "Updated an exam checkpoint",
    "Menambah akaun kakitangan.": "Added a staff account.",
    "Menambah akaun kakitangan": "Added a staff account",
    "Mengemas kini akaun kakitangan.": "Updated a staff account.",
    "Mengemas kini akaun kakitangan": "Updated a staff account",
    "Menetapkan semula kata laluan kakitangan.": "Reset a staff password.",
    "Menetapkan semula kata laluan kakitangan": "Reset a staff password",
    "Mencipta akaun ibu bapa.": "Created a parent account.",
    "Mencipta akaun ibu bapa": "Created a parent account",
    "Menetapkan semula kata laluan ibu bapa.": "Reset a parent password.",
    "Menetapkan semula kata laluan ibu bapa": "Reset a parent password",
    "Menambah kelas.": "Added a class.",
    "Menambah kelas": "Added a class",
    "Mengemas kini kelas.": "Updated a class.",
    "Mengemas kini kelas": "Updated a class",
    "Memadam kelas.": "Deleted a class.",
    "Memadam kelas": "Deleted a class",
    "Menambah subjek.": "Added a subject.",
    "Menambah subjek": "Added a subject",
    "Membuang subjek daripada tingkatan.": "Removed a subject from a level.",
    "Membuang subjek daripada tingkatan": "Removed a subject from a level",
    "Mengimport data pelajar.": "Imported student data.",
    "Mengimport data pelajar": "Imported student data",
    "Mengemas kini sasaran subjek.": "Updated subject targets.",
    "Mengemas kini sasaran subjek": "Updated subject targets",
    "Menerbitkan notis privasi.": "Published the privacy notice.",
    "Menerbitkan notis privasi": "Published the privacy notice",
    "Membuka slot perjumpaan.": "Opened a meeting slot.",
    "Membuka slot perjumpaan": "Opened a meeting slot",
    "Memadam slot perjumpaan.": "Deleted a meeting slot.",
    "Memadam slot perjumpaan": "Deleted a meeting slot",
    "Menempah perjumpaan guru.": "Booked a teacher meeting.",
    "Menempah perjumpaan guru": "Booked a teacher meeting",
    "Membatalkan tempahan perjumpaan.": "Cancelled a meeting booking.",
    "Membatalkan tempahan perjumpaan": "Cancelled a meeting booking",
    "Menandakan perjumpaan selesai.": "Marked a meeting done.",
    "Menandakan perjumpaan selesai": "Marked a meeting done",
    "Menjadikan rekod murid yang telah lama keluar tanpa nama (PDPA).":
      "Anonymised records of long-gone students (PDPA).",
    "Menjadikan rekod murid yang telah lama keluar tanpa nama (PDPA)":
      "Anonymised records of long-gone students (PDPA)",
    "Mencipta akaun super admin melalui pelayan.":
      "Created a super admin account on the server.",
    "Mencipta akaun super admin melalui pelayan":
      "Created a super admin account on the server",
  };

  // Text with numbers, names or checkpoint names. Captured parts are
  // translated again (recursively) where possible.
  const PATTERNS = [
    [/^(\d+) daripada (\d+) hari direkodkan$/, "$1 of $2 days recorded"],
    [/^(\d+) hari hadir$/, "$1 days present"],
    [
      /^(\d+) hari direkodkan sebagai tidak hadir atau MC\.$/,
      "$1 days recorded as absent or MC.",
    ],
    [
      /^(\d+) rekod tidak hadir atau MC\. Lihat sebab dan hantar makluman dalam halaman kehadiran\.$/,
      "$1 absent or MC records. See reasons and send notices on the attendance page.",
    ],
    [/^(\d+) intervensi aktif$/, "$1 active interventions"],
    [/^(\d+) menurun · (\d+) kekal$/, "$1 down · $2 unchanged"],
    [/^(\d+) murid$/, "$1 students"],
    [/^(\d+)\/(\d+) ditempah$/, "$1/$2 booked"],
    [/^(\d+) kelas aktif$/, "$1 active classes"],
    [/^(\d+) dalam proses$/, "$1 in progress"],
    [/^(\d+) laporan untuk semakan$/, "$1 reports to review"],
    [/^(\d+) menunggu semakan$/, "$1 awaiting review"],
    [/^(\d+) markah$/, "$1 marks"],
    [/^(\d+)% kehadiran$/, "$1% attendance"],
    [/^(\d+) guru dengan akses aktif$/, "$1 staff with active access"],
    [/^(\d+)% ke (\d+)%$/, "$1% to $2%"],
    [/^(\d+) kredit · (\d+) A\/A\+$/, "$1 credits · $2 A/A+"],
    [/^(\d+) subjek$/, "$1 subjects"],
    [/^Apa maksud (\d+)% ini\?$/, "What does $1% mean?"],
    [/^Kehadiran (\d+)%$/, "Attendance $1%"],
    [/^Purata (\d+)%$/, "Average $1%"],
    [/^Naik (\d+) gear$/, "Up $1 Gear"],
    [/^Turun (\d+) gear$/, "Down $1 Gear"],
    [/^Sasaran keseluruhan Gear (\d+)$/, "Overall target Gear $1"],
    [/^★ (\d+) Subjek pada Gear Kredit$/, "★ $1 subjects at credit Gear"],
    [/^↑ Anjakan \+(\d+) Gear$/, "↑ Up $1 Gear"],
    [/^Foto pasport: (\d+)\/(\d+)$/, "Passport photos: $1/$2"],
    [/^(\d+) laporan dikemas kini\.$/, "$1 reports updated."],
    [
      /^(\d+) rekod pelajar berjaya diimport\.$/,
      "$1 student records imported.",
    ],
    [
      /^(\d+) baris data ditemui\. Baris yang bermasalah akan dilangkau dan disenaraikan selepas import\.$/,
      "$1 data rows found. Rows with problems will be skipped and listed after import.",
    ],
    [
      /^Terdapat (\d+) laporan menunggu semakan\. Buka Kelulusan laporan untuk tindakan\.$/,
      "$1 reports are awaiting review. Open Report approvals to act on them.",
    ],
    [/^(\d+) laporan untuk semakan$/, "$1 reports to review"],
    [/^Kehadiran (.+)$/, "Attendance: $=1"],
    [/^Selamat datang, (.+)$/, "Welcome, $=1"],
    [/^Laporan (.+) tersedia$/, "$1 report available"],
    [/^Markah (.+)$/, "$1 marks"],
    [/^Ringkasan markah (.+), sesi (\d+)$/, "$1 marks summary, session $2"],
    [/^Sesi akademik (\d+)$/, "Academic session $1"],
    [/^Sesi akademik (\d+) · (.+)$/, "Academic session $1 · $2"],
    [/^Dikemas kini bersama laporan (.+)$/, "Updated with the $1 report"],
    [/^Purata (.+) ialah$/, "The $1 average is"],
    [/^Purata keseluruhan (.+):$/, "Overall average, $1:"],
    [
      /^ialah purata keseluruhan markah akademik anak anda bagi (.+)\.$/,
      "is your child's overall academic average for $1.",
    ],
    [/^Gear keseluruhan meningkat pada (.+)\.$/, "Overall Gear went up at $1."],
    [
      /^Label checkpoint disesuaikan mengikut Tingkatan (\d)\.$/,
      "Checkpoint labels follow Form $1.",
    ],
    [
      /^Buka slot untuk (.+)\. Ibu bapa menempah melalui portal\.$/,
      "Open slots for $1. Parents book through the portal.",
    ],
    [
      /^Tiada slot perjumpaan dibuka untuk (.+) buat masa ini\. Sila hubungi guru kelas\.$/,
      "No meeting slots are open for $1 right now. Please contact the class teacher.",
    ],
    [/^Pencapaian A atau A\+ dalam (.+)\.$/, "A or A+ in $1."],
    [
      /^Prestasi meningkat dan berada pada landasan yang lebih baik menuju (.+)\.$/,
      "Performance has improved and is on a better track towards $1.",
    ],
    [
      /^Ringkasan syarat dan jurang menuju (.+)\.$/,
      "Requirements and gaps towards $1.",
    ],
    [
      /^Visual ini menunjukkan peperiksaan yang telah dilalui murid dan kedudukan semasa menuju (.+)\.$/,
      "This shows the exams the student has taken and where they stand on the way to $1.",
    ],
    [
      /^Rekod kehadiran untuk kelas yang ditugaskan kepada anda pada (.+)\.$/,
      "Attendance for your class on $1.",
    ],
    [/^Status kehadiran · (.+)$/, "Attendance · $1"],
    [
      /^Tingkatan (\d) · Kod (\S+) · (\d+) pelajar aktif$/,
      "Form $1 · Code $2 · $3 active students",
    ],
    [/^Diluluskan oleh (.+) pada (.+)\.$/, "Approved by $=1 on $2."],
    [
      /^Laporan rasmi telah diterbitkan pada (.+)\.$/,
      "Official report published on $1.",
    ],
    [
      /^Rekod kehadiran semasa (\d+)%\. Sila hubungi guru kelas untuk tindakan lanjut\.$/,
      "Current attendance is $1%. Please contact the class teacher.",
    ],
    [/^Mula · (.+)$/, "Start · $1"],
    [/^pada (.+), kini$/, "at $1, now"],
    [
      /^Pergerakan semasa murid di Tingkatan 5 menuju (.+)\.$/,
      "The student's current movement in Form 5 towards $1.",
    ],
    [
      /^Perbandingan asas semasa Tingkatan 4 sebelum murid melangkah ke Tingkatan 5\.$/,
      "Form 4 baseline before the student moves to Form 5.",
    ],
    [/^Laporan akademik (.+)$/, "Academic report: $=1"],
    [/^(.+) hingga (.+)$/, "$1 to $2"],
    [
      /^\. Murid berada dalam (.+)\. Fokus seterusnya ialah (\S+) prestasi sehingga mencapai sasaran Gear (\d+)\.$/,
      ". The student is in the $1 zone. Next: $2 performance to reach target Gear $3.",
    ],
    [
      /^TLMS\. BM (\d+)%, Sejarah (\d+)%\. (.+)$/,
      "TLMS. BM $1%, Sejarah $2%. $3",
    ],
    [
      /^(\d+) subjek menunjukkan Gear menurun\.$/,
      "$1 subjects show falling Gears.",
    ],
    [/^(.+?): (.+)\.$/, "$1: $=2."],
    [
      /^Tukar kata laluan semasa log masuk pertama\. Laman: (.+)$/,
      "Change your password at first login. Site: $=1",
    ],
    [/^\. Lajur pilihan: (.+)$/, ". Optional columns: $=1"],
    [/^Visual Tingkatan (\d)$/, "Form $1 view"],
    [/^Meter perkembangan Tingkatan (\d)$/, "Form $1 progress meter"],
    [/^Perkembangan awal Tingkatan (\d)$/, "Early Form $1 progress"],
    [/^Pencapaian akhir Tingkatan (\d)$/, "End of Form $1 results"],
    [/^Pertengahan Tingkatan (\d)$/, "Mid Form $1"],
    [/^Akhir Tingkatan (\d)$/, "End of Form $1"],
    [/^Diagnostik Awal Tingkatan (\d)$/, "Form $1 Initial Diagnostic"],
    [/^Pentaksiran Pertengahan Tingkatan (\d)$/, "Form $1 Mid-Year Assessment"],
    [/^Pentaksiran 2 Tingkatan (\d)$/, "Form $1 Assessment 2"],
    [/^Pentaksiran Akhir Tingkatan (\d)$/, "Form $1 Final Assessment"],
    [/^TOV Tingkatan (\d)$/, "Form $1 TOV"],
    [/^PPT Tingkatan (\d)$/, "Form $1 PPT"],
    [/^PAT Tingkatan (\d)$/, "Form $1 PAT"],
    [/^Diagnostik Tingkatan (\d)$/, "Form $1 Diagnostic"],
    [/^Sasaran Tingkatan (\d)$/, "Form $1 target"],
    [/^Tingkatan (\d)$/, "Form $1"],
    [/^Tingkatan (\d) ([^,]+)$/, "Form $1 $=2"],
    [/^(.+) (\d{4})$/, "$1 $2"],
    [/^sasaran (SPM|STPM)$/, "the $1 target"],
    [/^sasaran akhir tahun$/, "the year-end target"],
    [/^sasaran Tingkatan (\d)$/, "the Form $1 target"],
    [/^(.+) · Lihat sahaja$/, "$1 · View only"],
    [
      /^(.+) untuk semua murid dalam akses guru$/,
      "$1 for all students you can access",
    ],
    [/^(.+) untuk semua tingkatan$/, "$1 for all forms"],
    [/^Mempunyai markah bagi (.+)$/, "Have a mark in $1"],
    [/^Pecahan gred (.+)$/, "$1 grade breakdown"],
    [
      /^Bilangan murid yang mendapat A, B, C dan gred lain bagi (.+)\.$/,
      "Students with A, B, C and other grades in $1.",
    ],
    [/^Murid dengan gred (\S+) bagi (.+)\.$/, "Students with grade $1 in $2."],
    [/^Semua murid (?:bagi|untuk) (.+)\.$/, "All students in $1."],
    [/^(.+) · ada guru$/, "$1 · has a teacher"],
    [/^Gred (\S+)$/, "Grade $1"],
  ];

  let lang = "ms";
  const original = new WeakMap(); // text node → Malay text
  const originalAttrs = new WeakMap(); // element → {attr: Malay}
  const ATTRS = ["placeholder", "title", "aria-label"];
  let terms = {}; // subjects and other names from the data, ms → en

  function exact(t) {
    return PHRASES[t] ?? terms[t];
  }
  // Translate one trimmed string; returns null when nothing is known.
  function tr(t, depth = 0) {
    if (!t || depth > 4) return null;
    const hit = exact(t);
    if (hit !== undefined) return hit;
    for (const [re, out] of PATTERNS) {
      const m = t.match(re);
      if (!m) continue;
      // $N: translate the captured part too; $=N: keep it as written (names).
      return out.replace(/\$(=?)(\d)/g, (_, raw, i) => {
        const part = m[Number(i)];
        return raw ? part : (tr(part, depth + 1) ?? part);
      });
    }
    // Composite text: "A · B", "A: B", "A, B" — translate each part.
    for (const sep of [" · ", ": ", ", "]) {
      if (!t.includes(sep)) continue;
      const parts = t.split(sep);
      let changed = false;
      const out = parts.map((p) => {
        const x = tr(p.trim(), depth + 1);
        if (x !== null) changed = true;
        return x ?? p;
      });
      if (changed) return out.join(sep);
    }
    return null;
  }
  function translateText(node) {
    const src = original.has(node) ? original.get(node) : node.nodeValue;
    const trimmed = src.replace(/\s+/g, " ").trim();
    if (!/[A-Za-z]{2}/.test(trimmed)) return;
    const out = tr(trimmed);
    if (out === null) return;
    if (!original.has(node)) original.set(node, src);
    const lead = src.match(/^\s*/)[0],
      trail = src.match(/\s*$/)[0];
    const next = lead + out + trail;
    if (node.nodeValue !== next) node.nodeValue = next;
  }
  function translateAttrs(el) {
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue;
      const saved = originalAttrs.get(el) || {};
      const src = saved[a] ?? el.getAttribute(a);
      const out = tr(src.trim());
      if (out === null) continue;
      saved[a] = src;
      originalAttrs.set(el, saved);
      if (el.getAttribute(a) !== out) el.setAttribute(a, out);
    }
  }
  function walk(root, fn) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) return fn(root, null);
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    if (["SCRIPT", "STYLE"].includes(root.tagName)) return;
    fn(null, root);
    const w = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (n) =>
          n.nodeType === Node.ELEMENT_NODE &&
          ["SCRIPT", "STYLE"].includes(n.tagName)
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT,
      },
    );
    let n;
    while ((n = w.nextNode()))
      n.nodeType === Node.TEXT_NODE ? fn(n, null) : fn(null, n);
  }
  function translateTree(root) {
    walk(root, (text, el) => (text ? translateText(text) : translateAttrs(el)));
  }
  function restoreTree(root) {
    walk(root, (text, el) => {
      if (text && original.has(text)) {
        text.nodeValue = original.get(text);
        original.delete(text);
      }
      if (el && originalAttrs.has(el)) {
        const saved = originalAttrs.get(el);
        Object.entries(saved).forEach(([a, v]) => el.setAttribute(a, v));
        originalAttrs.delete(el);
      }
    });
  }
  const observer = new MutationObserver((records) => {
    if (lang !== "en") return;
    for (const r of records) {
      if (r.type === "characterData") translateText(r.target);
      else if (r.type === "attributes") translateAttrs(r.target);
      else r.addedNodes.forEach((n) => translateTree(n));
    }
  });

  function setLang(next) {
    lang = next === "en" ? "en" : "ms";
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // Private mode: the choice lasts for this page only.
    }
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-lang-toggle]").forEach((b) => {
      b.textContent = lang === "en" ? "BM" : "EN";
      b.setAttribute(
        "aria-label",
        lang === "en" ? "Tukar ke Bahasa Melayu" : "Switch to English",
      );
    });
    if (lang === "en") translateTree(document.body);
    else restoreTree(document.body);
  }

  window.I18N = {
    get lang() {
      return lang;
    },
    // Intl locale for dates and numbers.
    locale() {
      return lang === "en" ? "en-MY" : "ms-MY";
    },
    setLang,
    // Names from the data (e.g. subject names) with English versions.
    addTerms(map) {
      terms = { ...terms, ...map };
    },
    t(text) {
      return lang === "en" ? (tr(String(text).trim()) ?? text) : text;
    },
    init() {
      let saved = "ms";
      try {
        saved = localStorage.getItem(STORAGE_KEY) || "ms";
      } catch (e) {
        // Use Malay.
      }
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ATTRS,
      });
      setLang(saved);
    },
  };
})();
