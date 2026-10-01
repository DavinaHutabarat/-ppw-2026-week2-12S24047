/**
 * app.js
 * Presentation Layer: Kontrol DOM, Dynamic CSR, Filter Kategori,
 * Universal Modal, Local Storage State & Toast Feedback
 */
class PortfolioApp {
  constructor() {
    this.state = {
      projects: [],
      filteredProjects: [],
      activeFilter: 'all',
      orders: []
    };

    this.container = document.getElementById('projects-container');
    this.form = document.getElementById('formKonsultasi');
    this.orderBadge = document.getElementById('orderBadge');
    this.toastEl = document.getElementById('liveToastFeedback');
    this.toastInstance = this.toastEl ? bootstrap.Toast.getOrCreateInstance(this.toastEl) : null;
  }

  // Sanitasi masukan dari serangan DOM XSS
  escapeHTML(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async init() {
    this.loadOrdersFromStorage();
    this.setupEventListeners();
    await this.loadProjects();
  }

  // 1. Loading State: Skeleton Placeholder Shimmer
  renderSkeletonLoading() {
    if (!this.container) return;
    let skeletonHTML = '';
    for (let i = 0; i < 4; i++) {
      skeletonHTML += `
        <div class="col">
          <div class="card h-100 kartu-proyek border-0 shadow-sm placeholder-glow p-0 overflow-hidden">
            <div class="placeholder col-12" style="aspect-ratio: 20/11; display:block;"></div>
            <div class="card-body kartu-isi d-flex flex-column">
              <span class="placeholder col-4 mb-2"></span>
              <span class="placeholder col-8 mb-3" style="height: 22px;"></span>
              <span class="placeholder col-12 mb-1"></span>
              <span class="placeholder col-9 mb-4"></span>
              <div class="mt-auto pt-3 border-top">
                <span class="placeholder col-12 py-3 rounded-pill"></span>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    this.container.innerHTML = skeletonHTML;
  }

  // Mengambil data projects.json via ApiService
  async loadProjects() {
    this.renderSkeletonLoading();
    try {
      const data = await ApiService.getProjects();
      this.state.projects = data;
      this.state.filteredProjects = data;
      this.renderProjects();
    } catch (err) {
      // 4. Error State: Alert Fallback
      if (this.container) {
        this.container.innerHTML = `
          <div class="col-12">
            <div class="alert alert-danger rounded-4 p-4 text-center border-custom">
              <i class="bi bi-exclamation-triangle-fill fs-3 text-cherry d-block mb-2"></i>
              <h5 class="fw-bold">Gagal Memuat Portofolio</h5>
              <p class="small text-muted mb-0">Terjadi gangguan saat mengambil data proyek. Silakan buka melalui Live Server atau periksa koneksi Anda.</p>
            </div>
          </div>
        `;
      }
    }
  }

  // 2. Success State & 3. Empty State
  renderProjects() {
    if (!this.container) return;

    // 3. Empty State jika filter tidak menemukan data
    if (this.state.filteredProjects.length === 0) {
      this.container.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="p-4 rounded-4 bg-card-panel border-custom">
            <i class="bi bi-folder-x display-5 text-cherry mb-2 d-block"></i>
            <h5 class="fw-bold">Belum Ada Proyek</h5>
            <p class="text-muted small mb-0">Tidak ada proyek dalam kategori "${this.escapeHTML(this.state.activeFilter)}".</p>
          </div>
        </div>
      `;
      return;
    }

    // 2. Success State: Render kartu proyek dengan class styling asli Davina
    this.container.innerHTML = this.state.filteredProjects.map(proj => {
      const tagsHTML = proj.tags.map(tag => `<span class="badge badge-custom">${this.escapeHTML(tag)}</span>`).join(' ');

      return `
        <div class="col">
          <article class="card h-100 kartu-proyek border-0 shadow-sm">
            <div class="kartu-gambar-wrap">
              <img class="card-img-top kartu-gambar" src="${this.escapeHTML(proj.thumbnail)}" alt="Tangkapan layar antarmuka ${this.escapeHTML(proj.title)}" loading="lazy">
              <span class="kartu-badge">${this.escapeHTML(proj.category)}</span>
            </div>
            <div class="card-body kartu-isi d-flex flex-column">
              <p class="kartu-label">${this.escapeHTML(proj.label)}</p>
              <h3 class="card-title">${this.escapeHTML(proj.title)}</h3>
              <p class="card-text">${this.escapeHTML(proj.description)}</p>
              <div class="badge-tech-group mb-3 d-flex flex-wrap gap-1">
                ${tagsHTML}
              </div>
              <div class="kartu-meta mt-auto pt-3 border-top">
                <button type="button" class="btn btn-sm btn-modal-trigger w-100 view-detail-btn" data-project-id="${this.escapeHTML(proj.id)}">
                  <span>Lihat Detail Proyek</span>
                  <i class="bi bi-arrow-up-right-circle ms-1"></i>
                </button>
              </div>
            </div>
          </article>
        </div>
      `;
    }).join('');

    // Tambahkan event listener ke setiap tombol "Lihat Detail Proyek"
    this.container.querySelectorAll('.view-detail-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projId = e.currentTarget.getAttribute('data-project-id');
        this.openUniversalModal(projId);
      });
    });
  }

  // Universal Dynamic Modal (1 Modal Tunggal untuk Semua Proyek)
  openUniversalModal(projectId) {
    const proj = this.state.projects.find(p => p.id === projectId);
    if (!proj) return;

    const modalTitle = document.getElementById('universalModalTitle');
    const modalCategory = document.getElementById('universalModalCategory');
    const modalBody = document.getElementById('universalModalBody');

    if (modalCategory) modalCategory.textContent = proj.category;
    if (modalTitle) modalTitle.textContent = proj.fullTitle || proj.title;

    if (modalBody) {
      modalBody.innerHTML = `
        <img src="${this.escapeHTML(proj.thumbnail)}" alt="Preview ${this.escapeHTML(proj.title)}" class="img-fluid rounded-3 mb-3 w-100 modal-preview-img">
        <h6 class="fw-bold text-cherry"><i class="bi bi-info-circle-fill me-1"></i> Deskripsi Proyek</h6>
        <p class="text-muted small">${this.escapeHTML(proj.longDescription || proj.description)}</p>
        <div class="row g-2 mt-2">
          <div class="col-sm-6">
            <div class="p-3 rounded-3 bg-light border">
              <span class="d-block small text-muted">Peran Saya:</span>
              <strong class="text-cherry small">${this.escapeHTML(proj.role || 'Front-End Designer')}</strong>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="p-3 rounded-3 bg-light border">
              <span class="d-block small text-muted">Teknologi:</span>
              <strong class="text-cherry small">${this.escapeHTML(proj.technology || proj.tags.join(', '))}</strong>
            </div>
          </div>
        </div>
      `;
    }

    const modalEl = document.getElementById('universalProjectModal');
    if (modalEl) {
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
  }

  // Filter Kategori Instan
  applyFilter(category) {
    this.state.activeFilter = category;

    document.querySelectorAll('.filter-btn').forEach(btn => {
      if (btn.getAttribute('data-filter') === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (category === 'all') {
      this.state.filteredProjects = this.state.projects;
    } else {
      this.state.filteredProjects = this.state.projects.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    }

    this.renderProjects();
  }

  // Penanganan Event Form Asinkron & Filter
  setupEventListeners() {
    // Event Filter Kategori
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.getAttribute('data-filter');
        this.applyFilter(cat);
      });
    });

    // Form Submit Asinkron (No Page Reload)
    if (this.form) {
      this.form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validasi native form
        if (!this.form.checkValidity()) {
          e.stopPropagation();
          this.form.classList.add('was-validated');
          return;
        }

        const formData = new FormData(this.form);
        const payload = Object.fromEntries(formData.entries());
        payload.waktuKirim = new Date().toLocaleString('id-ID');

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Mengirim...';

        try {
          await ApiService.submitConsultationOrder(payload);
          this.saveOrderToLocalStorage(payload);
          this.showToast('Permintaan Terkirim! ♡', 'Data konsultasi Anda berhasil diproses dan dicatat di penyimpanan lokal.');
          this.form.reset();
          this.form.classList.remove('was-validated');
        } catch (err) {
          this.showToast('Gagal Mengirim', 'Terjadi kesalahan jaringan saat mengirim data. Coba lagi nanti.', true);
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      });
    }
  }

  // Local Storage State Persistence & Reactive Badge
  saveOrderToLocalStorage(order) {
    this.state.orders.push(order);
    localStorage.setItem('davina_consultation_orders', JSON.stringify(this.state.orders));
    this.updateOrderBadge();
  }

  loadOrdersFromStorage() {
    try {
      const saved = localStorage.getItem('davina_consultation_orders');
      this.state.orders = saved ? JSON.parse(saved) : [];
      this.updateOrderBadge();
    } catch (e) {
      this.state.orders = [];
    }
  }

  updateOrderBadge() {
    if (this.orderBadge) {
      const count = this.state.orders.length;
      this.orderBadge.textContent = count;
      this.orderBadge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }

  showToast(title, message, isError = false) {
    const titleEl = document.getElementById('toastFeedbackTitle');
    const msgEl = document.getElementById('toastFeedbackMsg');
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    if (this.toastInstance) {
      this.toastInstance.show();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new PortfolioApp();
  app.init();
});