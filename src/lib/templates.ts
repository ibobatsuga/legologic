import { LegoApp, AppVersion } from '@/types/legologic';

export const CREATE_BLANK_APP = (): LegoApp => ({
  id: 'app-new-blank',
  slug: 'project-baru',
  name: 'Project Baru',
  description: 'Kanvas aplikasi baru yang bersih. Siap dibangun dari instruksi Anda.',
  category: 'custom',
  currentVersion: 0,
  isPublished: false,
  publishedSlug: 'project-baru',
  createdAt: '2026-11-09T00:00:00Z',
  updatedAt: '2026-11-09T00:00:00Z',
  organizationId: 'org-default',
  createdById: 'user-bobi',
  versions: []
});

export const SATU_PIPELINE_APP: LegoApp = {
  id: 'app-satupipeline',
  slug: 'satupipeline',
  name: 'SatuPipeline CRM',
  description: 'CRM lead generation, outreach consent-first, dan visual pipeline untuk UMKM & B2B Indonesia.',
  category: 'crm',
  currentVersion: 1,
  isPublished: true,
  publishedSlug: 'satupipeline',
  publishedAt: '2026-11-08T10:00:00Z',
  createdAt: '2026-11-08T09:00:00Z',
  updatedAt: '2026-11-08T10:00:00Z',
  organizationId: 'org-default',
  createdById: 'user-bobi',
  versions: [
    {
      versionNumber: 1,
      appName: 'SatuPipeline CRM',
      tagline: 'Lead → Outreach Berizin → Closing Terukur',
      changelog: 'Versi perdana: Visual Kanban Pipeline, Tabel Leads, dan Consent Verification.',
      promptUsed: 'Buatkan CRM sederhana dengan pipeline lead, outreach consent-first via WhatsApp, tracking estimasi nilai deal dalam Rupiah, dan status closing.',
      createdAt: '2026-11-08T09:00:00Z',
      mode: 'build',
      primaryColor: '#2563EB', // Blue Lego
      accentColor: '#F59E0B', // Yellow Lego
      quickActionLabel: '+ Tambah Prospek Baru',
      quickActionTargetTable: 'leads',
      metrics: [
        { id: 'm1', label: 'Total Prospek', value: '48 Leads', change: '+12% minggu ini', trend: 'up', icon: 'Users', color: 'blue' },
        { id: 'm2', label: 'Deal Aktif di Pipeline', value: '18 Deals', change: '8 butuh follow-up', trend: 'neutral', icon: 'GitPullRequest', color: 'yellow' },
        { id: 'm3', label: 'Estimasi Nilai Pipeline', value: 'Rp 142.500.000', change: '+Rp 28jt deal baru', trend: 'up', icon: 'BadgeDollarSign', color: 'green' },
        { id: 'm4', label: 'Consent Verified', value: '92.4%', change: 'Consent-first compliance', trend: 'up', icon: 'ShieldCheck', color: 'red' },
      ],
      pages: [
        { id: 'p1', name: 'Ringkasan & Pipeline', icon: 'Kanban', type: 'kanban', tableId: 'leads', description: 'Geser kartu prospek untuk mengubah status perjalanan deal.' },
        { id: 'p2', name: 'Database Leads', icon: 'Table', type: 'table', tableId: 'leads', description: 'Daftar lengkap kontak prospek, info perusahaan, dan status consent.' },
        { id: 'p3', name: 'Log Outreach & Follow-up', icon: 'Clock', type: 'table', tableId: 'activities', description: 'Catatan setiap interaksi telepon, chat WA, dan kirim penawaran.' },
      ],
      tables: [
        {
          id: 'leads',
          name: 'Daftar Prospek (Leads)',
          primaryKey: 'id',
          columns: [
            { key: 'nama', label: 'Nama Kontak', type: 'text', required: true },
            { key: 'perusahaan', label: 'Perusahaan / Brand', type: 'text' },
            { key: 'whatsapp', label: 'WhatsApp', type: 'phone', required: true },
            { 
              key: 'status', 
              label: 'Tahap Pipeline', 
              type: 'status',
              options: ['Lead Baru', 'Outreach Terkirim', 'Presentasi Demo', 'Negosiasi Harga', 'Closing (Won)', 'Batal (Lost)'],
              badgeColors: {
                'Lead Baru': 'blue',
                'Outreach Terkirim': 'yellow',
                'Presentasi Demo': 'purple',
                'Negosiasi Harga': 'amber',
                'Closing (Won)': 'green',
                'Batal (Lost)': 'red',
              }
            },
            { key: 'nilai', label: 'Estimasi Nilai (Rp)', type: 'currency' },
            { 
              key: 'consent', 
              label: 'Status Izin (Consent)', 
              type: 'badge',
              options: ['Diberikan (Opt-in)', 'Pending Konfirmasi', 'Ditolak'],
              badgeColors: {
                'Diberikan (Opt-in)': 'green',
                'Pending Konfirmasi': 'yellow',
                'Ditolak': 'red'
              }
            },
            { key: 'catatan', label: 'Catatan Kebutuhan', type: 'text' },
          ],
          records: [
            { id: '1', nama: 'Budi Santoso', perusahaan: 'Kopi Kenangan Indah', whatsapp: '081234567890', status: 'Negosiasi Harga', nilai: 35000000, consent: 'Diberikan (Opt-in)', catatan: 'Tertarik paket otomasi inventori 3 cabang' },
            { id: '2', nama: 'Siti Rahmawati', perusahaan: 'Batik Cahaya Murni', whatsapp: '081987654321', status: 'Presentasi Demo', nilai: 18000000, consent: 'Diberikan (Opt-in)', catatan: 'Jadwal presentasi Selasa jam 14.00 WIB' },
            { id: '3', nama: 'Hendro Gunawan', perusahaan: 'PT Sinar Logistik Jaya', whatsapp: '082155566778', status: 'Closing (Won)', nilai: 55000000, consent: 'Diberikan (Opt-in)', catatan: 'PO sudah diterbitkan, DP 50% masuk' },
            { id: '4', nama: 'Dewi Lestari', perusahaan: 'Studio Desain Kreatif', whatsapp: '085711223344', status: 'Outreach Terkirim', nilai: 12500000, consent: 'Pending Konfirmasi', catatan: 'Pesan perkenalan terkirim via WA Business' },
            { id: '5', nama: 'Rian Pratama', perusahaan: 'AutoCare Motor Garasi', whatsapp: '081399887766', status: 'Lead Baru', nilai: 22000000, consent: 'Diberikan (Opt-in)', catatan: 'Masuk dari form landing page' },
          ]
        },
        {
          id: 'activities',
          name: 'Log Aktivitas Outreach',
          primaryKey: 'id',
          columns: [
            { key: 'tanggal', label: 'Tanggal & Waktu', type: 'date' },
            { key: 'lead', label: 'Nama Prospek', type: 'text' },
            { key: 'tipe', label: 'Metode Outreach', type: 'badge', options: ['WhatsApp', 'Panggilan Suara', 'Meeting Online', 'Email Proposal'] },
            { key: 'hasil', label: 'Ringkasan Percakapan', type: 'text' },
            { key: 'pic', label: 'PIC Sales', type: 'text' },
          ],
          records: [
            { id: 'a1', tanggal: '2026-11-08 09:30', lead: 'Budi Santoso', tipe: 'WhatsApp', hasil: 'Mengirim draf revisi penawaran diskon pembelian tahunan.', pic: 'Ahmad' },
            { id: 'a2', tanggal: '2026-11-07 14:15', lead: 'Siti Rahmawati', tipe: 'Meeting Online', hasil: 'Demo fitur dashboard berhasil, klien minta ditambahkan modul ekspor PDF.', pic: 'Bobi' },
            { id: 'a3', tanggal: '2026-11-07 10:00', lead: 'Hendro Gunawan', tipe: 'Panggilan Suara', hasil: 'Konfirmasi kelengkapan dokumen perpajakan faktur.', pic: 'Ahmad' },
          ]
        }
      ],
      kanban: {
        enabled: true,
        tableId: 'leads',
        statusColumnKey: 'status',
        titleColumnKey: 'nama',
        subtitleColumnKey: 'perusahaan',
        valueColumnKey: 'nilai',
        stages: [
          { id: 'Lead Baru', name: 'Lead Baru', color: '#3B82F6' },
          { id: 'Outreach Terkirim', name: 'Outreach Terkirim', color: '#F59E0B' },
          { id: 'Presentasi Demo', name: 'Presentasi Demo', color: '#8B5CF6' },
          { id: 'Negosiasi Harga', name: 'Negosiasi Harga', color: '#D97706' },
          { id: 'Closing (Won)', name: 'Closing (Won)', color: '#10B981' },
          { id: 'Batal (Lost)', name: 'Batal (Lost)', color: '#EF4444' },
        ]
      }
    }
  ]
};

