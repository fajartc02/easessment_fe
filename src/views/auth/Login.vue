<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center" style="background-color: aliceblue!important;">
    <CContainer>
      <CRow class="justify-content-between align-items-center">
        <CCol :md="6">
          <img class="bg-image w-100" src="@/assets/images/imageLogin.png" alt="Sign Up">
        </CCol>
        <CCol :md="6">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="login()">
                  <h1>Login</h1>
                  <p class="text-medium-emphasis">Sign In to your account</p>
                  <div class="mb-3">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon="cil-user" />
                      </CInputGroupText>
                      <CFormInput placeholder="noreg" v-model="noreg" />
                    </CInputGroup>
                    <div v-if="errors.noreg" class="text-danger small mt-1">{{ errors.noreg }}</div>
                  </div>
                  <div class="mb-4">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon="cil-lock-locked" />
                      </CInputGroupText>
                      <CFormInput type="password" v-model="password" placeholder="Password"
                        autocomplete="current-password" />
                    </CInputGroup>
                    <div v-if="errors.password" class="text-danger small mt-1">{{ errors.password }}</div>
                  </div>
                  <CRow>
                    <CCol :xs="12">
                      <CButton type="submit" color="primary" class="px-4 w-100">
                        Login
                      </CButton>
                    </CCol>
                  </CRow>
                  <CRow class="mt-2">
                    <CCol :xs="12" class="text-center">
                      <CButton color="link" @click="$router.push('/pages/register')" class="px-0 text-decoration-none">
                        Belum punya akun? Daftar di sini
                      </CButton>
                    </CCol>
                  </CRow>
                  <br>
                  <CRow>
                    <CCol :xs="12">
                      <i>
                        Admin Contact (Dian Kartika):
                        <a href="https://wa.me/62882003343769" target="_blank">
                          Contact Here!
                        </a>
                      </i>
                    </CCol>

                    <CCol :xs="12">
                      <i>
                        Video Tutorial (E-Observations):
                        <a href="https://wa.me/628986264957" target="_blank">
                          See Here!
                        </a>
                      </i>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
          <CAlert v-if="isError" color="danger">
            <CIcon icon="cil-warning" class="flex-shrink-0 me-2" width="24" height="24" />{{ errMsg }}
          </CAlert>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import { LOGIN } from '@/store/modules/auth.module'
export default {
  name: 'Login',
  data() {
    return {
      noreg: null,
      password: null,
      isError: false,
      errMsg: null,
      errors: {},
    }
  },
  methods: {
    async login() {
      this.errors = {}
      if (!this.noreg) this.errors.noreg = 'Noreg belum diisi'
      if (!this.password) this.errors.password = 'Password belum diisi'
      
      if (Object.keys(this.errors).length > 0) return

      this.isError = false
      Swal.showLoading()
      await this.$store
        .dispatch(LOGIN, { noreg: this.noreg, password: this.password })
        .then((data) => {
          Swal.fire(`Hallo, ${data.data.fullname}`, '', 'success')
          this.$router.push({ name: 'Home' })
        })
        .catch((err) => {
          console.log(err)
          this.isError = true
          this.errMsg = err.data.message
          Swal.fire(`${err.data.message}`, '', 'error')
        })
    },
  },
}
</script>
