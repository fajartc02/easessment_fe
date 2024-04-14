<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex row align-items-center">
        <div class="col-10">
          Master Machines
        </div>
        <div class="col">
          <button class="btn btn-success" @click="this.$router.push('/master/machine/form')">
            Machine
            <CIcon icon="cil-plus" size="sm" />
          </button>
        </div>
      </div>
    </div>
    <div class="card-body text-center">
      <div class="row">
        <div class="col">
          <CInputGroup class="mb-3">
            <CInputGroupText>Line</CInputGroupText>
            <Select2 v-model="filtered.line_id" class="form-control" :options="getLinesOpts" />
          </CInputGroup>
        </div>
      </div>
      <table class="table table-bordered table-stripped">
        <tr>
          <th>No</th>
          <th>Line</th>
          <th>Machine</th>
          <th>Op No</th>
          <th>Pembuat</th>
          <th>Tanggal Di buat</th>
          <th colspan="2">Actions</th>
        </tr>
        <template v-if="MachinesState.length > 0">
          <tr v-for="(machine) in MachinesState" :key="machine.id">
            <td>{{ machine.no }}</td>
            <td>{{ machine.line_nm }}</td>
            <td>{{ machine.machine_nm }}</td>
            <td>{{ machine.op_no }}</td>
            <td>{{ machine.created_by }}</td>
            <td>{{ machine.created_dt.split('T')[0] }}</td>
            <td>
              <CButton color="warning" @click="edit(machine.id)">
                <CIcon icon="cil-pencil" size="sm" />
              </CButton>
            </td>
            <td>
              <CButton color="danger" @click="del(machine.id)">
                <CIcon icon="cil-trash" size="sm" />
              </CButton>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="6">
            <h3>Tidak Ada Data</h3>
          </td>
        </tr>
      </table>
    </div>
    <div class="card-footer">
      <div class="row justify-content-between">
        <div class="col-3">
          <label>Row per page:</label>
          <select class="form-control" v-model="filtered.limit">
            <option v-for="limit in limitOpts" :key="limit.label" :value="limit.vals">
              {{ limit.label }}
            </option>
          </select>
        </div>
        <div class="col-4 overflow-auto">
          <label>Total Page: {{ filtered.totalPage }}</label>
          <CustPagination :totalItems="filtered.total_data" :items-per-page="filtered.limit"
            :current-page="filtered.currentPage" @page-changed="handlePageChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'

import { GET_MACHINES, DELETE_MACHINE } from '@/store/modules/machine.module'
import { mapGetters } from 'vuex'
import { toast } from 'vue3-toastify'
import { GET_LINES } from '@/store/modules/line.module'

import CustPagination from '@/components/pagination/CustPagination.vue'


export default {
  name: 'Machines',
  data() {
    return {
      isLoading: false,
      filtered: {
        line_id: -1,
        pos_id: -1,
        limit: 5,
        totalPage: 1,
        currentPage: 1,
        total_data: 0
      },
      form: {
        machine_id: null
      },
      MachinesState: [],
      limitOpts: [
        {
          label: 5,
          vals: 5,
        },
        {
          label: 10,
          vals: 10,
        },
        {
          label: 100,
          vals: 100,
        },
      ],
    }
  },
  watch: {
    getMachines: function () {
      this.MachinesState = this.getMachines
      if (this.getMachines.length > 0) {
        this.MachinesState = this.getMachines
        this.filtered.limit = this.getMachines[0].limit
        this.filtered.totalPage = this.getMachines[0].total_page
        this.filtered.total_data = this.getMachines[0].total_data
        this.pageControl()
      }
    },
    ['filtered.line_id']: function () {
      this.getMachinesStore()
    },
    ['filtered.currentPage']: function () {
      this.getMachinesStore()
    },
    ['filtered.limit']: function () {
      this.filtered.currentPage = 1
      this.getMachinesStore()
    },
  },
  computed: {
    ...mapGetters(['getMachines', 'getLinesOpts'])
  },
  methods: {
    async handlePageChange(page) {
      this.filtered.currentPage = page;
      this.$store.dispatch(GET_MACHINES, this.filtered)
    },
    pageControl(state = 0, page = null) {
      page
        ? (this.filtered.currentPage = page)
        : (this.filtered.currentPage += state)
      this.pages = []
      for (let i = 0; i < this.filtered.totalPage; i++) {
        let obj = {
          label: null,
          is_active: null,
        }
        const idx = i + 1
        obj.label = i + 1
        if (idx == this.filtered.currentPage) {
          obj.is_active = 'page-item active'
        } else {
          obj.is_active = 'page-item'
        }
        this.pages.push(obj)
      }
    },
    async ActionGetLines() {
      try {
        this.$store.dispatch(GET_LINES)
      } catch (error) {
        toast.error(error.response.data.message, {
          autoClose: 1000
        })
      }
    },
    async getMachinesStore() {
      try {
        await this.$store.dispatch(GET_MACHINES, this.filtered)
      } catch (error) {
        toast.error(error.response.data.message, {
          autoClose: 1000
        })
      }
    },
    async edit(id) {
      await this.$router.push(`/master/machine/form?id=${id}`)
    },
    del(id) {
      Swal.fire({
        title: 'kamu mau menghapus data ini?',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        denyButtonText: `Tidak`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.$store.dispatch(DELETE_MACHINE, id)
            .then(async () => {
              Swal.fire('Berhasil menghapus machine', '', 'success')
              await this.$store.dispatch(GET_MACHINES)
            })
            .catch(err => {
              console.log(err);
              Swal.fire('Gagal menghapus machine', '', 'error')
            })
        }
      })
    }
  },
  components: {
    CustPagination
  },
  async mounted() {
    this.isLoading = true
    await this.ActionGetLines()
    this.filtered.line_id = localStorage.getItem('line_id') ? localStorage.getItem('line_id') : -1
    await this.getMachinesStore()
  }
}
</script>
