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
                <CForm @submit.prevent="register">
                  <h1>Register</h1>
                  <p class="text-medium-emphasis">Create your new account</p>

                  <!-- Nama Lengkap -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput placeholder="Nama Lengkap" v-model="form.fullname" required />
                  </CInputGroup>

                  <!-- Noreg -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-people" />
                    </CInputGroupText>
                    <CFormInput placeholder="Noreg" v-model="form.noreg" required />
                  </CInputGroup>

                  <!-- Nomor HP -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      No. HP
                    </CInputGroupText>
                    <CFormInput placeholder="Nomor Handphone" v-model="form.phone_number" required />
                  </CInputGroup>

                  <!-- Line Select -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Line</CInputGroupText>
                    <CFormSelect v-model="form.line_id" required>
                      <option :value="null" disabled>Select Line</option>
                      <option v-for="line in getLinesOptsWithoutAll" :key="line.id" :value="line.id">{{ line.text }}</option>
                    </CFormSelect>
                  </CInputGroup>

                  <!-- Shift/Group Select -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>Shift</CInputGroupText>
                    <CFormSelect v-model="form.group_id" required>
                      <option :value="null" disabled>Select Shift</option>
                      <option v-for="group in getGroupsOptsWithoutAll" :key="group.id" :value="group.id">{{ group.text }}</option>
                    </CFormSelect>
                  </CInputGroup>

                  <!-- Password -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      v-model="form.password"
                      required
                    />
                  </CInputGroup>

                  <!-- Confirm Password -->
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Konfirmasi password"
                      v-model="confirmPassword"
                      required
                    />
                  </CInputGroup>

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
    }
  },
  watch: {
    ['form.fullname']: function () {
      this.form.fullname = this?.form?.fullname?.toUpperCase()
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
      if (!this.form.fullname || !this.form.noreg || !this.form.phone_number || !this.form.password || !this.form.line_id || !this.form.group_id) {
        Swal.fire('Info', 'Mohon lengkapi semua input data!', 'info')
        return
      }

      if (this.form.password !== this.confirmPassword) {
        Swal.fire('Peringatan', 'Konfirmasi password tidak cocok!', 'warning')
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
