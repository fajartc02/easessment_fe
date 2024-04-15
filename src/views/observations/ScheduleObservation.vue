<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex justify-content-between align-items-center">
        <h5>Schedule Observasi</h5>
        <div class="d-flex">
          <div class="mx-2">
            <CInputGroup>
              <CInputGroupText>Line</CInputGroupText>
              <input type="month" class="form-control" v-model="selectedMonth" @change="addFilter()" />
            </CInputGroup>
          </div>
          <div class="mx-2">
            <CInputGroup>
              <CInputGroupText>Line</CInputGroupText>
              <select class="form-select" v-model="selectedLine" @change="addFilter()">
                <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
                  {{ line.text }}
                </option>
              </select>
            </CInputGroup>
          </div>
          <button class="btn btn-sm btn-success text-white" @click="this.$router.push('/schedule/observation/form')">
            Add Schedule
            <CIcon icon="cil-plus" size="sm" />
          </button>
        </div>
      </div>
    </div>
    <div>
      <table class="table table-striped text-center">
        <tr>
          <th>No</th>
          <th>Line</th>
          <th>Pos</th>
          <th>Type Pekerjaan</th>
          <th>Petugas</th>
          <th>Member</th>
          <th>Job Desc</th>
          <th>Planning</th>
          <th>Actual</th>
          <th>Actions</th>
        </tr>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="10" class="p-0" style="height: 200px">
              <div class="vl-parent p-0" style="height: 100%">
                <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false" :on-cancel="onCancel" />
              </div>
            </td>
          </tr>
          <tr v-else-if="observationSchedule.length > 0" v-for="(obaservation, i) in observationSchedule"
            :key="obaservation.uuid">
            <td>{{ i + 1 }}</td>
            <td>{{ obaservation.line_nm }}</td>
            <td>{{ obaservation.pos_nm }}</td>
            <td>{{ obaservation.job_type_nm }}</td>
            <td v-if="obaservation.checkers.length > 0">
              <button v-for="checker in obaservation.checkers" :key="checker.id"
                class="btn btn-warning text-dark disabled">
                {{ checker.checker_nm }}
              </button>
            </td>
            <td>{{ obaservation.member_nm }}</td>
            <td>{{ obaservation.job_nm }}</td>
            <td>{{ `${obaservation.plan_check_dt}` }}</td>
            <td :class="`${obaservation.actual_check_dt}`.split('T')[0] == 'null'
                ? 'bg-danger'
                : ''
              ">
              {{
                `${obaservation.actual_check_dt}`.split('T')[0] != 'null'
                  ? `${obaservation.actual_check_dt}`.split('T')[0]
                  : 'belum cek'
              }}
            </td>
            <td>
              <div class="d-flex">
                <button class="btn btn-info btn-sm mx-1 text-white" @click="editPos(obaservation.id)">
                  edit
                </button>
                <button class="btn btn-danger btn-sm text-white" @click="deletePos(obaservation.id)">
                  delete
                </button>
              </div>
            </td>
          </tr>
          <tr v-else>
            <td class="text-center" colspan="10">
              <h4>Tidak ada data</h4>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- pagination -->
    <Pagination :totalPages="10" :perPage="10" :currentPage="currentPage" @changePage="onPageChange"
      @changeLimit="onPageChangeLimit" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  GET_OBSERVATION_SCHEDULE_LIST,
  DELETE_OBSERVATION_LIST,
} from '@/store/modules/observation.module'
import { GET_LINES } from '@/store/modules/line.module'
import Swal from 'sweetalert2'
import Loading from 'vue-loading-overlay'
import Pagination from '@/components/Pagination.vue'
import moment from 'moment'

export default {
  name: 'ScheduleObservation',
  data() {
    return {
      currentPage: 1,
      currentPageLimit: 5,
      isLoading: false,
      form: {
        line_id: null,
      },
      selectedLine: -1,
      selectedMonth: null,
      selectedYear: null,
      idxMonth: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
      ],
      monthStr: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ],
      yearMonth: '',
      currentDate: `${new Date().getDate()}`,
    }
  },
  watch: {
    observationSchedule: function () {
      console.log(this.observationSchedule)
    },
    selectedMonth: function () {
      if (this.selectedMonth) {
        this.generateDate()
        let idx = this.idxMonth.indexOf(this.selectedMonth.split('-')[1])
        this.yearMonth = `${this.monthStr[idx]} ${this.selectedMonth.split('-')[0]
          }`
        this.getObservations()
      }
    },
  },
  computed: {
    ...mapGetters(['observationSchedule', 'getLinesOpts']),
  },
  methods: {
    onPageChange(page) {
      if (page == -1) {
        this.currentPage = this.currentPage - 1
        this.getObservations()
      } else {
        this.currentPage = this.currentPage + 1
        this.getObservations()
      }
    },
    onPageChangeLimit(limit) {
      this.currentPageLimit = limit
      this.getObservations()
    },
    async getObservations() {
      this.isLoading = true

      let objQuery = {
        month: this.selectedMonth?.split('-')[1],
        year: this.selectedMonth?.split('-')[0],
        line: this.selectedLine,
        limit: this.currentPageLimit,
        currentPage: this.currentPage,
      }

      await this.$store
        .dispatch(GET_OBSERVATION_SCHEDULE_LIST, objQuery)
        .then((res) => {
          if (res) {
            this.isLoading = false
          }
        })
    },
    async editPos(id) {
      await this.$router.push(`/schedule/observation/form?id=${id}`)
    },
    deletePos(id) {
      console.log(id)
      Swal.fire({
        title: 'kamu mau menghapus data ini?',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        denyButtonText: `Tidak`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.$store
            .dispatch(DELETE_OBSERVATION_LIST, id)
            .then(async () => {
              Swal.fire('Berhasil menghapus!', '', 'success')
              await this.$store.dispatch(GET_OBSERVATION_SCHEDULE_LIST)
            })
            .catch((err) => {
              console.log(err)
              Swal.fire('Gagal menghapus!', '', 'error')
            })
        }
      })
    },
    addFilter() {
      this.getObservations()
    },
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    generateDate() {
      let year = new Date(this.selectedMonth).getFullYear()
      let month = new Date(this.selectedMonth).getMonth() + 1
      let selectedMonth = new Date(`${year}-${month}`)
      var lastDay = new Date(year, month, 0)
      let container = []
      this.containerDate = []
      for (let i = 1; i <= lastDay.getDate(); i++) {
        let setDt = new Date(selectedMonth).setDate(i)
        let newDate = new Date(setDt)
        container.push(newDate.getDate())
        let dateObj = {
          bg: ``,
          date: newDate,
          idx: `${i}`,
        }
        if (newDate.getDay() === 0 || newDate.getDay() === 6)
          dateObj.bg = `bg-secondary`
        this.containerDate.push(dateObj)
      }
    },
  },
  async mounted() {
    await this.getObservations()
    await this.getLines()
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    this.selectedLine = localStorage.getItem('line_id')
  },
  components: { Loading, Pagination },
}
</script>
