<template>
  <div class="material-training-page">
    <!-- Header Section -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <div class="d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h4 class="fw-bold text-dark mb-1">
              <CIcon icon="cil-book" class="me-2" />Material Training
            </h4>
            <p class="text-muted mb-0">Kumpulan materi training untuk semua anggota tim</p>
          </div>
          <button class="btn btn-primary btn-add-material" @click="openAddModal()">
            <CIcon icon="cil-plus" size="sm" class="me-1" /> Tambah Materi
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body py-3">
        <div class="row align-items-center">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0">
                <CIcon icon="cil-search" />
              </span>
              <input
                v-model="searchQuery"
                type="text"
                class="form-control border-start-0 ps-0"
                placeholder="Cari materi training..."
              />
            </div>
          </div>
          <div class="col-md-8">
            <div class="d-flex flex-wrap gap-2 justify-content-md-end mt-2 mt-md-0">
              <button
                v-for="cat in ['All', ...categories]"
                :key="cat"
                class="btn btn-filter"
                :class="{ 'btn-filter-active': selectedCategory === cat }"
                @click="filterByCategory(cat)"
              >
                <span class="filter-dot" :class="getCategoryColor(cat)"></span>
                {{ cat }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted mt-2">Memuat data materi training...</p>
    </div>

    <div v-else-if="filteredMaterials.length === 0" class="card shadow-sm border-0">
      <div class="card-body text-center py-5">
        <CIcon icon="cil-folder-open" size="3xl" class="text-muted mb-3" />
        <h5 class="text-muted">Belum ada materi training</h5>
        <p class="text-muted">Klik tombol "Tambah Materi" untuk mengunggah materi pertama.</p>
      </div>
    </div>

    <div v-else class="card shadow-sm border-0">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover table-striped align-middle mb-0">
            <thead class="text-nowrap">
              <tr>
                <th class="ps-4 text-center sticky-col-1" style="width: 60px; min-width: 60px; max-width: 60px;">No</th>
                <th class="sticky-col-2" style="width: 200px; min-width: 200px; max-width: 200px;">Nama Materi</th>
                <th style="width: 30%">Deskripsi</th>
                <th style="width: 12%">Kategori</th>
                <th style="width: 13%">Diunggah Oleh</th>
                <th style="width: 10%">Tanggal</th>
                <th class="pe-4 text-end" style="width: 10%">File & Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(material, index) in filteredMaterials" :key="material.uuid">
                <td class="ps-4 text-center fw-semibold text-muted sticky-col-1">{{ index + 1 }}</td>
                <td class="sticky-col-2">
                  <div class="fw-semibold text-dark">{{ material.material_name }}</div>
                </td>
                <td>
                  <span class="text-muted small text-truncate-custom" :title="material.material_desc">
                    {{ material.material_desc || '-' }}
                  </span>
                </td>
                <td>
                  <span class="badge rounded-pill px-3 py-2" :class="getCategoryBadgeClass(material.category)">
                    {{ material.category }}
                  </span>
                </td>
                <td>
                  <span class="small text-secondary">{{ material.created_by }}</span>
                </td>
                <td>
                  <span class="small text-secondary">{{ formatDate(material.created_dt) }}</span>
                </td>
                <td class="pe-4 text-end">
                  <div class="d-flex justify-content-end align-items-center gap-2">
                    <!-- PDF Icon untuk Preview (Ikon file di sebelah kanan) -->
                    <button
                      class="btn btn-link p-1 text-danger position-relative file-icon-btn me-2"
                      title="Preview PDF"
                      @click="previewPdf(material)"
                    >
                      <CIcon icon="cil-file" size="lg" />
                      <span class="badge-pdf-small">PDF</span>
                    </button>

                    <!-- Download Icon Button -->
                    <a
                      :href="getFileUrl(material.file_path)"
                      target="_blank"
                      class="btn btn-sm btn-outline-primary btn-action"
                      title="Download"
                      download
                    >
                      <CIcon icon="cil-cloud-download" size="sm" />
                    </a>

                    <!-- Edit Button -->
                    <button
                      class="btn btn-sm btn-outline-warning btn-action"
                      title="Edit"
                      @click="openEditModal(material)"
                    >
                      <CIcon icon="cil-pencil" size="sm" />
                    </button>

                    <!-- Delete Button -->
                    <button
                      class="btn btn-sm btn-outline-danger btn-action"
                      title="Hapus"
                      @click="deleteMaterial(material)"
                    >
                      <CIcon icon="cil-trash" size="sm" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <CModal :visible="showModal" @close="closeModal" size="lg" alignment="center" backdrop="static">
      <CModalHeader>
        <CModalTitle>{{ isEdit ? 'Edit Materi Training' : 'Tambah Materi Training' }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="mb-3">
          <label class="form-label fw-semibold">Nama Materi <span class="text-danger">*</span></label>
          <CFormInput v-model="form.material_name" placeholder="Masukkan nama materi training" />
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Deskripsi</label>
          <CFormTextarea v-model="form.material_desc" rows="3" placeholder="Deskripsi singkat materi (opsional)" />
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Kategori <span class="text-danger">*</span></label>
          <CFormSelect v-model="form.category">
            <option value="">Pilih Kategori</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </CFormSelect>
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">File PDF <span v-if="!isEdit" class="text-danger">*</span></label>
          <input
            ref="fileInput"
            type="file"
            class="form-control"
            accept=".pdf"
            @change="onFileSelected"
          />
          <div v-if="isEdit && currentFileName" class="form-text">
            File saat ini: <strong>{{ currentFileName }}</strong>. Pilih file baru untuk mengganti.
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="ghost" @click="closeModal">Batal</CButton>
        <CButton color="primary" :disabled="isSaving" @click="saveMaterial">
          <span v-if="isSaving" class="spinner-border spinner-border-sm me-1" role="status"></span>
          {{ isEdit ? 'Simpan Perubahan' : 'Unggah Materi' }}
        </CButton>
      </CModalFooter>
    </CModal>

    <!-- Preview Modal -->
    <CModal :visible="showPreviewModal" @close="closePreviewModal" size="xl" alignment="center">
      <CModalHeader>
        <CModalTitle>Preview: {{ previewTitle }}</CModalTitle>
      </CModalHeader>
      <CModalBody class="p-0">
        <iframe
          v-if="previewUrl"
          :src="previewUrl"
          class="w-100 border-0"
          style="height: 80vh;"
        ></iframe>
      </CModalBody>
    </CModal>
  </div>
</template>

<script>
import {
  GET_MATERIAL_TRAININGS,
  POST_MATERIAL_TRAINING,
  PUT_MATERIAL_TRAINING,
  DELETE_MATERIAL_TRAINING
} from '@/store/modules/materialTraining.module'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'

export default {
  name: 'MaterialTraining',
  data() {
    return {
      categories: ['Safety', 'Quality', 'Productivity', 'Cost', 'HR'],
      selectedCategory: 'All',
      searchQuery: '',
      isLoading: false,
      showModal: false,
      showPreviewModal: false,
      isEdit: false,
      isSaving: false,
      editUuid: null,
      currentFileName: '',
      previewUrl: null,
      previewTitle: '',
      form: {
        material_name: '',
        material_desc: '',
        category: '',
      },
      selectedFile: null,
    }
  },
  computed: {
    ...mapGetters(['materialTrainings']),
    filteredMaterials() {
      let materials = this.materialTrainings || []
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        materials = materials.filter(m =>
          m.material_name.toLowerCase().includes(q) ||
          (m.material_desc && m.material_desc.toLowerCase().includes(q))
        )
      }
      return materials
    }
  },
  methods: {
    async fetchMaterials() {
      this.isLoading = true
      try {
        const query = {}
        if (this.selectedCategory !== 'All') {
          query.category = this.selectedCategory
        }
        await this.$store.dispatch(GET_MATERIAL_TRAININGS, query)
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    filterByCategory(cat) {
      this.selectedCategory = cat
      this.fetchMaterials()
    },
    getCategoryColor(cat) {
      const map = {
        'All': 'dot-all',
        'Safety': 'dot-safety',
        'Quality': 'dot-quality',
        'Productivity': 'dot-productivity',
        'Cost': 'dot-cost',
        'HR': 'dot-hr',
      }
      return map[cat] || 'dot-all'
    },
    getCategoryBadgeClass(cat) {
      const map = {
        'Safety': 'badge-safety',
        'Quality': 'badge-quality',
        'Productivity': 'badge-productivity',
        'Cost': 'badge-cost',
        'HR': 'badge-hr',
      }
      return map[cat] || 'bg-secondary'
    },
    getFileUrl(filePath) {
      if (!filePath) return '#'
      // Remove leading ./ from the file path
      const cleanPath = filePath.replace(/^\.\//, '')
      return `${process.env.VUE_APP_URL}/file?path=${cleanPath}`
    },
    formatDate(dt) {
      if (!dt) return '-'
      const d = new Date(dt)
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    },
    openAddModal() {
      this.isEdit = false
      this.editUuid = null
      this.currentFileName = ''
      this.form = { material_name: '', material_desc: '', category: '' }
      this.selectedFile = null
      if (this.$refs.fileInput) this.$refs.fileInput.value = ''
      this.showModal = true
    },
    openEditModal(material) {
      this.isEdit = true
      this.editUuid = material.uuid
      this.form = {
        material_name: material.material_name,
        material_desc: material.material_desc || '',
        category: material.category,
      }
      this.currentFileName = material.file_path ? material.file_path.split('/').pop().split('--').pop() : ''
      this.selectedFile = null
      if (this.$refs.fileInput) this.$refs.fileInput.value = ''
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    onFileSelected(event) {
      const file = event.target.files[0]
      if (file) {
        if (!file.name.toLowerCase().endsWith('.pdf')) {
          Swal.fire('Format tidak valid', 'Hanya file PDF yang diperbolehkan', 'error')
          event.target.value = ''
          this.selectedFile = null
          return
        }
        this.selectedFile = file
      }
    },
    async saveMaterial() {
      // Validation
      if (!this.form.material_name.trim()) {
        return Swal.fire('Validasi', 'Nama materi wajib diisi', 'warning')
      }
      if (!this.form.category) {
        return Swal.fire('Validasi', 'Kategori wajib dipilih', 'warning')
      }
      if (!this.isEdit && !this.selectedFile) {
        return Swal.fire('Validasi', 'File PDF wajib diunggah', 'warning')
      }

      this.isSaving = true
      try {
        const formData = new FormData()
        formData.append('material_name', this.form.material_name)
        formData.append('material_desc', this.form.material_desc)
        formData.append('category', this.form.category)
        formData.append('dest', 'material-training')
        if (this.selectedFile) {
          formData.append('file', this.selectedFile)
        }

        if (this.isEdit) {
          await this.$store.dispatch(PUT_MATERIAL_TRAINING, {
            uuid: this.editUuid,
            formData
          })
          Swal.fire('Berhasil!', 'Materi training berhasil diperbarui', 'success')
        } else {
          await this.$store.dispatch(POST_MATERIAL_TRAINING, formData)
          Swal.fire('Berhasil!', 'Materi training berhasil ditambahkan', 'success')
        }

        this.closeModal()
        this.fetchMaterials()
      } catch (error) {
        console.error(error)
        Swal.fire('Gagal!', 'Terjadi kesalahan saat menyimpan data', 'error')
      } finally {
        this.isSaving = false
      }
    },
    async deleteMaterial(material) {
      const result = await Swal.fire({
        title: 'Hapus Materi?',
        text: `Apakah Anda yakin ingin menghapus "${material.material_name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e55353',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
      })
      if (result.isConfirmed) {
        try {
          await this.$store.dispatch(DELETE_MATERIAL_TRAINING, material.uuid)
          Swal.fire('Berhasil!', 'Materi training berhasil dihapus', 'success')
          this.fetchMaterials()
        } catch (error) {
          console.error(error)
          Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus data', 'error')
        }
      }
    },
    previewPdf(material) {
      this.previewTitle = material.material_name
      this.previewUrl = this.getFileUrl(material.file_path)
      this.showPreviewModal = true
    },
    closePreviewModal() {
      this.showPreviewModal = false
      this.previewUrl = null
      this.previewTitle = ''
    }
  },
  mounted() {
    this.fetchMaterials()
  }
}
</script>

<style scoped>
/* ========== Page Styles ========== */
.material-training-page {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ========== Add Button ========== */
.btn-add-material {
  background: linear-gradient(135deg, #321fdb, #6b5ce7);
  border: none;
  padding: 10px 20px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(50, 31, 219, 0.3);
}

.btn-add-material:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(50, 31, 219, 0.4);
}

/* ========== Filter Buttons ========== */
.btn-filter {
  border: 1px solid #e0e0e0;
  background: #fff;
  color: #636f83;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-filter:hover {
  border-color: #321fdb;
  color: #321fdb;
  background: rgba(50, 31, 219, 0.04);
}

.btn-filter-active {
  background: #321fdb !important;
  color: #fff !important;
  border-color: #321fdb !important;
  box-shadow: 0 2px 10px rgba(50, 31, 219, 0.3);
}

.btn-filter-active .filter-dot {
  background: #fff !important;
}

.filter-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.dot-all { background: #636f83; }
.dot-safety { background: #e55353; }
.dot-quality { background: #2eb85c; }
.dot-productivity { background: #f9b115; }
.dot-cost { background: #3399ff; }
.dot-hr { background: #9b59b6; }

/* ========== Table Styles & File Icon ========== */
.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  background-color: #3c4b64 !important;
  color: #ffffff !important;
}

/* ========== Sticky Columns (Freeze on Mobile) ========== */
.sticky-col-1 {
  position: sticky !important;
  left: 0;
  z-index: 5;
}

.sticky-col-2 {
  position: sticky !important;
  left: 60px; /* Lebar kolom No */
  z-index: 5;
  border-right: 2px solid #d8dbe0 !important;
}

/* Mengatasi latar belakang transparan saat discroll */
thead th.sticky-col-1,
thead th.sticky-col-2 {
  background-color: #3c4b64 !important; /* Latar belakang dark slate matching CoreUI/Bootstrap theme */
  color: #ffffff !important;
}

.table tbody tr:nth-of-type(even) td.sticky-col-1,
.table tbody tr:nth-of-type(even) td.sticky-col-2 {
  background-color: #ffffff !important;
}

.table tbody tr:nth-of-type(odd) td.sticky-col-1,
.table tbody tr:nth-of-type(odd) td.sticky-col-2 {
  background-color: #fafbfc !important; /* Latar belakang baris belang (striped) */
}

/* Efek hover agar tetap selaras */
.table-hover tbody tr:hover td.sticky-col-1,
.table-hover tbody tr:hover td.sticky-col-2 {
  background-color: #ebedef !important;
}

.text-truncate-custom {
  display: block;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-icon-btn {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #e55353;
  transition: all 0.2s ease;
  line-height: 1;
}

.file-icon-btn:hover {
  transform: scale(1.2);
  color: #c53030 !important;
}

.badge-pdf-small {
  font-size: 0.55rem;
  font-weight: 800;
  color: #e55353;
  letter-spacing: 0.5px;
  margin-top: -1px;
}

.btn-action {
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-action:hover {
  transform: translateY(-2px);
}

/* ========== Category Badges ========== */
.badge-safety {
  background: linear-gradient(135deg, #e55353, #ff7b7b);
  color: #fff;
}

.badge-quality {
  background: linear-gradient(135deg, #2eb85c, #51d88a);
  color: #fff;
}

.badge-productivity {
  background: linear-gradient(135deg, #f9b115, #fcc748);
  color: #fff;
}

.badge-cost {
  background: linear-gradient(135deg, #3399ff, #66b3ff);
  color: #fff;
}

.badge-hr {
  background: linear-gradient(135deg, #9b59b6, #c084e0);
  color: #fff;
}

/* ========== Responsive ========== */
@media (max-width: 576px) {
  .btn-add-material {
    width: 100%;
    margin-top: 12px;
  }
}
</style>
