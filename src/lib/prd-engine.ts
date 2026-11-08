import { 
  PRDDocument, 
  LegoApp, 
  AppVersion, 
  TableDefinition, 
  MetricCard, 
  KanbanConfig 
} from '@/types/legologic';

export interface CompletenessResult {
  isComplete: boolean;
  score: number; // 0 - 100
  domain: string;
  suggestedTitle: string;
  missingItems: string[];
  interviewQuestions: string[];
  quickReplies: string[];
}

/**
 * Analyzes whether the user's prompt (plus optional history) contains
 * enough information to build a minimum viable PRD covering the 10 sections.
 */
export function analyzePromptCompleteness(
  prompt: string, 
  history: { sender: string; text: string }[] = []
): CompletenessResult {
  const allText = [prompt, ...history.map(h => h.text)].join(' ').toLowerCase();

  // Keyword detectors
  const hasPersona = /pengguna|user|persona|kasir|barista|dokter|pasien|pelanggan|admin|owner|staf|klien|sales|pembeli|karyawan/i.test(allText);
  const hasObjectives = /tujuan|masalah|omset|konversi|efisiensi|pencatatan|problem|goal|latar belakang|background/i.test(allText);
  const hasScope = /fitur|scope|in-scope|out-of-scope|wajib|hanya|termasuk|tidak termasuk|tunda|mvp/i.test(allText);
  const hasBusinessRules = /aturan|batasan|rules|qris|tunai|diskon|pajak|stok|harga|rp|persen|validasi|status/i.test(allText);
  const hasFunctionalDetails = /tabel|data|form|laporan|riwayat|cetak|input|notifikasi|whatsapp|export|filter/i.test(allText);
  
  let score = 20; // base score
  const missingItems: string[] = [];

  if (hasPersona) score += 20;
  else missingItems.push('Target Persona (Siapa pengguna utama & staf operasional)');

  if (hasObjectives) score += 15;
  else missingItems.push('Latar Belakang & Masalah Pokok yang ingin diselesaikan');

  if (hasScope) score += 15;
  else missingItems.push('Batasan Lingkup (Fitur MVP wajib vs fitur yang ditunda)');

  if (hasBusinessRules) score += 15;
  else missingItems.push('Aturan Bisnis & Logika Transaksi (misal: metode pembayaran / batasan)');

  if (hasFunctionalDetails) score += 15;
  else missingItems.push('Detail Fungsional (Alur input data & kebutuhan output)');

  // Domain detection
  let domain = 'Aplikasi Bisnis Custom';
  let suggestedTitle = 'Aplikasi Bisnis Cerdas';
  let quickReplies: string[] = [];
  let interviewQuestions: string[] = [];

  if (/kasir|pos|kopi|coffee|resto|cafe|f&b|makan|minum/i.test(allText)) {
    domain = 'Point of Sale (POS) & F&B';
    suggestedTitle = 'Kasir & Order POS Kedai';
    interviewQuestions = [
      'Siapa saja pengguna sistem (contoh: Kasir pencatat order, Barista/Dapur pemroses tiket, atau Pemilik kedai)?',
      'Metode pembayaran apa saja yang wajib didukung (QRIS, Tunai, Kartu debit)? Apakah perlu hitung kembalian dan cetak struk/nota digital WhatsApp?',
      'Fitur apa yang wajib ada di rilis pertama (In-Scope) vs yang ingin ditunda ke versi nanti (Out-of-Scope, misal: integrasi ojol/GrabFood)?',
      'Aturan bisnis khusus apa yang berlaku (contoh: stok berkurang otomatis per menu, diskon member, atau pembatalan order butuh PIN owner)?'
    ];
    quickReplies = [
      'Kasir & Barista, bayar QRIS + Tunai, cetak nota WhatsApp',
      'Kelola menu kopi, stok cup, laporan omset harian kasir',
      'Hanya order meja & takeaway, integrasi ojol tunda dulu',
      'Data sudah cukup, langsung susunkan PRD lengkap!'
    ];
  } else if (/klinik|dokter|gigi|pasien|rekam medis|medis|appointment/i.test(allText)) {
    domain = 'Sistem Manajemen & Booking Klinik';
    suggestedTitle = 'Klinik & Rekam Medis Pasien';
    interviewQuestions = [
      'Siapa persona pengguna yang berinteraksi (Resepsionis pendaftaran, Dokter pemeriksa, atau Pasien langsung)?',
      'Bagaimana alur pendaftaran antrean dan rekam medis (apakah ada nomor antrean harian dan reminder WhatsApp)?',
      'Apa batasan lingkup MVP (In-Scope: pendaftaran & rekam medis diagnosa; Out-of-Scope: integrasi BPJS/klaim asuransi)?',
      'Bagaimana aturan privasi & keamanan data rekam medis pasien sesuai kepatuhan regulasi PDP?'
    ];
    quickReplies = [
      'Resepsionis & Dokter, nomor antrean, rekam medis ringkas',
      'Booking jadwal dokter, reminder WhatsApp pasien, status antre',
      'MVP tanpa integrasi BPJS, fokus pendaftaran & diagnosa cepat',
      'Data sudah cukup, buatkan PRD sekarang!'
    ];
  } else if (/crm|leads|prospek|sales|closing|pipeline/i.test(allText)) {
    domain = 'Customer Relationship Management (CRM)';
    suggestedTitle = 'Pipeline CRM & Sales Tracker';
    interviewQuestions = [
      'Berapa tahapan kanban pipeline penjualan Anda (misal: Leads Baru -> Follow-up -> Demo/Penawaran -> Closing -> Batal)?',
      'Siapa pengguna utama sistem (Sales rep lapangan, Telemarketing, atau Sales Manager)?',
      'Informasi apa yang wajib diinput untuk setiap prospek (Nama, WhatsApp, Nilai Potensi Rp, Kategori Produk)?',
      'Apa metrik KPI utama keberhasilan (Konversi Closing Rate, Total Omset per Sales)?'
    ];
    quickReplies = [
      'Pipeline 4 tahap: Baru, Dihubungi, Penawaran, Closing Rp',
      'Tombol 1-klik follow up WhatsApp langsung dari pipeline',
      'Dashboard target omset bulanan & performa per sales',
      'Data sudah lengkap, langsung susunkan PRD!'
    ];
  } else if (/laundry|cuci|pakaian/i.test(allText)) {
    domain = 'Sistem Operasional & Kasir Laundry';
    suggestedTitle = 'Laundry Flow & Tracking Nota';
    interviewQuestions = [
      'Bagaimana alur status cucian (Terima -> Proses Cuci -> Setrika -> Siap Ambil -> Selesai)?',
      'Apakah perhitungan harga berdasarkan berat kiloan (Kg) atau per satuan pakaian (Dry Clean)?',
      'Bagaimana pelanggan mengetahui cuciannya selesai (notifikasi status otomatis via WhatsApp)?',
      'Fitur apa yang masuk In-Scope rilis pertama vs Out-of-Scope (antar jemput kurir)?'
    ];
    quickReplies = [
      'Hitung Kg & satuan, nota nomor rak, status WhatsApp siap ambil',
      'Kasir timbang, kasir bayar lunas/DP, rak penyimpanan',
      'Antar jemput tunda ke V2, utamakan operasional outlet',
      'Data sudah pas, lanjutkan buat PRD!'
    ];
  } else {
    suggestedTitle = 'Aplikasi ' + (prompt.split(' ').slice(0, 4).join(' ') || 'Bisnis Pintar');
    interviewQuestions = [
      'Siapa target pengguna utama dan peran yang ada dalam aplikasi ini (Admin, Staf, atau Pelanggan)?',
      'Masalah inti apa yang ingin diselesaikan dan apa tujuan bisnis terukur (misal: memangkas waktu kerja, menaikkan omset)?',
      'Apa batasan lingkup kerja (Fitur apa yang wajib masuk In-Scope rilis awal vs apa yang ditunda Out-of-Scope)?',
      'Aturan bisnis penting apa yang harus ditegakkan sistem (format data, validasi, rumus perhitungan)?'
    ];
    quickReplies = [
      'Pengguna Admin & Tim, alur cepat input & kelola data',
      'Fokus pencatatan harian, ekspor spreadsheet, dan WhatsApp',
      'MVP simpel tanpa fitur kompleks, utamakan mudah dipakai',
      'Data sudah lengkap, langsung buatkan PRD sekarang!'
    ];
  }

  // If text is very detailed (> 120 words or mentions PRD directly or user clicks "Data sudah lengkap"), mark complete
  const isExplicitlyComplete = /data sudah lengkap|buatkan prd sekarang|langsung susunkan prd|data sudah cukup/i.test(allText);
  const wordCount = allText.split(/\s+/).length;
  const isComplete = isExplicitlyComplete || (score >= 70 && wordCount >= 35);

  return {
    isComplete,
    score: isComplete ? 100 : Math.min(score, 65),
    domain,
    suggestedTitle,
    missingItems,
    interviewQuestions,
    quickReplies
  };
}

