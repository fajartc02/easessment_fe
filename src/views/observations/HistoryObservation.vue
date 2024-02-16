<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex justify-content-between align-items-center">
        <h5>History Observasi</h5>
        <div class="d-flex col-5">
          <CInputGroup>
            <CInputGroupText>Line</CInputGroupText>
            <Select2
              v-model="selectedLine"
              class="form-control"
              :options="getLinesOpts"
            />
          </CInputGroup>
          <CInputGroup class="mx-2">
            <CInputGroupText>Month</CInputGroupText>
            <input v-model="selectedMonth" class="form-control" type="month" />
          </CInputGroup>
          <button class="btn btn-primary" @click="getObservations()">
            Search
          </button>
        </div>
      </div>
    </div>
    <div>
      <table class="table table-stripped">
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
          v-else
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
              @click="details(obaservation.id)"
            >
              detail
            </button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { GET_OBSERVATION_SCHEDULE_LIST } from '@/store/modules/observation.module'
import { GET_LINES } from '@/store/modules/line.module'
import Loading from 'vue-loading-overlay'

export default {
  name: 'ScheduleObservation',
  data() {
    return {
      isLoading: false,
      selectedMonth: null,
      selectedLine: '-1',
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
    },
  },
  computed: {
    ...mapGetters(['observationSchedule', 'getLinesOpts']),
  },
  methods: {
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
        month: this.selectedMonth.split('-')[1],
        year: this.selectedMonth.split('-')[0],
      }
      if (this.selectedLine != '0') objQuery.line = this.selectedLine
      await this.$store
        .dispatch(GET_OBSERVATION_SCHEDULE_LIST, objQuery)
        .then((res) => {
          if (res) {
            this.isLoading = false
          }
        })
    },
    details(id) {
      this.$router.push(`/observation/${id}`)
    },
  },
  async mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    await this.getLines()
    await this.getObservations()
  },
  components: { Loading },
}
</script>