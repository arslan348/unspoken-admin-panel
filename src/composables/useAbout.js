import { ref } from 'vue'
import { apiBase } from '../utils/api'

const about = ref({})
const loading = ref(false)
const error = ref(null)

export function useAbout() {
  function getHeaders() {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  async function fetchAbout() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${apiBase}/api/about`)
      const data = await res.json()
      if (data.success) {
        about.value = data.data
      } else {
        error.value = data.message || 'Failed to load about data'
      }
    } catch {
      error.value = 'Network error'
    } finally {
      loading.value = false
    }
  }

  async function updateAbout(payload) {
    const res = await fetch(`${apiBase}/api/about`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (data.success) await fetchAbout()
    return { success: data.success, message: data.message }
  }

  return {
    about,
    loading,
    error,
    fetchAbout,
    updateAbout,
  }
}