export const AGENCY_PORTAL_APP: LegoApp = {
  id: 'app-agency-portal',
  slug: 'agency-portal',
  name: 'Karya Agency Portal',
  description: 'Portal kolaborasi klien, tracking deliverables, dan persetujuan revisi untuk tim agency.',
  category: 'portal',
  currentVersion: 1,
  isPublished: true,
  publishedSlug: 'karya-agency',
  publishedAt: '2026-11-08T11:00:00Z',
  createdAt: '2026-11-08T10:30:00Z',
  updatedAt: '2026-11-08T11:00:00Z',
  organizationId: 'org-default',
  createdById: 'user-bobi',
  versions: [
    {
      versionNumber: 1,
      appName: 'Karya Agency Portal',
      tagline: 'Transparansi Proyek & Persetujuan Klien 1-Pintu',
      changelog: 'Template Portal Agency v1: Manajemen Proyek, Timeline Deliverable, dan Status Approval.',
      promptUsed: 'Buatkan portal klien untuk agency desain & web development dengan tracking deliverables, status review klien, tenggat waktu, dan anggaran.',
      createdAt: '2026-11-08T10:30:00Z',
      mode: 'build',
      primaryColor: '#7C3AED',
      accentColor: '#3B82F6',
      quickActionLabel: '+ Tambah Milestone / Deliverable',
      quickActionTargetTable: 'deliverables',
      metrics: [
        { id: 'm1', label: 'Proyek Aktif', value: '9 Klien', change: '3 mendekati deadline', trend: 'neutral', icon: 'FolderGit2', color: 'purple' },
        { id: 'm2', label: 'Deliverables Selesai', value: '34 Item', change: '89% on-time delivery', trend: 'up', icon: 'CheckCircle2', color: 'green' },
        { id: 'm3', label: 'Menunggu Review Klien', value: '5 Item', change: 'Butuh approval 24 jam', trend: 'down', icon: 'AlertCircle', color: 'yellow' },
        { id: 'm4', label: 'Total Nilai Kontrak', value: 'Rp 210.000.000', change: 'Bulan berjalan', trend: 'up', icon: 'BadgePercent', color: 'blue' },
      ],
      pages: [
        { id: 'p1', name: 'Status Proyek', icon: 'Briefcase', type: 'table', tableId: 'projects', description: 'Overview progres tiap klien dan penanggung jawab tim.' },
        { id: 'p2', name: 'Deliverables & Review', icon: 'Layers', type: 'kanban', tableId: 'deliverables', description: 'Pipeline approval item dari draf internal ke approval klien.' },
      ],
      tables: [
        {
          id: 'projects',
          name: 'Daftar Proyek Klien',
          primaryKey: 'id',
          columns: [
            { key: 'proyek', label: 'Nama Proyek', type: 'text', required: true },
            { key: 'klien', label: 'Nama Brand / Klien', type: 'text', required: true },
            { key: 'status', label: 'Status Proyek', type: 'status', options: ['Briefing', 'Produksi Aktif', 'Review Klien', 'Revisi', 'Selesai'] },
            { key: 'deadline', label: 'Tenggat Waktu', type: 'date' },
            { key: 'lead_designer', label: 'Project Lead', type: 'text' },
            { key: 'anggaran', label: 'Total Anggaran', type: 'currency' },
          ],
          records: [
            { id: 'pr1', proyek: 'Redesign UI/UX E-Commerce', klien: 'Fashion Nusantara', status: 'Review Klien', deadline: '2026-11-20', lead_designer: 'Dian', anggaran: 45000000 },
            { id: 'pr2', proyek: 'Rebranding & Brand Guidelines', klien: 'Kopi Seduh Senja', status: 'Produksi Aktif', deadline: '2026-11-30', lead_designer: 'Farhan', anggaran: 30000000 },
            { id: 'pr3', proyek: 'Landing Page High Conversion', klien: 'Fintech Maju Cepat', status: 'Selesai', deadline: '2026-11-05', lead_designer: 'Dian', anggaran: 25000000 },
          ]
        },
        {
          id: 'deliverables',
          name: 'Item Deliverable',
          primaryKey: 'id',
          columns: [
            { key: 'item', label: 'Item Deliverable', type: 'text', required: true },
            { key: 'proyek', label: 'Proyek Terkait', type: 'text' },
            { key: 'status', label: 'Status Approval', type: 'status', options: ['Draf Internal', 'Menunggu Review Klien', 'Revisi Diminta', 'Disetujui (Approved)'] },
            { key: 'link', label: 'Tautan Figma / Dokumen', type: 'text' },
            { key: 'deadline', label: 'Deadline Serah Terima', type: 'date' },
          ],
          records: [
            { id: 'd1', item: 'Wireframe 12 Halaman Mobile', proyek: 'Fashion Nusantara', status: 'Disetujui (Approved)', link: 'figma.com/file/FN-wireframes', deadline: '2026-11-06' },
            { id: 'd2', item: 'Visual Design Mockup Utama', proyek: 'Fashion Nusantara', status: 'Menunggu Review Klien', link: 'figma.com/file/FN-hi-fi', deadline: '2026-11-12' },
            { id: 'd3', item: 'Logo & Color Palette Guide', proyek: 'Kopi Seduh Senja', status: 'Revisi Diminta', link: 'drive.google.com/kopi-seduh-v2', deadline: '2026-11-15' },
          ]
        }
      ],
      kanban: {
        enabled: true,
        tableId: 'deliverables',
        statusColumnKey: 'status',
        titleColumnKey: 'item',
        subtitleColumnKey: 'proyek',
        stages: [
          { id: 'Draf Internal', name: 'Draf Internal', color: '#6B7280' },
          { id: 'Menunggu Review Klien', name: 'Menunggu Review Klien', color: '#F59E0B' },
          { id: 'Revisi Diminta', name: 'Revisi Diminta', color: '#EF4444' },
          { id: 'Disetujui (Approved)', name: 'Disetujui (Approved)', color: '#10B981' },
        ]
      }
    }
  ]
};

