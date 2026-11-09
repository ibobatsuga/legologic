import { 
  PRDDocument, 
  LegoApp, 
  AppVersion, 
  TableDefinition, 
  MetricCard, 
  KanbanConfig,
  PRDFunctionalFeature
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

export type SupportedDomain = 
  | 'rental'
  | 'hr'
  | 'inventory'
  | 'sports_booking'
  | 'workshop_service'
  | 'property'
  | 'education'
  | 'ticketing'
  | 'event'
  | 'logistics'
  | 'pet'
  | 'salon'
  | 'finance'
  | 'project'
  | 'library'
  | 'pos'
  | 'clinic'
  | 'laundry'
  | 'crm'
  | 'custom';

/**
 * Detects the specific industry or business domain from input text.
 */
export function detectDomainFromText(text: string): { domainKey: SupportedDomain; domainName: string; defaultTitle: string } {
  const lower = text.toLowerCase();

  if (/rental|sewa mobil|sewa motor|rent car|sewa kamera|sewa gaun|sewa tenda|sewa alat/i.test(lower)) {
    return { domainKey: 'rental', domainName: 'Rental & Persewaan Kendaraan/Alat', defaultTitle: 'Sistem Rental & Manajemen Unit Sewa' };
  }
  if (/absen|presensi|karyawan|hr|payroll|gaji|cuti|kepegawaian/i.test(lower)) {
    return { domainKey: 'hr', domainName: 'HR, Presensi & Manajemen Karyawan', defaultTitle: 'Portal Karyawan & Presensi Kerja' };
  }
  if (/inventori|inventory|stok|gudang|toko bangunan|sparepart|toko retail|grosir|sembako/i.test(lower)) {
    return { domainKey: 'inventory', domainName: 'Manajemen Stok & Inventori Gudang', defaultTitle: 'Inventori Barang & Stok Gudang' };
  }
  if (/futsal|badminton|lapangan|tenis|gym|fitness|olahraga|sport/i.test(lower)) {
    return { domainKey: 'sports_booking', domainName: 'Booking Lapangan & Fasilitas Olahraga', defaultTitle: 'Jadwal Booking Lapangan Olahraga' };
  }
  if (/bengkel|servis|service|montir|elektronik|reparasi|teknisi/i.test(lower)) {
    return { domainKey: 'workshop_service', domainName: 'Bengkel & Layanan Servis Teknis', defaultTitle: 'Tiket Servis & Manajemen Bengkel' };
  }
  if (/kost|kos-kosan|kontrakan|apartemen|kamar|sewa rumah|properti/i.test(lower)) {
    return { domainKey: 'property', domainName: 'Manajemen Kost, Kontrakan & Properti', defaultTitle: 'Pengelolaan Kamar Kost & Kontrakan' };
  }
  if (/sekolah|bimbel|les|kursus|santri|pesantren|murid|siswa|spp/i.test(lower)) {
    return { domainKey: 'education', domainName: 'Bimbel, Kursus & Administrasi Pendidikan', defaultTitle: 'Portal Siswa & Pembayaran SPP/Kursus' };
  }
  if (/tiket|ticketing|helpdesk|komplain|aduan|customer service|keluhan/i.test(lower)) {
    return { domainKey: 'ticketing', domainName: 'Helpdesk, Ticketing & Layanan Pelanggan', defaultTitle: 'Pusat Bantuan & Tiket Pelanggan' };
  }
  if (/wedding|pernikahan|event|acara|wo|wedding organizer/i.test(lower)) {
    return { domainKey: 'event', domainName: 'Event Organizer & Wedding Planning', defaultTitle: 'Manajemen Proyek Wedding & Acara' };
  }
  if (/ekspedisi|logistik|kurir|resi|pengiriman|ongkir|paket/i.test(lower)) {
    return { domainKey: 'logistics', domainName: 'Ekspedisi, Logistik & Tracking Resi', defaultTitle: 'Tracking Resi & Pengiriman Paket' };
  }
  if (/petshop|hewan|anjing|kucing|grooming|klinik hewan/i.test(lower)) {
    return { domainKey: 'pet', domainName: 'Petshop, Salon Anabul & Klinik Hewan', defaultTitle: 'Layanan Petshop & Grooming Hewan' };
  }
  if (/barbershop|salon|pangkas rambut|barber|spa|perawatan wajah/i.test(lower)) {
    return { domainKey: 'salon', domainName: 'Barbershop, Salon & Perawatan Diri', defaultTitle: 'Antrean Barbershop & Booking Salon' };
  }
  if (/keuangan|kas|arus kas|uang masuk|pembukuan|utang|piutang/i.test(lower)) {
    return { domainKey: 'finance', domainName: 'Catatan Arus Kas & Keuangan Bisnis', defaultTitle: 'Buku Kas & Catatan Keuangan' };
  }
  if (/proyek|task|tugas|project|mandor|to-do|timeline/i.test(lower)) {
    return { domainKey: 'project', domainName: 'Manajemen Proyek & Pelacak Tugas', defaultTitle: 'Manajemen Proyek & Timeline Tim' };
  }
  if (/perpustakaan|buku|pinjam buku|peminjaman buku|pustaka/i.test(lower)) {
    return { domainKey: 'library', domainName: 'Perpustakaan & Peminjaman Buku', defaultTitle: 'Sirkulasi Peminjaman Buku Pustaka' };
  }
  if (/kasir|pos|kopi|coffee|resto|cafe|f&b|makan|minum/i.test(lower)) {
    return { domainKey: 'pos', domainName: 'Point of Sale (POS), Kasir & F&B', defaultTitle: 'Kasir & Order POS Kedai' };
  }
  if (/klinik|dokter|gigi|pasien|rekam medis|medis|appointment/i.test(lower)) {
    return { domainKey: 'clinic', domainName: 'Sistem Manajemen & Booking Klinik', defaultTitle: 'Klinik & Rekam Medis Pasien' };
  }
  if (/laundry|cuci|pakaian/i.test(lower)) {
    return { domainKey: 'laundry', domainName: 'Operasional & Kasir Laundry', defaultTitle: 'Laundry Flow & Tracking Nota' };
  }
  if (/\bcrm\b|pipeline|sales lead|deal closing|prospek klien/i.test(lower)) {
    return { domainKey: 'crm', domainName: 'CRM & Pipeline Penjualan B2B', defaultTitle: 'Pipeline CRM & Sales Tracker' };
  }

  // Extract custom subject if possible
  const cleanName = text.replace(/buatkan|bikin|tolong|aplikasi|sistem|web|app/gi, '').trim();
  const titleWords = cleanName.split(/\s+/).slice(0, 3).join(' ');
  const defaultTitle = titleWords ? `Sistem ${titleWords.charAt(0).toUpperCase() + titleWords.slice(1)}` : 'Aplikasi Operasional Bisnis';

  return { domainKey: 'custom', domainName: 'Aplikasi Kustom Sesuai Kebutuhan', defaultTitle };
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
  const hasPersona = /pengguna|user|persona|kasir|barista|dokter|pasien|pelanggan|admin|owner|staf|klien|sales|pembeli|karyawan|penyewa|penghuni|sopir/i.test(allText);
  const hasObjectives = /tujuan|masalah|omset|konversi|efisiensi|pencatatan|problem|goal|latar belakang|background/i.test(allText);
  const hasScope = /fitur|scope|in-scope|out-of-scope|wajib|hanya|termasuk|tidak termasuk|tunda|mvp/i.test(allText);
  const hasBusinessRules = /aturan|batasan|rules|qris|tunai|diskon|pajak|stok|harga|rp|persen|validasi|status|sewa|tarif/i.test(allText);
  const hasFunctionalDetails = /tabel|data|form|laporan|riwayat|cetak|input|notifikasi|whatsapp|export|filter/i.test(allText);
  
  let score = 20;
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
  const detected = detectDomainFromText(allText);
  const domain = detected.domainName;
  const suggestedTitle = detected.defaultTitle;
  let quickReplies: string[] = [];
  let interviewQuestions: string[] = [];

  switch (detected.domainKey) {
    case 'rental':
      interviewQuestions = [
        'Apa saja armada/alat yang disewakan (mobil, motor, kamera) dan siapa pengguna sistem (Admin rental vs Petugas serah terima)?',
        'Bagaimana alur perhitungan tarif sewa (per hari / per 24 jam) dan bagaimana penanganan uang jaminan (deposit) & denda keterlambatan?',
        'Fitur apa yang wajib masuk In-Scope rilis pertama (misal: kalender unit keluar-masuk, surat jalan WhatsApp) vs Out-of-Scope (GPS tracking live)?',
        'Metrik kunci apa yang paling ingin dipantau setiap hari (utilitas unit armada tersewa, omset harian, jadwal kembali)?'
      ];
      quickReplies = [
        'Mobil & Motor: tarif per hari, status booking & keluar, nomor WA penyewa',
        'Kamera & Alat Foto: jaminan KTP, status sewa, denda per jam',
        'In-Scope: pencatatan unit, nota WA, jadwal kembali. GPS tunda V2',
        'Data sudah cukup, langsung susunkan PRD lengkap!'
      ];
      break;

    case 'inventory':
      interviewQuestions = [
        'Jenis barang apa yang dikelola dalam gudang/toko (nama item, kode SKU, kategori)?',
        'Siapa pengguna aplikasi (Kepala Gudang, Kasir Toko, atau Pemilik Bisnis)?',
        'Bagaimana batas minimum peringatan stok menipis dan apakah ada pencatatan harga modal (beli) vs harga jual (Rupiah)?',
        'Fitur apa yang masuk In-Scope rilis awal (pencatatan stok masuk/keluar) vs Out-of-Scope (barcode scanner hardware)?'
      ];
      quickReplies = [
        'Stok masuk & keluar, batas stok menipis, harga beli & harga jual Rp',
        'Kelola inventori toko retail, pencarian cepat, ekspor ke spreadsheet',
        'Fokus stok akurat dulu, integrasi barcode tunda ke versi berikutnya',
        'Data sudah cukup, langsung buatkan PRD!'
      ];
      break;

    case 'hr':
      interviewQuestions = [
        'Siapa yang mencatat presensi (Karyawan mandiri lewat handphone atau Admin HR kantor)?',
        'Informasi apa yang dicatat pada profil staf (NIK, nama, divisi/jabatan, gaji pokok, nomor WhatsApp)?',
        'Apa batasan lingkup In-Scope (pencatatan hadir/izin/cuti & rekap bulanan) vs Out-of-Scope (koneksi mesin sidik jari biometrik)?',
        'Apa metrik KPI utama (persentase kehadiran tim, total estimasi beban payroll bulanan)?'
      ];
      quickReplies = [
        'Data staf, status hadir/izin/cuti harian, rekap gaji bulanan',
        'Admin kelola presensi harian karyawan & kirim pengumuman WA',
        'MVP: presensi & data pegawai. Mesin fingerprint tunda ke V2',
        'Data sudah lengkap, susunkan PRD sekarang!'
      ];
      break;

    case 'sports_booking':
      interviewQuestions = [
        'Fasilitas olahraga apa yang disewakan (lapangan futsal, bulutangkis, tenis) dan berapa slot jam operasionalnya?',
        'Bagaimana alur pemesanan (apakah wajib bayar DP di muka via QRIS/Transfer untuk mengunci jadwal)?',
        'Siapa pengguna utama (Resepsionis kasir lapangan & Pelanggan pemesan jadwal)?',
        'Fitur apa yang masuk In-Scope (jadwal booking per lapangan, status DP/Lunas, reminder WhatsApp)?'
      ];
      quickReplies = [
        'Jadwal slot jam main, status DP & Lunas, konfirmasi booking WhatsApp',
        'Kelola 2 lapangan, tarif per jam, reminder H-1 sebelum main',
        'Fokus jadwal tidak tabrakan & kas harian, sistem member tunda',
        'Data sudah cukup, langsung buatkan PRD!'
      ];
      break;

    case 'workshop_service':
      interviewQuestions = [
        'Layanan apa yang dikerjakan (servis motor/mobil, perbaikan handphone, laptop, elektronik)?',
        'Informasi apa yang dicatat saat unit masuk (No. Polisi / Tipe perangkat, nama pemilik, keluhan kerusakan, estimasi biaya)?',
        'Bagaimana alur status pengerjaan (Antrean Masuk -> Pengecekan -> Tunggu Sparepart -> Selesai Diambil)?',
        'Apakah pelanggan diberi notifikasi otomatis via WhatsApp saat servis selesai?'
      ];
      quickReplies = [
        'Tiket servis masuk, status pengerjaan, notifikasi WhatsApp siap diambil',
        'Catatan keluhan kerusakan, estimasi biaya jasa, sparepart',
        'Fokus alur tiket bengkel & nota WA, integrasi POS tunda ke V2',
        'Data sudah lengkap, susunkan PRD sekarang!'
      ];
      break;

    case 'property':
      interviewQuestions = [
        'Berapa jumlah kamar/unit yang dikelola dan bagaimana tipe kamarnya (VIP, Standar, AC)?',
        'Bagaimana alur penagihan sewa (jatuh tempo bulanan/tahunan) dan bukti pembayaran?',
        'Informasi apa yang wajib dicatat (nomor kamar, nama penghuni, kontak WhatsApp, tanggal mulai sewa)?',
        'Apa KPI utama (tingkat keterisian/okupansi kamar %, total pemasukan sewa per bulan)?'
      ];
      quickReplies = [
        'Daftar kamar, penghuni, tagihan bulanan, pengingat jatuh tempo WA',
        'Status kamar kosong vs terisi, total omset sewa per bulan',
        'In-Scope: kelola kamar & pembayaran. Smart lock tunda ke V2',
        'Data sudah lengkap, langsung susunkan PRD!'
      ];
      break;

    case 'pos':
      interviewQuestions = [
        'Siapa saja pengguna sistem (Kasir pencatat order, Barista/Dapur pemroses tiket, atau Pemilik kedai)?',
        'Metode pembayaran apa saja yang wajib didukung (QRIS, Tunai, Kartu debit)? Apakah perlu hitung kembalian dan cetak nota digital WhatsApp?',
        'Fitur apa yang wajib ada di rilis pertama (In-Scope) vs yang ingin ditunda (Out-of-Scope, misal: integrasi ojol)?',
        'Aturan bisnis khusus apa yang berlaku (contoh: stok cup/menu berkurang otomatis, diskon member)?'
      ];
      quickReplies = [
        'Kasir & Barista, bayar QRIS + Tunai, cetak nota WhatsApp',
        'Kelola menu kopi, stok cup, laporan omset harian kasir',
        'Hanya order meja & takeaway, integrasi ojol tunda dulu',
        'Data sudah cukup, langsung susunkan PRD lengkap!'
      ];
      break;

    case 'clinic':
      interviewQuestions = [
        'Siapa persona pengguna yang berinteraksi (Resepsionis pendaftaran, Dokter pemeriksa, atau Pasien)?',
        'Bagaimana alur pendaftaran antrean dan rekam medis (apakah ada nomor antrean harian dan reminder WhatsApp)?',
        'Apa batasan lingkup MVP (In-Scope: pendaftaran & rekam medis diagnosa; Out-of-Scope: integrasi BPJS)?',
        'Bagaimana aturan privasi & keamanan data rekam medis pasien sesuai kepatuhan regulasi PDP?'
      ];
      quickReplies = [
        'Resepsionis & Dokter, nomor antrean, rekam medis ringkas',
        'Booking jadwal dokter, reminder WhatsApp pasien, status antre',
        'MVP tanpa integrasi BPJS, fokus pendaftaran & diagnosa cepat',
        'Data sudah cukup, buatkan PRD sekarang!'
      ];
      break;

    case 'laundry':
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
      break;

    case 'crm':
      interviewQuestions = [
        'Berapa tahapan kanban pipeline penjualan Anda (misal: Leads Baru -> Follow-up -> Penawaran -> Closing -> Batal)?',
        'Siapa pengguna utama sistem (Sales rep lapangan, Telemarketing, atau Sales Manager)?',
        'Informasi apa yang wajib diinput untuk setiap prospek (Nama, WhatsApp, Nilai Potensi Rp, Catatan)?',
        'Apa metrik KPI utama keberhasilan (Konversi Closing Rate, Total Omset per Sales)?'
      ];
      quickReplies = [
        'Pipeline 4 tahap: Baru, Dihubungi, Penawaran, Closing Rp',
        'Tombol 1-klik follow up WhatsApp langsung dari pipeline',
        'Dashboard target omset bulanan & performa per sales',
        'Data sudah lengkap, langsung susunkan PRD!'
      ];
      break;

    default:
      interviewQuestions = [
        `Siapa target pengguna utama dan staf operasional dalam sistem ${suggestedTitle} ini?`,
        'Masalah utama apa yang ingin diselesaikan dan apa hasil bisnis terukur yang diharapkan?',
        'Fitur apa yang wajib masuk In-Scope rilis pertama vs fitur yang ingin ditunda ke versi nanti (Out-of-Scope)?',
        'Aturan bisnis dan alur proses apa yang paling krusial untuk dicatat (data masukan, nominal Rp, status alur)?'
      ];
      quickReplies = [
        'Pengguna Staf & Admin, formulir input cepat, rekapan status',
        'Kalkulasi nilai otomatis dalam Rupiah dan tombol kontak WhatsApp',
        'MVP fokus operasional harian, laporan ringkas siap pakai',
        'Data sudah lengkap, langsung buatkan PRD sekarang!'
      ];
      break;
  }

  const isExplicitlyComplete = /data sudah lengkap|buatkan prd sekarang|langsung susunkan prd|data sudah cukup/i.test(allText);
  const wordCount = allText.split(/\s+/).length;
  const isComplete = isExplicitlyComplete || (score >= 70 && wordCount >= 30);

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
  const detected = detectDomainFromText(combined);
  const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  const title = detected.defaultTitle;

  let userPersona = 'Pemilik Usaha (Owner) & Staf Operasional Harian';
  let problemStatement = 'Pencatatan operasional harian masih manual dan rawan selisih, menyita waktu rekapitulasi data.';
  let businessGoal = 'Mempercepat proses input data hingga 70% dan meningkatkan akurasi rekonsiliasi finansial bisnis.';
  let inScopeList = ['Pencatatan data transaksi harian', 'Kalkulasi nilai otomatis dalam Rupiah (Rp)', 'Status tracking visual', 'Ekspor ringkasan data'];
  let outOfScopeList = ['Integrasi payment gateway internasional', 'Aplikasi native mobile iOS/Android di PlayStore (fase V2)', 'Sistem akuntansi multi-cabang kompleks'];
  let primaryMetric = 'Waktu penyelesaian proses kerja berkurang hingga < 30 detik per transaksi.';
  let secondaryMetric = 'Zero human error pada kalkulasi data dan kepatuhan alur operasional.';

  switch (detected.domainKey) {
    case 'rental':
      userPersona = 'Admin Persewaan & Petugas Serah Terima Unit (Armada/Alat)';
      problemStatement = 'Jadwal ketersediaan unit sewa sering tumpang tindih (double booking), keterlambatan pengembalian unit luput dari tagihan denda, dan pencatatan nomor identitas penyewa masih tercecer di kertas.';
      businessGoal = 'Meningkatkan utilitas unit sewa hingga di atas 80% dan mencegah hilangnya pendapatan akibat denda atau kerusakan yang tidak tertagih.';
      inScopeList = [
        'Katalog unit armada/alat sewa dengan status ketersediaan real-time',
        'Pencatatan booking sewa: nama penyewa, durasi (hari/jam), tarif Rp, dan kontak WhatsApp',
        'Surat jalan / bukti serah terima digital kirim langsung ke WhatsApp',
        'Penetapan status alur sewa (Booking -> Unit Keluar -> Selesai Kembali -> Terlambat Denda)',
        'Rekapitulasi pendapatan sewa harian & bulanan'
      ];
      outOfScopeList = [
        'Pelacakan GPS tracking IoT real-time pada kendaraan (fase V2)',
        'Sistem verifikasi KTP biometrik otomatis melalui Dukcapil',
        'Integrasi kartu kredit deposit payment gateway asing'
      ];
      primaryMetric = 'Tingkat utilitas unit sewa meningkat dari 55% menjadi minimal 80%.';
      secondaryMetric = 'Zero kasus double-booking jadwal sewa unit yang sama.';
      break;

    case 'inventory':
      userPersona = 'Kepala Gudang, Staf Penerimaan Barang, & Owner Toko Retail/Grosir';
      problemStatement = 'Stok barang sering selisih antara catatan fisik dan buku, barang habis mendadak tanpa ada peringatan awal, serta kesulitan mengetahui total nilai aset modal yang tertahan di gudang.';
      businessGoal = 'Mencegah kehabisan stok barang laku (out-of-stock) dan mempercepat rekonsiliasi stok opname hingga 80%.';
      inScopeList = [
        'Katalog barang terperinci dengan kode SKU, nama produk, kategori, dan harga beli vs jual Rp',
        'Pencatatan stok masuk (pembelian) & stok keluar (penjualan)',
        'Indikator status stok visual: Stok Aman (Hijau), Menipis (Kuning), Habis (Merah)',
        'Pencarian dan filter instan berdasarkan kategori dan nama barang',
        'Ekspor laporan nilai aset stok gudang ke spreadsheet CSV'
      ];
      outOfScopeList = [
        'Integrasi scanner barcode laser industri custom USB/Bluetooth (fase V2)',
        'Multi-gudang antar pulau dengan transfer stok transit otomatis',
        'Otomasi re-order PO langsung ke sistem supplier API'
      ];
      primaryMetric = 'Akurasi jumlah stok fisik vs sistem di atas 98%.';
      secondaryMetric = 'Penurunan kasus barang habis tanpa peringatan menjadi 0 insiden.';
      break;

    case 'hr':
      userPersona = 'Manajer HRD, Supervisor Lapangan, & Staf Administrasi Kepegawaian';
      problemStatement = 'Rekapitulasi absensi bulanan memakan waktu berhari-hari karena data presensi manual tercecer, perhitungan potongan cuti/izin sering salah.';
      businessGoal = 'Memangkas waktu rekapitulasi data kehadiran dan perhitungan gaji bulanan dari 3 hari menjadi hitungan menit.';
      inScopeList = [
        'Master data karyawan: NIK, nama lengkap, divisi, jabatan, nomor WhatsApp, dan gaji pokok Rp',
        'Pencatatan presensi harian dengan status: Hadir, Izin, Cuti, Alpha',
        'Pemberitahuan / reminder presensi via WhatsApp langsung',
        'Rekapitulasi kehadiran tim dan estimasi payroll bulanan',
        'Filter pencarian berdasarkan divisi dan status aktif karyawan'
      ];
      outOfScopeList = [
        'Koneksi API ke mesin sidik jari biometrik fisik di kantor (fase V2)',
        'Sistem perhitungan pajak PPh 21 tarif progresif kompleks',
        'Integrasi klaim asuransi kesehatan BPJS Ketenagakerjaan API'
      ];
      primaryMetric = 'Waktu penyusunan rekap absensi bulanan berkurang hingga 90%.';
      secondaryMetric = 'Tingkat ketepatan data potongan cuti dan presensi 100%.';
      break;

    case 'sports_booking':
      userPersona = 'Admin / Kasir Lapangan Olahraga & Pelanggan Komunitas Olahraga';
      problemStatement = 'Jadwal main sering bentrok karena dipesan lewat telepon dan chat bersamaan, pelanggan batal sepihak tanpa uang muka (DP).';
      businessGoal = 'Menghilangkan jadwal sewa bentrok dan mengamankan kas masuk lewat sistem penguncian slot DP terverifikasi.';
      inScopeList = [
        'Jadwal slot booking interaktif per lapangan per jam operasional',
        'Pencatatan data pemesan, nomor WhatsApp, durasi main, dan tarif sewa Rp',
        'Pelacak status: Menunggu DP -> Terkonfirmasi -> Sedang Main -> Selesai',
        'Konfirmasi booking otomatis via WhatsApp 1-klik dengan rincian jadwal',
        'Laporan omset sewa lapangan harian'
      ];
      outOfScopeList = [
        'Sistem turnamen e-bracket otomatis multi-grup (fase V2)',
        'Otomasi lampu lapangan mati/nyala via relay IoT smart home',
        'Kamera live-streaming pertandingan rekaman otomatis'
      ];
      primaryMetric = 'Zero jadwal sewa lapangan bentrok dalam 30 hari operasional.';
      secondaryMetric = 'Penurunan angka pembatalan sepihak (no-show) sebesar 70%.';
      break;

    case 'workshop_service':
      userPersona = 'Front Office Bengkel, Kepala Mekanik / Teknisi, & Pemilik Kendaraan/Gadget';
      problemStatement = 'Pemilik kendaraan/gadget sering bolak-balik menanyakan progres servis, nota fisik sering hilang, dan riwayat perbaikan sebelumnya tidak tercatat rapi.';
      businessGoal = 'Meningkatkan kepuasan pelanggan lewat transparansi progres servis dan menaikkan kapasitas pengerjaan unit harian.';
      inScopeList = [
        'Penerbitan nomor tiket servis baru dengan data kendaraan/gadget, keluhan, dan pemilik',
        'Papan visual status pengerjaan: Antrean Masuk -> Pemeriksaan -> Tunggu Sparepart -> Selesai Siap Ambil',
        'Pencatatan rincian biaya jasa & sparepart dalam Rupiah (Rp)',
        'Notifikasi WhatsApp 1-klik: "Halo, unit Anda sudah selesai diservis & siap diambil"',
        'Laporan unit selesai servis dan omset bengkel harian'
      ];
      outOfScopeList = [
        'Integrasi scanner OBD-II diagnosa mesin mobil komputer (fase V2)',
        'Katalog digital sparepart pabrikan resmi terhubung ke distributor',
        'Sistem booking teknisi panggilan home-service dengan live maps'
      ];
      primaryMetric = 'Peningkatan efisiensi waktu update status pengerjaan ke pelanggan sebesar 80%.';
      secondaryMetric = 'Peningkatan repeat-order servis pelanggan sebesar 25%.';
      break;

    case 'property':
      userPersona = 'Pengelola Kost/Kontrakan & Pemilik Properti Sewa';
      problemStatement = 'Penghuni sering terlambat membayar sewa bulanan karena lupa jatuh tempo, pengelola kesulitan mengingat kamar mana yang kosong atau akan habis masa sewanya.';
      businessGoal = 'Meningkatkan ketepatan waktu pembayaran sewa dan menekan tingkat kamar kosong (vacancy rate) di bawah 10%.';
      inScopeList = [
        'Daftar kamar/unit kost dengan rincian tipe kamar, fasilitas, dan harga sewa bulanan Rp',
        'Pencatatan identitas penghuni kost, tanggal mulai sewa, dan kontak WhatsApp',
        'Status kamar: Terisi, Kosong Siap Huni, Jatuh Tempo Bayar, Booking',
        'Kirim tagihan sewa dan pengingat jatuh tempo via WhatsApp 1-klik',
        'Rekapitulasi total pemasukan uang sewa bulanan'
      ];
      outOfScopeList = [
        'Sistem smart door lock RFID kartu kamar terintegrasi jaringan (fase V2)',
        'Pencatatan meteran listrik token otomatis terhubung PLN',
        'Portal login khusus masing-masing anak kost'
      ];
      primaryMetric = 'Pembayaran sewa tepat waktu naik dari 60% menjadi di atas 90%.';
      secondaryMetric = 'Okupansi kamar kost bertahan stabil di atas 85%.';
      break;

    case 'pos':
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
      break;

    case 'clinic':
      userPersona = 'Resepsionis Pendaftaran & Dokter Pemeriksa yang butuh rekam riwayat medis akurat.';
      problemStatement = 'Buku rekam medis fisik sering terselip, antrean pasien di ruang tunggu menumpuk tidak teratur, serta pasien lupa jadwal kontrol.';
      businessGoal = 'Mengurangi waktu tunggu antrean pasien sebesar 40% dan mencegah kehilangan riwayat diagnosa pengobatan.';
      inScopeList = [
        'Pendaftaran pasien baru & pencarian nomor rekam medis instan',
        'Nomor antrean harian dengan indikator status (Menunggu, Diperiksa, Selesai)',
        'Pencatatan rekam medis: diagnosa, tindakan, obat, dan biaya tindakan Rp',
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
      break;

    case 'laundry':
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
      break;

    case 'crm':
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
      break;

    default:
      userPersona = 'Manajer Operasional & Staf Pelaksana ' + title;
      problemStatement = `Pencatatan dan alur operasional ${title} saat ini masih manual, memerlukan sistem terpusat yang responsif dan mudah digunakan.`;
      businessGoal = `Mendigitalkan alur data ${title} secara menyeluruh untuk meningkatkan kecepatan operasional dan akurasi rekonsiliasi data hingga 80%.`;
      inScopeList = [
        `Formulir input data ${title} yang cepat dan tervalidasi`,
        'Papan status operasional interaktif dengan indikator visual',
        'Perhitungan nominal transaksi / biaya dalam format Rupiah (Rp)',
        'Kemudahan aksi kontak / follow-up via WhatsApp 1-klik',
        'Ekspor ringkasan rekaman data ke spreadsheet'
      ];
      outOfScopeList = [
        'Integrasi sistem enterprise legacy lama (fase V2)',
        'Aplikasi native khusus iOS & Android terpisah di app store',
        'Sistem multi-bahasa internasional'
      ];
      primaryMetric = 'Peningkatan efisiensi waktu kerja operasional tim sebesar 60%.';
      secondaryMetric = 'Tingkat kelengkapan data operasional mencapai 100%.';
      break;
  }

  const features: PRDFunctionalFeature[] = [
    {
      id: 'FR-01',
      description: `Modul Input & Formulir Validasi ${title}`,
      priority: 'Must Have',
      acceptanceCriteria: 'Given pengguna berada pada halaman utama, When mengisi formulir data dan menekan tombol simpan, Then data baru tersimpan di database dan muncul seketika pada antarmuka tanpa reload halaman.'
    },
    {
      id: 'FR-02',
      description: 'Papan Visual Status & Pelacak Progres Alur Kerja',
      priority: 'Must Have',
      acceptanceCriteria: 'Given data memiliki tahapan status tertentu, When staf mengubah status pada kartu item, Then badge status langsung terupdate dengan warna indikator yang sesuai.'
    },
    {
      id: 'FR-03',
      description: 'Integrasi Kontak & Notifikasi WhatsApp 1-Klik',
      priority: 'Should Have',
      acceptanceCriteria: 'Given nomor WhatsApp valid pada data kontak, When tombol WhatsApp ditekan, Then sistem membuka aplikasi/web WhatsApp dengan nomor tujuan dan pesan template otomatis.'
    },
    {
      id: 'FR-04',
      description: 'Ringkasan KPI Dashboard & Kalkulasi Finansial Rupiah (Rp)',
      priority: 'Must Have',
      acceptanceCriteria: 'Given terdapat rekaman data aktif dengan nominal transaksi, When dashboard dibuka, Then seluruh metrik ringkasan terhitung akurat dalam format Rupiah.'
    },
    {
      id: 'FR-05',
      description: 'Ekspor Data ke File Spreadsheet (CSV)',
      priority: 'Could Have',
      acceptanceCriteria: 'Given tabel memiliki data, When tombol Ekspor CSV ditekan, Then file spreadsheet siap olah langsung terunduh ke perangkat pengguna.'
    }
  ];

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
      changelog: 'v1.0.0 — Finalisasi PRD berdasarkan wawancara kebutuhan pengguna. Siap masuk produksi.'
    },
    backgroundObjectives: {
      background: `Berdasarkan wawancara kebutuhan pengguna, ${problemStatement}`,
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
        `Sebagai ${userPersona.split('&')[0].trim()}, saya ingin mencatat data operasional baru dengan cepat agar proses kerja tidak tertunda.`,
        `Sebagai staf pelaksana, saya ingin mengubah status tahapan proses secara visual agar seluruh tim mengetahui progres pekerjaan terkini.`,
        `Sebagai pemilik bisnis/manajer, saya ingin melihat ringkasan metrik kunci secara real-time agar dapat mengambil keputusan bisnis yang tepat.`
      ],
      features
    },
    uxUiRequirements: {
      userFlow: [
        'Langkah 1: Pengguna membuka aplikasi -> Melihat dashboard ringkasan metrik utama.',
        'Langkah 2: Menekan tombol "+ Tambah Data" -> Form modal bersih muncul.',
        'Langkah 3: Mengisi field wajib -> Menekan tombol "Simpan Data".',
        'Langkah 4: Kartu item langsung muncul di papan visual atau tabel utama.',
        'Langkah 5: Melakukan aksi cepat (Ubah Status, Kontak WhatsApp, atau Edit Nilai).'
      ],
      designLinksNotes: 'Desain responsif clean modern dengan palet warna profesional, padding lapang, font terbaca jelas, dot-grid canvas.',
      elementDetails: {
        errorMessaging: 'Pesan validasi tampil inline merah tegas di bawah field jika data wajib belum terisi.',
        actionCopywriting: 'Tombol aksi menggunakan kata kerja aktif yang jelas: "+ Tambah Data", "Simpan", "Kirim WhatsApp".',
        emptyStates: 'Tampilan kosong ramah dengan ikon informatif: "Belum ada rekaman data hari ini. Tekan tombol Tambah untuk memulai."'
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
        'Apakah ke depannya diperlukan hak akses multi-role berbayar (misal: Staf tidak bisa melihat total laba bersih)?',
        'Apakah diperlukan pencatatan riwayat log perubahan data per pengguna?'
      ],
      risksAndMitigations: [
        {
          risk: 'Koneksi internet di lokasi kerja sempat terputus saat jam sibuk operasional.',
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
 * Fully domain-aware: builds the EXACT table schemas, columns, records, metrics, and kanban
 * matching the user's specific industry (Rental, HR, Inventory, Workshop, Clinic, Sports, etc.).
 */
export function convertPRDToLegoApp(
  prd: PRDDocument,
  authorId: string = 'user-bobi',
  orgId: string = 'org-1'
): LegoApp {
  const fullText = [
    prd.metadata.productName,
    prd.backgroundObjectives.background,
    prd.backgroundObjectives.problemStatement,
    prd.userPersonaBusinessLogic.userPersona
  ].join(' ');

  const detected = detectDomainFromText(fullText);

  let category: 'crm' | 'portal' | 'booking' | 'custom' = 'custom';
  let primaryTable: TableDefinition;
  let metrics: MetricCard[];
  let kanban: KanbanConfig | undefined;

  switch (detected.domainKey) {
    case 'rental':
      category = 'booking';
      primaryTable = {
        id: 'rentals',
        name: 'Daftar Sewa & Unit Armada',
        primaryKey: 'id',
        columns: [
          { key: 'noSewa', label: 'No. Sewa', type: 'text', required: true },
          { key: 'unit', label: 'Unit Armada / Alat', type: 'text', required: true },
          { key: 'penyewa', label: 'Nama Penyewa', type: 'text', required: true },
          { key: 'durasi', label: 'Durasi (Hari)', type: 'number', required: true },
          { key: 'totalBiaya', label: 'Total Tarif (Rp)', type: 'currency', required: true },
          { key: 'status', label: 'Status Sewa', type: 'status', options: ['Booking Terkonfirmasi', 'Unit Keluar / Disewa', 'Selesai Kembali', 'Terlambat Denda'] },
          { key: 'whatsapp', label: 'WhatsApp Penyewa', type: 'phone', required: true },
        ],
        records: [
          { id: '1', noSewa: 'RENT-001', unit: 'Avanza Veloz 2023 (B 1234 ABC)', penyewa: 'Bpk. Ridwan', durasi: 3, totalBiaya: 1350000, status: 'Unit Keluar / Disewa', whatsapp: '081299887766' },
          { id: '2', noSewa: 'RENT-002', unit: 'Innova Reborn Diesel (B 5678 XYZ)', penyewa: 'Kak Vina', durasi: 2, totalBiaya: 1600000, status: 'Booking Terkonfirmasi', whatsapp: '081388776655' },
          { id: '3', noSewa: 'RENT-003', unit: 'Honda Brio Matic (B 9012 EFG)', penyewa: 'Mas Dimas', durasi: 1, totalBiaya: 350000, status: 'Selesai Kembali', whatsapp: '081577665544' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Unit Sedang Disewa', value: '1 Unit Keluar', change: 'Avanza Veloz aktif', trend: 'up', icon: 'Car', color: 'blue' },
        { id: 'm2', label: 'Pendapatan Sewa (Rp)', value: 'Rp 3.300.000', change: 'Total 3 transaksi aktif', trend: 'up', icon: 'DollarSign', color: 'green' },
        { id: 'm3', label: 'Booking Mendatang', value: '1 Jadwal', change: 'Unit Innova Reborn', trend: 'neutral', icon: 'Clock', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'rentals',
        statusColumnKey: 'status',
        titleColumnKey: 'unit',
        subtitleColumnKey: 'penyewa',
        valueColumnKey: 'totalBiaya',
        stages: [
          { id: 'Booking Terkonfirmasi', name: 'Booking Jadwal', color: '#3B82F6' },
          { id: 'Unit Keluar / Disewa', name: 'Sedang Disewa', color: '#F59E0B' },
          { id: 'Selesai Kembali', name: 'Kembali Selesai', color: '#10B981' },
          { id: 'Terlambat Denda', name: 'Terlambat / Denda', color: '#EF4444' }
        ]
      };
      break;

    case 'inventory':
      category = 'portal';
      primaryTable = {
        id: 'inventory',
        name: 'Katalog Barang & Stok Gudang',
        primaryKey: 'id',
        columns: [
          { key: 'kodeSku', label: 'Kode SKU', type: 'text', required: true },
          { key: 'namaBarang', label: 'Nama Barang', type: 'text', required: true },
          { key: 'kategori', label: 'Kategori', type: 'badge', options: ['Bahan Bangunan', 'Alat Teknik', 'Elektronik', 'Cat & Finishing'] },
          { key: 'stok', label: 'Jumlah Stok', type: 'number', required: true },
          { key: 'hargaBeli', label: 'Harga Modal (Rp)', type: 'currency' },
          { key: 'hargaJual', label: 'Harga Jual (Rp)', type: 'currency', required: true },
          { key: 'statusStok', label: 'Status Stok', type: 'status', options: ['Stok Aman', 'Stok Menipis', 'Habis'] },
        ],
        records: [
          { id: '1', kodeSku: 'SKU-SMN01', namaBarang: 'Semen Tiga Roda 50kg', kategori: 'Bahan Bangunan', stok: 120, hargaBeli: 62000, hargaJual: 71000, statusStok: 'Stok Aman' },
          { id: '2', kodeSku: 'SKU-CAT02', namaBarang: 'Cat Tembok Dulux Putih 5L', kategori: 'Cat & Finishing', stok: 8, hargaBeli: 145000, hargaJual: 180000, statusStok: 'Stok Menipis' },
          { id: '3', kodeSku: 'SKU-BOR03', namaBarang: 'Mesin Bor Bosch Impact 13mm', kategori: 'Alat Teknik', stok: 0, hargaBeli: 520000, hargaJual: 650000, statusStok: 'Habis' },
          { id: '4', kodeSku: 'SKU-PKU04', namaBarang: 'Paku Beton Baja 3 inch (Kotak)', kategori: 'Bahan Bangunan', stok: 45, hargaBeli: 28000, hargaJual: 36000, statusStok: 'Stok Aman' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Total Aset Stok (Rp)', value: 'Rp 11.230.000', change: 'Nilai inventori gudang', trend: 'up', icon: 'Box', color: 'blue' },
        { id: 'm2', label: 'Perhatian: Stok Menipis', value: '1 Item', change: 'Cat Tembok sisa 8', trend: 'down', icon: 'AlertTriangle', color: 'yellow' },
        { id: 'm3', label: 'Item Habis (Restock)', value: '1 Item', change: 'Mesin Bor Bosch', trend: 'down', icon: 'XCircle', color: 'red' },
      ];
      kanban = {
        enabled: true,
        tableId: 'inventory',
        statusColumnKey: 'statusStok',
        titleColumnKey: 'namaBarang',
        subtitleColumnKey: 'kategori',
        valueColumnKey: 'hargaJual',
        stages: [
          { id: 'Stok Aman', name: 'Stok Aman (>10)', color: '#10B981' },
          { id: 'Stok Menipis', name: 'Menipis (<10)', color: '#F59E0B' },
          { id: 'Habis', name: 'Habis (0)', color: '#EF4444' }
        ]
      };
      break;

    case 'hr':
      category = 'portal';
      primaryTable = {
        id: 'employees',
        name: 'Data Karyawan & Presensi',
        primaryKey: 'id',
        columns: [
          { key: 'nik', label: 'NIK Pegawai', type: 'text', required: true },
          { key: 'nama', label: 'Nama Lengkap', type: 'text', required: true },
          { key: 'divisi', label: 'Divisi / Departemen', type: 'badge', options: ['Operasional', 'Pemasaran', 'Keuangan', 'Teknologi'] },
          { key: 'jabatan', label: 'Jabatan', type: 'text', required: true },
          { key: 'gajiPokok', label: 'Gaji Pokok (Rp)', type: 'currency' },
          { key: 'statusKehadiran', label: 'Status Presensi', type: 'status', options: ['Hadir', 'Izin', 'Cuti Tahunan', 'Alpha'] },
          { key: 'whatsapp', label: 'Nomor WhatsApp', type: 'phone', required: true },
        ],
        records: [
          { id: '1', nik: 'EMP-001', nama: 'Budi Santoso', divisi: 'Operasional', jabatan: 'Supervisor Gudang', gajiPokok: 5500000, statusKehadiran: 'Hadir', whatsapp: '081234567891' },
          { id: '2', nik: 'EMP-002', nama: 'Siti Rahma', divisi: 'Keuangan', jabatan: 'Staf Akunting', gajiPokok: 4800000, statusKehadiran: 'Hadir', whatsapp: '081234567892' },
          { id: '3', nik: 'EMP-003', nama: 'Fajar Nugraha', divisi: 'Pemasaran', jabatan: 'Field Officer', gajiPokok: 4500000, statusKehadiran: 'Izin', whatsapp: '081234567893' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Tingkat Kehadiran', value: '92%', change: '2 Hadir, 1 Izin hari ini', trend: 'up', icon: 'UserCheck', color: 'green' },
        { id: 'm2', label: 'Total Staf Aktif', value: '3 Pegawai', change: 'Semua terverifikasi', trend: 'neutral', icon: 'Users', color: 'blue' },
        { id: 'm3', label: 'Beban Payroll Bulanan', value: 'Rp 14.800.000', change: 'Estimasi gaji berjalan', trend: 'neutral', icon: 'CreditCard', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'employees',
        statusColumnKey: 'statusKehadiran',
        titleColumnKey: 'nama',
        subtitleColumnKey: 'jabatan',
        valueColumnKey: 'gajiPokok',
        stages: [
          { id: 'Hadir', name: 'Hadir Bekerja', color: '#10B981' },
          { id: 'Izin', name: 'Izin Resmi', color: '#3B82F6' },
          { id: 'Cuti Tahunan', name: 'Cuti Tahunan', color: '#F59E0B' },
          { id: 'Alpha', name: 'Alpha / Tanpa Kabar', color: '#EF4444' }
        ]
      };
      break;

    case 'sports_booking':
      category = 'booking';
      primaryTable = {
        id: 'bookings',
        name: 'Jadwal Booking Lapangan',
        primaryKey: 'id',
        columns: [
          { key: 'kodeBooking', label: 'Kode Booking', type: 'text', required: true },
          { key: 'lapangan', label: 'Lapangan', type: 'badge', options: ['Lapangan 1 (Vinyl A)', 'Lapangan 2 (Rumput Sintetis)', 'Lapangan 3 (Badminton)'] },
          { key: 'penyewa', label: 'Nama Pemesan / Tim', type: 'text', required: true },
          { key: 'slotJam', label: 'Slot Jam Main', type: 'text', required: true },
          { key: 'totalBiaya', label: 'Total Tarif (Rp)', type: 'currency', required: true },
          { key: 'status', label: 'Status Booking', type: 'status', options: ['Menunggu DP', 'Terkonfirmasi Lunas', 'Sedang Main', 'Selesai'] },
          { key: 'whatsapp', label: 'WhatsApp Pemesan', type: 'phone', required: true },
        ],
        records: [
          { id: '1', kodeBooking: 'FUT-101', lapangan: 'Lapangan 1 (Vinyl A)', penyewa: 'FC Garuda Jaya', slotJam: '19:00 - 21:00 (2 Jam)', totalBiaya: 350000, status: 'Terkonfirmasi Lunas', whatsapp: '081211223344' },
          { id: '2', kodeBooking: 'FUT-102', lapangan: 'Lapangan 2 (Rumput Sintetis)', penyewa: 'Komunitas Alumni 2018', slotJam: '21:00 - 23:00 (2 Jam)', totalBiaya: 400000, status: 'Menunggu DP', whatsapp: '081255667788' },
          { id: '3', kodeBooking: 'FUT-103', lapangan: 'Lapangan 3 (Badminton)', penyewa: 'Bpk. Surya', slotJam: '17:00 - 18:00 (1 Jam)', totalBiaya: 80000, status: 'Selesai', whatsapp: '081399881122' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Jam Tersewa Hari Ini', value: '5 Jam Main', change: 'Okupansi lapangan 78%', trend: 'up', icon: 'Clock', color: 'blue' },
        { id: 'm2', label: 'Omset Booking Hari Ini', value: 'Rp 830.000', change: 'Total dari 3 jadwal', trend: 'up', icon: 'DollarSign', color: 'green' },
        { id: 'm3', label: 'Menunggu Pelunasan', value: '1 Pemesan', change: 'FC Garuda DP Rp 100rb', trend: 'neutral', icon: 'AlertCircle', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'bookings',
        statusColumnKey: 'status',
        titleColumnKey: 'penyewa',
        subtitleColumnKey: 'slotJam',
        valueColumnKey: 'totalBiaya',
        stages: [
          { id: 'Menunggu DP', name: 'Menunggu DP', color: '#EF4444' },
          { id: 'Terkonfirmasi Lunas', name: 'Terkonfirmasi', color: '#3B82F6' },
          { id: 'Sedang Main', name: 'Sedang Main', color: '#F59E0B' },
          { id: 'Selesai', name: 'Selesai Main', color: '#10B981' }
        ]
      };
      break;

    case 'workshop_service':
      category = 'portal';
      primaryTable = {
        id: 'services',
        name: 'Tiket Servis & Pengerjaan',
        primaryKey: 'id',
        columns: [
          { key: 'noTiket', label: 'No. Tiket', type: 'text', required: true },
          { key: 'unit', label: 'Perangkat / Kendaraan', type: 'text', required: true },
          { key: 'pemilik', label: 'Nama Pemilik', type: 'text', required: true },
          { key: 'keluhan', label: 'Keluhan Kerusakan', type: 'text', required: true },
          { key: 'biaya', label: 'Estimasi Biaya (Rp)', type: 'currency' },
          { key: 'status', label: 'Status Pengerjaan', type: 'status', options: ['Antrean Masuk', 'Pengecekan / Diagnosa', 'Menunggu Sparepart', 'Selesai Siap Ambil', 'Sudah Diambil'] },
          { key: 'whatsapp', label: 'WhatsApp Pemilik', type: 'phone', required: true },
        ],
        records: [
          { id: '1', noTiket: 'SRV-801', unit: 'Honda Vario 150 (B 4567 XYZ)', pemilik: 'Pak Hendra', keluhan: 'Ganti vanbelt & servis CVT bergetar', biaya: 285000, status: 'Selesai Siap Ambil', whatsapp: '081299887711' },
          { id: '2', noTiket: 'SRV-802', unit: 'Yamaha NMAX (B 8901 ABC)', pemilik: 'Mas Arya', keluhan: 'Rem belakang blong & ganti oli mesin', biaya: 175000, status: 'Pengecekan / Diagnosa', whatsapp: '081377889922' },
          { id: '3', noTiket: 'SRV-803', unit: 'Honda Beat FI (B 2345 DEF)', pemilik: 'Mba Cindy', keluhan: 'Aki tekor & ganti bohlam lampu depan', biaya: 320000, status: 'Antrean Masuk', whatsapp: '081566778833' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Siap Diambil Pemilik', value: '1 Unit', change: 'Notifikasi WA terkirim', trend: 'up', icon: 'CheckCircle2', color: 'green' },
        { id: 'm2', label: 'Dalam Pengerjaan', value: '2 Kendaraan', change: 'Teknisi aktif bekerja', trend: 'neutral', icon: 'Wrench', color: 'blue' },
        { id: 'm3', label: 'Omset Servis Hari Ini', value: 'Rp 780.000', change: 'Total estimasi biaya', trend: 'up', icon: 'DollarSign', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'services',
        statusColumnKey: 'status',
        titleColumnKey: 'unit',
        subtitleColumnKey: 'keluhan',
        valueColumnKey: 'biaya',
        stages: [
          { id: 'Antrean Masuk', name: 'Antrean Masuk', color: '#94A3B8' },
          { id: 'Pengecekan / Diagnosa', name: 'Sedang Diagnosa', color: '#3B82F6' },
          { id: 'Menunggu Sparepart', name: 'Tunggu Part', color: '#F59E0B' },
          { id: 'Selesai Siap Ambil', name: 'Siap Diambil', color: '#10B981' },
          { id: 'Sudah Diambil', name: 'Selesai', color: '#64748B' }
        ]
      };
      break;

    case 'property':
      category = 'booking';
      primaryTable = {
        id: 'rooms',
        name: 'Daftar Kamar & Penghuni Kost',
        primaryKey: 'id',
        columns: [
          { key: 'noKamar', label: 'Nomor Kamar', type: 'text', required: true },
          { key: 'tipe', label: 'Tipe Kamar', type: 'badge', options: ['VIP AC + KM Dalam', 'Standar AC', 'Reguler Kipas'] },
          { key: 'penghuni', label: 'Nama Penghuni', type: 'text' },
          { key: 'tarifBulanan', label: 'Harga Sewa / Bln (Rp)', type: 'currency', required: true },
          { key: 'tglMulai', label: 'Mulai Sewa', type: 'date' },
          { key: 'status', label: 'Status Kamar', type: 'status', options: ['Terisi', 'Kosong Siap Huni', 'Jatuh Tempo Bayar', 'Booking / DP'] },
          { key: 'whatsapp', label: 'WhatsApp Penghuni', type: 'phone' },
        ],
        records: [
          { id: '1', noKamar: 'Kamar 101 (Lt. 1)', tipe: 'VIP AC + KM Dalam', penghuni: 'Mas Rian Pratama', tarifBulanan: 1650000, tglMulai: '2026-01-10', status: 'Terisi', whatsapp: '081288990011' },
          { id: '2', noKamar: 'Kamar 102 (Lt. 1)', tipe: 'VIP AC + KM Dalam', penghuni: 'Kak Dita Anggraini', tarifBulanan: 1650000, tglMulai: '2026-02-01', status: 'Jatuh Tempo Bayar', whatsapp: '081377889922' },
          { id: '3', noKamar: 'Kamar 201 (Lt. 2)', tipe: 'Standar AC', penghuni: '-', tarifBulanan: 1250000, tglMulai: '', status: 'Kosong Siap Huni', whatsapp: '' },
          { id: '4', noKamar: 'Kamar 202 (Lt. 2)', tipe: 'Standar AC', penghuni: 'Ananda Bagas', tarifBulanan: 1250000, tglMulai: '2026-03-01', status: 'Booking / DP', whatsapp: '081566778899' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Tingkat Okupansi', value: '75%', change: '3 terisi dari 4 kamar', trend: 'up', icon: 'Home', color: 'green' },
        { id: 'm2', label: 'Estimasi Omset / Bulan', value: 'Rp 4.550.000', change: 'Total pendapatan sewa', trend: 'up', icon: 'DollarSign', color: 'blue' },
        { id: 'm3', label: 'Kamar Siap Huni', value: '1 Kamar Kosong', change: 'Kamar 201 Lt. 2', trend: 'neutral', icon: 'Key', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'rooms',
        statusColumnKey: 'status',
        titleColumnKey: 'noKamar',
        subtitleColumnKey: 'penghuni',
        valueColumnKey: 'tarifBulanan',
        stages: [
          { id: 'Kosong Siap Huni', name: 'Kosong (Siap Huni)', color: '#3B82F6' },
          { id: 'Booking / DP', name: 'Booking / DP', color: '#F59E0B' },
          { id: 'Terisi', name: 'Terisi Aktif', color: '#10B981' },
          { id: 'Jatuh Tempo Bayar', name: 'Jatuh Tempo Tagihan', color: '#EF4444' }
        ]
      };
      break;

    case 'pos':
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
      break;

    case 'clinic':
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
      break;

    case 'laundry':
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
      break;

    case 'crm':
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
        ]
      };
      metrics = [
        { id: 'm1', label: 'Total Nilai Pipeline', value: 'Rp 38.000.000', change: '+25% bulan ini', trend: 'up', icon: 'Target', color: 'blue' },
        { id: 'm2', label: 'Closing Deal', value: 'Rp 18.500.000', change: 'Proposal disetujui', trend: 'up', icon: 'CheckCircle2', color: 'green' },
        { id: 'm3', label: 'Prospek Aktif', value: '2 Akun', change: 'Follow up hari ini', trend: 'neutral', icon: 'Users', color: 'yellow' },
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
      break;

    default: {
      // Dynamic Custom Synthesizer based on PRD title
      const cleanSubject = prd.metadata.productName.replace(/aplikasi|sistem|web|portal/gi, '').trim() || 'Item Operasional';
      category = 'custom';
      primaryTable = {
        id: 'records',
        name: `Data ${cleanSubject}`,
        primaryKey: 'id',
        columns: [
          { key: 'kode', label: 'Kode / ID', type: 'text', required: true },
          { key: 'nama', label: `Nama ${cleanSubject}`, type: 'text', required: true },
          { key: 'penanggungJawab', label: 'Penanggung Jawab', type: 'text' },
          { key: 'nilai', label: 'Nilai / Biaya (Rp)', type: 'currency' },
          { key: 'status', label: 'Status Pengerjaan', type: 'status', options: ['Terdaftar / Baru', 'Dalam Proses', 'Selesai', 'Diarsipkan'] },
          { key: 'whatsapp', label: 'Kontak WhatsApp', type: 'phone', required: true },
        ],
        records: [
          { id: '1', kode: 'REC-001', nama: `${cleanSubject} Utama`, penanggungJawab: 'Staf Operasional A', nilai: 1500000, status: 'Dalam Proses', whatsapp: '081234567890' },
          { id: '2', kode: 'REC-002', nama: `${cleanSubject} Tambahan`, penanggungJawab: 'Staf Operasional B', nilai: 2750000, status: 'Terdaftar / Baru', whatsapp: '081234567891' },
          { id: '3', kode: 'REC-003', nama: `${cleanSubject} Prioritas`, penanggungJawab: 'Supervisor', nilai: 850000, status: 'Selesai', whatsapp: '081234567892' },
        ]
      };
      metrics = [
        { id: 'm1', label: `Total ${cleanSubject}`, value: '3 Data', change: 'Aktif di sistem', trend: 'up', icon: 'Layers', color: 'blue' },
        { id: 'm2', label: 'Total Nominal (Rp)', value: 'Rp 5.100.000', change: 'Terkalkulasi otomatis', trend: 'up', icon: 'DollarSign', color: 'green' },
        { id: 'm3', label: 'Dalam Pengerjaan', value: '1 Item', change: 'Status aktif', trend: 'neutral', icon: 'Clock', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'records',
        statusColumnKey: 'status',
        titleColumnKey: 'nama',
        subtitleColumnKey: 'penanggungJawab',
        valueColumnKey: 'nilai',
        stages: [
          { id: 'Terdaftar / Baru', name: 'Baru Terdaftar', color: '#3B82F6' },
          { id: 'Dalam Proses', name: 'Sedang Proses', color: '#F59E0B' },
          { id: 'Selesai', name: 'Selesai', color: '#10B981' },
          { id: 'Diarsipkan', name: 'Diarsipkan', color: '#94A3B8' }
        ]
      };
      break;
    }
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