/**
 * Generates a full 10-section PRD based on user input & interview answers.
 */
export function generateFullPRD(
  prompt: string,
  interviewNotes: string[] = [],
  authorName: string = 'Om Bobi (Product Manager)'
): PRDDocument {
  const combined = [prompt, ...interviewNotes].join(' ');
  const completeness = analyzePromptCompleteness(combined);
  const title = completeness.suggestedTitle;
  const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

  // Customized domain-specific details
  const isPos = /kasir|pos|kopi|resto|cafe|f&b/i.test(combined);
  const isKlinik = /klinik|dokter|gigi|pasien|medis/i.test(combined);
  const isCrm = /crm|sales|lead|prospek|closing/i.test(combined);
  const isLaundry = /laundry|cuci/i.test(combined);

  let userPersona = 'Pemilik Usaha (Owner) & Staf Operasional Harian';
  let problemStatement = 'Pencatatan operasional harian masih manual dan rawan selisih, menyita waktu rekapitulasi data.';
  let businessGoal = 'Mempercepat proses input data hingga 70% dan meningkatkan akurasi rekonsiliasi finansial bisnis.';
  let inScopeList = ['Pencatatan data transaksi harian', 'Kalkulasi nilai otomatis dalam Rupiah (Rp)', 'Status tracking visual', 'Ekspor ringkasan data'];
  let outOfScopeList = ['Integrasi payment gateway internasional', 'Aplikasi native mobile iOS/Android di PlayStore (fase V2)', 'Sistem akuntansi multi-cabang kompleks'];
  let primaryMetric = 'Waktu penyelesaian input order berkurang dari 3 menit menjadi < 30 detik.';
  let secondaryMetric = 'Zero human error pada kalkulasi total nilai dan status transaksi.';

  if (isPos) {
    userPersona = 'Kasir Outlet (Frontline) & Owner Bisnis F&B yang butuh visibilitas omset harian.';
    problemStatement = 'Kasir sering lambat saat antrean ramai, nota kertas tercecer, dan rekap omset malam hari memakan waktu lebih dari 1 jam.';
    businessGoal = 'Meningkatkan kecepatan order hingga 2x lipat dan rekonsiliasi kas harian otomatis seketika saat tutup kasir.';
    inScopeList = [
      'Katalog menu interaktif dengan filter kategori & foto',
      'Pencatatan pesanan cepat (Dine-in / Takeaway)',
      'Perhitungan otomatis total, diskon, dan kembalian tunai/QRIS',
      'Nota digital instan via WhatsApp pemilik/pelanggan',
      'Rekapitulasi omset & menu terlaris real-time'
    ];
    outOfScopeList = [
      'Integrasi delivery aggregator API (GrabFood/GoFood) fase V2',
      'Modul loyalty point pelanggan bertingkat',
      'Mesin pemotong struk thermal bluetooth custom hardware'
    ];
    primaryMetric = 'Durasi proses transaksi dari pilih menu hingga bayar < 25 detik per antrean.';
    secondaryMetric = 'Tingkat akurasi hitung kas fisik vs rekaman sistem 99.9%.';
  } else if (isKlinik) {
    userPersona = 'Resepsionis Pendaftaran & Dokter Pemeriksa yang butuh rekam riwayat medis akurat.';
    problemStatement = 'Buku rekam medis fisik sering terselip, antrean pasien di ruang tunggu menumpuk tidak teratur, serta pasien lupa jadwal kontrol.';
    businessGoal = 'Mengurangi waktu tunggu antrean pasien sebesar 40% dan mencegah kehilangan riwayat diagnosa pengobatan.';
    inScopeList = [
      'Pendaftaran pasien baru & pencarian nomor rekam medis instan',
      'Nomor antrean harian dengan indikator status (Menunggu, Diperiksa, Selesai)',
      'Pencatatan rekam medis: diagnosa, tindakan, obat, dan biaya tindakan',
      'Pengingat jadwal kontrol berkala via WhatsApp 1-klik',
      'Laporan jumlah kunjungan pasien harian & bulanan'
    ];
    outOfScopeList = [
      'Bridging sistem klaim BPJS Kesehatan (fase V2)',
      'Telekonsultasi video call streaming langsung dalam aplikasi',
      'Manajemen resep apotek terintegrasi gudang farmasi pusat'
    ];
    primaryMetric = 'Peningkatan ketepatan waktu antrean kontrol pasien sebesar 50%.';
    secondaryMetric = 'Zero berkas rekam medis hilang karena tersimpan di cloud database.';
  } else if (isCrm) {
    userPersona = 'Sales Executive & Sales Manager yang memantau pergerakan prospek dari lead hingga closing.';
    problemStatement = 'Follow-up prospek sering terlambat karena data tercecer di chat WhatsApp pribadi, omset potensial tidak terpantau.';
    businessGoal = 'Menaikkan closing rate penjualan sebesar 25% dan mempercepat siklus deal dari 14 hari menjadi 7 hari.';
    inScopeList = [
      'Kanban board visual tahapan deal (Leads Baru -> Follow-up -> Demo -> Closing -> Batal)',
      'Pencatatan profil kontak prospek, nomor WhatsApp, dan potensi nilai Rp',
      'Tombol 1-klik Follow-up WhatsApp langsung dengan template pesan',
      'KPI Metrik: Total Pipeline Rp, Win-Rate %, Jumlah Prospek Aktif',
      'Pencatatan catatan follow-up terakhir dan tanggal jadwal kontak berikutnya'
    ];
    outOfScopeList = [
      'Otomasi broadcast blast WhatsApp centang hijau (fase V2)',
      'Integrasi telephony call center VOIP',
      'AI predictive lead scoring berbasis machine learning kompleks'
    ];
    primaryMetric = 'Kenaikan rasio konversi prospek menjadi closing minimal 20%.';
    secondaryMetric = 'Waktu respon follow-up pertama turun menjadi di bawah 15 menit.';
  } else if (isLaundry) {
    userPersona = 'Kasir Kasir Laundry & Pengelola Operasional Cuci/Setrika.';
    problemStatement = 'Pakaian pelanggan sering tertukar atau terselip di rak, pelanggan sering bolak-balik menanyakan apakah cucian sudah beres.';
    businessGoal = 'Menghilangkan komplain pakaian tertukar menjadi 0% dan menghemat waktu konfirmasi status cucian ke pelanggan.';
    inScopeList = [
      'Pencatatan nota masuk: nama pelanggan, nomor WhatsApp, berat (Kg) / satuan',
      'Penetapan nomor rak penyimpanan cucian',
      'Status tahapan visual: Masuk -> Cuci -> Setrika -> Siap Diambil -> Selesai',
      'Notifikasi WhatsApp 1-klik: "Halo Kak, cucian nota #X di rak Y sudah wangi & siap diambil!"',
      'Laporan kiloan harian dan kas masuk tunai/QRIS'
    ];
    outOfScopeList = [
      'Aplikasi kurir pick-up antar jemput GPS tracking (fase V2)',
      'Integrasi mesin cuci IoT otomatis',
      'Sistem franchise multi-outlet cabang'
    ];
    primaryMetric = 'Komplain cucian tertukar atau telat turun ke angka 0%.';
    secondaryMetric = 'Pencatatan nota baru selesai dalam waktu < 20 detik per pelanggan.';
  }

  const prd: PRDDocument = {
    id: 'prd-' + Date.now(),
    metadata: {
      productName: title,
      status: 'Approved',
      author: authorName,
      coreTeam: {
        uxUiDesigner: 'GENESIS UI/UX Specialist',
        techLead: 'GENESIS Full-Stack Architect',
        qaEngineer: 'GENESIS QA & Test Automation'
      },
      lastUpdated: today,
      changelog: 'v1.0.0 — Finalisasi PRD berdasarkan hasil wawancara kebutuhan pengguna. Siap masuk ke tahap Produksi.'
    },
    backgroundObjectives: {
      background: `Berdasarkan wawancara kebutuhan, pengguna memerlukan solusi digital siap-pakai untuk mengelola operasional harian. ${problemStatement}`,
      problemStatement,
      businessGoal
    },
    userPersonaBusinessLogic: {
      userPersona,
      assumptions: [
        'Pengguna mengoperasikan aplikasi melalui peramban web modern (Google Chrome / Safari) di desktop, tablet, maupun smartphone.',
        'Koneksi internet stabil tersedia di lokasi operasional bisnis.',
        'Mata uang transaksi yang digunakan adalah Rupiah Indonesia (Rp).'
      ],
      businessRules: [
        'Format penulisan nomor WhatsApp menggunakan format standar Indonesia (08... atau 62...).',
        'Setiap perubahan status data harus tercatat otomatis beserta timestamp pembaruan.',
        'Nilai moneter tidak boleh bernilai negatif dan diformat otomatis dengan pemisah ribuan.'
      ]
    },
    scope: {
      inScope: inScopeList,
      outOfScope: outOfScopeList
    },
    functionalRequirements: {
      userStories: [
        `Sebagai ${userPersona.split('&')[0].trim()}, saya ingin mencatat data transaksi/order baru dengan cepat agar pelanggan tidak menunggu lama.`,
        `Sebagai staf operasional, saya ingin mengubah status tahapan proses secara visual agar seluruh tim mengetahui progres pekerjaan terkini.`,
        `Sebagai pemilik bisnis, saya ingin melihat ringkasan omset dan metrik kunci secara real-time agar dapat mengambil keputusan bisnis yang tepat.`
      ],
      features: [
        {
          id: 'FR-01',
          description: 'Modul Input Data Cepat & Validasi Formulir',
          priority: 'Must Have',
          acceptanceCriteria: 'Given pengguna berada di halaman aplikasi, When mengisi nama, kontak, dan nilai transaksi lalu menekan tombol simpan, Then data baru langsung tersimpan di database dan muncul pada daftar seketika tanpa refresh halaman.'
        },
        {
          id: 'FR-02',
          description: 'Kanban Board / Tabel Status Interaktif',
          priority: 'Must Have',
          acceptanceCriteria: 'Given terdapat daftar item dengan status tertentu, When staf mengubah status item (misal: dari Baru ke Selesai), Then badge status berubah warna dan riwayat pembaruan tersimpan otomatis.'
        },
        {
          id: 'FR-03',
          description: 'Follow-up WhatsApp 1-Klik Tanpa Simpan Nomor',
          priority: 'Should Have',
          acceptanceCriteria: 'Given data kontak memiliki nomor WhatsApp valid, When tombol chat WhatsApp ditekan, Then tab baru wa.me terbuka langsung menuju nomor pelanggan dengan pesan template ramah.'
        },
        {
          id: 'FR-04',
          description: 'Ringkasan KPI Stats Cards & Omset Finansial',
          priority: 'Must Have',
          acceptanceCriteria: 'Given data transaksi bertambah atau bernilai nominal, When halaman dashboard dibuka, Then nilai total omset dan jumlah data aktif terhitung secara akurat dalam Rupiah.'
        },
        {
          id: 'FR-05',
          description: 'Ekspor Data ke File Spreadsheet (CSV)',
          priority: 'Could Have',
          acceptanceCriteria: 'Given tabel memiliki rekaman data aktif, When tombol Ekspor CSV ditekan, Then peramban langsung mengunduh file spreadsheet siap olah.'
        }
      ]
    },
    uxUiRequirements: {
      userFlow: [
        'Langkah 1: Pengguna membuka aplikasi -> Melihat dashboard ringkasan metrik utama.',
        'Langkah 2: Menekan tombol "+ Tambah Data" -> Form modal bersih muncul.',
        'Langkah 3: Mengisi field wajib -> Menekan tombol "Simpan".',
        'Langkah 4: Kartu item langsung muncul di papan Kanban atau tabel utama.',
        'Langkah 5: Melakukan aksi cepat (Ubah Status, WhatsApp Direct, atau Edit Nilai).'
      ],
      designLinksNotes: 'Desain responsif clean modern dengan palet warna aksen biru (#2563EB) & amber (#F59E0B), padding lapang, font terbaca jelas, dot-grid canvas.',
      elementDetails: {
        errorMessaging: 'Pesan validasi tampil inline merah tegas di bawah field jika data wajib belum terisi.',
        actionCopywriting: 'Tombol aksi menggunakan kata kerja aktif yang jelas: "+ Tambah Order", "Simpan Data", "Hubungi WhatsApp".',
        emptyStates: 'Tampilan kosong ramah dengan ilustrasi kotak rapi: "Belum ada transaksi hari ini. Tekan tombol Tambah untuk memulai."'
      }
    },
    nonFunctionalRequirements: {
      performance: 'Kecepatan loading awal halaman < 1.5 detik pada jaringan 4G/WiFi; filter dan kalkulasi data instan di sisi klien (< 100ms).',
      security: 'Data sensitif terlindungi di database terisolasi; kepatuhan dasar UU PDP (Perlindungan Data Pribadi) nomor telepon & nama pelanggan.',
      scalabilityAccessibility: 'Tampilan adaptif otomatis untuk layar Desktop (1920px), Laptop (1366px), Tablet (768px), dan Layar Ponsel (375px) sesuai standar WCAG AA.'
    },
    successMetrics: {
      primaryMetric,
      secondaryMetric
    },
    releasePlan: {
      testingPlan: 'Uji fungsional end-to-end (Alpha internal) untuk alur create, read, update, delete (CRUD) dan kalkulasi nominal.',
      launchCriteria: 'Nol (0) critical bug pada form input data dan kalkulasi Rupiah; tampilan responsif tanpa horizontal scroll pada mobile.'
    },
    openQuestionsRisks: {
      openQuestions: [
        'Apakah ke depannya diperlukan hak akses multi-role berbayar (misal: Kasir tidak bisa melihat total laba bersih)?',
        'Apakah perlu integrasi QRIS dinamis langsung ke QRIS bank tertentu?'
      ],
      risksAndMitigations: [
        {
          risk: 'Koneksi internet di lokasi toko/outlet sempat terputus saat jam sibuk.',
          mitigation: 'Sistem menyimpan draft formulir di penyimpanan lokal browser (localStorage) agar data tidak hilang.'
        },
        {
          risk: 'Staf keliru memasukkan nomor WhatsApp tanpa awalan yang benar.',
          mitigation: 'Formulir melakukan auto-format nomor otomatis mengubah "08..." menjadi format internasional "628...".'
        }
      ]
    }
  };

  return prd;
}

