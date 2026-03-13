<script setup>
import { onMounted, ref } from 'vue'
import { useBlogs } from '../composables/useBlogs.js'
import BlogFormModal from '../components/BlogFormModal.vue'

const { blogs, loading, error, fetchBlogs, createBlog, updateBlog, deleteBlog } = useBlogs()

const showModal = ref(false)
const editingBlog = ref(null)
const toast = ref('')

onMounted(fetchBlogs)

function openCreate() {
  editingBlog.value = null
  showModal.value = true
}

function openEdit(blog) {
  editingBlog.value = blog
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingBlog.value = null
}

async function handleSave(payload) {
  let result
  if (editingBlog.value) {
    result = await updateBlog(editingBlog.value._id, payload)
  } else {
    result = await createBlog(payload)
  }
  if (result.success) {
    showToast(editingBlog.value ? 'Blog updated.' : 'Blog created.')
    closeModal()
  } else {
    showToast(result.message || 'Something went wrong.', true)
  }
}

async function handleDelete(blog) {
  if (!confirm(`Delete "${blog.title}"?`)) return
  const result = await deleteBlog(blog._id)
  if (result.success) {
    showToast('Blog deleted.')
  } else {
    showToast(result.message || 'Delete failed.', true)
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function truncate(text, len = 80) {
  if (!text) return ''
  const stripped = text.replace(/<[^>]*>/g, '')
  return stripped.length > len ? stripped.slice(0, len) + '...' : stripped
}

let toastTimer = null
function showToast(msg, isError = false) {
  toast.value = (isError ? '✗ ' : '✓ ') + msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 3000)
}
</script>

<template>
  <div class="blogs-page">
    <div class="page-header">
      <div>
        <h2>Blog Posts</h2>
        <p class="subtitle">Manage your blog content</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ Add Blog Post</button>
    </div>

    <div v-if="loading" class="state-msg">Loading blogs...</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>

    <div v-else-if="blogs.length === 0" class="empty">
      <p>No blog posts yet.</p>
      <button class="btn-primary" @click="openCreate">Add your first blog post</button>
    </div>

    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Tags</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="blog in blogs" :key="blog._id">
            <td>
              <img v-if="blog.image" :src="blog.image" :alt="blog.title" class="thumb" />
              <div v-else class="no-img">--</div>
            </td>
            <td>
              <div class="blog-title">{{ blog.title }}</div>
              <div class="blog-desc">{{ truncate(blog.content) }}</div>
            </td>
            <td>
              <div class="badge-group">
                <span v-for="tag in (blog.tags || [])" :key="tag" class="badge">{{ tag }}</span>
                <span v-if="!blog.tags || blog.tags.length === 0" class="badge muted">--</span>
              </div>
            </td>
            <td>
              <span :class="['status', blog.published ? 'published' : 'draft']">
                {{ blog.published ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="date-cell">{{ formatDate(blog.createdAt) }}</td>
            <td class="actions-cell">
              <button class="btn-edit" @click="openEdit(blog)">Edit</button>
              <button class="btn-delete" @click="handleDelete(blog)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BlogFormModal
      :show="showModal"
      :blog="editingBlog"
      @close="closeModal"
      @save="handleSave"
    />

    <div v-if="toast" class="toast" :class="toast.startsWith('✗') ? 'toast-error' : 'toast-success'">
      {{ toast }}
    </div>
  </div>
</template>

<style scoped>
.blogs-page {
  padding: 2rem;
  position: relative;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.page-header h2 {
  margin: 0 0 0.25rem;
  font-size: 1.4rem;
  color: #1a1a1a;
}

.subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.btn-primary {
  padding: 0.55rem 1.25rem;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #4338ca;
}

.state-msg {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.state-msg.error {
  color: #dc2626;
}

.empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.table-wrap {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

thead {
  background: #f9fafb;
}

th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.78rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background: #fafafa;
}

.thumb {
  width: 56px;
  height: 38px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.no-img {
  width: 56px;
  height: 38px;
  background: #f3f4f6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 0.75rem;
}

.blog-title {
  font-weight: 500;
  color: #1a1a1a;
}

.blog-desc {
  font-size: 0.78rem;
  color: #9ca3af;
  margin-top: 0.15rem;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: #ede9fe;
  color: #5b21b6;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge.muted {
  background: #f3f4f6;
  color: #9ca3af;
}

.status {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status.published {
  background: #f0fdf4;
  color: #16a34a;
}

.status.draft {
  background: #fefce8;
  color: #ca8a04;
}

.date-cell {
  color: #6b7280;
  font-size: 0.85rem;
  white-space: nowrap;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.btn-edit {
  padding: 0.35rem 0.75rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  font-size: 0.82rem;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-edit:hover {
  background: #e5e7eb;
}

.btn-delete {
  padding: 0.35rem 0.75rem;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 5px;
  font-size: 0.82rem;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-delete:hover {
  background: #fee2e2;
}

.toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 200;
  animation: slidein 0.2s ease;
}

.toast-success {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.toast-error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

@keyframes slidein {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
