/**
 * app.js
 * Presentation Layer (PL): Mengontrol manipulasi DOM, Client-Side Rendering (CSR),
 * manajemen 4 UI States, Filter Kategori Instan, Universal Dynamic Modal (Anti DOM-XSS),
 * Pengiriman Form Asinkron REST API, dan Persistensi State LocalStorage.
 * 
 * Pengembang: Davina Olivia Yosefanny Hutabarat (12S24047)
 * Mata Kuliah: Pemrograman dan Pengujian Web (12S3101) - Institut Teknologi Del
 */

class PortfolioApp {
  constructor() {
    this.state = {
      profile: null,
      projects: [],
      filteredProjects: [],
      services: [],
      activeFilter: 'all',
      orders: []
    };

    // Referensi Elemen DOM Utama
    this.projectsContainer = document.getElementById('projects-container');
    this.servicesSelect = document.getElementById('floatingKategoriLayanan');
    this.form = document.getElementById('formKonsultasi');
    this.orderBadge = document.getElementById('orderBadge');
    this.toastEl = document.getElementById('liveToastFeedback');
    this.toastInstance = this.toastEl ? bootstrap.Toast.getOrCreateInstance(this.toastEl) : null;
  }

  /**
   * Sanitasi string untuk mencegah celah keamanan DOM-based Cross-Site Scripting (XSS)
   * Mengubah karakter berbahaya (&, <, >, ", ') menjadi HTML entities aman
   * @param {any} str - Input nilai string yang akan disanitasi
   * @returns {string} String yang telah diamankan
   */
  escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Inisialisasi siklus hidup aplikasi Presentation Tier
   */
  async init() {
    this.loadOrdersFromStorage();
    this.setupEventListeners();
    await Promise.all([
      this.loadProjects(),
      this.loadServicesCatalog()
    ]);
  }

  // =========================================================
  // 1. MANAJEMEN 4 UI STATES PADA CLIENT-SIDE RENDERING
  // =========================================================

