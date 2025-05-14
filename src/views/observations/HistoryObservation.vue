<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex justify-content-between align-items-center">
        <h5>History Observasi</h5>
        <div class="d-flex col-5">
          <CInputGroup>
            <CInputGroupText>Line</CInputGroupText>
            <Select2
              v-model="filter.line_id"
              class="form-control"
              :options="getLinesOpts"
            />
          </CInputGroup>
          <CInputGroup class="mx-2">
            <CInputGroupText>Month</CInputGroupText>
            <input
              v-model="filter.selectedMonth"
              class="form-control"
              type="month"
            />
          </CInputGroup>
        </div>
      </div>
    </div>
    <div class="card-body p-0">
      <table class="table table-striped">
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
        <tr v-if="isLoading">
          <td colspan="10" class="p-0" style="height: 200px">
            <div class="vl-parent p-0" style="height: 100%">
              <loading
                v-model:active="isLoading"
                :can-cancel="true"
                :is-full-page="false"
                :on-cancel="onCancel"
              />
            </div>
          </td>
        </tr>
        <tr
          v-else-if="observationSchedule.length > 0"
          v-for="(obaservation, i) in observationSchedule"
          :key="obaservation.uuid"
        >
          <td>{{ i + 1 }}</td>
          <td>{{ obaservation.line_nm }}</td>
          <td>{{ obaservation.pos_nm }}</td>
          <td>{{ obaservation.job_type_nm }}</td>
          <td v-if="obaservation.checkers.length > 0">
            <button
              v-for="checker in obaservation.checkers"
              :key="checker.id"
              class="btn btn-warning text-black disabled"
            >
              {{ checker.checker_nm }}
            </button>
          </td>
          <td>{{ obaservation.member_nm }}</td>
          <td>{{ obaservation.job_nm }}</td>
          <td>{{ `${obaservation.plan_check_dt}` }}</td>
          <td
            :class="
              `${obaservation.actual_check_dt}` == 'null' ? 'bg-danger' : ''
            "
          >
            {{
              `${obaservation.actual_check_dt}` != 'null'
                ? `${obaservation.actual_check_dt}`
                : 'belum cek'
            }}
          </td>
          <td>
            <button
              class="btn btn-info btn-sm"
              @click="details(obaservation.id, obaservation)"
            >
              detail
            </button>
          </td>
        </tr>
        <tr v-else>
          <td class="text-center" colspan="10">
            <h4>Tidak ada data</h4>
          </td>
        </tr>
      </table>
    </div>
    <div class="card-footer">
      <div class="row">
        <div class="col-xl-3">
          <div class="input-group mb-3">
            <label class="input-group-text">Limit</label>
            <select class="form-select" v-model="filter.limit">
              <option selected value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        <div class="col"></div>
        <div class="col-xl-3" v-if="filter.total_data > 0">
          <CustPagination
            :totalItems="filter.total_data"
            :items-per-page="filter.limit"
            :current-page="filter.current_page"
            @page-changed="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { GET_OBSERVATION_SCHEDULE_LIST } from '@/store/modules/observation.module'
import { GET_LINES } from '@/store/modules/line.module'
import Loading from 'vue-loading-overlay'
import CustPagination from '@/components/pagination/CustPagination.vue'

export default {
  name: 'HistoryObservation',
  data() {
    return {
      filter: {
        limit: 10,
        total_data: 1,
        current_page: 1,
        line_id: -1,
        selectedMonth: moment().format('YYYY-MM'),
      },
      isLoading: false,
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
    }
  },
  watch: {
    observationSchedule: function () {
      console.log(this.observationSchedule)
      if (this.observationSchedule[0]) {
        this.filter.total_data = this.observationSchedule[0].total_data
        this.filter.limit = this.observationSchedule[0].limit
        this.filter.total_page = this.observationSchedule[0].total_page
      }
    },
    filter: {
      deep: true,
      handler() {
        this.getObservations()
      },
    },
  },
  computed: {
    ...mapGetters(['observationSchedule', 'getLinesOpts']),
  },
  methods: {
    handlePageChange(page) {
      this.filter.current_page = page
      // this.getObservations()
    },
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getObservations() {
      this.isLoading = true
      let objQuery = {
        month: this.filter.selectedMonth.split('-')[1],
        year: this.filter.selectedMonth.split('-')[0],
        limit: this.filter.limit,
        current_page: this.filter.current_page,
      }
      if (this.filter.line_id != '0') objQuery.line = this.filter.line_id
      await this.$store
        .dispatch(GET_OBSERVATION_SCHEDULE_LIST, objQuery)
        .then((res) => {
          if (res) {
            this.isLoading = false
          }
        })
    },
    details(id, observationData) {
      const isNewForm = observationData?.is_new_form
      if (isNewForm) {
        this.$router.push(`/new-observation/${id}`)
      } else {
        this.$router.push(`/observation/${id}`)
      }
    },
  },
  async mounted() {
    if (localStorage.getItem('line_id')) {
      this.filter.line_id = localStorage.getItem('line_id')
    }
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.filter.selectedMonth = `${year}-${month}`
    await this.getLines()
    await this.getObservations()
  },
  components: { Loading, CustPagination },
}
</script>
