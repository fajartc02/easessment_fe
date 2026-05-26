<template>
  <div class="card">
    <custom-full-loading :show="isLoading"></custom-full-loading>
    <div class="card-header">
      <div class="d-flex row align-items-center">
        <div class="col-10">
          Master Users
        </div>
        <div class="col">
          <button class="btn btn-success" @click="this.$router.push('/master/user/form')">
            Add User
            <CIcon icon="cil-plus" size="sm" />
          </button>
        </div>
      </div>
    </div>
    <div class="card-body text-center">
      <div class="row d-flex align-items-start justify-content-between">
        <div class="col-12 col-lg-4 mb-1">
          <CInputGroup>
            <CInputGroupText>Line</CInputGroupText>
            <Select2 v-model="filtered.line_id" class="form-control p-1 align-items-center" :options="getLinesOpts" />
          </CInputGroup>
        </div>
        <div class="col-12 col-lg-4 mb-1">
          <CInputGroup>
            <CInputGroupText>Name</CInputGroupText>
            <Select2 v-model="filtered.id" class="form-control p-1 align-items-center" :options="noregUser" />
          </CInputGroup>
        </div>
        <div class="col-12 col-lg-2 mb-1">
          <button class="btn btn-warning w-100" @click="clearUserStore()">Clear</button>
        </div>
        <div class="col-12 col-lg-2 mb-1">
          <button class="btn btn-primary w-100" @click="getUsersStore()">Search</button>
        </div>
      </div>
      <div class="overflow-auto">
        <table class="table table-bordered table-stripped">
          <tr>
            <th>No</th>
            <th>Noreg</th>
            <th>Nama</th>
            <th>Pembuat</th>
            <th>Tanggal Di buat</th>
            <th>Aktivasi</th>
            <th>Role</th>
            <th colspan="3">Actions</th>
          </tr>
          <template v-if="usersState.length > 0">
            <tr v-for="(pos, i) in usersState" :key="pos.id">
              <td>{{ i + 1 }}</td>
              <td>{{ pos.noreg }}</td>
              <td>{{ pos.text }}</td>
              <td>{{ pos.created_by }}</td>
              <td>{{ pos.created_dt.split('T')[0] }}</td>
              <td>
                <CFormSwitch 
                  :checked="!!pos.is_activated" 
                  @change="toggleActivation(pos)"
                />
              </td>
              <td>
                <select class="form-select form-select-sm w-auto"
                v-model="pos.role"
                @change="editRole(pos.id, pos.role)">
                  <option v-if="pos.role && !roleopts.some(r => r.label === pos.role)" :value="pos.role">
                    {{ pos.role }}
                  </option>
                  <option v-for="opts in roleopts" :key="opts.label" :value="opts.label">
                    {{ opts.label }}
                  </option>
                </select>
              </td>
              <td>
                <CButton color="warning" @click="edit(pos.id)">
                  <CIcon icon="cil-pencil" size="sm" />
                </CButton>
              </td>
               <td>
                <CButton color="warning" @click="getPass(pos)">
                  <CIcon icon="cil-settings" size="sm" />
                </CButton>
              </td>
              <td>  
                <CButton color="danger" @click="del(pos.id)">
                  <CIcon icon="cil-trash" size="sm" />
                </CButton>
              </td>

            </tr>
          </template>
          <tr v-else>
            <td colspan="10">
              <h3>Tidak Ada Data</h3>
            </td>
          </tr>
        </table>
      </div>
    </div>
     <CModal size="lg" alignment="center" :visible="showSettingModal" @close="showSettingModal = false">
      <CModalHeader>
        <CModalTitle>Change Password</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div v-if="selectedUser">
          <div class="mb-3">
            <label class="form-label">New Password</label>
            <input type="text" class="form-control" v-model="newPassword" />
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showSettingModal = false">Close</CButton>
        <CButton color="primary" @click="saveSetting">Save</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import { GET_LINES } from "@/store/modules/line.module";
import { GET_USERS, DELETE_USER,PUT_USER_ROLE,PUT_USER_PASS } from '@/store/modules/user.module'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'
import CustomFullLoading from '@/components/CustomFullLoading.vue';
import ROLE_MOCK from "@/mocks/role.mock";
// import queryFormat from "@/functions/queryFormat";

