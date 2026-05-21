<template>
  <div class="card profile-card">
    <div class="card-header text-white" style="background-color: #1e3a5f;">
      <h5 class="mb-0">User Profile</h5>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-4 text-center mb-4 border-end">
          <div class="profile-photo-container mb-3">
            <img 
              :src="photoPreview || (isValidPhoto(form.photo_url) ? `${appUrl}/file?path=${form.photo_url}` : defaultAvatar)" 
              alt="Profile Photo" 
              class="img-thumbnail rounded-circle profile-photo shadow-sm"
            >
          </div>
          <div class="px-3">
            <CFormInput type="file" @change="onFileChange" accept="image/*" class="mb-2 form-control-sm" />
            <button class="btn btn-sm w-100 text-white" style="background-color: #1e3a5f;" @click="uploadPhoto" :disabled="!selectedFile">
              <CIcon icon="cil-cloud-upload" class="me-1" /> Upload Foto
            </button>
          </div>
        </div>
        <div class="col-md-8 px-4">
          <div class="mb-4">
            <label class="form-label fw-bold">Noreg</label>
            <CInputGroup>
              <CInputGroupText><CIcon icon="cil-fingerprint" /></CInputGroupText>
              <CFormInput v-model="form.noreg" placeholder="Masukkan Noreg" />
            </CInputGroup>
          </div>
          <div class="mb-4">
            <label class="form-label fw-bold">Nama Lengkap</label>
            <CInputGroup>
              <CInputGroupText><CIcon icon="cil-user" /></CInputGroupText>
              <CFormInput v-model="form.fullname" placeholder="Masukkan nama lengkap" />
            </CInputGroup>
          </div>
          <div class="mb-4">
            <label class="form-label fw-bold">Role</label>
            <CInputGroup>
              <CInputGroupText><CIcon icon="cil-shield-check" /></CInputGroupText>
              <CFormInput v-model="form.role" readonly disabled class="bg-light" />
            </CInputGroup>
          </div>
          <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
            <button class="btn text-white px-4 shadow-sm" style="background-color: #1e3a5f;" @click="updateProfile">
              <CIcon icon="cil-save" class="me-1" /> Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "@/store/api.service";
import Swal from 'sweetalert2';

export default {
  name: 'Profile',
  data() {
    return {
      form: {
        noreg: '',
        fullname: '',
        role: '',
        photo_url: ''
      },
      selectedFile: null,
      photoPreview: null,
      defaultAvatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      appUrl: process.env.VUE_APP_URL
    }
  },
  methods: {
    async fetchProfile() {
      try {
        const res = await ApiService.get('auth/profile');
        const data = res.data ? res.data : res; 
        
        if (data && data.status === 'success') {
          this.form = data.data;
          if (this.form.photo_url) {
            localStorage.setItem('photo_url', this.form.photo_url);
          }
          localStorage.setItem('name', this.form.fullname);
          localStorage.setItem('noreg', this.form.noreg);
          localStorage.setItem('role', this.form.role);
        } else {
          // Fallback if API fails
          this.form.fullname = localStorage.getItem('name');
          this.form.noreg = localStorage.getItem('noreg');
          this.form.role = localStorage.getItem('role');
          this.form.photo_url = localStorage.getItem('photo_url');
        }
      } catch (error) {
        console.error(error);
        this.form.fullname = localStorage.getItem('name');
        this.form.noreg = localStorage.getItem('noreg');
        this.form.role = localStorage.getItem('role');
        this.form.photo_url = localStorage.getItem('photo_url');
      }
    },
    isValidPhoto(url) {
      return url && url !== 'null' && url !== 'undefined' && url !== '';
    },
    onFileChange(e) {
      this.selectedFile = e.target.files[0];
      if (this.selectedFile) {
        this.photoPreview = URL.createObjectURL(this.selectedFile);
      }
    },
    async uploadPhoto() {
      if (!this.selectedFile) return;
      
      const formData = new FormData();
      formData.append('dest', 'profiles');
      formData.append('photo', this.selectedFile);

      try {
        ApiService.setHeader(true);
        const { data } = await ApiService.post('auth/profile/upload', formData);
        ApiService.setHeader(false);
        
        if (data.status === 'success') {
          Swal.fire('Berhasil', 'Foto profil diperbarui', 'success');
          this.form.photo_url = data.data.photo_url;
          localStorage.setItem('photo_url', data.data.photo_url);
          this.selectedFile = null;
          this.photoPreview = null;
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Gagal mengunggah foto', 'error');
      }
    },
    async updateProfile() {
      if (!this.form.fullname) {
        Swal.fire('Peringatan', 'Nama lengkap tidak boleh kosong', 'warning');
        return;
      }
      try {
        const { data } = await ApiService.put('auth/profile', { 
          fullname: this.form.fullname,
          noreg: this.form.noreg
        });
        if (data.status === 'success') {
          localStorage.setItem('name', this.form.fullname);
          localStorage.setItem('noreg', this.form.noreg);
          Swal.fire({
            title: 'Berhasil',
            text: 'Profil diperbarui',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            window.location.reload();
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Gagal memperbarui profil', 'error');
      }
    }
  },
  mounted() {
    this.fetchProfile();
  }
}
</script>

<style scoped>
.profile-photo {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 4px solid #fff;
}
.profile-card {
  max-width: 800px;
  margin: 40px auto;
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}
.card-header {
  border-radius: 12px 12px 0 0 !important;
  padding: 1.5rem;
}
.form-label {
  font-size: 0.9rem;
  color: #6c757d;
}
.bg-light {
  background-color: #f8f9fa !important;
}
</style>
