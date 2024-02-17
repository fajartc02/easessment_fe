<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex row align-items-center">
        <div class="col-10">Master Pos</div>
        <div class="col">
          <button
            class="btn btn-success"
            @click="this.$router.push('/master/pos/form')"
          >
            Add Pos<CIcon icon="cil-plus" size="sm" />
          </button>
        </div>
      </div>
    </div>
    <div class="card-body text-center">
      <div class="row">
        <div class="col">
          <CInputGroup class="mb-3">
            <CInputGroupText>Line</CInputGroupText>
            <Select2
              v-model="filtered.line_id"
              class="form-control"
              :options="getLinesOpts"
            />
          </CInputGroup>
        </div>
        <div class="col">
          <CInputGroup class="mb-3">
            <CInputGroupText>Pos</CInputGroupText>
            <Select2
              :disabled="filtered.line_id == -1"
              v-model="filtered.pos_id"
              class="form-control"
              :options="getPosOpts"
            />
          </CInputGroup>
        </div>
      </div>
      <table class="table table-bordered table-stripped">
        <tr>
          <th>No</th>
          <th>Line</th>
          <th>Pos Name</th>
          <th>TSK | Gentan-i</th>
          <th>TSKK | Yamazumi</th>
          <th>Pembuat</th>
          <th>Tanggal Di buat</th>
          <th colspan="2">Actions</th>
        </tr>
        <template v-if="posState.length > 0">
          <tr v-for="(pos, i) in posState" :key="pos.id">
            <td>{{ i + 1 }}</td>
            <td>{{ pos.line_nm }}</td>
            <td>{{ pos.pos_nm }}</td>
            <td v-if="pos.tsk">
              <CIcon icon="cil-check-circle" class="text-success" size="xxl" />
            </td>
            <td v-else>
              <CIcon icon="cil-x" class="text-danger" size="xxl" />
            </td>
            <td v-if="pos.tskk">
              <CIcon icon="cil-check-circle" class="text-success" size="xxl" />
            </td>
            <td v-else>
              <CIcon icon="cil-x" class="text-danger" size="xxl" />
            </td>
            <td>{{ pos.created_by }}</td>
            <td>{{ pos.created_dt.split('T')[0] }}</td>
            <td>
              <CButton color="warning" @click="editPos(pos.id)">
                <CIcon icon="cil-pencil" size="sm" />
              </CButton>
            </td>
            <td>
              <CButton color="danger" @click="deletePos(pos.id)">
                <CIcon icon="cil-trash" size="sm" />
              </CButton>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="8">
            <h3>Tidak Ada Data</h3>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { GET_POS, DELETE_POS } from '@/store/modules/pos.module'
import { GET_LINES } from '@/store/modules/line.module'

import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'

export default {
  name: 'Pos',
  data() {
    return {
      form: {
        line_id: null,
      },
      posState: [],
      filtered: {
        line_id: -1,
        pos_id: -1,
        limit: 5,
        totalPage: 1,
        currentPage: 1,
      },
    }
  },
  watch: {
    posData: function () {
      console.log(this.posData)
      this.posState = this.posData
      Swal.hideLoading()
    },
    ['filtered.line_id']: function () {
      this.getPos({ line_id: this.filtered.line_id })
    },
    ['filtered.pos_id']: function () {
      this.getPos({
        line_id: this.filtered.line_id,
        pos_id: this.filtered.pos_id,
      })
    },
  },
  computed: {
    ...mapGetters(['posData', 'getLinesOpts', 'getPosOpts']),
  },
  methods: {
    async getLines() {
      this.$store.dispatch(GET_LINES)
    },
    async getPos(query = false) {
      await Swal.showLoading()
      if (query) {
        this.filtered.currentPage = 1
        this.filtered.limit = 5
      }
      await this.$store.dispatch(GET_POS, this.filtered)
    },
    async editPos(id) {
      await this.$router.push(`/master/pos/form?id=${id}`)
    },
    deletePos(id) {
      Swal.fire({
        title: 'kamu mau menghapus data ini?',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        denyButtonText: `Tidak`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.$store
            .dispatch(DELETE_POS, id)
            .then(async () => {
              Swal.fire('Berhasil menghapus!', '', 'success')
              await this.$store.dispatch(GET_POS)
            })
            .catch((err) => {
              console.log(err)
              Swal.fire('Gagal menghapus!', '', 'error')
            })
        }
      })
    },
  },
  async mounted() {
    await this.getPos()
    await this.getLines()
  },
}
</script>

<style>
tr,
th {
  border: 1px solid black !important;
}
tr,
td {
  border: 1px solid black !important;
}
</style>