  /**
   * UI State 1: LOADING STATE (Skeleton Placeholder Shimmer)
   * Menampilkan kerangka visual animatif sebelum data JSON selesai diunduh
   */
  renderSkeletonLoading() {
    if (!this.projectsContainer) return;

    let skeletonCards = '';
    for (let i = 0; i < 4; i++) {
      skeletonCards += `
        <div class="col">
          <div class="card h-100 kartu-proyek border-0 shadow-sm placeholder-glow p-0 overflow-hidden">
            <div class="placeholder col-12" style="aspect-ratio: 20/11; display:block;"></div>
            <div class="card-body kartu-isi d-flex flex-column">
              <span class="placeholder col-4 mb-2 rounded-pill"></span>
              <span class="placeholder col-8 mb-3" style="height: 22px;"></span>
              <span class="placeholder col-12 mb-1"></span>
              <span class="placeholder col-10 mb-4"></span>
              <div class="badge-tech-group mb-3 d-flex gap-1">
                <span class="placeholder col-3 py-2 rounded-pill"></span>
                <span class="placeholder col-3 py-2 rounded-pill"></span>
              </div>
              <div class="mt-auto pt-3 border-top">
                <span class="placeholder col-12 py-3 rounded-pill"></span>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    this.projectsContainer.innerHTML = skeletonCards;
  }

  /**
   * Memuat data projects.json via ApiService (Data Access Layer)
   */
  async loadProjects() {
    this.renderSkeletonLoading();
    try {
      const data = await ApiService.getProjects();
      this.state.projects = Array.isArray(data) ? data : [];
      this.applyFilter(this.state.activeFilter);
    } catch (err) {
      console.error('[PortfolioApp] Gagal memuat data proyek:', err);
      this.renderErrorState();
    }
  }

  /**
   * UI State 4: ERROR STATE (Defensive Alert Fallback + Tombol Coba Lagi)
   */
  renderErrorState() {
    if (!this.projectsContainer) return;

    this.projectsContainer.innerHTML = `
      <div class="col-12">
        <div class="error-state-box text-center shadow-sm">
          <i class="bi bi-exclamation-triangle-fill display-5 text-cherry mb-3 d-block"></i>
          <h4 class="fw-bold text-cherry mb-2">Gagal Mengambil Data Portofolio</h4>
          <p class="text-muted small mb-3">
            Terjadi kendala jaringan saat memuat berkas <code>projects.json</code>. 
            Pastikan web dijalankan melalui web server lokal (Live Server / Python HTTP Server) dan bukan protokol <code>file:///</code>.
          </p>
          <button type="button" class="btn btn-retry" id="btnRetryProjects">
            <i class="bi bi-arrow-clockwise"></i>
            <span>Coba Lagi</span>
          </button>
        </div>
      </div>
    `;

    // Pasang listener pada tombol Coba Lagi
    const retryBtn = document.getElementById('btnRetryProjects');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.loadProjects();
      });
    }
  }

  /**
   * UI State 2: SUCCESS STATE & UI State 3: EMPTY STATE
   */
  renderProjects() {
    if (!this.projectsContainer) return;

    // UI State 3: EMPTY STATE (Ketika filter kategori tidak memiliki item)
    if (this.state.filteredProjects.length === 0) {
      this.projectsContainer.innerHTML = `
        <div class="col-12 text-center py-4">
          <div class="empty-state-box shadow-sm">
            <i class="bi bi-folder-x display-4 text-cherry mb-3 d-block"></i>
            <h4 class="fw-bold text-cherry mb-2">Belum Ada Proyek Ditemukan</h4>
            <p class="text-muted small mb-3">
              Tidak ada portofolio yang terdaftar dalam kategori 
              <strong>"${this.escapeHTML(this.state.activeFilter)}"</strong>.
            </p>
            <button type="button" class="btn btn-garis btn-sm" id="btnResetFilter">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Tampilkan Semua Kategori
            </button>
          </div>
        </div>
      `;

      const resetBtn = document.getElementById('btnResetFilter');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.applyFilter('all');
        });
      }
      return;
    }

    // UI State 2: SUCCESS STATE (Render Kartu Portofolio Decoupled)
    this.projectsContainer.innerHTML = this.state.filteredProjects.map(proj => {
      const escapedId = this.escapeHTML(proj.id);
      const escapedTitle = this.escapeHTML(proj.title);
      const escapedCategory = this.escapeHTML(proj.category);
      const escapedLabel = this.escapeHTML(proj.label || proj.category);
      const escapedDesc = this.escapeHTML(proj.description);
      const escapedThumb = this.escapeHTML(proj.thumbnail || proj.image);

      // Render tags secara aman
      const tagsList = Array.isArray(proj.tags) ? proj.tags : [];
      const tagsHTML = tagsList
        .map(tag => `<span class="badge badge-custom">${this.escapeHTML(tag)}</span>`)
        .join(' ');

      return `
        <div class="col">
          <article class="card h-100 kartu-proyek border-0 shadow-sm">
            <div class="kartu-gambar-wrap">
              <img class="card-img-top kartu-gambar" 
                   src="${escapedThumb}" 
                   alt="Tangkapan layar antarmuka proyek ${escapedTitle}" 
                   loading="lazy">
              <span class="kartu-badge">${escapedCategory}</span>
            </div>
            <div class="card-body kartu-isi d-flex flex-column">
              <p class="kartu-label">${escapedLabel}</p>
              <h3 class="card-title fs-5 fw-bold mb-2">${escapedTitle}</h3>
              <p class="card-text text-muted small mb-3">${escapedDesc}</p>
              
              <div class="badge-tech-group mb-3 d-flex flex-wrap gap-1">
                ${tagsHTML}
              </div>

              <div class="kartu-meta mt-auto pt-3 border-top">
                <button type="button" 
                        class="btn btn-sm btn-modal-trigger w-100 view-detail-btn" 
                        data-project-id="${escapedId}"
                        aria-label="Buka rincian proyek ${escapedTitle}">
                  <span>Lihat Detail Proyek</span>
                  <i class="bi bi-arrow-up-right-circle ms-1"></i>
                </button>
              </div>
            </div>
          </article>
        </div>
      `;
    }).join('');

    // Hubungkan tombol ke Universal Dynamic Modal
    this.projectsContainer.querySelectorAll('.view-detail-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projId = e.currentTarget.getAttribute('data-project-id');
        this.openUniversalModal(projId);
      });
    });
  }

  // =========================================================
  // 2. UNIVERSAL DYNAMIC MODAL (ANTI DOM-XSS)
  // =========================================================

  /**
   * Menampilkan rincian proyek pada 1 Modal Tunggal (Universal Modal)
   * Mencegah serangan DOM XSS dengan textContent & escapeHTML()
   * @param {string} projectId - ID unik proyek
   */
  openUniversalModal(projectId) {
    const proj = this.state.projects.find(p => p.id === projectId);
    if (!proj) return;

    const modalTitle = document.getElementById('universalModalTitle');
    const modalCategory = document.getElementById('universalModalCategory');
    const modalBody = document.getElementById('universalModalBody');

    // Gunakan textContent murni untuk elemen teks judul & kategori (Anti DOM-XSS)
    if (modalTitle) {
      modalTitle.textContent = proj.fullTitle || proj.title;
    }
    if (modalCategory) {
      modalCategory.textContent = proj.category;
    }

    if (modalBody) {
      const escapedThumb = this.escapeHTML(proj.thumbnail || proj.image);
      const escapedTitle = this.escapeHTML(proj.title);
      const escapedDesc = this.escapeHTML(proj.longDescription || proj.description);
      const escapedRole = this.escapeHTML(proj.role || 'Front-End Designer & Developer');
      const escapedTech = this.escapeHTML(proj.technology || (Array.isArray(proj.tags) ? proj.tags.join(', ') : '-'));
      const escapedLink = this.escapeHTML(proj.link || '#');

      // Render metrik capaian jika ada
      let metricsHTML = '';
      if (proj.metrics && typeof proj.metrics === 'object') {
        const metricItems = Object.entries(proj.metrics).map(([key, val]) => `
          <div class="col-4">
            <div class="modal-metric-card">
              <div class="metric-number">${this.escapeHTML(val)}</div>
              <div class="metric-name">${this.escapeHTML(key.replace(/([A-Z])/g, ' $1'))}</div>
            </div>
          </div>
        `).join('');

        metricsHTML = `
          <div class="my-3">
            <h6 class="fw-bold text-cherry small mb-2"><i class="bi bi-graph-up-arrow me-1"></i> Metrik Kinerja & Dampak:</h6>
            <div class="row g-2">${metricItems}</div>
          </div>
        `;
      }

      // Render tags
      const tagsList = Array.isArray(proj.tags) ? proj.tags : [];
      const tagsBadges = tagsList
        .map(t => `<span class="badge badge-custom me-1">${this.escapeHTML(t)}</span>`)
        .join('');

      modalBody.innerHTML = `
        <div class="modal-preview-wrap mb-3">
          <img src="${escapedThumb}" alt="Preview ${escapedTitle}" class="img-fluid rounded-3 w-100 modal-preview-img shadow-sm">
        </div>
        <h6 class="fw-bold text-cherry mb-1"><i class="bi bi-info-circle-fill me-1"></i> Gambaran & Latar Belakang Proyek</h6>
        <p class="text-muted small mb-3">${escapedDesc}</p>
        
        ${metricsHTML}

        <div class="row g-2 mt-1 mb-3">
          <div class="col-sm-6">
            <div class="p-3 rounded-3 bg-light border">
              <span class="d-block small text-muted">Peran Pengembang:</span>
              <strong class="text-cherry small">${escapedRole}</strong>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="p-3 rounded-3 bg-light border">
              <span class="d-block small text-muted">Teknologi & Fondasi:</span>
              <strong class="text-cherry small">${escapedTech}</strong>
            </div>
          </div>
        </div>

        <div class="d-flex align-items-center justify-content-between pt-2 border-top">
          <div class="tags-group">
            <span class="small text-muted me-2">Kata Kunci:</span>
            ${tagsBadges}
          </div>
          ${proj.link ? `
            <a href="${escapedLink}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-danger rounded-pill px-3">
              <i class="bi bi-github me-1"></i> Repositori Proyek
            </a>
          ` : ''}
        </div>
      `;
    }

    const modalEl = document.getElementById('universalProjectModal');
    if (modalEl) {
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
  }

  // =========================================================
  // 3. FILTER KATEGORI PORTOFOLIO INSTAN
  // =========================================================

  /**
   * Memfilter daftar proyek di sisi klien tanpa reload halaman
   * @param {string} category - Kategori yang dipilih ('all', 'B2B AgriTech', dll)
   */
  applyFilter(category) {
    this.state.activeFilter = category;

    // Perbarui status tombol filter aktif
    document.querySelectorAll('.filter-btn').forEach(btn => {
      const btnFilter = btn.getAttribute('data-filter');
      if (btnFilter === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (category === 'all') {
      this.state.filteredProjects = [...this.state.projects];
    } else {
      const query = category.toLowerCase().trim();
      this.state.filteredProjects = this.state.projects.filter(p => 
        p.category && p.category.toLowerCase().includes(query)
      );
    }

    this.renderProjects();
  }

  // =========================================================
  // 4. DECOUPLED SERVICES DATA CATALOG POPULATION
  // =========================================================

  /**
   * Mengambil data paket layanan dari data/services.json
   * dan menginjeksi opsi dropdown formulir secara dinamis
   */
  async loadServicesCatalog() {
    try {
      const services = await ApiService.getServices();
      this.state.services = Array.isArray(services) ? services : [];

      if (this.servicesSelect && this.state.services.length > 0) {
        this.servicesSelect.innerHTML = `
          <option value="" selected disabled>Pilih paket layanan konsultasi...</option>
          ${this.state.services.map(svc => `
            <option value="${this.escapeHTML(svc.name)}">
              ${this.escapeHTML(svc.name)} ${svc.price ? `(${this.escapeHTML(svc.price)})` : ''}
            </option>
          `).join('')}
        `;
      }
    } catch (err) {
      console.warn('[PortfolioApp] Menggunakan opsi layanan bawaan karena katalog dinamis gagal dimuat:', err);
    }
  }

  // =========================================================
  // 5. ASYNCHRONOUS REST FORM DISPATCH & STATE PERSISTENCE
  // =========================================================

  /**
   * Mengatur event listeners untuk filter dan formulir pengiriman layanan
   */
  setupEventListeners() {
    // Listener Tombol Filter Kategori
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.getAttribute('data-filter');
        this.applyFilter(cat);
      });
    });

    // Listener Pengiriman Formulir Asinkron (No Page Reload)
    if (this.form) {
      this.form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validasi native HTML5
        if (!this.form.checkValidity()) {
          e.stopPropagation();
          this.form.classList.add('was-validated');
          return;
        }

        // Kumpulkan data via FormData dan serialisasi ke JSON DTO
        const formData = new FormData(this.form);
        const payload = Object.fromEntries(formData.entries());
        payload.waktuPengajuan = new Date().toISOString();
        payload.idPesanan = 'ORD-' + Date.now();

        // Indikasi status tombol submit (disabled + spinner)
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalBtnHTML = submitBtn ? submitBtn.innerHTML : 'Kirim Permintaan Konsultasi';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Mengirim...';
        }

        try {
          // Kirim secara asinkron ke REST API Mock (JSONPlaceholder POST)
          const result = await ApiService.submitServiceOrder(payload);
          
          // Simpan ke localStorage & perbarui badge UI reaktif
          this.saveOrderToLocalStorage(payload);

          // Tampilkan feedback visual Bootstrap Toast Sukses
          this.showToast(
            'Permintaan Terkirim! ♡',
            `Halo ${this.escapeHTML(payload.nama)}, permintaan konsultasi Anda berhasil dikirim ke API dan dicatat di penyimpanan lokal.`
          );

          // Reset formulir
          this.form.reset();
          this.form.classList.remove('was-validated');
        } catch (err) {
          console.error('[PortfolioApp] Error submit form:', err);
          this.showToast(
            'Gagal Mengirim Permintaan',
            'Terjadi kesalahan jaringan saat mengirim data ke API. Silakan periksa koneksi Anda dan coba lagi.',
            true
          );
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
          }
        }
      });
    }
  }

  /**
   * Persistensi data pesanan ke localStorage secara defensif
   * @param {Object} order - Payload pesanan
   */
  saveOrderToLocalStorage(order) {
    try {
      this.state.orders.push(order);
      localStorage.setItem('davina_service_orders', JSON.stringify(this.state.orders));
      this.updateOrderBadge();
    } catch (e) {
      console.error('[PortfolioApp] Gagal menyimpan ke localStorage:', e);
    }
  }

  /**
   * Membaca riwayat pesanan dari localStorage saat aplikasi diinisialisasi
   */
  loadOrdersFromStorage() {
    try {
      const saved = localStorage.getItem('davina_service_orders') || localStorage.getItem('davina_consultation_orders');
      this.state.orders = saved ? JSON.parse(saved) : [];
      this.updateOrderBadge();
    } catch (e) {
      console.warn('[PortfolioApp] Gagal membaca localStorage:', e);
      this.state.orders = [];
    }
  }

  /**
   * Memperbarui badge jumlah pesanan di navbar secara reaktif tanpa reload
   */
  updateOrderBadge() {
    if (this.orderBadge) {
      const total = Array.isArray(this.state.orders) ? this.state.orders.length : 0;
      this.orderBadge.textContent = total;
      this.orderBadge.style.display = total > 0 ? 'inline-block' : 'none';
    }
  }

  /**
   * Menampilkan Bootstrap Toast Notifikasi Visual
   * @param {string} title - Judul notifikasi
   * @param {string} message - Pesan ringkas notifikasi
   * @param {boolean} isError - True jika notifikasi error
   */
  showToast(title, message, isError = false) {
    const titleEl = document.getElementById('toastFeedbackTitle');
    const msgEl = document.getElementById('toastFeedbackMsg');

    if (titleEl) {
      titleEl.textContent = title;
      titleEl.className = isError ? 'me-auto text-danger fw-bold' : 'me-auto text-cherry fw-bold';
    }
    if (msgEl) {
      msgEl.textContent = message;
    }

    if (this.toastInstance) {
      this.toastInstance.show();
    }
  }
}

// Inisialisasi aplikasi saat seluruh elemen DOM selesai diparsing
document.addEventListener('DOMContentLoaded', () => {
  const app = new PortfolioApp();
  app.init();
  window.portfolioApp = app;
});