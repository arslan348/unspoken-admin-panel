import { ref } from 'vue'
import { apiBase } from '../utils/api'

const blogs = ref([])
const loading = ref(false)
const error = ref(null)

export function useBlogs() {
  function getHeaders() {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  async function fetchBlogs() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${apiBase}/api/blogs`)
      const data = await res.json()
      if (data.success) {
        blogs.value = data.data
      } else {
        error.value = data.message || 'Failed to load blogs'
      }
    } catch {
      error.value = 'Network error'
    } finally {
      loading.value = false
    }
  }

  async function createBlog(payload) {
    const res = await fetch(`${apiBase}/api/blogs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (data.success) await fetchBlogs()
    return { success: data.success, message: data.message }
  }

  async function updateBlog(id, payload) {
    const res = await fetch(`${apiBase}/api/blogs/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (data.success) await fetchBlogs()
    return { success: data.success, message: data.message }
  }

  async function deleteBlog(id) {
    const res = await fetch(`${apiBase}/api/blogs/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    const data = await res.json()
    if (data.success) await fetchBlogs()
    return { success: data.success, message: data.message }
  }

  return { blogs, loading, error, fetchBlogs, createBlog, updateBlog, deleteBlog }
}