export default {
  components: { CustomFullLoading },
  name: 'Users',
  data() {
    return {
      form: {
        line_id: null,
      },
      usersState: [],
      filtered: {
        line_id: -1,
        limit: 5,
        totalPage: 1,
        currentPage: 1,
        id: -1,
        
        // job_type_id: null
      },
      isLoading: false,
      roleopts:ROLE_MOCK,
      showSettingModal:false,
     selectedUser:this.getUsers,
    
    }
  },
  watch: {
    getUsers: function () {
      this.usersState = this.getUsers
      this.selectedrole = this.filtered.role
    },
    'filtered.line_id': function () {
      this.getUsersStore()
    },
    'filtered.id': function () {
      this.getUsersStore()
    }
  },
  computed: {
    ...mapGetters(['getUsers', 'getLinesOpts']),
    noregUser() {
      if (this.getUsers) {
        let container = this.getUsers.map(user => {
          return {
            id: user.id,
            text: `${user.noreg}-${user.text}`
          }
        })
        return container;
      } else {
        return [];
      }
    },
  
  },
  methods: {
    async getUsersStore() {
      this.isLoading = true
      console.log(this.filtered)
      localStorage.setItem("master_users_filters", JSON.stringify(this.filtered))
      await this.$store.dispatch(GET_USERS, this.filtered)
      this.isLoading = false
    },
    async clearUserStore() {
      this.isLoading = true
      this.filtered = {
        line_id: -1,
        limit: 5,
        totalPage: 1,
        currentPage: 1,
        id: -1
      }
      localStorage.removeItem("master_users_filters")
      await this.$store.dispatch(GET_USERS, this.filtered)
      this.isLoading = false
    },
    async getLines() {
      this.$store.dispatch(GET_LINES)
    },
    async edit(id) {
      await this.$router.push(`/master/user/form?id=${id}`)
    },
     async getPass(user) {
    this.selectedUser = { ...user }
    this.newPassword = ''
    this.showSettingModal = true
   
  },
    del(id) {
      Swal.fire({
        title: 'kamu yakin mau menghapus data ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Tidak',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            this.isLoading = true;
            await this.$store.dispatch(DELETE_USER, id);
            Swal.fire('Berhasil menghapus!', '', 'success');
            await this.getUsersStore();
          } catch (err) {
            console.log(err);
            Swal.fire('Gagal menghapus!', '', 'error');
          } finally {
            this.isLoading = false;
          }
        }
      })
    },
async editRole(id, role) {
  Swal.fire({
    title: `Ubah role user ini menjadi "${role}"?`,
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Tidak',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await this.$store.dispatch(PUT_USER_ROLE, { id, role });
        Swal.fire('Berhasil ubah role', '', 'success');
      } catch (error) {
        console.error(error);
        Swal.fire('Gagal ubah role', '', 'error');
        await this.getUsersStore();
      }
    } else {
      await this.getUsersStore();
    }
  });
},
async toggleActivation(user) {
  const targetStatus = !user.is_activated;
  const actionText = targetStatus ? 'mengaktifkan' : 'menonaktifkan';
  
  Swal.fire({
    title: `Apakah Anda yakin ingin ${actionText} user ini?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Tidak',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        this.isLoading = true;
        await this.$store.dispatch(PUT_USER_ROLE, { id: user.id, is_activated: targetStatus });
        Swal.fire('Berhasil!', `User telah ${targetStatus ? 'diaktifkan' : 'dinonaktifkan'}.`, 'success');
        user.is_activated = targetStatus;
      } catch (error) {
        console.error(error);
        Swal.fire('Gagal!', `Gagal ${actionText} user.`, 'error');
        await this.getUsersStore();
      } finally {
        this.isLoading = false;
      }
    } else {
      await this.getUsersStore();
    }
  });
},
async saveSetting() {
  const id = this.selectedUser.id
  const password = this.newPassword
  if (!this.newPassword) {
    Swal.fire('Password baru tidak boleh kosong!', '', 'warning');
    return;
  }

  try {
    this.isLoading = true;
    await this.$store.dispatch(PUT_USER_PASS, {id,password
     
    });

    Swal.fire('Password berhasil diubah!', '', 'success');
    this.showSettingModal = false;
    this.newPassword = '';
    this.selectedUser = null;

    // refresh list user biar up-to-date
    await this.getUsersStore();
  } catch (error) {
    console.error(error);
    Swal.fire('Gagal mengubah password!', '', 'error');
  } finally {
    this.isLoading = false;
  }
},

  },

  async mounted() {
    this.isLoading = true
    this.filtered.line_id = localStorage.getItem('line_id')
    
    const savedFiltersStr = localStorage.getItem("master_users_filters")
    if (savedFiltersStr) {
      try {
        const savedFilters = JSON.parse(savedFiltersStr)
        if (savedFilters.line_id !== undefined) this.filtered.line_id = savedFilters.line_id
        if (savedFilters.id !== undefined) this.filtered.id = savedFilters.id
        if (savedFilters.limit !== undefined) this.filtered.limit = savedFilters.limit
        if (savedFilters.currentPage !== undefined) this.filtered.currentPage = savedFilters.currentPage
        if (savedFilters.totalPage !== undefined) this.filtered.totalPage = savedFilters.totalPage
      } catch (e) {
        console.error("Error parsing saved Master Users filters", e)
      }
    }
    
    await this.getUsersStore()
    await this.getLines()
    this.isLoading = false
  }
}
</script>