export const BOOKING_CATALOG_APP: LegoApp = {
  id: 'app-booking-catalog',
  slug: 'booking-katalog',
  name: 'Booking & Katalog Jasa',
  description: 'Aplikasi pendaftaran janji temu, katalog layanan harga, dan konfirmasi reservasi pelanggan.',
  category: 'booking',
  currentVersion: 1,
  isPublished: true,
  publishedSlug: 'booking-jasa',
  publishedAt: '2026-11-08T12:00:00Z',
  createdAt: '2026-11-08T11:45:00Z',
  updatedAt: '2026-11-08T12:00:00Z',
  organizationId: 'org-default',
  createdById: 'user-bobi',
  versions: [
    {
      versionNumber: 1,
      appName: 'Booking Jasa & Salon Kecantikan',
      tagline: 'Reservasi Mandiri Pelanggan Tanpa Antre',
      changelog: 'Template Booking Jasa v1: Kalender Reservasi, Katalog Layanan, dan Rekap Pendapatan.',
      promptUsed: 'Buatkan aplikasi pemesanan jadwal salon/jasa kecantikan dengan katalog perawatan, durasi, harga, data reservasi pelanggan, dan status konfirmasi booking.',
      createdAt: '2026-11-08T11:45:00Z',
      mode: 'build',
      primaryColor: '#EC4899',
      accentColor: '#F59E0B',
      quickActionLabel: '+ Tambah Reservasi Manual',
      quickActionTargetTable: 'bookings',
      metrics: [
        { id: 'm1', label: 'Booking Hari Ini', value: '14 Jadwal', change: '8 selesai, 6 mendatang', trend: 'up', icon: 'Calendar', color: 'red' },
        { id: 'm2', label: 'Menunggu Konfirmasi', value: '3 Slot', change: 'Konfirmasi via WA', trend: 'neutral', icon: 'Clock', color: 'yellow' },
        { id: 'm3', label: 'Estimasi Omset Hari Ini', value: 'Rp 4.250.000', change: '+18% vs kemarin', trend: 'up', icon: 'Coins', color: 'green' },
        { id: 'm4', label: 'Pelanggan Terdaftar', value: '128 Orang', change: '35 repeat order', trend: 'up', icon: 'HeartHandshake', color: 'purple' },
      ],
      pages: [
        { id: 'p1', name: 'Jadwal Reservasi', icon: 'CalendarDays', type: 'table', tableId: 'bookings', description: 'Daftar reservasi masuk dan status kehadiran pelanggan.' },
        { id: 'p2', name: 'Katalog Layanan', icon: 'Sparkles', type: 'table', tableId: 'services', description: 'Menu perawatan, estimasi durasi waktu, dan tarif.' },
      ],
      tables: [
        {
          id: 'bookings',
          name: 'Data Reservasi Pelanggan',
          primaryKey: 'id',
          columns: [
            { key: 'pelanggan', label: 'Nama Pelanggan', type: 'text', required: true },
            { key: 'whatsapp', label: 'WhatsApp', type: 'phone', required: true },
            { key: 'layanan', label: 'Paket Layanan', type: 'text', required: true },
            { key: 'jadwal', label: 'Waktu Reservasi', type: 'date' },
            { key: 'status', label: 'Status Konfirmasi', type: 'status', options: ['Menunggu Konfirmasi', 'Terkonfirmasi', 'Sedang Berlangsung', 'Selesai', 'Dibatalkan'] },
            { key: 'total_biaya', label: 'Total Tarif (Rp)', type: 'currency' },
          ],
          records: [
            { id: 'b1', pelanggan: 'Anindya Putri', whatsapp: '081299001122', layanan: 'Hair Spa + Creambath Herbal', jadwal: '2026-11-09 13:00', status: 'Terkonfirmasi', total_biaya: 350000 },
            { id: 'b2', pelanggan: 'Clara Michelle', whatsapp: '085733445566', layanan: 'Nail Art Gel Signature', jadwal: '2026-11-09 15:30', status: 'Menunggu Konfirmasi', total_biaya: 250000 },
            { id: 'b3', pelanggan: 'Nadia Salsabila', whatsapp: '082166778899', layanan: 'Paket Glow Facial & Mask', jadwal: '2026-11-09 10:00', status: 'Selesai', total_biaya: 450000 },
          ]
        },
        {
          id: 'services',
          name: 'Katalog Layanan & Tarif',
          primaryKey: 'id',
          columns: [
            { key: 'nama_layanan', label: 'Nama Perawatan', type: 'text', required: true },
            { key: 'durasi', label: 'Durasi Pengerjaan', type: 'text' },
            { key: 'harga', label: 'Tarif (Rp)', type: 'currency', required: true },
            { key: 'kategori', label: 'Kategori', type: 'badge', options: ['Rambut', 'Kuku', 'Wajah', 'Relaksasi'] },
          ],
          records: [
            { id: 's1', nama_layanan: 'Hair Spa + Creambath Herbal', durasi: '60 Menit', harga: 350000, kategori: 'Rambut' },
            { id: 's2', nama_layanan: 'Nail Art Gel Signature', durasi: '45 Menit', harga: 250000, kategori: 'Kuku' },
            { id: 's3', nama_layanan: 'Paket Glow Facial & Mask', durasi: '90 Menit', harga: 450000, kategori: 'Wajah' },
            { id: 's4', nama_layanan: 'Aromatherapy Body Massage', durasi: '120 Menit', harga: 550000, kategori: 'Relaksasi' },
          ]
        }
      ]
    }
  ]
};

export const ALL_TEMPLATES: LegoApp[] = [
  SATU_PIPELINE_APP,
  AGENCY_PORTAL_APP,
  BOOKING_CATALOG_APP
];
