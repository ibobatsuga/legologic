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
  | 'profile'           // 1. Website Profile
  | 'news'              // 2. Website Berita / Media Online
  | 'ecommerce'         // 3. Web Toko Online
  | 'marketplace'       // 4. Web Marketplace/Jual Beli
  | 'classifieds'       // 5. Web Iklan Baris
  | 'academic'          // 6. Web Sistem Informasi Akademik (SIA)
  | 'forum'             // 7. Web Forum
  | 'radio_streaming'   // 8. Web Radio Streaming
  | 'landingpage'       // 9. Web Landingpage
  | 'ppdb'              // 10. Web PPDB
  | 'ppob'              // 11. Web PPOB
  | 'jobportal'         // 12. Web Lowongan Kerja
  | 'corporate'         // 13. Website Perusahaan
  | 'government'        // 14. Website Pemerintah
  | 'village'           // 16. Website Desa
  | 'school'            // 18. Web Sekolah
  | 'rental'            // 17. Web Rental Mobil
  | 'android_pwa'       // 19. Aplikasi Android
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
 * Covers all requested website types (Profile, Berita, Toko Online, Marketplace, 
 * Iklan Baris, SIA, Forum, Radio Streaming, Landingpage, PPDB, PPOB, Loker, 
 * Perusahaan, Pemerintah, Desa, Rental Mobil, Sekolah, Android).
 */
