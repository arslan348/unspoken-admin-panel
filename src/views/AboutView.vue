<script setup>
import { onMounted, ref } from 'vue'
import { useAbout } from '../composables/useAbout.js'

const { about, loading, error, fetchAbout, updateAbout } = useAbout()

const toast = ref('')

onMounted(fetchAbout)

async function handleSave() {
  const result = await updateAbout(about.value)
  if (result.success) {
    showToast('About section updated successfully.')
  } else {
    showToast(result.message || 'Something went wrong.', true)
  }
}

function showToast(message, isError = false) {
  toast.value = message
  setTimeout(() => (toast.value = ''), 3000)
}
</script>

<template>
  <div class="about-page">
    <div class="page-header">
      <div>
        <h2>About Us</h2>
        <p class="subtitle">Manage your about page content</p>
      </div>
    </div>

    <div v-if="loading" class="state-msg">Loading...</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>

    <form v-else @submit.prevent="handleSave" class="about-form">
      <div class="grid">
        <!-- Main Section -->
        <div class="card">
          <h4>Main Section</h4>
          <div class="field">
            <label>Title</label>
            <input type="text" v-model="about.title" required />
          </div>
          <div class="field">
            <label>Subtitle</label>
            <textarea rows="3" v-model="about.subtitle"></textarea>
          </div>
        </div>

        <!-- Our Vision -->
        <div class="card">
          <h4>Our Vision</h4>
          <div class="field">
            <label>Vision Title</label>
            <input type="text" v-model="about.visionTitle" />
          </div>
          <div class="field">
            <label>Vision Text</label>
            <textarea rows="5" v-model="about.visionText"></textarea>
          </div>
          <div class="field">
            <label>Vision Image URL</label>
            <input type="url" v-model="about.visionImage" />
          </div>
        </div>

        <!-- Our Approach -->
        <div class="card">
          <h4>Our Approach</h4>
          <div class="field">
            <label>Approach Title</label>
            <input type="text" v-model="about.approachTitle" />
          </div>
          <div class="field">
            <label>Approach Text</label>
            <textarea rows="5" v-model="about.approachText"></textarea>
          </div>
          <div class="field">
            <label>Approach Image URL</label>
            <input type="url" v-model="about.approachImage" />
          </div>
        </div>

        <!-- Our Process -->
        <div class="card">
          <h4>Our Process</h4>
          <div class="field">
            <label>Process Title</label>
            <input type="text" v-model="about.processTitle" />
          </div>
          <div class="field">
            <label>Process Text</label>
            <textarea rows="5" v-model="about.processText"></textarea>
          </div>
          <div class="field">
            <label>Process Image URL</label>
            <input type="url" v-model="about.processImage" />
          </div>
        </div>
      </div>

      <button type="submit" class="btn-primary">Save Changes</button>
    </form>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<style scoped>
.about-page {
  padding: 2rem;
  position: relative;
}

.page-header {
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

.state-msg {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.state-msg.error {
  color: #dc2626;
}

.about-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card h4 {
  margin: 0;
  font-size: 1rem;
  color: #1a1a1a;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field label {
  font-size: 0.83rem;
  font-weight: 500;
  color: #374151;
}

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

.field input:focus,
.field textarea:focus {
  border-color: #4f46e5;
}

.btn-primary {
  align-self: flex-start;
  padding: 0.55rem 1.25rem;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #4338ca;
}

.toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 200;
  animation: slidein 0.2s ease;
}

@keyframes slidein {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>