/**
 * Transforms an approved PRD Document into a real, interactive LegoApp ready for Studio!
 */
export function convertPRDToLegoApp(
  prd: PRDDocument,
  authorId: string = 'user-bobi',
  orgId: string = 'org-1'
): LegoApp {
  const isPos = /pos|kasir|kopi|resto/i.test(prd.metadata.productName);
  const isKlinik = /klinik|medis|pasien/i.test(prd.metadata.productName);
  const isCrm = /crm|sales|pipeline|prospek/i.test(prd.metadata.productName);
  const isLaundry = /laundry|cuci/i.test(prd.metadata.productName);

  let category: 'crm' | 'portal' | 'booking' | 'custom' = 'custom';
  let primaryTable: TableDefinition;
  let metrics: MetricCard[];
  let kanban: KanbanConfig | undefined;

  if (isPos) {
    category = 'portal';
    primaryTable = {
      id: 'orders',
      name: 'Pesanan & Kasir',
      primaryKey: 'id',
      columns: [
        { key: 'noNota', label: 'No. Nota', type: 'text', required: true },
        { key: 'pelanggan', label: 'Nama Pelanggan', type: 'text', required: true },
        { key: 'menuItem', label: 'Rincian Menu', type: 'text', required: true },
        { key: 'status', label: 'Status Order', type: 'status', options: ['Menunggu Bayar', 'Diproses Barista', 'Siap Saji', 'Selesai'] },
        { key: 'metode', label: 'Metode Pembayaran', type: 'badge', options: ['QRIS', 'Tunai', 'Debit'] },
        { key: 'total', label: 'Total Bayar (Rp)', type: 'currency', required: true },
        { key: 'whatsapp', label: 'WhatsApp Nota', type: 'phone' },
      ],
      records: [
        { id: '1', noNota: 'INV-101', pelanggan: 'Kak Salsa', menuItem: '2x Kopi Susu Gula Aren, 1x Croissant', status: 'Selesai', metode: 'QRIS', total: 68000, whatsapp: '081288889999' },
        { id: '2', noNota: 'INV-102', pelanggan: 'Mas Budi', menuItem: '1x Americano Double, 1x Donat Cokelat', status: 'Diproses Barista', metode: 'Tunai', total: 42000, whatsapp: '081377778888' },
        { id: '3', noNota: 'INV-103', pelanggan: 'Ibu Ratna', menuItem: '3x Caramel Latte, 2x Roti Bakar Keju', status: 'Menunggu Bayar', metode: 'QRIS', total: 125000, whatsapp: '081566667777' },
      ]
    };
    metrics = [
      { id: 'm1', label: 'Omset Hari Ini', value: 'Rp 235.000', change: '+18% vs kemarin', trend: 'up', icon: 'DollarSign', color: 'blue' },
      { id: 'm2', label: 'Pesanan Aktif', value: '2 Order', change: 'Antrean lancar', trend: 'neutral', icon: 'Clock', color: 'yellow' },
      { id: 'm3', label: 'Total Cup Terjual', value: '9 Cup', change: 'Best seller: Gula Aren', trend: 'up', icon: 'Coffee', color: 'green' },
    ];
    kanban = {
      enabled: true,
      tableId: 'orders',
      statusColumnKey: 'status',
      titleColumnKey: 'noNota',
      subtitleColumnKey: 'pelanggan',
      valueColumnKey: 'total',
      stages: [
        { id: 'Menunggu Bayar', name: 'Menunggu Bayar', color: '#EF4444' },
        { id: 'Diproses Barista', name: 'Diproses Barista', color: '#F59E0B' },
        { id: 'Siap Saji', name: 'Siap Saji', color: '#3B82F6' },
        { id: 'Selesai', name: 'Selesai', color: '#10B981' }
      ]
    };
  } else if (isKlinik) {
    category = 'booking';
    primaryTable = {
      id: 'patients',
      name: 'Pendaftaran & Rekam Pasien',
      primaryKey: 'id',
      columns: [
        { key: 'noAntrean', label: 'No. Antrean', type: 'text', required: true },
        { key: 'namaPasien', label: 'Nama Pasien', type: 'text', required: true },
        { key: 'keluhan', label: 'Keluhan / Tindakan', type: 'text', required: true },
        { key: 'dokter', label: 'Dokter Pemeriksa', type: 'text' },
        { key: 'status', label: 'Status Antrean', type: 'status', options: ['Menunggu', 'Pemeriksaan', 'Apotek & Bayar', 'Selesai'] },
        { key: 'biaya', label: 'Biaya Tindakan (Rp)', type: 'currency' },
        { key: 'whatsapp', label: 'WhatsApp Pasien', type: 'phone', required: true },
      ],
      records: [
        { id: '1', noAntrean: 'A-01', namaPasien: 'Ananda Rizky', keluhan: 'Pembersihan Karang Gigi (Scaling)', dokter: 'drg. Sarah Sp.Perio', status: 'Selesai', biaya: 350000, whatsapp: '081299990001' },
        { id: '2', noAntrean: 'A-02', namaPasien: 'Bpk. Hendro', keluhan: 'Tambal Gigi Geraham Bawah', dokter: 'drg. Sarah Sp.Perio', status: 'Pemeriksaan', biaya: 250000, whatsapp: '081299990002' },
        { id: '3', noAntrean: 'A-03', namaPasien: 'Sdri. Cindy', keluhan: 'Pemeriksaan Behel Bulanan', dokter: 'drg. Dimas Sp.Ort', status: 'Menunggu', biaya: 200000, whatsapp: '081299990003' },
      ]
    };
    metrics = [
      { id: 'm1', label: 'Pasien Hari Ini', value: '3 Pasien', change: '1 menunggu, 1 diperiksa', trend: 'up', icon: 'Users', color: 'blue' },
      { id: 'm2', label: 'Total Tindakan (Rp)', value: 'Rp 800.000', change: 'Koleksi pembayaran aktif', trend: 'up', icon: 'Activity', color: 'green' },
      { id: 'm3', label: 'Rata-rata Waktu Tunggu', value: '14 Menit', change: 'Sesuai SOP < 20 mnt', trend: 'neutral', icon: 'Clock', color: 'yellow' },
    ];
    kanban = {
      enabled: true,
      tableId: 'patients',
      statusColumnKey: 'status',
      titleColumnKey: 'namaPasien',
      subtitleColumnKey: 'keluhan',
      valueColumnKey: 'biaya',
      stages: [
        { id: 'Menunggu', name: 'Menunggu Antrean', color: '#F59E0B' },
        { id: 'Pemeriksaan', name: 'Sedang Diperiksa', color: '#3B82F6' },
        { id: 'Apotek & Bayar', name: 'Apotek & Kasir', color: '#8B5CF6' },
        { id: 'Selesai', name: 'Selesai Kontrol', color: '#10B981' }
      ]
    };
  } else if (isLaundry) {
    category = 'portal';
    primaryTable = {
      id: 'laundry_orders',
      name: 'Nota Cucian Masuk',
      primaryKey: 'id',
      columns: [
        { key: 'noNota', label: 'No. Nota', type: 'text', required: true },
        { key: 'pelanggan', label: 'Nama Pelanggan', type: 'text', required: true },
        { key: 'layanan', label: 'Layanan Cuci', type: 'badge', options: ['Cuci Kering Setrika', 'Cuci Basah', 'Dry Clean'] },
        { key: 'berat', label: 'Berat (Kg)', type: 'number' },
        { key: 'rak', label: 'Nomor Rak', type: 'text' },
        { key: 'status', label: 'Status Proses', type: 'status', options: ['Masuk Antrean', 'Proses Cuci', 'Setrika Halus', 'Siap Ambil', 'Sudah Diambil'] },
        { key: 'total', label: 'Total Bayar (Rp)', type: 'currency' },
        { key: 'whatsapp', label: 'WhatsApp Pelanggan', type: 'phone', required: true },
      ],
      records: [
        { id: '1', noNota: 'LND-201', pelanggan: 'Ibu Maya', layanan: 'Cuci Kering Setrika', berat: 4.5, rak: 'RAK-B02', status: 'Siap Ambil', total: 45000, whatsapp: '081233445566' },
        { id: '2', noNota: 'LND-202', pelanggan: 'Pak Danu', layanan: 'Dry Clean Jas 2 Pcs', berat: 2.0, rak: 'RAK-J01', status: 'Proses Cuci', total: 70000, whatsapp: '081277889900' },
        { id: '3', noNota: 'LND-203', pelanggan: 'Mba Cindy', layanan: 'Cuci Kering Setrika', berat: 6.0, rak: 'RAK-B05', status: 'Masuk Antrean', total: 60000, whatsapp: '081344556677' },
      ]
    };
    metrics = [
      { id: 'm1', label: 'Cucian Siap Ambil', value: '1 Nota (Rak B02)', change: 'Notifikasi WA terkirim', trend: 'up', icon: 'Package', color: 'green' },
      { id: 'm2', label: 'Total Berat Cuci', value: '12.5 Kg', change: 'Kapasitas mesin normal', trend: 'neutral', icon: 'Scale', color: 'blue' },
      { id: 'm3', label: 'Kas Harian Terkumpul', value: 'Rp 175.000', change: 'Semua lunas di muka', trend: 'up', icon: 'DollarSign', color: 'yellow' },
    ];
    kanban = {
      enabled: true,
      tableId: 'laundry_orders',
      statusColumnKey: 'status',
      titleColumnKey: 'noNota',
      subtitleColumnKey: 'pelanggan',
      valueColumnKey: 'total',
      stages: [
        { id: 'Masuk Antrean', name: 'Masuk Antrean', color: '#94A3B8' },
        { id: 'Proses Cuci', name: 'Sedang Dicuci', color: '#3B82F6' },
        { id: 'Setrika Halus', name: 'Setrika Halus', color: '#F59E0B' },
        { id: 'Siap Ambil', name: 'Siap Diambil', color: '#10B981' },
        { id: 'Sudah Diambil', name: 'Selesai', color: '#64748B' }
      ]
    };
  } else {
    // Default CRM / Business Pipeline
    category = 'crm';
    primaryTable = {
      id: 'leads',
      name: 'Pipeline & Prospek Klien',
      primaryKey: 'id',
      columns: [
        { key: 'nama', label: 'Nama Klien/Bisnis', type: 'text', required: true },
        { key: 'whatsapp', label: 'Nomor WhatsApp', type: 'phone', required: true },
        { key: 'status', label: 'Tahapan Deal', type: 'status', options: ['Prospek Baru', 'Sedang Dihubungi', 'Kirim Penawaran', 'Closing Deal', 'Batal'] },
        { key: 'nilai', label: 'Nilai Transaksi (Rp)', type: 'currency' },
        { key: 'catatan', label: 'Catatan Kebutuhan', type: 'text' },
      ],
      records: [
        { id: '1', nama: 'PT Sinergi Abadi', whatsapp: '081298765432', status: 'Kirim Penawaran', nilai: 18500000, catatan: 'Klien tertarik paket implementasi custom ERP cloud.' },
        { id: '2', nama: 'CV Media Cipta', whatsapp: '081345678901', status: 'Sedang Dihubungi', nilai: 7500000, catatan: 'Jadwal call demo Zoom hari Selasa jam 14:00.' },
        { id: '3', nama: 'Klinik Sehat Prima', whatsapp: '081512345678', status: 'Prospek Baru', nilai: 12000000, catatan: 'Tanya modul reservasi online dan cetak resep.' },
        { id: '4', nama: 'Toko Roti Makmur', whatsapp: '081698712345', status: 'Closing Deal', nilai: 9500000, catatan: 'Pembayaran DP 50% via transfer BCA sudah masuk.' },
      ]
    };
    metrics = [
      { id: 'm1', label: 'Total Nilai Pipeline', value: 'Rp 47.500.000', change: '+32% bulan ini', trend: 'up', icon: 'Target', color: 'blue' },
      { id: 'm2', label: 'Closing Deal', value: 'Rp 9.500.000', change: '1 deal lunas minggu ini', trend: 'up', icon: 'CheckCircle2', color: 'green' },
      { id: 'm3', label: 'Prospek Aktif', value: '3 Akun', change: 'Butuh follow up hari ini', trend: 'neutral', icon: 'Users', color: 'yellow' },
    ];
    kanban = {
      enabled: true,
      tableId: 'leads',
      statusColumnKey: 'status',
      titleColumnKey: 'nama',
      subtitleColumnKey: 'catatan',
      valueColumnKey: 'nilai',
      stages: [
        { id: 'Prospek Baru', name: 'Prospek Baru', color: '#3B82F6' },
        { id: 'Sedang Dihubungi', name: 'Sedang Dihubungi', color: '#F59E0B' },
        { id: 'Kirim Penawaran', name: 'Penawaran', color: '#8B5CF6' },
        { id: 'Closing Deal', name: 'Closing Deal', color: '#10B981' },
        { id: 'Batal', name: 'Batal', color: '#EF4444' }
      ]
    };
  }

  const slug = prd.metadata.productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'app-bisnis';

  const initialVersion: AppVersion = {
    versionNumber: 1,
    appName: prd.metadata.productName,
    tagline: prd.backgroundObjectives.businessGoal,
    changelog: 'v1.0.0 — Rilis produksi perdana mengacu spesifikasi PRD resmi.',
    promptUsed: prd.backgroundObjectives.problemStatement,
    createdAt: new Date().toISOString(),
    mode: 'build',
    metrics,
    pages: [
      {
        id: 'p1',
        name: kanban?.enabled ? 'Dashboard & Pipeline' : 'Dashboard Utama',
        type: kanban?.enabled ? 'kanban' : 'table',
        tableId: primaryTable.id,
        description: 'Tampilan visual operasional dan aksi transaksi langsung'
      },
      {
        id: 'p2',
        name: 'Database Explorer',
        type: 'table',
        tableId: primaryTable.id,
        description: 'Tabel data terperinci dengan filter dan pencarian instan'
      }
    ],
    tables: [primaryTable],
    kanban,
    quickActionLabel: '+ Tambah Data',
    quickActionTargetTable: primaryTable.id,
    primaryColor: '#2563EB',
    accentColor: '#F59E0B'
  };

  const app: LegoApp = {
    id: 'app-' + Date.now(),
    slug: slug + '-' + Math.floor(Math.random() * 1000),
    name: prd.metadata.productName,
    description: prd.backgroundObjectives.background,
    category,
    currentVersion: 1,
    versions: [initialVersion],
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    organizationId: orgId,
    createdById: authorId,
    plan: 'STANDAR',
    prd
  };

  return app;
}

