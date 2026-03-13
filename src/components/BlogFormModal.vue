<script setup>
import { ref, watch, onMounted } from 'vue'
import { apiBase } from '../utils/api'

const props = defineProps({
  show: Boolean,
  blog: { type: Object, default: null },
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  title: '',
  subtitle: '',
  content: '',
  image: '',
  tags: [],
  readTime: '',
  published: false,
})
const tagInput = ref('')
const saving = ref(false)
const errorMsg = ref('')
const imageError = ref('')
const imageUploading = ref(false)
const imagePreview = ref('')

watch(
  () => props.blog,
  (b) => {
    if (b) {
      form.value = {
        title: b.title,
        subtitle: b.subtitle || '',
        content: b.content,
        image: b.image || '',
        tags: [...(b.tags || [])],
        readTime: b.readTime || '',
        published: b.published || false,
      }
    } else {
      form.value = {
        title: '',
        subtitle: '',
        content: '',
        image: '',
        tags: [],
        readTime: '',
        published: false,
      }
    }
    errorMsg.value = ''
    imageError.value = ''
    tagInput.value = ''
    imagePreview.value = b?.image || ''
  },
  { immediate: true }
)

function addTag() {
  const tag = tagInput.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
  }
  tagInput.value = ''
}

function removeTag(index) {
  form.value.tags.splice(index, 1)
}

function handleTagKeydown(e) {
  if (e.key === 'Enter') {
    e.preventDefault()
    addTag()
  }
}

