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
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title mb-0">About Us</h4>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
            <form v-else @submit.prevent="handleSave">
              <div class="row">
                <div class="col-md-6">
                  <h5>Main Section</h5>
                  <div class="mb-3">
                    <label for="title" class="form-label">Title</label>
                    <input
                      type="text"
                      class="form-control"
                      id="title"
                      v-model="about.title"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="subtitle" class="form-label">Subtitle</label>
                    <textarea
                      class="form-control"
                      id="subtitle"
                      rows="3"
                      v-model="about.subtitle"
                    ></textarea>
                  </div>
                </div>
                <div class="col-md-6">
                  <h5>Our Vision</h5>
                  <div class="mb-3">
                    <label for="visionTitle" class="form-label">Vision Title</label>
                    <input
                      type="text"
                      class="form-control"
                      id="visionTitle"
                      v-model="about.visionTitle"
                    />
                  </div>
                  <div class="mb-3">
                    <label for="visionText" class="form-label">Vision Text</label>
                    <textarea
                      class="form-control"
                      id="visionText"
                      rows="5"
                      v-model="about.visionText"
                    ></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="visionImage" class="form-label">Vision Image URL</label>
                    <input
                      type="url"
                      class="form-control"
                      id="visionImage"
                      v-model="about.visionImage"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <h5>Our Approach</h5>
                  <div class="mb-3">
                    <label for="approachTitle" class="form-label">Approach Title</label>
                    <input
                      type="text"
                      class="form-control"
                      id="approachTitle"
                      v-model="about.approachTitle"
                    />
                  </div>
                  <div class="mb-3">
                    <label for="approachText" class="form-label">Approach Text</label>
                    <textarea
                      class="form-control"
                      id="approachText"
                      rows="5"
                      v-model="about.approachText"
                    ></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="approachImage" class="form-label">Approach Image URL</label>
                    <input
                      type="url"
                      class="form-control"
                      id="approachImage"
                      v-model="about.approachImage"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <h5>Our Process</h5>
                  <div class="mb-3">
                    <label for="processTitle" class="form-label">Process Title</label>
                    <input
                      type="text"
                      class="form-control"
                      id="processTitle"
                      v-model="about.processTitle"
                    />
                  </div>
                  <div class="mb-3">
                    <label for="processText" class="form-label">Process Text</label>
                    <textarea
                      class="form-control"
                      id="processText"
                      rows="5"
                      v-model="about.processText"
                    ></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="processImage" class="form-label">Process Image URL</label>
                    <input
                      type="url"
                      class="form-control"
                      id="processImage"
                      v-model="about.processImage"
                    />
                  </div>
                </div>
              </div>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toast"
      class="toast show position-fixed bottom-0 end-0 m-3"
      role="alert"
    >
      <div class="toast-body">{{ toast }}</div>
    </div>
  </div>
</template>