export function detectDomainFromText(text: string): { domainKey: SupportedDomain; domainName: string; defaultTitle: string } {
  const lower = text.toLowerCase();

  // 1. Web Radio Streaming
  if (/radio|streaming radio|siaran audio|on-air|broadcast radio|radio online/i.test(lower)) {
    return { domainKey: 'radio_streaming', domainName: 'Web Radio Streaming & Audio Siaran', defaultTitle: 'Radio Streaming Online & Jadwal Siaran' };
  }
  // 2. Web PPDB (Penerimaan Peserta Didik Baru)
  if (/ppdb|penerimaan siswa baru|pendaftaran santri baru|psb online|seleksi calon siswa/i.test(lower)) {
    return { domainKey: 'ppdb', domainName: 'Sistem PPDB (Penerimaan Peserta Didik Baru)', defaultTitle: 'Portal Seleksi PPDB Online Sekolah' };
  }
  // 3. Web PPOB (Pulsa, Token, Tagihan)
  if (/ppob|pulsa|token pln|bayar tagihan|bpjs|pdam|loket pembayaran|agen pulsa/i.test(lower)) {
    return { domainKey: 'ppob', domainName: 'Web Loket PPOB & Pembayaran Tagihan', defaultTitle: 'Loket PPOB & Pembayaran Tagihan Online' };
  }
  // 4. Web Sistem Informasi Akademik (SIA / SIAKAD)
  if (/siakad|sia|informasi akademik|krs online|kartu rencana studi|khs|transkrip nilai|perkuliahan/i.test(lower)) {
    return { domainKey: 'academic', domainName: 'Sistem Informasi Akademik (SIAKAD)', defaultTitle: 'Sistem Informasi Akademik (SIAKAD)' };
  }
  // 5. Web Iklan Baris
  if (/iklan baris|classified|pasang iklan|baris iklan|iklan gratis/i.test(lower)) {
    return { domainKey: 'classifieds', domainName: 'Web Iklan Baris & Classified Ads', defaultTitle: 'Portal Pasang Iklan Baris Online' };
  }
  // 6. Web Forum / Komunitas
  if (/forum|thread|diskusi komunitas|tanya jawab komunitas|forum online|board diskusi/i.test(lower)) {
    return { domainKey: 'forum', domainName: 'Web Forum Diskusi & Komunitas Online', defaultTitle: 'Forum Diskusi & Komunitas Digital' };
  }
  // 7. Web Marketplace / Jual Beli
  if (/marketplace|jual beli|multi-seller|multi vendor|lapak penjual|buka lapak/i.test(lower)) {
    return { domainKey: 'marketplace', domainName: 'Web Marketplace & Jual Beli Multi-Vendor', defaultTitle: 'Platform Marketplace Jual Beli' };
  }
  // 8. Website Berita / Media Online
  if (/berita|media online|portal berita|koran online|jurnalistik|redaksi|artikel/i.test(lower)) {
    return { domainKey: 'news', domainName: 'Website Berita & Media Online', defaultTitle: 'Portal Berita & Media Online Terkini' };
  }
  // 9. Web Lowongan Kerja (Job Portal)
  if (/lowongan kerja|loker|job portal|job board|karir|rekrutmen|pelamar kerja/i.test(lower)) {
    return { domainKey: 'jobportal', domainName: 'Portal Lowongan Kerja & Karir', defaultTitle: 'Portal Lowongan Kerja & Rekrutmen' };
  }
  // 10. Website Desa
  if (/desa|kelurahan|apbdes|pamong desa|surat desa|kades|dusun|warga desa/i.test(lower)) {
    return { domainKey: 'village', domainName: 'Website Desa & Pelayanan Surat Warga', defaultTitle: 'Sistem Informasi Desa & Layanan Warga' };
  }
  // 11. Website Pemerintah
  if (/pemerintah|dinas|instansi|pemda|pemprov|pemkab|kementerian|layanan publik/i.test(lower)) {
    return { domainKey: 'government', domainName: 'Website Resmi Pemerintah & Layanan Publik', defaultTitle: 'Portal Resmi Pemerintah & Layanan Publik' };
  }
  // 12. Web Sekolah
  if (/sekolah|smp|sma|smk|sd|madrasah|portal sekolah|web sekolah/i.test(lower)) {
    return { domainKey: 'school', domainName: 'Website Resmi Sekolah & Portal Informasi', defaultTitle: 'Website Resmi Sekolah & Portal Informasi' };
  }
  // 13. Website Perusahaan (Corporate)
  if (/perusahaan|corporate|holding|pt |cv |profil perusahaan|company profile/i.test(lower)) {
    return { domainKey: 'corporate', domainName: 'Website Resmi Perusahaan (Corporate Site)', defaultTitle: 'Website Resmi Korporat & Layanan Bisnis' };
  }
  // 14. Website Profile (Personal / Usaha)
  if (/profile|profil|portofolio|portfolio|biodata/i.test(lower)) {
    return { domainKey: 'profile', domainName: 'Website Profile & Portofolio Profesional', defaultTitle: 'Website Profil Profesional & Portofolio' };
  }
  // 15. Web Landingpage
  if (/landingpage|landing page|sales page|penawaran produk|lead magnet/i.test(lower)) {
    return { domainKey: 'landingpage', domainName: 'Web Landing Page & Sales Funnel', defaultTitle: 'Landing Page Konversi & Penawaran Produk' };
  }
  // 16. Web Toko Online / E-commerce
  if (/toko online|olshop|ecommerce|e-commerce|keranjang belanja|katalog jualan/i.test(lower)) {
    return { domainKey: 'ecommerce', domainName: 'Web Toko Online & Belanja Digital', defaultTitle: 'Toko Online & Checkout Belanja' };
  }
  // 17. Aplikasi Android (PWA / Mobile)
  if (/android|apk|mobile app|pwa|aplikasi hp|aplikasi smartphone/i.test(lower)) {
    return { domainKey: 'android_pwa', domainName: 'Aplikasi Android Mobile-First (PWA)', defaultTitle: 'Aplikasi Bisnis Android Mobile-First' };
  }
  // 18. Rental Mobil & Kendaraan
  if (/rental|sewa mobil|sewa motor|rent car|sewa kamera|sewa gaun|sewa tenda|sewa alat/i.test(lower)) {
    return { domainKey: 'rental', domainName: 'Rental & Persewaan Kendaraan/Alat', defaultTitle: 'Sistem Rental & Manajemen Unit Sewa' };
  }
  // Other specialized domains
  if (/absen|presensi|karyawan|hr|payroll|gaji|cuti|kepegawaian/i.test(lower)) {
    return { domainKey: 'hr', domainName: 'HR, Presensi & Manajemen Karyawan', defaultTitle: 'Portal Karyawan & Presensi Kerja' };
  }
  if (/inventori|inventory|stok|gudang|toko bangunan|sparepart|grosir|sembako/i.test(lower)) {
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
  if (/bimbel|les|kursus|santri|pesantren|murid|siswa|spp/i.test(lower)) {
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
 * Analyzes whether the user's prompt contains enough information to build a minimum viable PRD.
 */
export function analyzePromptCompleteness(
  prompt: string, 
  history: { sender: string; text: string }[] = []
): CompletenessResult {
  const allText = [prompt, ...history.map(h => h.text)].join(' ').toLowerCase();

  const hasPersona = /pengguna|user|persona|kasir|barista|dokter|pasien|pelanggan|admin|owner|staf|klien|sales|pembeli|karyawan|penyewa|penghuni|sopir|warga|masyarakat|pembaca|siswa|guru|pendengar|pelamar/i.test(allText);
  const hasObjectives = /tujuan|masalah|omset|konversi|efisiensi|pencatatan|problem|goal|latar belakang|background/i.test(allText);
  const hasScope = /fitur|scope|in-scope|out-of-scope|wajib|hanya|termasuk|tidak termasuk|tunda|mvp/i.test(allText);
  const hasBusinessRules = /aturan|batasan|rules|qris|tunai|diskon|pajak|stok|harga|rp|persen|validasi|status|sewa|tarif|kuota|zonasi/i.test(allText);
  const hasFunctionalDetails = /tabel|data|form|laporan|riwayat|cetak|input|notifikasi|whatsapp|export|filter|siaran|artikel|berkas|surat/i.test(allText);
  
  let score = 25;
  const missingItems: string[] = [];

  if (hasPersona) score += 20;
  else missingItems.push('Target Persona (Siapa pengguna utama & pengunjung)');

  if (hasObjectives) score += 15;
  else missingItems.push('Latar Belakang & Masalah Pokok yang ingin diselesaikan');

  if (hasScope) score += 15;
  else missingItems.push('Batasan Lingkup (Fitur rilis pertama vs yang ditunda)');

  if (hasBusinessRules) score += 15;
  else missingItems.push('Aturan Bisnis & Logika Transaksi/Alur Kerja');

  if (hasFunctionalDetails) score += 15;
  else missingItems.push('Detail Fungsional (Kebutuhan form input & tampilan output)');

  const detected = detectDomainFromText(allText);
  const domain = detected.domainName;
  const suggestedTitle = detected.defaultTitle;
  let quickReplies: string[] = [];
  let interviewQuestions: string[] = [];

  switch (detected.domainKey) {
    case 'radio_streaming':
      interviewQuestions = [
        'Bagaimana format siaran radio (apakah ada stream audio URL live langsung dan pemutar audio player)?',
        'Siapa penyiar / program yang terjadwal (pagi, siang, sore, malam) dan apakah pendengar bisa kirim request lagu via WhatsApp?',
        'Fitur apa yang masuk In-Scope rilis pertama (pemutar audio, jadwal siaran live, form request lagu) vs Out-of-Scope (rekaman podcast arsip besar)?',
        'Apa metrik kesuksesan utama (jumlah pendengar streaming aktif bersamaan, request lagu masuk)?'
      ];
      quickReplies = [
        'Pemutar audio streaming online, jadwal program on-air, request WhatsApp',
        'Halaman live audio player, daftar penyiar, banner sponsor iklan radio',
        'In-Scope: streaming langsung & jadwal siaran. Arsip podcast tunda V2',
        'Data sudah cukup, langsung susunkan PRD lengkap!'
      ];
      break;

    case 'ppdb':
      interviewQuestions = [
        'Jenjang sekolah apa yang dibuka (SD, SMP, SMA, SMK, atau Pesantren) dan jalur masuk apa saja (Zonasi, Prestasi, Afirmasi)?',
        'Berkas apa saja yang wajib diunggah (Kartu Keluarga, Akta Kelahiran, Nilai Rapor/Ijazah)?',
        'Bagaimana alur seleksi (Pendaftaran -> Verifikasi Berkas Panitia -> Pengumuman Lolos -> Daftar Ulang)?',
        'Fitur apa yang masuk In-Scope rilis awal vs Out-of-Scope (tes ujian online CAT)?'
      ];
      quickReplies = [
        'Formulir pendaftaran, jalur zonasi & prestasi, pengumuman status seleksi',
        'Verifikasi berkas oleh panitia PPDB, notifikasi kelolosan via WhatsApp',
        'MVP: pendaftaran & verifikasi berkas. Ujian online CBT tunda ke V2',
        'Data sudah lengkap, langsung buatkan PRD sekarang!'
      ];
      break;

    case 'ppob':
      interviewQuestions = [
        'Layanan pembayaran apa saja yang disediakan (Token PLN, Pulsa & Kuota, Tagihan BPJS, PDAM, Top-up E-Wallet)?',
        'Siapa pengguna utama (Pelanggan umum yang bayar langsung di web atau Agen loket PPOB)?',
        'Bagaimana skema margin keuntungan admin (misal: biaya admin Rp 2.500 per transaksi)?',
        'Fitur apa yang masuk In-Scope rilis pertama (pilih produk, cek tagihan, bayar QRIS, cetak struk WA)?'
      ];
      quickReplies = [
        'Beli pulsa, token PLN, bayar BPJS/PDAM, biaya admin otomatis Rp',
        'Cek tagihan online, pembayaran instan QRIS, cetak struk via WhatsApp',
        'Fokus loket kasir PPOB retail, saldo deposit keagenan tunda ke V2',
        'Data sudah cukup, buatkan PRD sekarang!'
      ];
      break;

    case 'academic':
      interviewQuestions = [
        'Apakah sistem ini untuk Kampus / Perguruan Tinggi (KRS & SKS) atau Sekolah (Rapor & Jadwal Pelajaran)?',
        'Siapa pengguna sistem (Mahasiswa/Siswa, Dosen PA / Guru, dan Bagian Akademik)?',
        'Bagaimana alur pengisian KRS dan penerbitan KHS nilai semester?',
        'Fitur apa yang wajib masuk In-Scope rilis pertama vs Out-of-Scope (pembayaran SPP autodebet bank)?'
      ];
      quickReplies = [
        'KRS online, jadwal kuliah, persetujuan Dosen PA, transkrip nilai KHS',
        'Data mahasiswa, mata kuliah, dosen pengampu, input nilai akhir A/B/C',
        'In-Scope: KRS & input nilai. Pembayaran virtual account tunda V2',
        'Data sudah lengkap, susunkan PRD sekarang!'
      ];
      break;

    case 'classifieds':
      interviewQuestions = [
        'Kategori iklan baris apa saja yang dibuka (Properti, Kendaraan, Lowongan, Jasa, Elektronik)?',
        'Apakah pemasangan iklan butuh verifikasi nomor WhatsApp dan moderasi admin sebelum tayang?',
        'Informasi apa yang wajib diisi pengiklan (Judul, deskripsi singkat, harga penawaran Rp, kota, nomor WA)?',
        'Fitur apa yang masuk In-Scope rilis awal (pencarian kota, pasang iklan, kontak WA langsung)?'
      ];
      quickReplies = [
        'Pasang iklan baris, kategori properti/kendaraan, hubungi via WhatsApp',
        'Pencarian filter per kota, moderasi admin, status tayang vs laku',
        'In-Scope: pasang & cari iklan. Fitur sundul berbayar tunda ke V2',
        'Data sudah cukup, langsung susunkan PRD!'
      ];
      break;

    case 'forum':
      interviewQuestions = [
        'Topik komunitas apa yang dibahas dan kategori kanal apa saja yang tersedia?',
        'Siapa pengguna forum (Anggota komunitas terdaftar, Moderator, dan Tamu pembaca)?',
        'Bagaimana aturan posting (apakah ada verifikasi konten bebas spam dan fitur pinned topik pengumuman)?',
        'Fitur apa yang wajib masuk In-Scope rilis awal vs Out-of-Scope (reputasi badges & karma gamification)?'
      ];
      quickReplies = [
        'Buat thread diskusi, kategori topik, balas komentar, pinned pengumuman',
        'Forum tanya jawab, filter topik terhangat, tombol bagikan ke WhatsApp',
        'MVP: posting & diskusi thread. Sistem badge reputasi tunda ke V2',
        'Data sudah lengkap, buatkan PRD sekarang!'
      ];
      break;

    case 'marketplace':
      interviewQuestions = [
        'Produk apa yang diperjualbelikan (produk fisik, kerajinan lokal, jasa, barang bekas berkualitas)?',
        'Bagaimana interaksi transaksi (apakah pembeli langsung checkout WhatsApp ke penjual atau via rekening bersama)?',
        'Informasi apa yang dicatat pada tiap lapak toko (Nama lapak, kota penjual, katalog barang, kontak WA)?',
        'Fitur apa yang masuk In-Scope rilis pertama (katalog multi-penjual, filter kota, tombol order WA)?'
      ];
      quickReplies = [
        'Multi-penjual, katalog lapak, harga Rp, tombol beli langsung via WhatsApp',
        'Daftar toko terverifikasi, pencarian kategori barang, filter kota asal',
        'MVP: direktori lapak & order WA. Rekening escrow payment tunda V2',
        'Data sudah cukup, langsung susunkan PRD!'
      ];
      break;

    case 'news':
      interviewQuestions = [
        'Kategori rubrik berita apa saja yang disajikan (Nasional, Bisnis, Hiburan, Olahraga, Teknologi)?',
        'Siapa pengguna sistem (Wartawan/Penulis draf, Editor pemeriksa, dan Pembaca umum)?',
        'Bagaimana alur publikasi redaksi (Draft Wartawan -> Review Editor -> Terbit Tayang -> Arsip)?',
        'Fitur apa yang masuk In-Scope (baca berita, kategori rubrik, berita populer, bagikan ke WA)?'
      ];
      quickReplies = [
        'Rubrik berita, alur redaksi editor, berita terkini, share WhatsApp',
        'Portal berita responsif, pencarian artikel, tampilan mobile-first',
        'In-Scope: portal berita & manajemen redaksi. Paywall langganan tunda V2',
        'Data sudah lengkap, susunkan PRD sekarang!'
      ];
      break;

    case 'jobportal':
      interviewQuestions = [
        'Bidang pekerjaan apa yang dimuat (UMKM lokal, IT & kreatif, pabrik/operasional, perhotelan)?',
        'Siapa pengguna portal (Perusahaan pemasang loker, Pencari kerja / Pelamar, dan Admin)?',
        'Informasi apa yang wajib ada di setiap loker (Posisi, nama perusahaan, kisaran gaji Rp, lokasi, syarat)?',
        'Bagaimana alur pelamar (Lamar via form + kirim CV / kirim lamaran langsung ke WhatsApp HRD)?'
      ];
      quickReplies = [
        'Daftar loker, kisaran gaji Rp, lokasi kerja, kirim lamaran via WhatsApp',
        'Perusahaan pasang loker, status lamaran, filter posisi & pendidikan',
        'MVP: direktori loker & kontak HRD. Tes asesmen online tunda ke V2',
        'Data sudah cukup, langsung buatkan PRD!'
      ];
      break;

    case 'village':
      interviewQuestions = [
        'Pelayanan surat apa saja yang paling sering diajukan warga (SKCK, Keterangan Domisili, Keterangan Usaha, Surat Tidak Mampu)?',
        'Informasi apa yang dicatat pada pengajuan warga (Nama, NIK, Dusun/RT/RW, keperluan surat, WhatsApp)?',
        'Bagaimana alur pengurusan (Warga ajukan online -> Verifikasi Kepala Dusun -> TTD Kades -> Siap Ambil)?',
        'Fitur apa yang masuk In-Scope rilis awal (pelayanan surat online, berita desa, transparansi APBDes)?'
      ];
      quickReplies = [
        'Pengajuan surat online warga, verifikasi pamong desa, kabar desa',
        'Form surat pengantar, tracking status surat, notifikasi WA siap ambil',
        'In-Scope: pelayanan surat & profil desa. Integrasi e-KTP card tunda V2',
        'Data sudah lengkap, susunkan PRD sekarang!'
      ];
      break;

    case 'government':
      interviewQuestions = [
        'Instansi pemerintah atau dinas apa yang dinaungi dan layanan publik utama apa yang disajikan?',
        'Bagaimana alur pengaduan / aspirasi masyarakat (Tiket aduan -> Verifikasi petugas -> Tindak lanjut)?',
        'Informasi keterbukaan informasi apa yang ditampilkan (transparansi program, jadwal pelayanan, kontak dinas)?',
        'Fitur apa yang masuk In-Scope (portal informasi dinas, pengajuan izin/layanan, kontak call center)?'
      ];
      quickReplies = [
        'Portal resmi dinas, permohonan layanan publik, aduan aspirasi warga',
        'Agenda pimpinan, standar pelayanan, transparansi anggaran publik',
        'MVP: portal dinas & pengaduan masyarakat. Integrasi SSO pusat tunda V2',
        'Data sudah lengkap, langsung susunkan PRD!'
      ];
      break;

    case 'school':
      interviewQuestions = [
        'Informasi apa saja yang wajib ditampilkan (Profil visi-misi, daftar guru & staf, agenda kegiatan, pengumuman sekolah)?',
        'Siapa pengunjung utama (Wali murid, Siswa, Calon siswa baru, dan Masyarakat umum)?',
        'Apakah perlu formulir kontak pengaduan / pertanyaan langsung ke nomor WhatsApp sekolah?',
        'Fitur apa yang masuk In-Scope (profil sekolah, agenda kegiatan, galeri prestasi, berita sekolah)?'
      ];
      quickReplies = [
        'Profil sekolah, daftar guru & tenaga pendidik, agenda & pengumuman',
        'Galeri prestasi siswa, berita sekolah terkini, kontak resmi WhatsApp',
        'In-Scope: portal sekolah lengkap. E-learning ujian online tunda ke V2',
        'Data sudah cukup, buatkan PRD sekarang!'
      ];
      break;

    case 'corporate':
      interviewQuestions = [
        'Bidang industri apa yang dijalankan perusahaan (konstruksi, manufaktur, teknologi, agrobisnis)?',
        'Apa saja layanan / portofolio proyek unggulan yang ingin ditonjolkan kepada klien bisnis (B2B)?',
        'Bagaimana alur calon klien menghubungi (Formulir permintaan proposal / konsultasi via WhatsApp resmi)?',
        'Fitur apa yang masuk In-Scope (profil perusahaan, portofolio proyek, rincian layanan, profil direksi)?'
      ];
      quickReplies = [
        'Profil korporat, katalog portofolio proyek, form permintaan proposal B2B',
        'Layanan perusahaan, sertifikasi ISO, kontak kantor & legalitas',
        'In-Scope: company profile & B2B inquiry. Sistem tender e-procurement tunda V2',
        'Data sudah lengkap, susunkan PRD sekarang!'
      ];
      break;

    case 'profile':
      interviewQuestions = [
        'Profil siapa yang ditampilkan (profil individu profesional, kantor konsultan, studio kreatif, dokter, pengacara)?',
        'Apa keahlian, pengalaman, dan portofolio karya utama yang ingin dipamerkan?',
        'Bagaimana calon klien atau mitra menghubungi (Tombol direct WhatsApp, email resmi, tautan medsos)?',
        'Fitur apa yang masuk In-Scope (bagian tentang saya/kami, daftar layanan & tarif, testimoni klien)?'
      ];
      quickReplies = [
        'Profil profesional, showcase portofolio karya, daftar layanan & biaya',
        'Tentang kami, ulasan testimoni klien, tombol konsultasi WhatsApp',
        'In-Scope: portfolio one-page elegan. Portal klien login tunda ke V2',
        'Data sudah cukup, langsung buatkan PRD!'
      ];
      break;

    case 'landingpage':
      interviewQuestions = [
        'Produk atau jasa apa yang dipromosikan (produk fisik, kursus/ebook, jasa layanan, properti)?',
        'Apa penawaran utama dan diskon/promo terbatas yang ingin ditekankan untuk mendorong konversi?',
        'Ke mana tombol Call-to-Action (CTA) diarahkan (langsung ke form pemesanan atau chat WhatsApp sales)?',
        'Fitur apa yang masuk In-Scope (headline penawaran, manfaat produk, testimoni, form order cepat)?'
      ];
      quickReplies = [
        'Headline penawaran, rincian manfaat, testimoni, form order WhatsApp',
        'Landing page produk, promo diskon terbatas, tombol CTA langsung beli',
        'In-Scope: sales page konversi tinggi. Split-test A/B otomatis tunda V2',
        'Data sudah lengkap, susunkan PRD sekarang!'
      ];
      break;

    case 'ecommerce':
      interviewQuestions = [
        'Produk apa yang dijual (fashion pakaian, makanan olahan, herbal, elektronik, aksesoris)?',
        'Bagaimana alur pembayaran pesanan (QRIS instan, transfer bank, atau Bayar di Tempat / COD)?',
        'Bagaimana konfirmasi order dilakukan (apakah otomatis mengirim rincian nota belanja ke WhatsApp pembeli)?',
        'Fitur apa yang masuk In-Scope (katalog produk, filter kategori, keranjang belanja, checkout WhatsApp)?'
      ];
      quickReplies = [
        'Katalog produk foto & harga, keranjang belanja, checkout pesan via WA',
        'Pilihan pembayaran QRIS & Transfer, hitung total otomatis, data alamat',
        'In-Scope: toko online & checkout WhatsApp. Integrasi API ekspedisi kurir tunda V2',
        'Data sudah lengkap, langsung susunkan PRD!'
      ];
      break;

    case 'android_pwa':
      interviewQuestions = [
        'Aplikasi bisnis apa yang ingin dioptimalkan untuk perangkat smartphone Android (kasir, logbook, kurir, order)?',
        'Apakah aplikasi perlu fitur PWA (bisa di-install "Add to Home Screen" langsung di layar HP Android tanpa PlayStore)?',
        'Bagaimana layout tampilan (navigasi bawah bottom bar, tombol jempol ramah sentuhan, formulir cepat)?',
        'Fitur apa yang masuk In-Scope (desain mobile-first responsif, penyimpanan offline draft data)?'
      ];
      quickReplies = [
        'Tampilan mobile-first Android, tombol sentuh besar, install ke layar utama PWA',
        'Navigasi bottom bar, form cepat input data di HP, tombol kontak WhatsApp',
        'In-Scope: web app siap install Android. Build APK file tunda ke versi V2',
        'Data sudah cukup, buatkan PRD sekarang!'
      ];
      break;

    case 'rental':
      interviewQuestions = [
        'Apa saja armada yang disewakan (mobil keluarga, bus pariwisata, motor) dan siapa pengguna sistem?',
        'Bagaimana alur perhitungan tarif sewa (per hari / 24 jam) dan jaminan identitas penyewa?',
        'Fitur apa yang wajib masuk In-Scope rilis pertama (katalog unit armada, kalender booking sewa, nota WhatsApp)?',
        'Metrik kunci apa yang paling ingin dipantau setiap hari (unit sedang keluar, omset sewa Rp, jadwal kembali)?'
      ];
      quickReplies = [
        'Katalog mobil, tarif harian Rp, status booking & keluar, nomor WA penyewa',
        'Manajemen unit rental, cek ketersediaan armada, surat jalan WhatsApp',
        'In-Scope: pencatatan unit sewa & nota WA. GPS tracking IoT tunda ke V2',
        'Data sudah cukup, langsung susunkan PRD lengkap!'
      ];
      break;

    default:
      interviewQuestions = [
        `Siapa target pengguna utama dan pengunjung sistem ${suggestedTitle} ini?`,
        'Masalah utama apa yang ingin diselesaikan dan apa hasil bisnis terukur yang diharapkan?',
        'Fitur apa yang wajib masuk In-Scope rilis pertama vs fitur yang ingin ditunda ke versi nanti (Out-of-Scope)?',
        'Aturan bisnis dan alur proses apa yang paling krusial untuk dicatat (data masukan, nominal Rp, status alur)?'
      ];
      quickReplies = [
        'Pengguna Staf & Pengunjung, formulir input cepat, rekapan status',
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
  let problemStatement = 'Pencatatan dan operasional masih dilakukan secara manual dan terpisah, menyita waktu pelayanan.';
  let businessGoal = 'Mendigitalkan alur informasi secara terpusat untuk meningkatkan efisiensi dan kecepatan pelayanan hingga 75%.';
  let inScopeList = ['Pencatatan data transaksi harian', 'Kalkulasi nilai otomatis dalam Rupiah (Rp)', 'Status tracking visual', 'Ekspor ringkasan data'];
  let outOfScopeList = ['Integrasi payment gateway internasional', 'Aplikasi native khusus iOS & Android terpisah di store (fase V2)', 'Sistem akuntansi multi-cabang kompleks'];
  let primaryMetric = 'Waktu penyelesaian proses kerja berkurang hingga < 30 detik per transaksi.';
  let secondaryMetric = 'Zero human error pada kalkulasi data dan kepatuhan alur operasional.';

  switch (detected.domainKey) {
    case 'radio_streaming':
      userPersona = 'Pendengar Radio Online & Penyiar / Operator Siaran Studio';
      problemStatement = 'Pendengar radio FM konvensional terbatas oleh jangkauan frekuensi pemancar antena, sementara pendengar masa kini ingin mendengarkan siaran langsung dari mana saja melalui internet.';
      businessGoal = 'Memperluas jangkauan pendengar radio hingga ke seluruh Indonesia dan mancanegara secara real-time.';
      inScopeList = [
        'Pemutar audio streaming online responsif dengan tombol play/pause instan',
        'Jadwal siaran program harian (On-Air) beserta nama penyiar dan genre musik',
        'Formulir request lagu dan kirim salam via WhatsApp resmi studio',
        'Banner informasi program unggulan dan sponsor radio'
      ];
      outOfScopeList = ['Fitur unduh MP3 offline (fase V2)', 'Multi-channel streaming multi-genre terpisah'];
      primaryMetric = 'Peningkatan jumlah pendengar streaming aktif bersamaan hingga 500+ pendengar harian.';
      secondaryMetric = 'Kestabilan audio streaming tanpa buffering lebih dari 99%.';
      break;

    case 'ppdb':
      userPersona = 'Orang Tua / Calon Siswa Baru & Panitia Penerimaan Siswa Sekolah';
      problemStatement = 'Pendaftaran siswa baru dengan antre di sekolah menimbulkan kerumunan, berkas fisik rawan rusak atau hilang, dan rekap nilai rapor memakan waktu berminggu-minggu.';
      businessGoal = 'Mempersingkat proses pendaftaran dan verifikasi berkas dari 7 hari menjadi hitungan jam secara transparan.';
      inScopeList = [
        'Formulir pendaftaran calon siswa online lengkap (biodata, asal sekolah, jalur masuk)',
        'Papan verifikasi berkas oleh panitia PPDB (Menunggu -> Terverifikasi -> Lolos Seleksi -> Ditolak)',
        'Notifikasi status kelolosan seleksi langsung via WhatsApp orang tua',
        'Rekapitulasi kuota pendaftar per jalur masuk (Zonasi, Prestasi, Afirmasi)'
      ];
      outOfScopeList = ['Ujian tes online CAT real-time terintegrasi (fase V2)', 'Pembayaran uang seragam dengan cicilan kartu kredit'];
      primaryMetric = 'Waktu pendaftaran siswa selesai dalam waktu < 5 menit per formulir.';
      secondaryMetric = 'Akurasi verifikasi dokumen persyaratan mencapai 100%.';
      break;

    case 'ppob':
      userPersona = 'Operator Loket PPOB / Pemilik Usaha Pembayaran & Konsumen Pelanggan';
      problemStatement = 'Masyarakat sekitar sering kesulitan membayar tagihan bulanan atau beli pulsa malam hari, sedangkan pencatatan pembukuan loket manual rawan salah hitung margin laba.';
      businessGoal = 'Mempermudah warga bayar tagihan di satu tempat dan merekam keuntungan transaksi secara otomatis.';
      inScopeList = [
        'Katalog produk PPOB lengkap: Pulsa, Paket Data, Token PLN, BPJS, PDAM, E-Wallet',
        'Kalkulasi otomatis nominal tagihan ditambah biaya admin loket dalam Rupiah (Rp)',
        'Status transaksi real-time: Menunggu Pembayaran -> Sedang Diproses -> Sukses Berhasil -> Gagal',
        'Cetak bukti struk pembayaran digital kirim langsung ke WhatsApp pelanggan'
      ];
      outOfScopeList = ['Koneksi deposit saldo multibank otomatis API perbankan langsung (fase V2)', 'Mesin cetak struk thermal kasir bluetooth custom'];
      primaryMetric = 'Penyelesaian transaksi pembayaran tagihan dalam waktu < 30 detik.';
      secondaryMetric = 'Rekapitulasi keuntungan admin per transaksi akurat 100%.';
      break;

    case 'academic':
      userPersona = 'Mahasiswa / Siswa, Dosen Pembimbing Akademik (PA), & Bagian Tata Usaha';
      problemStatement = 'Pengisian formulir KRS kertas sering hilang di ruang dosen, jadwal kuliah bertabrakan, dan mahasiswa lambat mengetahui nilai akhir semester.';
      businessGoal = 'Mendigitalkan seluruh proses KRS dan KHS untuk transparansi rekam jejak akademik.';
      inScopeList = [
        'Kartu Rencana Studi (KRS) online dengan kuota SKS dan jadwal kuliah',
        'Alur persetujuan akademik: Pengajuan KRS -> Disetujui Dosen PA -> Berjalan -> Nilai Terbit',
        'Penerbitan kartu hasil studi (KHS) dengan nilai mutu (A, B, C, D) dan IPK otomatis',
        'Portal pencarian mata kuliah dan dosen pengampu'
      ];
      outOfScopeList = ['Integrasi PDDIKTI Feeder kemendikbud otomatis (fase V2)', 'Absensi berbasis GPS geofencing di ruang kelas'];
      primaryMetric = 'Penyelesaian approval KRS tepat waktu mencapai 100% sebelum masa kuliah mulai.';
      secondaryMetric = 'Nol kasus jadwal kuliah bentrok bagi mahasiswa.';
      break;

    case 'classifieds':
      userPersona = 'Pemasang Iklan Baris & Pengunjung Pencari Barang/Jasa Lokal';
      problemStatement = 'Iklan baris di media cetak terbatas karakter dan masa edar cepat usang, sedangkan masyarakat butuh pasang iklan instan yang langsung terhubung ke WhatsApp.';
      businessGoal = 'Menyediakan wadah iklan lokal yang praktis, cepat tayang, dan langsung menghasilkan leads ke penjual.';
      inScopeList = [
        'Formulir pasang iklan baris cepat dengan kategori (Properti, Mobil/Motor, Jasa, Elektronik)',
        'Pencarian dan filter iklan berdasarkan kota dan rentang harga Rupiah (Rp)',
        'Tombol 1-klik "Chat WhatsApp Penjual" langsung dengan referensi iklan',
        'Status iklan: Menunggu Moderasi -> Tayang Aktif -> Terjual Laku -> Kadaluarsa'
      ];
      outOfScopeList = ['Sistem rekening bersama escrow payment holding (fase V2)', 'Otomasi iklan berbayar dengan potong pulsa operator'];
      primaryMetric = 'Pengiklan mendapatkan respon pembeli pertama dalam waktu < 24 jam.';
      secondaryMetric = 'Waktu moderasi iklan baru kurang dari 15 menit.';
      break;

    case 'forum':
      userPersona = 'Anggota Komunitas Online, Penanya / Pembuat Thread, & Moderator Forum';
      problemStatement = 'Diskusi di grup WhatsApp sering tenggelam tertimbun chat baru, tips dan solusi penting sulit dicari kembali.';
      businessGoal = 'Membangun arsip diskusi terstruktur berbasis kategori topik yang dapat dicari kapan saja.';
      inScopeList = [
        'Pembuatan thread diskusi baru dengan kategori topik dan tagar',
        'Halaman pembaca thread dengan komentar balasan bertingkat',
        'Fitur sorotan (Pinned Thread) untuk pengumuman penting',
        'Status moderasi: Aktif Terbuka, Pinned Sorotan, Terkunci, Ditutup'
      ];
      outOfScopeList = ['Panggilan suara voice chat room dalam forum (fase V2)', 'Sistem token reward crypto untuk postingan'];
      primaryMetric = 'Peningkatan jumlah interaksi dan balasan thread mingguan sebesar 50%.';
      secondaryMetric = 'Zero spam postingan berkat sistem status moderasi aktif.';
      break;

    case 'marketplace':
      userPersona = 'Penjual Lapak (Seller), Pembeli (Buyer), & Admin Pengelola Platform';
      problemStatement = 'Banyak UMKM lokal kesulitan membuka toko online sendiri karena biaya server mahal, sementara marketplace raksasa memotong komisi tinggi.';
      businessGoal = 'Menyediakan pasar online bersama bagi penjual lokal dengan transaksi ramah WhatsApp.';
      inScopeList = [
        'Katalog produk multi-penjual dengan foto, harga Rp, dan nama lapak',
        'Filter pencarian produk berdasarkan kategori dan asal kota pengiriman',
        'Tombol direct order "Beli via WhatsApp Penjual"',
        'Status lapak: Aktif Tayang, Terverifikasi, Stok Kosong'
      ];
      outOfScopeList = ['Sistem pembayaran payment gateway escrow terpusat (fase V2)', 'Integrasi logistik penjemputan paket kurir otomatis'];
      primaryMetric = 'Pertumbuhan jumlah lapak penjual lokal aktif mencapai 50+ toko.';
      secondaryMetric = 'Waktu muat katalog produk kurang dari 1.5 detik.';
      break;

    case 'news':
      userPersona = 'Wartawan / Jurnalis, Editor Redaksi, & Pembaca Berita Online';
      problemStatement = 'Portal berita lambat menayangkan liputan terkini karena alur persetujuan redaksi berbelit-belit, layout pembaca penuh iklan mengganggu.';
      businessGoal = 'Menyajikan portal berita yang cepat, bersih dari bloatware, dan alur redaksi gesit.';
      inScopeList = [
        'Katalog artikel berita berdasarkan rubrik (Nasional, Bisnis, Teknologi, Hiburan)',
        'Alur redaksi bertingkat: Draft Redaksi -> Review Editor -> Sudah Tayang -> Arsip',
        'Tampilan baca artikel bersih, responsif, dengan estimasi waktu baca',
        'Tombol 1-klik bagikan artikel ke WhatsApp dan media sosial'
      ];
      outOfScopeList = ['Sistem langganan berbayar paywall artikel eksklusif (fase V2)', 'Studio siaran video berita live interaktif'];
      primaryMetric = 'Waktu terbit berita dari penulisan draft hingga tayang < 15 menit.';
      secondaryMetric = 'Kecepatan loading halaman artikel berita di ponsel < 1.2 detik.';
      break;

    case 'jobportal':
      userPersona = 'Tim HRD Perusahaan (Perekrut) & Pencari Kerja (Pelamar Karir)';
      problemStatement = 'Pencari kerja kesulitan menemukan informasi loker terpercaya dengan kisaran gaji jelas, perusahaan kebanjiran CV tidak sesuai kualifikasi.';
      businessGoal = 'Menghubungkan kandidat berkualitas dengan lowongan kerja terverifikasi secara transparan.';
      inScopeList = [
        'Daftar lowongan kerja dengan posisi, nama perusahaan, kisaran gaji Rp, dan lokasi',
        'Alur status perekrutan: Membuka Lamaran -> Tahap Wawancara -> Posisi Terisi -> Ditutup',
        'Tombol 1-klik "Kirim Lamaran via WhatsApp HRD" dengan template perkenalan',
        'Filter loker berdasarkan bidang pekerjaan dan jenis kerja (Full-time / Remote)'
      ];
      outOfScopeList = ['Uji asesmen psikotes online otomatis dalam sistem (fase V2)', 'Sistem background check kepolisian terintegrasi'];
      primaryMetric = 'Peningkatan jumlah pelamar yang dipanggil wawancara sebesar 40%.';
      secondaryMetric = 'Transparansi informasi kisaran gaji pada 100% postingan loker.';
      break;

    case 'village':
      userPersona = 'Warga Desa & Perangkat Desa (Kepala Dusun, Sekretaris Desa, Kepala Desa)';
      problemStatement = 'Warga harus izin cuti kerja hanya untuk meminta surat pengantar di kantor desa yang sering kosong saat jam kerja lapangan.';
      businessGoal = 'Memudahkan warga mengurus surat administrasi desa dari rumah melalui smartphone.';
      inScopeList = [
        'Formulir permohonan surat online: Surat Domisili, SKCK, Usaha, Keterangan Tidak Mampu',
        'Alur verifikasi surat: Pengajuan Baru -> Verifikasi Dusun -> TTD Kades -> Surat Siap Ambil',
        'Pemberitahuan otomatis ke WhatsApp warga saat surat selesai ditandatangani',
        'Pusat informasi kabar desa dan transparansi anggaran APBDes'
      ];
      outOfScopeList = ['Perekaman sidik jari e-KTP di balai desa (fase V2)', 'Sistem pemungutan suara pemilihan kepala desa elektronik'];
      primaryMetric = 'Pengurusan surat pengantar selesai dalam waktu maksimal 1x24 jam.';
      secondaryMetric = 'Tingkat kepuasan masyarakat terhadap layanan administrasi desa > 90%.';
      break;

    case 'government':
      userPersona = 'Masyarakat Pemohon Layanan Publik & Petugas Aparatur Instansi Pemerintah';
      problemStatement = 'Masyarakat mengeluhkan birokrasi berbelit dan tidak jelasnya status berkas permohonan yang diajukan ke dinas pemerintah.';
      businessGoal = 'Mewujudkan tata kelola pelayanan publik yang transparan, akuntabel, dan bebas pungli.';
      inScopeList = [
        'Pendaftaran permohonan layanan publik online beserta nomor tiket registrasi',
        'Pelacak status transparan: Berkas Diterima -> Verifikasi Petugas -> Siap Terbit -> Selesai',
        'Kanal aduan aspirasi masyarakat langsung terhubung ke bagian inspektorat',
        'Publikasi standar operasional prosedur (SOP) dan kontak resmi dinas'
      ];
      outOfScopeList = ['Integrasi satu data nasional kementerian terpusat (fase V2)', 'Tanda tangan digital sertifikat elektronik BSrE'];
      primaryMetric = 'Indeks kepuasan masyarakat (IKM) terhadap layanan publik naik ke angka minimal 85/100.';
      secondaryMetric = 'Waktu respon aduan warga pertama kali kurang dari 2x24 jam.';
      break;

    case 'school':
      userPersona = 'Guru, Staf Tata Usaha, Siswa, & Orang Tua Wali Murid';
      problemStatement = 'Buku agenda sekolah sering tidak dibaca orang tua, pengumuman ujian atau libur mendadak sering tidak tersampaikan tepat waktu.';
      businessGoal = 'Membangun jembatan komunikasi digital yang cepat antara pihak sekolah dan seluruh wali murid.';
      inScopeList = [
        'Portal profil sekolah, visi misi, dan jajaran guru pengajar',
        'Kalender agenda kegiatan sekolah: ujian, rapat komite, ekstrakurikuler',
        'Kanal pengumuman resmi sekolah dengan tombol bagikan ke grup WhatsApp orang tua',
        'Galeri prestasi siswa dan informasi kontak sekolah'
      ];
      outOfScopeList = ['Sistem ujian berbasis komputer CAT di server sekolah (fase V2)', 'Kamera CCTV kelas live streaming wali murid'];
      primaryMetric = '100% orang tua wali murid menerima pengumuman sekolah secara tepat waktu.';
      secondaryMetric = 'Penurunan kasus siswa salah membawa perlengkapan agenda sekolah.';
      break;

    case 'corporate':
      userPersona = 'Klien Korporat B2B, Calon Mitra Investor, & Direksi Perusahaan';
      problemStatement = 'Perusahaan kehilangan kesempatan tender bernilai tinggi karena website korporat lama terlihat tidak profesional dan portofolio tidak terbarui.';
      businessGoal = 'Meningkatkan kredibilitas korporasi untuk memenangkan tender dan kerjasama bisnis bernilai miliaran Rupiah.';
      inScopeList = [
        'Profil resmi korporasi, legalitas perusahaan, visi misi, dan susunan dewan direksi',
        'Showcase portofolio proyek industri yang telah sukses diselesaikan',
        'Formulir B2B Business Inquiry & Request for Proposal (RFP)',
        'Alur penjajakan kerjasama: Prospek Masuk -> Penjajakan NDA -> MoU Sepakat -> Proyek Aktif'
      ];
      outOfScopeList = ['Portal e-Procurement lelang tender vendor multi-tier (fase V2)', 'Laporan keuangan audited interaktif pasar modal IDX'];
      primaryMetric = 'Kenaikan permintaan proposal kerjasama B2B dari klien sebesar 50%.';
      secondaryMetric = 'Waktu muat website korporat kurang dari 1.5 detik.';
      break;

    case 'profile':
      userPersona = 'Profesional / Praktisi Ahli, Klien Konsultasi, & Rekan Kolaborasi';
      problemStatement = 'Calon klien sering ragu menggunakan jasa karena portofolio berserakan di berbagai media sosial tanpa profil resmi yang terpadu.';
      businessGoal = 'Membangun personal branding yang kuat dan memudahkan calon klien mengontrak jasa profesional.';
      inScopeList = [
        'Ringkasan profil profesional, keahlian utama, dan sertifikasi keahlian',
        'Katalog layanan jasa yang ditawarkan beserta estimasi tarif dalam Rupiah (Rp)',
        'Galeri portofolio karya terbaik dan testimoni kepuasan klien',
        'Tombol direct WhatsApp untuk konsultasi dan jadwal sesi diskusi'
      ];
      outOfScopeList = ['Portal kursus video materi pembelajaran pribadi (fase V2)', 'Sistem booking kalender otomatis terintegrasi Zoom'];
      primaryMetric = 'Peningkatan kontak calon klien yang masuk melalui formulir profil sebesar 60%.';
      secondaryMetric = 'Peningkatan konversi konsultasi menjadi deal proyek aktif.';
      break;

    case 'landingpage':
      userPersona = 'Calon Pembeli Prospektif & Tim Sales / Digital Marketer';
      problemStatement = 'Iklan online yang dipasang menghasilkan klik banyak tetapi sedikit yang membeli karena halaman arahan lambat dan penawaran membingungkan.';
      businessGoal = 'Memaksimalkan tingkat konversi penjualan (Conversion Rate) dari pengunjung menjadi pembeli riil.';
      inScopeList = [
        'Headline penawaran menarik dengan copywriting yang memecahkan masalah calon pembeli',
        'Rincian paket penawaran, garansi produk, dan promo potongan harga Rupiah (Rp)',
        'Formulir pemesanan cepat 1-halaman terhubung langsung ke WhatsApp tim sales',
        'Alur prospek: Lead Masuk -> Chat WhatsApp -> Deal Closing -> Batal'
      ];
      outOfScopeList = ['Sistem affiliate multi-level marketing (fase V2)', 'Split testing dinamis multi-URL otomatis'];
      primaryMetric = 'Tingkat konversi pengunjung landing page menjadi closing deal > 12%.';
      secondaryMetric = 'Penurunan rasio pentalan (bounce rate) hingga di bawah 40%.';
      break;

    case 'ecommerce':
      userPersona = 'Pembeli Belanja Online & Pemilik Toko Online';
      problemStatement = 'Pembeli sering membatalkan pesanan karena alur checkout website toko online yang rumit dan harus mendaftar akun berulang kali.';
      businessGoal = 'Meningkatkan kelancaran proses belanja dengan checkout instan dan konfirmasi nota WhatsApp.';
      inScopeList = [
        'Katalog produk visual dengan foto, rincian spesifikasi, dan harga Rupiah (Rp)',
        'Keranjang belanja belanja interaktif dengan kalkulasi total otomatis',
        'Metode pembayaran QRIS instan dan Transfer Bank dengan konfirmasi nota WhatsApp',
        'Pelacak status pesanan: Menunggu Pembayaran -> Dipacking -> Dikirim -> Selesai'
      ];
      outOfScopeList = ['Otomasi cek resi kurir real-time 15 ekspedisi API (fase V2)', 'Sistem refund retur barang otomatis antar gudang'];
      primaryMetric = 'Peningkatan nilai transaksi keranjang belanja selesai checkout sebesar 35%.';
      secondaryMetric = 'Waktu penyelesaian pesanan dari pilih produk hingga selesai bayar < 1 menit.';
      break;

    case 'android_pwa':
      userPersona = 'Pengguna Smartphone Android (Staf Lapangan / Pelanggan Mobile)';
      problemStatement = 'Aplikasi native Android di Google Play Store butuh ruang memori besar dan biaya akun developer mahal, sedangkan pengguna butuh aplikasi ringan yang bisa langsung diakses.';
      businessGoal = 'Menyediakan aplikasi mobile Android ringan berbasis Web PWA yang dapat dipasang langsung ke layar utama tanpa Play Store.';
      inScopeList = [
        'Tata letak Mobile-First Android responsif dengan navigasi bottom bar yang ergonomis',
        'Dukungan fitur Progressive Web App (PWA) untuk dipasang di Home Screen HP Android',
        'Penyimpanan lokal cepat sehingga form tetap aman meski jaringan seluler putus',
        'Formulir input ramah sentuhan jempol dan tombol direct WhatsApp'
      ];
      outOfScopeList = ['Publikasi berkas .aab ke Google Play Store Console (fase V2)', 'Notifikasi push background saat aplikasi ditutup total'];
      primaryMetric = 'Aplikasi dapat di-install dan dibuka dalam waktu < 1 detik di semua ponsel Android.';
      secondaryMetric = 'Responsivitas antarmuka layar sentuh 100% tanpa lag.';
      break;

    case 'rental':
      userPersona = 'Admin Persewaan & Petugas Serah Terima Unit (Armada/Alat)';
      problemStatement = 'Jadwal ketersediaan unit sewa sering tumpang tindih, denda keterlambatan luput ditagih, dan data penyewa tercecer di kertas.';
      businessGoal = 'Meningkatkan utilitas unit sewa hingga di atas 80% dan mencegah hilangnya pendapatan denda sewa.';
      inScopeList = [
        'Katalog unit armada/alat sewa dengan status ketersediaan real-time',
        'Pencatatan booking sewa: nama penyewa, durasi sewa, tarif Rp, dan kontak WhatsApp',
        'Surat jalan / bukti serah terima digital kirim langsung ke WhatsApp penyewa',
        'Penetapan status alur sewa: Booking -> Unit Keluar -> Selesai Kembali -> Terlambat Denda'
      ];
      outOfScopeList = ['Pelacakan GPS tracking IoT real-time pada kendaraan (fase V2)', 'Sistem verifikasi KTP biometrik otomatis melalui Dukcapil'];
      primaryMetric = 'Tingkat utilitas unit sewa meningkat dari 55% menjadi minimal 80%.';
      secondaryMetric = 'Zero kasus double-booking jadwal sewa unit yang sama.';
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
      description: `Modul Formulir & Input Data Cepat ${title}`,
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
        `Sebagai ${userPersona.split('&')[0].trim()}, saya ingin mengakses dan mengelola data dengan cepat agar operasional berjalan lancar.`,
        `Sebagai staf pelaksana, saya ingin memantau status tahapan secara visual agar tidak ada tugas yang terlewat.`,
        `Sebagai pengambil keputusan, saya ingin melihat ringkasan metrik secara real-time untuk memantau performa harian.`
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
        'Apakah ke depannya diperlukan hak akses multi-role berbayar (Admin vs Pengunjung Umum)?',
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
 * Covers ALL 19 user-requested application & website types!
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
    // 1. Radio Streaming
    case 'radio_streaming':
      category = 'portal';
      primaryTable = {
        id: 'broadcast_schedules',
        name: 'Jadwal Siaran & Request Lagu',
        primaryKey: 'id',
        columns: [
          { key: 'jamTayang', label: 'Jam Tayang', type: 'text', required: true },
          { key: 'namaProgram', label: 'Nama Program Siaran', type: 'text', required: true },
          { key: 'penyiar', label: 'Penyiar / Host', type: 'text', required: true },
          { key: 'genre', label: 'Genre Musik', type: 'badge', options: ['Pop Hits', 'Akustik Santai', 'Jazz & RnB', 'Dangdut Nusantara', 'Bincang Bisnis'] },
          { key: 'requestLagu', label: 'Request Lagu Pendengar', type: 'text' },
          { key: 'statusSiaran', label: 'Status Siaran', type: 'status', options: ['Live On-Air', 'Jadwal Berikutnya', 'Selesai Tayang', 'Rerun Siaran'] },
          { key: 'whatsappStudio', label: 'WhatsApp Studio', type: 'phone', required: true },
        ],
        records: [
          { id: '1', jamTayang: '06:00 - 10:00 WIB', namaProgram: 'Morning Coffee & News Update', penyiar: 'Dimas & Salsa', genre: 'Pop Hits', requestLagu: 'Sheila on 7 - Film Favorit (Kak Dian)', statusSiaran: 'Live On-Air', whatsappStudio: '081299881122' },
          { id: '2', jamTayang: '10:00 - 14:00 WIB', namaProgram: 'Bisnis & UMKM Berdaya', penyiar: 'Om Bobi', genre: 'Bincang Bisnis', requestLagu: 'Kunto Aji - Rehat (Bpk. Surya)', statusSiaran: 'Jadwal Berikutnya', whatsappStudio: '081299881122' },
          { id: '3', jamTayang: '14:00 - 18:00 WIB', namaProgram: 'Akustik Senja & Request Hati', penyiar: 'Dita Rahma', genre: 'Akustik Santai', requestLagu: 'Tulus - Monokrom (Mas Fajar)', statusSiaran: 'Jadwal Berikutnya', whatsappStudio: '081299881122' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Pendengar Streaming Live', value: '428 Pendengar', change: 'Bitrate 128kbps lancar', trend: 'up', icon: 'Sparkles', color: 'green' },
        { id: 'm2', label: 'Program On-Air Sekarang', value: 'Morning Coffee', change: 'Host: Dimas & Salsa', trend: 'up', icon: 'Clock', color: 'blue' },
        { id: 'm3', label: 'Request Lagu Masuk', value: '38 Lagu', change: 'Koleksi request WA', trend: 'up', icon: 'HeartHandshake', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'broadcast_schedules',
        statusColumnKey: 'statusSiaran',
        titleColumnKey: 'namaProgram',
        subtitleColumnKey: 'penyiar',
        valueColumnKey: 'jamTayang',
        stages: [
          { id: 'Live On-Air', name: 'Live On-Air (Sedang Tayang)', color: '#EF4444' },
          { id: 'Jadwal Berikutnya', name: 'Jadwal Berikutnya', color: '#3B82F6' },
          { id: 'Selesai Tayang', name: 'Selesai Tayang', color: '#10B981' },
          { id: 'Rerun Siaran', name: 'Rerun Siaran', color: '#94A3B8' }
        ]
      };
      break;

    // 2. PPDB Online
    case 'ppdb':
      category = 'portal';
      primaryTable = {
        id: 'ppdb_applicants',
        name: 'Data Pendaftar Siswa Baru',
        primaryKey: 'id',
        columns: [
          { key: 'noDaftar', label: 'No. Pendaftaran', type: 'text', required: true },
          { key: 'namaSiswa', label: 'Nama Calon Siswa', type: 'text', required: true },
          { key: 'jalur', label: 'Jalur Masuk', type: 'badge', options: ['Zonasi Domisili', 'Prestasi Akademik', 'Afirmasi KIP', 'Mutasi Orang Tua'] },
          { key: 'asalSekolah', label: 'Asal Sekolah', type: 'text', required: true },
          { key: 'nilaiRataRata', label: 'Rata-rata Nilai', type: 'number', required: true },
          { key: 'statusSeleksi', label: 'Status Seleksi', type: 'status', options: ['Pendaftaran Masuk', 'Verifikasi Berkas', 'Lolos Seleksi', 'Ditolak / Cadangan'] },
          { key: 'whatsappOrtu', label: 'WhatsApp Orang Tua', type: 'phone', required: true },
        ],
        records: [
          { id: '1', noDaftar: 'PPDB-2026-001', namaSiswa: 'Ahmad Faiz Al-Ghifari', jalur: 'Prestasi Akademik', asalSekolah: 'SMP Negeri 1 Surabaya', nilaiRataRata: 92.5, statusSeleksi: 'Lolos Seleksi', whatsappOrtu: '081288990011' },
          { id: '2', noDaftar: 'PPDB-2026-002', namaSiswa: 'Nadia Putri Kirana', jalur: 'Zonasi Domisili', asalSekolah: 'SMP Negeri 5 Surabaya', nilaiRataRata: 87.0, statusSeleksi: 'Verifikasi Berkas', whatsappOrtu: '081377889922' },
          { id: '3', noDaftar: 'PPDB-2026-003', namaSiswa: 'Bagas Aditya Rahman', jalur: 'Afirmasi KIP', asalSekolah: 'SMP Kartika Wijaya', nilaiRataRata: 84.5, statusSeleksi: 'Pendaftaran Masuk', whatsappOrtu: '081566778833' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Total Calon Siswa Terdaftar', value: '185 Siswa', change: 'Kuota tersisa 40 kursi', trend: 'up', icon: 'Users', color: 'blue' },
        { id: 'm2', label: 'Lolos Seleksi Terbit', value: '45 Siswa', change: 'Verifikasi berkas tuntas', trend: 'up', icon: 'CheckCircle2', color: 'green' },
        { id: 'm3', label: 'Berkas Menunggu Review', value: '18 Berkas', change: 'Panitia sedang proses', trend: 'neutral', icon: 'Clock', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'ppdb_applicants',
        statusColumnKey: 'statusSeleksi',
        titleColumnKey: 'namaSiswa',
        subtitleColumnKey: 'jalur',
        valueColumnKey: 'nilaiRataRata',
        stages: [
          { id: 'Pendaftaran Masuk', name: 'Pendaftaran Masuk', color: '#94A3B8' },
          { id: 'Verifikasi Berkas', name: 'Verifikasi Berkas', color: '#F59E0B' },
          { id: 'Lolos Seleksi', name: 'Lolos Seleksi', color: '#10B981' },
          { id: 'Ditolak / Cadangan', name: 'Cadangan / Ditolak', color: '#EF4444' }
        ]
      };
      break;

    // 3. PPOB Pembayaran Tagihan
    case 'ppob':
      category = 'portal';
      primaryTable = {
        id: 'ppob_transactions',
        name: 'Transaksi Pembayaran Tagihan & Pulsa',
        primaryKey: 'id',
        columns: [
          { key: 'noTrx', label: 'No. Transaksi', type: 'text', required: true },
          { key: 'layanan', label: 'Jenis Layanan', type: 'badge', options: ['Token Listrik PLN', 'Pulsa & Kuota Data', 'Tagihan BPJS', 'PDAM Air', 'Top-up E-Wallet'] },
          { key: 'noPelanggan', label: 'No. Tujuan / Pelanggan', type: 'text', required: true },
          { key: 'nominal', label: 'Nominal Produk (Rp)', type: 'currency', required: true },
          { key: 'adminFee', label: 'Biaya Admin (Rp)', type: 'currency', required: true },
          { key: 'totalBayar', label: 'Total Bayar (Rp)', type: 'currency', required: true },
          { key: 'status', label: 'Status Transaksi', type: 'status', options: ['Menunggu Pembayaran', 'Sedang Diproses', 'Sukses Berhasil', 'Gagal / Refund'] },
          { key: 'whatsapp', label: 'WhatsApp Struk', type: 'phone', required: true },
        ],
        records: [
          { id: '1', noTrx: 'PPOB-9901', layanan: 'Token Listrik PLN', noPelanggan: '3201-9876-5432', nominal: 100000, adminFee: 2500, totalBayar: 102500, status: 'Sukses Berhasil', whatsapp: '081288991122' },
          { id: '2', noTrx: 'PPOB-9902', layanan: 'Tagihan BPJS', noPelanggan: '0001-4567-8901', nominal: 150000, adminFee: 3000, totalBayar: 153000, status: 'Sukses Berhasil', whatsapp: '081377882233' },
          { id: '3', noTrx: 'PPOB-9903', layanan: 'Top-up E-Wallet', noPelanggan: 'GoPay 081298765432', nominal: 50000, adminFee: 2000, totalBayar: 52000, status: 'Sedang Diproses', whatsapp: '081566773344' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Volume Transaksi Hari Ini', value: 'Rp 307.500', change: 'Total perputaran kas', trend: 'up', icon: 'Coins', color: 'blue' },
        { id: 'm2', label: 'Laba Admin Terkumpul', value: 'Rp 7.500', change: 'Bersih masuk kantong', trend: 'up', icon: 'BadgeDollarSign', color: 'green' },
        { id: 'm3', label: 'Transaksi Berhasil', value: '2 Sukses', change: 'Tingkat keberhasilan 100%', trend: 'up', icon: 'CheckCircle2', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'ppob_transactions',
        statusColumnKey: 'status',
        titleColumnKey: 'layanan',
        subtitleColumnKey: 'noPelanggan',
        valueColumnKey: 'totalBayar',
        stages: [
          { id: 'Menunggu Pembayaran', name: 'Menunggu Bayar', color: '#94A3B8' },
          { id: 'Sedang Diproses', name: 'Sedang Diproses', color: '#F59E0B' },
          { id: 'Sukses Berhasil', name: 'Sukses Berhasil', color: '#10B981' },
          { id: 'Gagal / Refund', name: 'Gagal / Refund', color: '#EF4444' }
        ]
      };
      break;

    // 4. Sistem Informasi Akademik (SIAKAD)
    case 'academic':
      category = 'portal';
      primaryTable = {
        id: 'academic_records',
        name: 'KRS Mahasiswa & Nilai Perkuliahan',
        primaryKey: 'id',
        columns: [
          { key: 'nim', label: 'NIM Mahasiswa', type: 'text', required: true },
          { key: 'nama', label: 'Nama Mahasiswa', type: 'text', required: true },
          { key: 'mataKuliah', label: 'Mata Kuliah', type: 'text', required: true },
          { key: 'dosenPa', label: 'Dosen Pembimbing PA', type: 'text', required: true },
          { key: 'sks', label: 'Bobot SKS', type: 'number', required: true },
          { key: 'nilaiHuruf', label: 'Nilai Akhir', type: 'badge', options: ['A (4.0)', 'B+ (3.5)', 'B (3.0)', 'C+ (2.5)', 'C (2.0)', 'Belum Terbit'] },
          { key: 'statusKrs', label: 'Status KRS', type: 'status', options: ['Pengajuan KRS', 'Disetujui Dosen PA', 'Sedang Berjalan', 'Nilai Terbit'] },
          { key: 'whatsapp', label: 'WhatsApp Mahasiswa', type: 'phone', required: true },
        ],
        records: [
          { id: '1', nim: '220101001', nama: 'Rizky Pratama', mataKuliah: 'Rekayasa Perangkat Lunak', dosenPa: 'Dr. Ir. Hendra M.Kom', sks: 3, nilaiHuruf: 'A (4.0)', statusKrs: 'Nilai Terbit', whatsapp: '081288990011' },
          { id: '2', nim: '220101002', nama: 'Siti Wulandari', mataKuliah: 'Sistem Basis Data Lanjut', dosenPa: 'Dr. Ir. Hendra M.Kom', sks: 3, nilaiHuruf: 'Belum Terbit', statusKrs: 'Sedang Berjalan', whatsapp: '081377889922' },
          { id: '3', nim: '220101003', nama: 'Fandi Kurniawan', mataKuliah: 'Kecerdasan Buatan (AI)', dosenPa: 'Prof. Sri Wahyuni Ph.D', sks: 4, nilaiHuruf: 'Belum Terbit', statusKrs: 'Pengajuan KRS', whatsapp: '081566778833' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Total Mahasiswa Aktif', value: '380 Mahasiswa', change: 'Semester Genap 2026', trend: 'up', icon: 'Users', color: 'blue' },
        { id: 'm2', label: 'Rata-rata IPK Semester', value: '3.62', change: 'Peningkatan prestasi +0.15', trend: 'up', icon: 'Sparkles', color: 'green' },
        { id: 'm3', label: 'Pengajuan KRS Menunggu PA', value: '14 Pengajuan', change: 'Perlu verifikasi dosen', trend: 'neutral', icon: 'Clock', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'academic_records',
        statusColumnKey: 'statusKrs',
        titleColumnKey: 'nama',
        subtitleColumnKey: 'mataKuliah',
        valueColumnKey: 'sks',
        stages: [
          { id: 'Pengajuan KRS', name: 'Pengajuan KRS', color: '#94A3B8' },
          { id: 'Disetujui Dosen PA', name: 'Disetujui Dosen PA', color: '#3B82F6' },
          { id: 'Sedang Berjalan', name: 'Sedang Berjalan', color: '#F59E0B' },
          { id: 'Nilai Terbit', name: 'Nilai Terbit', color: '#10B981' }
        ]
      };
      break;

    // 5. Iklan Baris Online
    case 'classifieds':
      category = 'portal';
      primaryTable = {
        id: 'classified_ads',
        name: 'Daftar Iklan Baris Tayang',
        primaryKey: 'id',
        columns: [
          { key: 'noIklan', label: 'No. Iklan', type: 'text', required: true },
          { key: 'judulIklan', label: 'Judul Iklan', type: 'text', required: true },
          { key: 'kategori', label: 'Kategori', type: 'badge', options: ['Properti & Rumah', 'Mobil & Motor', 'Elektronik & Gadget', 'Lowongan & Jasa', 'Lain-lain'] },
          { key: 'harga', label: 'Harga Penawaran (Rp)', type: 'currency', required: true },
          { key: 'kota', label: 'Kota / Lokasi', type: 'text', required: true },
          { key: 'status', label: 'Status Iklan', type: 'status', options: ['Menunggu Moderasi', 'Tayang Aktif', 'Terjual / Laku', 'Kadaluarsa'] },
          { key: 'whatsapp', label: 'WhatsApp Pemasang', type: 'phone', required: true },
        ],
        records: [
          { id: '1', noIklan: 'IKL-101', judulIklan: 'Rumah Siap Huni 2 Lantai Dekat Stasiun', kategori: 'Properti & Rumah', harga: 650000000, kota: 'Depok, Jawa Barat', status: 'Tayang Aktif', whatsapp: '081299887711' },
          { id: '2', noIklan: 'IKL-102', judulIklan: 'Honda Vario 160 2023 Mulus Tangan Pertama', kategori: 'Mobil & Motor', harga: 22500000, kota: 'Jakarta Selatan', status: 'Tayang Aktif', whatsapp: '081377889922' },
          { id: '3', noIklan: 'IKL-103', judulIklan: 'MacBook Pro M2 16/512GB Garansi Resmi', kategori: 'Elektronik & Gadget', harga: 17800000, kota: 'Surabaya', status: 'Menunggu Moderasi', whatsapp: '081566778833' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Iklan Tayang Aktif', value: '48 Iklan', change: 'Tersebar di 12 kota', trend: 'up', icon: 'Layers', color: 'blue' },
        { id: 'm2', label: 'Nilai Transaksi Listing (Rp)', value: 'Rp 690.300.000', change: 'Total aset ditawarkan', trend: 'up', icon: 'BadgeDollarSign', color: 'green' },
        { id: 'm3', label: 'Moderasi Baru Masuk', value: '3 Iklan', change: 'Perlu cek konten', trend: 'neutral', icon: 'Clock', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'classified_ads',
        statusColumnKey: 'status',
        titleColumnKey: 'judulIklan',
        subtitleColumnKey: 'kota',
        valueColumnKey: 'harga',
        stages: [
          { id: 'Menunggu Moderasi', name: 'Menunggu Moderasi', color: '#94A3B8' },
          { id: 'Tayang Aktif', name: 'Tayang Aktif', color: '#10B981' },
          { id: 'Terjual / Laku', name: 'Terjual / Laku', color: '#3B82F6' },
          { id: 'Kadaluarsa', name: 'Kadaluarsa', color: '#EF4444' }
        ]
      };
      break;

    // 6. Forum Diskusi
    case 'forum':
      category = 'portal';
      primaryTable = {
        id: 'forum_threads',
        name: 'Topik Diskusi & Thread Forum',
        primaryKey: 'id',
        columns: [
          { key: 'idThread', label: 'ID Thread', type: 'text', required: true },
          { key: 'judulTopik', label: 'Judul Topik Diskusi', type: 'text', required: true },
          { key: 'kategori', label: 'Kanal Kategori', type: 'badge', options: ['Diskusi Umum', 'Tanya Solusi & Bantuan', 'Tips & Tutorial', 'Pengumuman Resmi'] },
          { key: 'penulis', label: 'Pembuat Thread', type: 'text', required: true },
          { key: 'balasan', label: 'Jumlah Balasan', type: 'number', required: true },
          { key: 'statusModerasi', label: 'Status Topik', type: 'status', options: ['Aktif Terbuka', 'Pinned / Sorotan', 'Terkunci', 'Ditutup / Spam'] },
          { key: 'whatsapp', label: 'WhatsApp Moderator', type: 'phone', required: true },
        ],
        records: [
          { id: '1', idThread: 'THR-001', judulTopik: 'Panduan Memulai Bisnis Digital 2026 Tanpa Modal Besar', kategori: 'Tips & Tutorial', penulis: 'Bobi Tech', balasan: 42, statusModerasi: 'Pinned / Sorotan', whatsapp: '081299887711' },
          { id: '2', idThread: 'THR-002', judulTopik: 'Tanya: Rekomendasi Framework Web Terbaik untuk UMKM', kategori: 'Tanya Solusi & Bantuan', penulis: 'Rian Dev', balasan: 19, statusModerasi: 'Aktif Terbuka', whatsapp: '081377889922' },
          { id: '3', idThread: 'THR-003', judulTopik: 'Aturan Komunitas & Panduan Berdiskusi yang Santun', kategori: 'Pengumuman Resmi', penulis: 'Admin Forum', balasan: 8, statusModerasi: 'Pinned / Sorotan', whatsapp: '081566778833' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Total Thread Diskusi', value: '56 Topik', change: '+12 topik minggu ini', trend: 'up', icon: 'MessageCircle', color: 'blue' },
        { id: 'm2', label: 'Total Komentar Balasan', value: '384 Komentar', change: 'Komunitas sangat aktif', trend: 'up', icon: 'Users', color: 'green' },
        { id: 'm3', label: 'Topik Pinned Penting', value: '2 Pengumuman', change: 'Dipantau moderator', trend: 'neutral', icon: 'Sparkles', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'forum_threads',
        statusColumnKey: 'statusModerasi',
        titleColumnKey: 'judulTopik',
        subtitleColumnKey: 'penulis',
        valueColumnKey: 'balasan',
        stages: [
          { id: 'Pinned / Sorotan', name: 'Pinned / Sorotan', color: '#F59E0B' },
          { id: 'Aktif Terbuka', name: 'Aktif Terbuka', color: '#10B981' },
          { id: 'Terkunci', name: 'Terkunci', color: '#94A3B8' },
          { id: 'Ditutup / Spam', name: 'Ditutup / Spam', color: '#EF4444' }
        ]
      };
      break;

    // 7. Marketplace Jual Beli Multi-Vendor
    case 'marketplace':
      category = 'portal';
      primaryTable = {
        id: 'marketplace_products',
        name: 'Katalog Marketplace Multi-Lapak',
        primaryKey: 'id',
        columns: [
          { key: 'kodeProduk', label: 'Kode Produk', type: 'text', required: true },
          { key: 'namaProduk', label: 'Nama Produk', type: 'text', required: true },
          { key: 'namaLapak', label: 'Nama Toko / Lapak', type: 'text', required: true },
          { key: 'kategori', label: 'Kategori', type: 'badge', options: ['Pakaian & Fashion', 'Kuliner & Snack', 'Kerajinan Tangan', 'Elektronik Rumah', 'Kecantikan'] },
          { key: 'harga', label: 'Harga Produk (Rp)', type: 'currency', required: true },
          { key: 'kota', label: 'Kota Pengiriman', type: 'text', required: true },
          { key: 'status', label: 'Status Lapak', type: 'status', options: ['Aktif Tayang', 'Lapak Terverifikasi', 'Stok Kosong', 'Disuspend'] },
          { key: 'whatsapp', label: 'WhatsApp Penjual', type: 'phone', required: true },
        ],
        records: [
          { id: '1', kodeProduk: 'MKT-01', namaProduk: 'Kemeja Batik Tulis Pekalongan Katun Halus', namaLapak: 'Batik Pusaka Jaya', kategori: 'Pakaian & Fashion', harga: 275000, kota: 'Pekalongan', status: 'Lapak Terverifikasi', whatsapp: '081288990011' },
          { id: '2', kodeProduk: 'MKT-02', namaProduk: 'Kopi Robusta Temanggung Roast Medium 250g', namaLapak: 'Kopi Lereng Sindoro', kategori: 'Kuliner & Snack', harga: 48000, kota: 'Temanggung', status: 'Aktif Tayang', whatsapp: '081377889922' },
          { id: '3', kodeProduk: 'MKT-03', namaProduk: 'Tas Anyaman Kulit Sintetis Handcrafted', namaLapak: 'Kriya Art Studio', kategori: 'Kerajinan Tangan', harga: 185000, kota: 'Yogyakarta', status: 'Aktif Tayang', whatsapp: '081566778833' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Total Produk Terdaftar', value: '142 Produk', change: 'Dari 28 lapak lokal', trend: 'up', icon: 'FolderGit2', color: 'blue' },
        { id: 'm2', label: 'Lapak Terverifikasi', value: '28 Seller', change: 'Koleksi penjual terpercaya', trend: 'up', icon: 'ShieldCheck', color: 'green' },
        { id: 'm3', label: 'Omset Transaksi Mitra (Rp)', value: 'Rp 14.850.000', change: 'Bulan berjalan', trend: 'up', icon: 'BadgeDollarSign', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'marketplace_products',
        statusColumnKey: 'status',
        titleColumnKey: 'namaProduk',
        subtitleColumnKey: 'namaLapak',
        valueColumnKey: 'harga',
        stages: [
          { id: 'Aktif Tayang', name: 'Aktif Tayang', color: '#3B82F6' },
          { id: 'Lapak Terverifikasi', name: 'Terverifikasi Resmi', color: '#10B981' },
          { id: 'Stok Kosong', name: 'Stok Habis', color: '#F59E0B' },
          { id: 'Disuspend', name: 'Disuspend', color: '#EF4444' }
        ]
      };
      break;

    // 8. Website Berita / Media Online
    case 'news':
      category = 'portal';
      primaryTable = {
        id: 'news_articles',
        name: 'Artikel & Berita Redaksi',
        primaryKey: 'id',
        columns: [
          { key: 'kodeBerita', label: 'Kode Berita', type: 'text', required: true },
          { key: 'judul', label: 'Judul Berita', type: 'text', required: true },
          { key: 'rubrik', label: 'Rubrik Kategori', type: 'badge', options: ['Nasional & Politik', 'Ekonomi & Bisnis', 'Teknologi & Sains', 'Olahraga', 'Gaya Hidup'] },
          { key: 'wartawan', label: 'Wartawan / Penulis', type: 'text', required: true },
          { key: 'tglTerbit', label: 'Tanggal Terbit', type: 'date', required: true },
          { key: 'views', label: 'Total Pembaca', type: 'number' },
          { key: 'status', label: 'Status Publikasi', type: 'status', options: ['Draft Redaksi', 'Review Editor', 'Sudah Tayang', 'Arsip'] },
          { key: 'whatsapp', label: 'WhatsApp Redaksi', type: 'phone', required: true },
        ],
        records: [
          { id: '1', kodeBerita: 'NWS-101', judul: 'Pertumbuhan Ekonomi Digital Indonesia Diproyeksi Tembus Rp 1.500 Triliun', rubrik: 'Ekonomi & Bisnis', wartawan: 'Budi Jurnalis', tglTerbit: '2026-11-08', views: 4210, status: 'Sudah Tayang', whatsapp: '081288990011' },
          { id: '2', kodeBerita: 'NWS-102', judul: 'Inovasi Kendaraan Listrik Karya Mahasiswa Siap Uji Jalan Antar Kota', rubrik: 'Teknologi & Sains', wartawan: 'Dian Permata', tglTerbit: '2026-11-09', views: 1840, status: 'Sudah Tayang', whatsapp: '081377889922' },
          { id: '3', kodeBerita: 'NWS-103', judul: 'Kesiapan Infrastruktur Transportasi Publik Menghadapi Libur Akhir Tahun', rubrik: 'Nasional & Politik', wartawan: 'Agus Santoso', tglTerbit: '2026-11-09', views: 0, status: 'Review Editor', whatsapp: '081566778833' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Total Pembaca Hari Ini', value: '18.450 Views', change: '+32% vs kemarin', trend: 'up', icon: 'Users', color: 'blue' },
        { id: 'm2', label: 'Berita Tayang Aktif', value: '42 Artikel', change: 'Kategori terlengkap', trend: 'up', icon: 'CheckCircle2', color: 'green' },
        { id: 'm3', label: 'Antrean Review Editor', value: '3 Naskah', change: 'Siap tayang siang ini', trend: 'neutral', icon: 'Clock', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'news_articles',
        statusColumnKey: 'status',
        titleColumnKey: 'judul',
        subtitleColumnKey: 'wartawan',
        valueColumnKey: 'views',
        stages: [
          { id: 'Draft Redaksi', name: 'Draft Wartawan', color: '#94A3B8' },
          { id: 'Review Editor', name: 'Review Editor', color: '#F59E0B' },
          { id: 'Sudah Tayang', name: 'Tayang Online', color: '#10B981' },
          { id: 'Arsip', name: 'Arsip Berita', color: '#64748B' }
        ]
      };
      break;

    // 9. Job Portal / Lowongan Kerja
    case 'jobportal':
      category = 'portal';
      primaryTable = {
        id: 'job_listings',
        name: 'Daftar Lowongan Kerja & Pelamar',
        primaryKey: 'id',
        columns: [
          { key: 'kodeLoker', label: 'Kode Loker', type: 'text', required: true },
          { key: 'posisi', label: 'Posisi Pekerjaan', type: 'text', required: true },
          { key: 'perusahaan', label: 'Nama Perusahaan', type: 'text', required: true },
          { key: 'lokasi', label: 'Lokasi Kerja', type: 'badge', options: ['Jakarta (WFO)', 'Surabaya (Hybrid)', 'Bandung (WFO)', 'Remote Seluruh Indonesia'] },
          { key: 'gaji', label: 'Kisaran Gaji (Rp)', type: 'currency', required: true },
          { key: 'status', label: 'Status Loker', type: 'status', options: ['Membuka Lamaran', 'Tahap Wawancara', 'Posisi Terisi', 'Lowongan Ditutup'] },
          { key: 'whatsapp', label: 'WhatsApp HRD Perekrut', type: 'phone', required: true },
        ],
        records: [
          { id: '1', kodeLoker: 'JOB-201', posisi: 'Frontend React Developer', perusahaan: 'PT Sinergi Teknologi', lokasi: 'Remote Seluruh Indonesia', gaji: 8500000, status: 'Membuka Lamaran', whatsapp: '081288990011' },
          { id: '2', kodeLoker: 'JOB-202', posisi: 'Digital Marketing & Content Lead', perusahaan: 'Nalarasa Creative Studio', lokasi: 'Jakarta (WFO)', gaji: 7000000, status: 'Tahap Wawancara', whatsapp: '081377889922' },
          { id: '3', kodeLoker: 'JOB-203', posisi: 'Staf Administrasi & Kasir Gudang', perusahaan: 'CV Makmur Sejahtera', lokasi: 'Surabaya (Hybrid)', gaji: 4800000, status: 'Membuka Lamaran', whatsapp: '081566778833' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Loker Aktif Dibuka', value: '24 Lowongan', change: 'Dari 18 perusahaan', trend: 'up', icon: 'FolderGit2', color: 'blue' },
        { id: 'm2', label: 'Lamaran Masuk Minggu Ini', value: '142 Pelamar', change: 'Antusiasme tinggi', trend: 'up', icon: 'Users', color: 'green' },
        { id: 'm3', label: 'Rata-rata Gaji Ditawarkan', value: 'Rp 6.750.000', change: 'Transparan & adil', trend: 'neutral', icon: 'BadgeDollarSign', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'job_listings',
        statusColumnKey: 'status',
        titleColumnKey: 'posisi',
        subtitleColumnKey: 'perusahaan',
        valueColumnKey: 'gaji',
        stages: [
          { id: 'Membuka Lamaran', name: 'Membuka Lamaran', color: '#3B82F6' },
          { id: 'Tahap Wawancara', name: 'Tahap Wawancara', color: '#F59E0B' },
          { id: 'Posisi Terisi', name: 'Posisi Terisi', color: '#10B981' },
          { id: 'Lowongan Ditutup', name: 'Ditutup', color: '#EF4444' }
        ]
      };
      break;

    // 10. Website Desa & Kelurahan
    case 'village':
      category = 'portal';
      primaryTable = {
        id: 'village_services',
        name: 'Pelayanan Surat Administrasi Desa',
        primaryKey: 'id',
        columns: [
          { key: 'noSurat', label: 'No. Registrasi', type: 'text', required: true },
          { key: 'namaWarga', label: 'Nama Pemohon Warga', type: 'text', required: true },
          { key: 'nik', label: 'NIK Pemohon', type: 'text', required: true },
          { key: 'dusun', label: 'Dusun / RT-RW', type: 'text', required: true },
          { key: 'jenisSurat', label: 'Jenis Surat Pengantar', type: 'badge', options: ['Surat Pengantar SKCK', 'Surat Keterangan Domisili', 'Surat Keterangan Usaha (SKU)', 'Surat Keterangan Tidak Mampu (SKTM)', 'Surat Kematian/Kelahiran'] },
          { key: 'status', label: 'Status Permohonan', type: 'status', options: ['Pengajuan Baru', 'Verifikasi Kepala Dusun', 'Ditandatangani Kades', 'Surat Siap Ambil'] },
          { key: 'whatsapp', label: 'WhatsApp Warga', type: 'phone', required: true },
        ],
        records: [
          { id: '1', noSurat: 'REG-DS/2026/041', namaWarga: 'Bapak Slamet Raharjo', nik: '3515081203750001', dusun: 'Dusun Krajan RT 02 / RW 01', jenisSurat: 'Surat Keterangan Usaha (SKU)', status: 'Surat Siap Ambil', whatsapp: '081288990011' },
          { id: '2', noSurat: 'REG-DS/2026/042', namaWarga: 'Ibu Endang Sri Lestari', nik: '3515085507820003', dusun: 'Dusun Sukamaju RT 05 / RW 02', jenisSurat: 'Surat Pengantar SKCK', status: 'Ditandatangani Kades', whatsapp: '081377889922' },
          { id: '3', noSurat: 'REG-DS/2026/043', namaWarga: 'Mas Bayu Aji Pratama', nik: '3515082104010002', dusun: 'Dusun Krajan RT 01 / RW 01', jenisSurat: 'Surat Keterangan Domisili', status: 'Verifikasi Kepala Dusun', whatsapp: '081566778833' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Surat Selesai Diterbitkan', value: '184 Surat', change: 'Pelayanan cepat warga', trend: 'up', icon: 'CheckCircle2', color: 'green' },
        { id: 'm2', label: 'Warga Terlayani Bulan Ini', value: '72 Warga', change: 'Waktu proses < 24 jam', trend: 'up', icon: 'Users', color: 'blue' },
        { id: 'm3', label: 'Realisasi Dana Desa APBDes', value: 'Rp 645.000.000', change: 'Transparansi anggaran', trend: 'neutral', icon: 'Coins', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'village_services',
        statusColumnKey: 'status',
        titleColumnKey: 'namaWarga',
        subtitleColumnKey: 'jenisSurat',
        valueColumnKey: 'dusun',
        stages: [
          { id: 'Pengajuan Baru', name: 'Pengajuan Baru', color: '#94A3B8' },
          { id: 'Verifikasi Kepala Dusun', name: 'Verifikasi Dusun', color: '#F59E0B' },
          { id: 'Ditandatangani Kades', name: 'TTD Kades', color: '#3B82F6' },
          { id: 'Surat Siap Ambil', name: 'Siap Ambil di Kantor', color: '#10B981' }
        ]
      };
      break;

    // 11. Website Pemerintah & Dinas
    case 'government':
      category = 'portal';
      primaryTable = {
        id: 'gov_services',
        name: 'Permohonan Layanan Publik & Aduan',
        primaryKey: 'id',
        columns: [
          { key: 'noTiket', label: 'No. Tiket Layanan', type: 'text', required: true },
          { key: 'layanan', label: 'Jenis Layanan / Aduan', type: 'badge', options: ['Izin Operasional Usaha', 'Sertifikasi Laik Sehat', 'Aspirasi & Pengaduan Fasilitas', 'Bantuan Sosial Terpadu'] },
          { key: 'pemohon', label: 'Nama Pemohon Warga', type: 'text', required: true },
          { key: 'instansi', label: 'Instansi / Seksi Terkait', type: 'text', required: true },
          { key: 'tglMasuk', label: 'Tanggal Masuk', type: 'date', required: true },
          { key: 'status', label: 'Status Pelayanan', type: 'status', options: ['Berkas Diterima', 'Verifikasi Petugas', 'Siap Diterbitkan', 'Selesai Diberikan'] },
          { key: 'whatsapp', label: 'WhatsApp Pemohon', type: 'phone', required: true },
        ],
        records: [
          { id: '1', noTiket: 'GOV-2026-081', layanan: 'Izin Operasional Usaha', pemohon: 'PT Mandiri Sentosa', instansi: 'Dinas Penanaman Modal & PTSP', tglMasuk: '2026-11-05', status: 'Selesai Diberikan', whatsapp: '081288990011' },
          { id: '2', noTiket: 'GOV-2026-082', layanan: 'Aspirasi & Pengaduan Fasilitas', pemohon: 'Warga RT 04 Sukamaju', instansi: 'Dinas Bina Marga & Jalan', tglMasuk: '2026-11-08', status: 'Verifikasi Petugas', whatsapp: '081377889922' },
          { id: '3', noTiket: 'GOV-2026-083', layanan: 'Sertifikasi Laik Sehat', pemohon: 'Kedai Kopi Sehat', instansi: 'Dinas Kesehatan Kota', tglMasuk: '2026-11-09', status: 'Berkas Diterima', whatsapp: '081566778833' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Indeks Kepuasan Masyarakat', value: '88.5 / 100', change: 'Kategori Sangat Baik (A)', trend: 'up', icon: 'ShieldCheck', color: 'green' },
        { id: 'm2', label: 'Layanan Selesai Bulan Ini', value: '312 Berkas', change: 'Rata-rata 2 hari kerja', trend: 'up', icon: 'CheckCircle2', color: 'blue' },
        { id: 'm3', label: 'Aduan Ditindaklanjuti', value: '96%', change: 'Respon cepat pengawas', trend: 'up', icon: 'Clock', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'gov_services',
        statusColumnKey: 'status',
        titleColumnKey: 'pemohon',
        subtitleColumnKey: 'layanan',
        valueColumnKey: 'instansi',
        stages: [
          { id: 'Berkas Diterima', name: 'Berkas Diterima', color: '#94A3B8' },
          { id: 'Verifikasi Petugas', name: 'Verifikasi Petugas', color: '#F59E0B' },
          { id: 'Siap Diterbitkan', name: 'Siap Diterbitkan', color: '#3B82F6' },
          { id: 'Selesai Diberikan', name: 'Selesai Tuntas', color: '#10B981' }
        ]
      };
      break;

    // 12. Web Sekolah
    case 'school':
      category = 'portal';
      primaryTable = {
        id: 'school_events',
        name: 'Agenda & Pengumuman Sekolah',
        primaryKey: 'id',
        columns: [
          { key: 'kodeAgenda', label: 'Kode Agenda', type: 'text', required: true },
          { key: 'namaKegiatan', label: 'Nama Kegiatan / Pengumuman', type: 'text', required: true },
          { key: 'penanggungJawab', label: 'Guru / Penanggung Jawab', type: 'text', required: true },
          { key: 'tglPelaksanaan', label: 'Tanggal Pelaksanaan', type: 'date', required: true },
          { key: 'kategori', label: 'Kategori', type: 'badge', options: ['Akademik & Ujian', 'Ekstrakurikuler', 'Rapat Wali Murid', 'Pentas Seni & Prestasi'] },
          { key: 'status', label: 'Status Agenda', type: 'status', options: ['Rencana Persiapan', 'Sedang Berlangsung', 'Selesai Terlaksana'] },
          { key: 'whatsapp', label: 'WhatsApp Panitia', type: 'phone', required: true },
        ],
        records: [
          { id: '1', kodeAgenda: 'SCH-01', namaKegiatan: 'Asesmen Sumatif Akhir Semester Ganjil', penanggungJawab: 'Drs. Subagyo M.Pd', tglPelaksanaan: '2026-11-25', kategori: 'Akademik & Ujian', status: 'Rencana Persiapan', whatsapp: '081288990011' },
          { id: '2', kodeAgenda: 'SCH-02', namaKegiatan: 'Pentas Seni Budaya & Gelar Karya P5', penanggungJawab: 'Ibu Ratna Sari S.Pd', tglPelaksanaan: '2026-12-10', kategori: 'Pentas Seni & Prestasi', status: 'Rencana Persiapan', whatsapp: '081377889922' },
          { id: '3', kodeAgenda: 'SCH-03', namaKegiatan: 'Pertemuan Komite & Konsultasi Rapor Siswa', penanggungJawab: 'H. Suwandi S.Ag', tglPelaksanaan: '2026-11-15', kategori: 'Rapat Wali Murid', status: 'Sedang Berlangsung', whatsapp: '081566778833' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Total Siswa Terdaftar', value: '720 Siswa', change: '24 rombongan belajar', trend: 'up', icon: 'Users', color: 'blue' },
        { id: 'm2', label: 'Guru & Tenaga Pendidik', value: '48 Guru', change: '100% tersertifikasi', trend: 'neutral', icon: 'ShieldCheck', color: 'green' },
        { id: 'm3', label: 'Agenda Kegiatan Bulan Ini', value: '6 Agenda', change: 'Jadwal terkoordinasi', trend: 'up', icon: 'CalendarDays', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'school_events',
        statusColumnKey: 'status',
        titleColumnKey: 'namaKegiatan',
        subtitleColumnKey: 'penanggungJawab',
        valueColumnKey: 'tglPelaksanaan',
        stages: [
          { id: 'Rencana Persiapan', name: 'Rencana Persiapan', color: '#F59E0B' },
          { id: 'Sedang Berlangsung', name: 'Sedang Berjalan', color: '#3B82F6' },
          { id: 'Selesai Terlaksana', name: 'Selesai Sukses', color: '#10B981' }
        ]
      };
      break;

    // 13. Website Perusahaan (Corporate)
    case 'corporate':
      category = 'portal';
      primaryTable = {
        id: 'corporate_inquiries',
        name: 'Proyek Kerjasama & Permintaan Klien B2B',
        primaryKey: 'id',
        columns: [
          { key: 'noInquiry', label: 'No. Inquiry', type: 'text', required: true },
          { key: 'namaKlien', label: 'Nama Perusahaan / Mitra', type: 'text', required: true },
          { key: 'bidang', label: 'Bidang Kerjasama', type: 'badge', options: ['Kontraktor Konstruksi', 'Pengadaan IT & Software', 'Manufaktur & Suplai', 'Konsultan Manajemen'] },
          { key: 'nilaiKontrak', label: 'Estimasi Nilai Kontrak (Rp)', type: 'currency', required: true },
          { key: 'pic', label: 'Nama PIC Klien', type: 'text', required: true },
          { key: 'status', label: 'Status Kerjasama', type: 'status', options: ['Prospek Masuk', 'Penjajakan / NDA', 'MoU Disepakati', 'Proyek Berjalan Aktif'] },
          { key: 'whatsapp', label: 'WhatsApp PIC', type: 'phone', required: true },
        ],
        records: [
          { id: '1', noInquiry: 'CORP-501', namaKlien: 'PT Nusantara Mega Properti', bidang: 'Kontraktor Konstruksi', nilaiKontrak: 1250000000, pic: 'Ir. Bambang Trihatmojo', status: 'Proyek Berjalan Aktif', whatsapp: '081288990011' },
          { id: '2', noInquiry: 'CORP-502', namaKlien: 'CV Global Solusindo Mandiri', bidang: 'Pengadaan IT & Software', nilaiKontrak: 450000000, pic: 'Ibu Maya Hartati', status: 'MoU Disepakati', whatsapp: '081377889922' },
          { id: '3', noInquiry: 'CORP-503', namaKlien: 'PT Berkah Pangan Makmur', bidang: 'Manufaktur & Suplai', nilaiKontrak: 850000000, pic: 'Pak Danu Setiawan', status: 'Penjajakan / NDA', whatsapp: '081566778833' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Total Nilai Kontrak MoU (Rp)', value: 'Rp 2.550.000.000', change: '+45% tahun ini', trend: 'up', icon: 'BadgeDollarSign', color: 'green' },
        { id: 'm2', label: 'Mitra Korporat Aktif', value: '18 Perusahaan', change: 'Kemitraan jangka panjang', trend: 'up', icon: 'Building2', color: 'blue' },
        { id: 'm3', label: 'Inquiry B2B Baru', value: '3 Klien Masuk', change: 'Proses penawaran harga', trend: 'neutral', icon: 'Clock', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'corporate_inquiries',
        statusColumnKey: 'status',
        titleColumnKey: 'namaKlien',
        subtitleColumnKey: 'bidang',
        valueColumnKey: 'nilaiKontrak',
        stages: [
          { id: 'Prospek Masuk', name: 'Inquiry Baru Masuk', color: '#94A3B8' },
          { id: 'Penjajakan / NDA', name: 'Penjajakan Teknis', color: '#F59E0B' },
          { id: 'MoU Disepakati', name: 'MoU Kontrak Sepakat', color: '#3B82F6' },
          { id: 'Proyek Berjalan Aktif', name: 'Proyek Aktif', color: '#10B981' }
        ]
      };
      break;

    // 14. Website Profile (Personal & Jasa Profesional)
    case 'profile':
      category = 'portal';
      primaryTable = {
        id: 'profile_services',
        name: 'Katalog Layanan & Konsultasi Portofolio',
        primaryKey: 'id',
        columns: [
          { key: 'kodeLayanan', label: 'Kode Paket', type: 'text', required: true },
          { key: 'namaLayanan', label: 'Nama Paket Layanan', type: 'text', required: true },
          { key: 'kategori', label: 'Kategori', type: 'badge', options: ['Desain & Branding', 'Website & App', 'Konsultasi Bisnis', 'Audit & Legalitas'] },
          { key: 'tarif', label: 'Tarif Investasi (Rp)', type: 'currency', required: true },
          { key: 'estimasiWaktu', label: 'Estimasi Pengerjaan', type: 'text', required: true },
          { key: 'status', label: 'Status Layanan', type: 'status', options: ['Tersedia / Siap Kerjakan', 'Slot Booking Terisi', 'Konsultasi Khusus'] },
          { key: 'whatsapp', label: 'WhatsApp Kontak Langsung', type: 'phone', required: true },
        ],
        records: [
          { id: '1', kodeLayanan: 'SRV-01', namaLayanan: 'Pembuatan Website Profesional Bisnis', kategori: 'Website & App', tarif: 4500000, estimasiWaktu: '7 Hari Kerja', status: 'Tersedia / Siap Kerjakan', whatsapp: '081288990011' },
          { id: '2', kodeLayanan: 'SRV-02', namaLayanan: 'Desain Brand Identity & Logo Korporat', kategori: 'Desain & Branding', tarif: 2500000, estimasiWaktu: '4 Hari Kerja', status: 'Slot Booking Terisi', whatsapp: '081377889922' },
          { id: '3', kodeLayanan: 'SRV-03', namaLayanan: 'Konsultasi Transformasi Digital UMKM', kategori: 'Konsultasi Bisnis', tarif: 1500000, estimasiWaktu: '2 Jam Sesi Khusus', status: 'Tersedia / Siap Kerjakan', whatsapp: '081566778833' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Rating Kepuasan Klien', value: '4.98 / 5.0', change: 'Berdasarkan 85+ ulasan', trend: 'up', icon: 'Sparkles', color: 'yellow' },
        { id: 'm2', label: 'Proyek Selesai Dikerjakan', value: '124 Proyek', change: 'Klien dari 8 kota', trend: 'up', icon: 'CheckCircle2', color: 'green' },
        { id: 'm3', label: 'Slot Kerja Tersedia', value: '2 Slot Minggu Ini', change: 'Siap mulai kerja', trend: 'neutral', icon: 'Calendar', color: 'blue' },
      ];
      kanban = {
        enabled: true,
        tableId: 'profile_services',
        statusColumnKey: 'status',
        titleColumnKey: 'namaLayanan',
        subtitleColumnKey: 'estimasiWaktu',
        valueColumnKey: 'tarif',
        stages: [
          { id: 'Tersedia / Siap Kerjakan', name: 'Tersedia (Bisa Dipesan)', color: '#10B981' },
          { id: 'Slot Booking Terisi', name: 'Sedang Dikerjakan', color: '#F59E0B' },
          { id: 'Konsultasi Khusus', name: 'Konsultasi Khusus', color: '#3B82F6' }
        ]
      };
      break;

    // 15. Web Landing Page (Sales & Leads)
    case 'landingpage':
      category = 'portal';
      primaryTable = {
        id: 'landing_leads',
        name: 'Pesanan & Prospek Masuk Landing Page',
        primaryKey: 'id',
        columns: [
          { key: 'noOrder', label: 'No. Prospek', type: 'text', required: true },
          { key: 'namaPembeli', label: 'Nama Pembeli / Prospek', type: 'text', required: true },
          { key: 'paketPilihan', label: 'Paket Promo Pilihan', type: 'badge', options: ['Paket Hemat 1 Box', 'Paket Promo 2 Box (Best Seller)', 'Paket Family 5 Box (Diskon 40%)'] },
          { key: 'nilaiPesanan', label: 'Total Bayar (Rp)', type: 'currency', required: true },
          { key: 'alamatKota', label: 'Kota Tujuan', type: 'text', required: true },
          { key: 'status', label: 'Status Prospek', type: 'status', options: ['Lead Masuk', 'Chat WhatsApp', 'Deal Closing', 'Batal'] },
          { key: 'whatsapp', label: 'WhatsApp Pembeli', type: 'phone', required: true },
        ],
        records: [
          { id: '1', noOrder: 'LEAD-701', namaPembeli: 'Kak Salsa Bila', paketPilihan: 'Paket Promo 2 Box (Best Seller)', nilaiPesanan: 299000, alamatKota: 'Bandung', status: 'Deal Closing', whatsapp: '081288990011' },
          { id: '2', noOrder: 'LEAD-702', namaPembeli: 'Mas Dimas Kurnia', paketPilihan: 'Paket Family 5 Box (Diskon 40%)', nilaiPesanan: 599000, alamatKota: 'Semarang', status: 'Chat WhatsApp', whatsapp: '081377889922' },
          { id: '3', noOrder: 'LEAD-703', namaPembeli: 'Ibu Ratna Dewi', paketPilihan: 'Paket Hemat 1 Box', nilaiPesanan: 169000, alamatKota: 'Jakarta Timur', status: 'Lead Masuk', whatsapp: '081566778833' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Tingkat Konversi Landing Page', value: '14.8%', change: 'Di atas rata-rata industri', trend: 'up', icon: 'BadgePercent', color: 'green' },
        { id: 'm2', label: 'Omset Penjualan Masuk (Rp)', value: 'Rp 1.067.000', change: 'Total dari 3 transaksi', trend: 'up', icon: 'BadgeDollarSign', color: 'blue' },
        { id: 'm3', label: 'Leads Menunggu Respon', value: '1 Chat Masuk', change: 'Siap difollow up', trend: 'neutral', icon: 'MessageCircle', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'landing_leads',
        statusColumnKey: 'status',
        titleColumnKey: 'namaPembeli',
        subtitleColumnKey: 'paketPilihan',
        valueColumnKey: 'nilaiPesanan',
        stages: [
          { id: 'Lead Masuk', name: 'Lead Masuk', color: '#94A3B8' },
          { id: 'Chat WhatsApp', name: 'Chat WhatsApp', color: '#F59E0B' },
          { id: 'Deal Closing', name: 'Deal Closing (Lunas)', color: '#10B981' },
          { id: 'Batal', name: 'Batal / Tidak Respon', color: '#EF4444' }
        ]
      };
      break;

    // 16. Web Toko Online & E-Commerce
    case 'ecommerce':
      category = 'portal';
      primaryTable = {
        id: 'ecommerce_orders',
        name: 'Pesanan Masuk & Keranjang Toko Online',
        primaryKey: 'id',
        columns: [
          { key: 'noInvoice', label: 'No. Invoice', type: 'text', required: true },
          { key: 'namaPembeli', label: 'Nama Pembeli', type: 'text', required: true },
          { key: 'rincianProduk', label: 'Rincian Produk Belanja', type: 'text', required: true },
          { key: 'metode', label: 'Metode Pembayaran', type: 'badge', options: ['QRIS Instan', 'Transfer Bank BCA', 'Bayar di Tempat (COD)'] },
          { key: 'totalBayar', label: 'Total Bayar (Rp)', type: 'currency', required: true },
          { key: 'status', label: 'Status Pesanan', type: 'status', options: ['Menunggu Pembayaran', 'Pesanan Dipacking', 'Sedang Dikirim', 'Selesai Diterima'] },
          { key: 'whatsapp', label: 'WhatsApp Pembeli', type: 'phone', required: true },
        ],
        records: [
          { id: '1', noInvoice: 'INV-SHOP-01', namaPembeli: 'Kak Cindy Aulia', rincianProduk: '2x Kaos Polos Combed 30s Hitam (L), 1x Hoodie Abu (XL)', metode: 'QRIS Instan', totalBayar: 285000, status: 'Selesai Diterima', whatsapp: '081288990011' },
          { id: '2', noInvoice: 'INV-SHOP-02', namaPembeli: 'Mas Hendra Gunawan', rincianProduk: '1x Sepatu Sneakers Kanvas Putih (Size 42)', metode: 'Transfer Bank BCA', totalBayar: 320000, status: 'Sedang Dikirim', whatsapp: '081377889922' },
          { id: '3', noInvoice: 'INV-SHOP-03', namaPembeli: 'Ibu Anita Rahayu', rincianProduk: '3x Hijab Segi Empat Voal Premium', metode: 'Bayar di Tempat (COD)', totalBayar: 135000, status: 'Pesanan Dipacking', whatsapp: '081566778833' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Omset Penjualan Hari Ini', value: 'Rp 740.000', change: '+22% vs target harian', trend: 'up', icon: 'BadgeDollarSign', color: 'green' },
        { id: 'm2', label: 'Pesanan Perlu Dipacking', value: '1 Pesanan', change: 'Ibu Anita (Hijab Voal)', trend: 'neutral', icon: 'Clock', color: 'yellow' },
        { id: 'm3', label: 'Total Produk Terjual', value: '7 Item', change: 'Katalog stok otomatis', trend: 'up', icon: 'CheckCircle2', color: 'blue' },
      ];
      kanban = {
        enabled: true,
        tableId: 'ecommerce_orders',
        statusColumnKey: 'status',
        titleColumnKey: 'namaPembeli',
        subtitleColumnKey: 'rincianProduk',
        valueColumnKey: 'totalBayar',
        stages: [
          { id: 'Menunggu Pembayaran', name: 'Menunggu Bayar', color: '#EF4444' },
          { id: 'Pesanan Dipacking', name: 'Sedang Dipacking', color: '#F59E0B' },
          { id: 'Sedang Dikirim', name: 'Sedang Dikirim', color: '#3B82F6' },
          { id: 'Selesai Diterima', name: 'Selesai Diterima', color: '#10B981' }
        ]
      };
      break;

    // 17. Aplikasi Android (Mobile-First Web App / PWA)
    case 'android_pwa':
      category = 'portal';
      primaryTable = {
        id: 'mobile_activities',
        name: 'Data Operasional Mobile App Android',
        primaryKey: 'id',
        columns: [
          { key: 'idAktivitas', label: 'ID Aktivitas', type: 'text', required: true },
          { key: 'namaKegiatan', label: 'Nama Kegiatan / Transaksi', type: 'text', required: true },
          { key: 'kategori', label: 'Kategori Mobile', type: 'badge', options: ['Pencatatan Cepat', 'Kunjungan Lapangan', 'Verifikasi Order', 'Laporan Harian'] },
          { key: 'nilaiTransaksi', label: 'Nilai Transaksi (Rp)', type: 'currency' },
          { key: 'status', label: 'Status Mobile', type: 'status', options: ['Tercatat di HP', 'Sedang Diproses', 'Sinkron Cloud Sukses'] },
          { key: 'whatsapp', label: 'WhatsApp Kontak', type: 'phone', required: true },
        ],
        records: [
          { id: '1', idAktivitas: 'MOB-101', namaKegiatan: 'Pemeriksaan Unit & Ceklist Lapangan', kategori: 'Kunjungan Lapangan', nilaiTransaksi: 250000, status: 'Sinkron Cloud Sukses', whatsapp: '081288990011' },
          { id: '2', idAktivitas: 'MOB-102', namaKegiatan: 'Pencatatan Order Masuk Kasir Mobile', kategori: 'Pencatatan Cepat', nilaiTransaksi: 180000, status: 'Sedang Diproses', whatsapp: '081377889922' },
          { id: '3', idAktivitas: 'MOB-103', namaKegiatan: 'Verifikasi Penerimaan Barang Toko', kategori: 'Verifikasi Order', nilaiTransaksi: 450000, status: 'Tercatat di HP', whatsapp: '081566778833' },
        ]
      };
      metrics = [
        { id: 'm1', label: 'Status PWA Android', value: 'Ready to Install', change: 'Bisa tambah ke Home Screen', trend: 'up', icon: 'Sparkles', color: 'green' },
        { id: 'm2', label: 'Responsivitas Mobile Layar', value: '100% Layar HP', change: 'Optimasi tombol jempol', trend: 'up', icon: 'CheckCircle2', color: 'blue' },
        { id: 'm3', label: 'Volume Transaksi Mobile', value: 'Rp 880.000', change: 'Sinkronisasi real-time', trend: 'up', icon: 'BadgeDollarSign', color: 'yellow' },
      ];
      kanban = {
        enabled: true,
        tableId: 'mobile_activities',
        statusColumnKey: 'status',
        titleColumnKey: 'namaKegiatan',
        subtitleColumnKey: 'kategori',
        valueColumnKey: 'nilaiTransaksi',
        stages: [
          { id: 'Tercatat di HP', name: 'Tercatat di HP', color: '#94A3B8' },
          { id: 'Sedang Diproses', name: 'Sedang Diproses', color: '#F59E0B' },
          { id: 'Sinkron Cloud Sukses', name: 'Sinkron Cloud Sukses', color: '#10B981' }
        ]
      };
      break;

    // 18. Rental Mobil & Kendaraan
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
        { id: 'm1', label: 'Unit Sedang Disewa', value: '1 Unit Keluar', change: 'Avanza Veloz aktif', trend: 'up', icon: 'CheckCircle2', color: 'blue' },
        { id: 'm2', label: 'Pendapatan Sewa (Rp)', value: 'Rp 3.300.000', change: 'Total 3 transaksi aktif', trend: 'up', icon: 'BadgeDollarSign', color: 'green' },
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

    // Remaining standard domains
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
        ]
      };
      metrics = [
        { id: 'm1', label: 'Total Aset Stok (Rp)', value: 'Rp 11.230.000', change: 'Nilai inventori gudang', trend: 'up', icon: 'FolderGit2', color: 'blue' },
        { id: 'm2', label: 'Perhatian: Stok Menipis', value: '1 Item', change: 'Cat Tembok sisa 8', trend: 'down', icon: 'AlertCircle', color: 'yellow' },
        { id: 'm3', label: 'Item Habis (Restock)', value: '1 Item', change: 'Mesin Bor Bosch', trend: 'down', icon: 'AlertCircle', color: 'red' },
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

    case 'pos':
      category = 'portal';
      primaryTable = {
        id: 'orders',
        name: 'Pesanan & Kasir Kedai',
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
        ]
      };
      metrics = [
        { id: 'm1', label: 'Omset Hari Ini', value: 'Rp 235.000', change: '+18% vs kemarin', trend: 'up', icon: 'BadgeDollarSign', color: 'blue' },
        { id: 'm2', label: 'Pesanan Aktif', value: '2 Order', change: 'Antrean lancar', trend: 'neutral', icon: 'Clock', color: 'yellow' },
        { id: 'm3', label: 'Total Cup Terjual', value: '9 Cup', change: 'Best seller: Gula Aren', trend: 'up', icon: 'CheckCircle2', color: 'green' },
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
        ]
      };
      metrics = [
        { id: 'm1', label: 'Pasien Hari Ini', value: '3 Pasien', change: '1 menunggu, 1 diperiksa', trend: 'up', icon: 'Users', color: 'blue' },
        { id: 'm2', label: 'Total Tindakan (Rp)', value: 'Rp 800.000', change: 'Koleksi pembayaran aktif', trend: 'up', icon: 'CheckCircle2', color: 'green' },
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
        ]
      };
      metrics = [
        { id: 'm1', label: 'Cucian Siap Ambil', value: '1 Nota (Rak B02)', change: 'Notifikasi WA terkirim', trend: 'up', icon: 'CheckCircle2', color: 'green' },
        { id: 'm2', label: 'Total Berat Cuci', value: '12.5 Kg', change: 'Kapasitas mesin normal', trend: 'neutral', icon: 'Coins', color: 'blue' },
        { id: 'm3', label: 'Kas Harian Terkumpul', value: 'Rp 175.000', change: 'Semua lunas di muka', trend: 'up', icon: 'BadgeDollarSign', color: 'yellow' },
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
        ]
      };
      metrics = [
        { id: 'm1', label: 'Total Nilai Pipeline', value: 'Rp 26.000.000', change: '+25% bulan ini', trend: 'up', icon: 'FolderGit2', color: 'blue' },
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
      const cleanSubject = prd.metadata.productName.replace(/aplikasi|sistem|web|portal|website/gi, '').trim() || 'Item Operasional';
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
        { id: 'm1', label: `Total ${cleanSubject}`, value: '3 Data', change: 'Aktif di sistem', trend: 'up', icon: 'FolderGit2', color: 'blue' },
        { id: 'm2', label: 'Total Nominal (Rp)', value: 'Rp 5.100.000', change: 'Terkalkulasi otomatis', trend: 'up', icon: 'BadgeDollarSign', color: 'green' },
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