async function handleFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  imageError.value = ''

  const localUrl = URL.createObjectURL(file)
  imageUploading.value = true
  imagePreview.value = localUrl

  try {
    const token = localStorage.getItem('token')
    const fd = new FormData()
    fd.append('image', file)
    const res = await fetch(`${apiBase}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
    const data = await res.json()
    if (data.success) {
      form.value.image = data.url
    } else {
      imageError.value = data.message || 'Upload failed.'
      imagePreview.value = ''
    }
  } catch {
    imageError.value = 'Upload failed. Check your connection.'
    imagePreview.value = ''
  } finally {
    imageUploading.value = false
  }
}

async function submit() {
  errorMsg.value = ''
  if (!form.value.title || !form.value.content) {
    errorMsg.value = 'Title and content are required.'
    return
  }
  if (imageUploading.value) {
    errorMsg.value = 'Please wait for the image to finish uploading.'
    return
  }
  saving.value = true
  emit('save', { ...form.value })
  saving.value = false
}
</script>

<template>
  <div v-if="show" class="overlay" @click.self="emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ blog ? 'Edit Blog Post' : 'New Blog Post' }}</h3>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <form @submit.prevent="submit" class="modal-body">
        <!-- Title -->
        <div class="field">
          <label>Title</label>
          <input v-model="form.title" placeholder="Blog post title" required />
        </div>

        <!-- Subtitle -->
        <div class="field">
          <label>Subtitle <span class="optional">(optional)</span></label>
          <input v-model="form.subtitle" placeholder="Short description or intro" />
        </div>

        <!-- Content -->
        <div class="field">
          <label>Content <span class="optional">(HTML supported)</span></label>
          <textarea v-model="form.content" rows="12" placeholder="Write your blog content here..." required></textarea>
        </div>

        <!-- Read Time + Published -->
        <div class="row">
          <div class="field">
            <label>Read Time <span class="optional">(optional)</span></label>
            <input v-model="form.readTime" placeholder="e.g. ~4-6 min" />
          </div>
          <div class="field">
            <label>Status</label>
            <label class="toggle-label">
              <input type="checkbox" v-model="form.published" class="toggle-input" />
              <span class="toggle-text">{{ form.published ? 'Published' : 'Draft' }}</span>
            </label>
          </div>
        </div>

        <!-- Tags -->
        <div class="field">
          <label>Tags <span class="optional">(optional)</span></label>
          <div v-if="form.tags.length > 0" class="tags">
            <span v-for="(tag, i) in form.tags" :key="i" class="tag">
              {{ tag }}
              <button type="button" class="tag-remove" @click="removeTag(i)">✕</button>
            </span>
          </div>
          <div class="tag-input-row">
            <input
              v-model="tagInput"
              placeholder="Type a tag and press Enter"
              @keydown="handleTagKeydown"
            />
            <button type="button" class="btn-add-tag" @click="addTag">Add</button>
          </div>
        </div>

        <!-- Cover Image -->
        <div class="field">
          <label>Cover Image <span class="optional">(JPEG, PNG, WebP)</span></label>
          <div class="upload-area" :class="{ 'has-image': imagePreview, 'has-error': imageError }">
            <img v-if="imagePreview" :src="imagePreview" class="upload-preview" alt="Preview" />
            <div v-if="!imagePreview" class="upload-placeholder">
              <span class="upload-icon">📁</span>
              <span>Click to choose image</span>
            </div>
            <div v-if="imageUploading" class="upload-overlay">
              <span class="upload-spinner"></span> Uploading...
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="upload-input"
              @change="handleFileChange"
            />
          </div>
          <span v-if="imageError" class="field-error">{{ imageError }}</span>
          <span v-else-if="form.image && !imageUploading" class="field-hint">Image uploaded successfully.</span>
          <button
            v-if="form.image && !imageUploading"
            type="button"
            class="btn-clear-img"
            @click="form.image = ''; imagePreview = ''"
          >
            Remove image
          </button>
        </div>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <div class="actions">
          <button type="button" class="btn-secondary" @click="emit('close')">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? 'Saving...' : blog ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fff;
  border-radius: 10px;
  width: 620px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.05rem;
  color: #1a1a1a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #888;
  padding: 0.25rem;
  line-height: 1;
}
.close-btn:hover { color: #333; }

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.field label {
  font-size: 0.83rem;
  font-weight: 500;
  color: #374151;
}

.field select,
.field input,
.field textarea {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
}

.field select:focus,
.field input:focus,
.field textarea:focus {
  border-color: #4f46e5;
}

.row {
  display: flex;
  gap: 1rem;
}

.optional {
  font-weight: 400;
  color: #9ca3af;
}

.error {
  color: #dc2626;
  font-size: 0.85rem;
  margin: 0;
}

.field-error {
  font-size: 0.78rem;
  color: #dc2626;
}

.field-hint {
  font-size: 0.78rem;
  color: #9ca3af;
}

/* Toggle */
.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 0;
}

.toggle-input {
  width: 16px;
  height: 16px;
  accent-color: #4f46e5;
}

.toggle-text {
  font-size: 0.9rem;
  color: #374151;
}

/* Tags */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.25rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.6rem;
  background: #ede9fe;
  color: #5b21b6;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 500;
}

.tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: #7c3aed;
  font-size: 0.7rem;
  padding: 0;
  line-height: 1;
  display: flex;
  align-items: center;
}
.tag-remove:hover { color: #4c1d95; }

.tag-input-row {
  display: flex;
  gap: 0.5rem;
}

.tag-input-row input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  font-family: inherit;
}

.tag-input-row input:focus {
  border-color: #4f46e5;
}

.btn-add-tag {
  padding: 0.5rem 0.85rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
}
.btn-add-tag:hover { background: #e5e7eb; }

/* Upload */
.upload-area {
  position: relative;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover { border-color: #4f46e5; }
.upload-area.has-image { border-style: solid; border-color: #e5e7eb; }
.upload-area.has-error { border-color: #dc2626; }

.upload-preview {
  width: 100%;
  max-height: 220px;
  object-fit: contain;
  display: block;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 0.875rem;
  padding: 2rem;
}

.upload-icon { font-size: 2rem; }

.upload-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4f46e5;
  font-weight: 500;
}

.upload-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #c4b5fd;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.btn-clear-img {
  align-self: flex-start;
  background: none;
  border: none;
  color: #dc2626;
  font-size: 0.78rem;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}
.btn-clear-img:hover { color: #b91c1c; }

/* Actions */
.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.btn-primary {
  padding: 0.5rem 1.25rem;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover:not(:disabled) { background: #4338ca; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary {
  padding: 0.5rem 1.25rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-secondary:hover { background: #e5e7eb; }
</style>