/**
 * Formats a PRDDocument into clean, publication-ready GitHub Flavored Markdown.
 */
export function formatPRDToMarkdown(prd: PRDDocument): string {
  return `# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## ${prd.metadata.productName}

---

### 1. Informasi Dasar Dokumen (Metadata)
- **Nama Produk/Fitur**: ${prd.metadata.productName}
- **Status**: ${prd.metadata.status}
- **Pemilik Produk (Author)**: ${prd.metadata.author}
- **Tim Inti**:
  - UI/UX Designer: ${prd.metadata.coreTeam.uxUiDesigner}
  - Tech Lead / Engineering Lead: ${prd.metadata.coreTeam.techLead}
  - QA Engineer: ${prd.metadata.coreTeam.qaEngineer}
- **Tanggal & Changelog**: ${prd.metadata.lastUpdated} | ${prd.metadata.changelog}

---

### 2. Latar Belakang & Tujuan (Background & Objectives)
- **Latar Belakang (Background)**:
  ${prd.backgroundObjectives.background}
- **Pernyataan Masalah (Problem Statement)**:
  ${prd.backgroundObjectives.problemStatement}
- **Tujuan Bisnis (Business Goal)**:
  ${prd.backgroundObjectives.businessGoal}

---

### 3. Profil Pengguna & Logika Bisnis (User Persona & Business Logic)
- **Target Pengguna (User Persona)**:
  ${prd.userPersonaBusinessLogic.userPersona}
- **Asumsi**:
${prd.userPersonaBusinessLogic.assumptions.map(a => `  - ${a}`).join('\n')}
- **Batasan & Aturan Bisnis (Business Rules)**:
${prd.userPersonaBusinessLogic.businessRules.map(r => `  - ${r}`).join('\n')}

---

### 4. Lingkup Kerja (Scope: In-Scope vs Out-of-Scope)
#### In-Scope (Rilis Kali Ini):
${prd.scope.inScope.map(item => `  - [x] ${item}`).join('\n')}

#### Out-of-Scope (Ditunda ke Fase V2):
${prd.scope.outOfScope.map(item => `  - [ ] ${item}`).join('\n')}

---

### 5. Kebutuhan Fungsional & Spesifikasi Fitur (Functional Requirements)
#### User Stories:
${prd.functionalRequirements.userStories.map((story, i) => `  ${i + 1}. ${story}`).join('\n')}

#### Tabel Kebutuhan Fitur (Metode MoSCoW):
| ID Fitur | Deskripsi Fitur | Prioritas | Kriteria Penerimaan (Given - When - Then) |
|---|---|---|---|
${prd.functionalRequirements.features.map(f => `| **${f.id}** | ${f.description} | \`${f.priority}\` | ${f.acceptanceCriteria} |`).join('\n')}

