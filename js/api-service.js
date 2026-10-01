/**
 * api-service.js
 * Data Access Layer: Menangani pemanggilan HTTP Fetch & Error Handling
 */
class ApiService {
  static async fetchJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: Gagal memuat ${url}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`[API Service Error] ${url}:`, err);
      throw err;
    }
  }

  static async getProfile() {
    return await this.fetchJSON('./data/profile.json');
  }

  static async getProjects() {
    return await this.fetchJSON('./data/projects.json');
  }

  static async getServices() {
    return await this.fetchJSON('./data/services.json');
  }

  /**
   * Mengirim form DTO secara asinkron ke REST API (JSONPlaceholder mock)
   */
  static async submitConsultationOrder(payload) {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Gagal mengirim permintaan: ${response.status}`);
    }

    return await response.json();
  }
}

window.ApiService = ApiService;