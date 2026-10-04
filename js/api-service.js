/**
 * api-service.js
 * Data Access Layer (DAL): Menangani komunikasi asinkron via HTTP Fetch,
 * validasi respons, error handling defensif, dan pengiriman payload POST DTO.
 * 
 * Pengembang: Davina Olivia Yosefanny Hutabarat (12S24047)
 * Mata Kuliah: Pemrograman dan Pengujian Web (12S3101) - Institut Teknologi Del
 */

class ApiService {
  /**
   * Helper dasar untuk mengambil data JSON dengan penanganan error defensif
   * @param {string} url - Alamat endpoint berkas JSON atau REST API
   * @returns {Promise<any>}
   */
  static async fetchJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText} (Gagal memuat ${url})`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`[API Network Error] ${url}:`, err);
      throw err;
    }
  }

  /**
   * Mengambil biodata mahasiswa dan metrik ringkas dari profile.json
   */
  static async getProfile() {
    return await this.fetchJSON('./data/profile.json');
  }

  /**
   * Mengambil katalog koleksi proyek portofolio dari projects.json
   */
  static async getProjects() {
    return await this.fetchJSON('./data/projects.json');
  }

  /**
   * Mengambil daftar paket layanan konsultasi dari services.json
   */
  static async getServices() {
    return await this.fetchJSON('./data/services.json');
  }

  /**
   * Mengirim pesanan layanan (Service Order DTO) secara asinkron ke REST API Mock
   * Menggunakan endpoint JSONPlaceholder (HTTP POST)
   * @param {Object} payload - Objek data formulir terstruktur (DTO)
   * @returns {Promise<any>}
   */
  static async submitServiceOrder(payload) {
    const endpoint = 'https://jsonplaceholder.typicode.com/posts';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: Gagal mengirim permintaan layanan ke server mock.`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('[API Network Error] submitServiceOrder:', err);
      throw err;
    }
  }

  /**
   * Alias kompatibilitas
   */
  static async submitConsultationOrder(payload) {
    return await this.submitServiceOrder(payload);
  }
}

// Ekspos ke global window untuk konsumsi Presentation Layer (app.js)
window.ApiService = ApiService;