---

### 6. Desain & Pengalaman Pengguna (UX/UI Requirements)
- **Alur Pengguna (User Flow)**:
${prd.uxUiRequirements.userFlow.map(flow => `  - ${flow}`).join('\n')}
- **Konsep Desain**: ${prd.uxUiRequirements.designLinksNotes}
- **Detail Elemen Spesifik**:
  - *Error Messaging*: ${prd.uxUiRequirements.elementDetails.errorMessaging}
  - *Action Copywriting*: ${prd.uxUiRequirements.elementDetails.actionCopywriting}
  - *Empty State*: ${prd.uxUiRequirements.elementDetails.emptyStates}

---

### 7. Kebutuhan Non-Fungsional (Non-Functional Requirements)
- **Kinerja (Performance)**: ${prd.nonFunctionalRequirements.performance}
- **Keamanan & Regulasi (Security & PDP)**: ${prd.nonFunctionalRequirements.security}
- **Skalabilitas & Aksesibilitas**: ${prd.nonFunctionalRequirements.scalabilityAccessibility}

---

### 8. Metrik Keberhasilan (Success Metrics / KPIs)
- **Metrik Utama (Primary Metric)**:
  ${prd.successMetrics.primaryMetric}
- **Metrik Sekunder (Guardrail Metric)**:
  ${prd.successMetrics.secondaryMetric}

---

### 9. Rencana Rilis & Kriteria Peluncuran (Release Plan & Go-To-Market)
- **Rencana Pengujian (Testing Plan)**:
  ${prd.releasePlan.testingPlan}
- **Kriteria Peluncuran (Launch Criteria)**:
  ${prd.releasePlan.launchCriteria}

---

### 10. Pertanyaan Terbuka & Mitigasi Risiko (Open Questions & Risks)
- **Pertanyaan Terbuka**:
${prd.openQuestionsRisks.openQuestions.map(q => `  - ? ${q}`).join('\n')}
- **Risiko & Mitigasi**:
${prd.openQuestionsRisks.risksAndMitigations.map(rm => `  - **Risiko**: ${rm.risk}\n    **Mitigasi**: ${rm.mitigation}`).join('\n')}
`;
}
