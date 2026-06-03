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
              @click="showFullPhoto"
              title="Klik untuk memperbesar"
            >
          </div>
          <div class="mb-3">
            <small class="text-muted cursor-pointer" @click="showFullPhoto">
              <CIcon icon="cil-zoom-in" class="me-1" /> Klik foto untuk memperbesar
            </small>
          </div>
          <div class="px-3">
            <CFormInput type="file" @change="onFileChange" accept="image/*" class="mb-2 form-control-sm" />
            <button class="btn btn-sm w-100 text-white" style="background-color: #1e3a5f;" @click="uploadPhoto" :disabled="!selectedFile || isUploading">
              <span v-if="isUploading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              <CIcon v-else icon="cil-cloud-upload" class="me-1" /> {{ isUploading ? 'Uploading...' : 'Upload Foto' }}
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
            <button class="btn text-white px-4 shadow-sm" style="background-color: #1e3a5f;" @click="updateProfile" :disabled="isSaving">
              <span v-if="isSaving" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              <CIcon v-else icon="cil-save" class="me-1" /> {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
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
      appUrl: process.env.VUE_APP_URL,
      isUploading: false,
      isSaving: false
    }
  },
  methods: {
    showFullPhoto() {
      const photoUrl = this.photoPreview || (this.isValidPhoto(this.form.photo_url) ? `${this.appUrl}/file?path=${this.form.photo_url}` : this.defaultAvatar);
      Swal.fire({
        imageUrl: photoUrl,
        imageAlt: 'Foto Profil',
        showConfirmButton: false,
        showCloseButton: true,
        backdrop: 'rgba(0,0,0,0.8)',
        width: '360px',
        imageWidth: '280px',
        imageHeight: '280px',
        customClass: {
          image: 'img-thumbnail rounded-circle object-fit-cover shadow-sm'
        }
      });
    },
    async fetchProfile() {
      try {
        ApiService.setHeader();
        const res = await ApiService.get('auth/profile');
        const data = res.data ? res.data : res;
        
        if ((res && res.status === 200) || (data && data.status == 200)) {
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
      
      const result = await Swal.fire({
        title: 'Upload Foto Profil?',
        text: 'Apakah Anda yakin ingin mengunggah foto profil baru ini?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1e3a5f',
        confirmButtonText: 'Ya, Upload',
        cancelButtonText: 'Batal'
      });

      if (!result.isConfirmed) return;

      this.isUploading = true;
      Swal.fire({
        title: 'Mengunggah Foto...',
        text: 'Mohon tunggu selagi foto Anda sedang diproses.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const formData = new FormData();
      formData.append('dest', 'profiles');
      formData.append('photo', this.selectedFile);

      try {
        ApiService.setHeader();
        const res = await ApiService.post('auth/profile/upload', formData);
        
        const resData = res.data ? res.data : res;
        
        if ((res && res.status === 200) || (resData && resData.status == 200)) {
          this.form.photo_url = resData.data.photo_url;
          localStorage.setItem('photo_url', resData.data.photo_url);
          this.selectedFile = null;
          this.photoPreview = null;
          
          Swal.fire({
            title: 'Berhasil!',
            text: 'Foto profil berhasil diperbarui.',
            icon: 'success',
            confirmButtonColor: '#1e3a5f',
            confirmButtonText: 'OK'
          }).then(() => {
            window.location.reload();
          });
        } else {
          throw new Error(resData?.message || 'Gagal');
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: 'Gagal',
          text: 'Gagal mengunggah foto profil.',
          icon: 'error',
          confirmButtonColor: '#1e3a5f'
        });
      } finally {
        this.isUploading = false;
      }
    },
    async updateProfile() {
      if (!this.form.fullname) {
        Swal.fire({
          title: 'Peringatan',
          text: 'Nama lengkap tidak boleh kosong',
          icon: 'warning',
          confirmButtonColor: '#1e3a5f'
        });
        return;
      }

      const result = await Swal.fire({
        title: 'Simpan Perubahan?',
        text: 'Apakah Anda yakin ingin menyimpan perubahan profil Anda?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1e3a5f',
        confirmButtonText: 'Ya, Simpan',
        cancelButtonText: 'Batal'
      });

      if (!result.isConfirmed) return;

      this.isSaving = true;
      Swal.fire({
        title: 'Menyimpan...',
        text: 'Mohon tunggu selagi profil Anda sedang diperbarui.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const res = await ApiService.put('auth/profile', { 
          fullname: this.form.fullname,
          noreg: this.form.noreg
        });
        const resData = res.data ? res.data : res;
        
        if ((res && res.status === 200) || (resData && resData.status == 200)) {
          localStorage.setItem('name', this.form.fullname);
          localStorage.setItem('noreg', this.form.noreg);
          
          Swal.fire({
            title: 'Berhasil!',
            text: 'Profil berhasil diperbarui.',
            icon: 'success',
            confirmButtonColor: '#1e3a5f',
            confirmButtonText: 'OK'
          }).then(() => {
            window.location.reload();
          });
        } else {
          throw new Error(resData?.message || 'Gagal');
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: 'Gagal',
          text: 'Gagal memperbarui profil.',
          icon: 'error',
          confirmButtonColor: '#1e3a5f'
        });
      } finally {
        this.isSaving = false;
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
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.profile-photo:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15) !important;
}
.cursor-pointer {
  cursor: pointer;
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
