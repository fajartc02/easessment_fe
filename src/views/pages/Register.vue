<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center" style="background-color: aliceblue!important;">
    <CContainer>
      <CRow class="justify-content-between align-items-center">
        <!-- Kolom Gambar Kiri -->
        <CCol :md="6">
          <img class="bg-image w-100" src="@/assets/images/imageLogin.png" alt="Sign Up">
        </CCol>
        
        <!-- Kolom Card Form Kanan -->
        <CCol :md="6">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="register()">
                  <h1>Register</h1>
                  <p class="text-medium-emphasis">Create your new account</p>

                  <!-- Nama Lengkap -->
                  <div class="mb-3">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon="cil-user" />
                      </CInputGroupText>
                      <CFormInput placeholder="Nama Lengkap" v-model="form.fullname" />
                    </CInputGroup>
                    <div v-if="errors.fullname" class="text-danger small mt-1">{{ errors.fullname }}</div>
                  </div>

                  <!-- Noreg -->
                  <div class="mb-3">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon="cil-people" />
                      </CInputGroupText>
                      <CFormInput placeholder="Noreg" v-model="form.noreg" />
                    </CInputGroup>
                    <div v-if="errors.noreg" class="text-danger small mt-1">{{ errors.noreg }}</div>
                  </div>

                  <!-- Nomor HP -->
                  <div class="mb-3">
                    <CInputGroup>
                      <CInputGroupText>
                        No. HP
                      </CInputGroupText>
                      <CFormInput placeholder="Nomor Handphone" v-model="form.phone_number" />
                    </CInputGroup>
                    <div v-if="errors.phone_number" class="text-danger small mt-1">{{ errors.phone_number }}</div>
                  </div>

                  <!-- Line Select -->
                  <div class="mb-3">
                    <CInputGroup>
                      <CInputGroupText>Line</CInputGroupText>
                      <select class="form-select" v-model="form.line_id">
                        <option :value="null" disabled>Select Line</option>
                        <option v-for="line in getLinesOptsWithoutAll" :key="line.id" :value="line.id">{{ line.text }}</option>
                      </select>
                    </CInputGroup>
                    <div v-if="errors.line_id" class="text-danger small mt-1">{{ errors.line_id }}</div>
                  </div>

                  <!-- Shift/Group Select -->
                  <div class="mb-3">
                    <CInputGroup>
                      <CInputGroupText>Shift</CInputGroupText>
                      <select class="form-select" v-model="form.group_id">
                        <option :value="null" disabled>Select Shift</option>
                        <option v-for="group in getGroupsOptsWithoutAll" :key="group.id" :value="group.id">{{ group.text }}</option>
                      </select>
                    </CInputGroup>
                    <div v-if="errors.group_id" class="text-danger small mt-1">{{ errors.group_id }}</div>
                  </div>

                  <!-- Password -->
                  <div class="mb-3">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon="cil-lock-locked" />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        v-model="form.password"
                      />
                    </CInputGroup>
                    <div v-if="errors.password" class="text-danger small mt-1">{{ errors.password }}</div>
                  </div>

                  <!-- Confirm Password -->
                  <div class="mb-4">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon="cil-lock-locked" />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Konfirmasi password"
                        v-model="confirmPassword"
                      />
                    </CInputGroup>
                    <div v-if="errors.confirmPassword" class="text-danger small mt-1">{{ errors.confirmPassword }}</div>
                  </div>

                  <!-- Tombol Aksi -->
                  <CRow>
                    <CCol :xs="12">
                      <CButton type="submit" color="primary" class="text-white px-4 w-100">
                        Register
                      </CButton>
                    </CCol>
                  </CRow>
                  <CRow class="mt-2">
                    <CCol :xs="12" class="text-center">
                      <CButton color="link" @click="$router.push('/login')" class="px-0 text-decoration-none">
                        Sudah punya akun? Login di sini
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import { REGISTER } from '@/store/modules/auth.module'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_GROUP } from '@/store/modules/group.module'
import { mapGetters } from 'vuex'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        fullname: '',
        noreg: '',
        phone_number: '',
        password: '',
        line_id: null,
        group_id: null,
      },
      confirmPassword: '',
      errors: {},
    }
  },
  watch: {
    ['form.fullname']: function () {
      this.form.fullname = this?.form?.fullname?.toUpperCase()
    },
    ['form.noreg']: function (val) {
      if (val) {
        this.form.noreg = val.replace(/\D/g, '').slice(0, 7)
      }
    }
  },
  computed: {
    ...mapGetters([
      'getLinesOptsWithoutAll',
      'getGroupsOptsWithoutAll'
    ])
  },
  methods: {
    async getLines() {
      await this.$store.dispatch(GET_LINES)
    },
    async getGroup() {
      await this.$store.dispatch(GET_GROUP)
    },
    async register() {
      this.errors = {}
      
      if (!this.form.fullname) this.errors.fullname = 'Nama Lengkap belum diisi'
      if (!this.form.noreg) this.errors.noreg = 'Noreg belum diisi'
      if (!this.form.phone_number) this.errors.phone_number = 'Nomor HP belum diisi'
      if (!this.form.password) this.errors.password = 'Password belum diisi'
      if (!this.form.line_id) this.errors.line_id = 'Line belum dipilih'
      if (this.form.group_id === null || this.form.group_id === undefined || this.form.group_id === '') {
        this.errors.group_id = 'Shift belum dipilih'
      }
      if (!this.confirmPassword) this.errors.confirmPassword = 'Konfirmasi password belum diisi'

      if (Object.keys(this.errors).length > 0) {
        return
      }

      if (this.form.noreg.length !== 7) {
        this.errors.noreg = 'Noreg harus berjumlah 7 digit angka!'
        return
      }

      if (this.form.password !== this.confirmPassword) {
        this.errors.confirmPassword = 'Konfirmasi password tidak cocok!'
        return
      }

      Swal.showLoading()
      this.$store.dispatch(REGISTER, this.form)
        .then(() => {
          Swal.fire({
            title: 'Registrasi Berhasil!',
            text: 'Akun Anda berhasil didaftarkan. Harap hubungi Admin (Dita Nurlita) untuk aktivasi akun sebelum login.',
            icon: 'success',
            confirmButtonText: 'Ke Halaman Login'
          }).then(() => {
            this.$router.push('/login')
          })
        })
        .catch((err) => {
          console.error(err)
          const errorMsg = err?.data?.message || 'Terjadi kesalahan saat registrasi.'
          Swal.fire('Gagal Registrasi', errorMsg, 'error')
        })
    }
  },
  async mounted() {
    await this.getGroup()
    await this.getLines()
  }
}
</script>
