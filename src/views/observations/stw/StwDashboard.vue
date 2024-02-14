<template>
  <div>
    <div class="card mb-3">
      <Filter filterType="stw-dashboard" />
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5>Schedule Observation</h5>
        <button class="btn btn-info text-white">Add schedule</button>
      </div>
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <div>
          <strong>Monthly Schedule</strong>
        </div>
        <div class="d-flex align-items-center">
          <div style="margin-right: 20px">
            Type 1 & 2
            <CButton color="dark rounded-circle" variant="outline" disabled>
              <CIcon icon="cil-circlea" class="text-dark" size="sm" />
            </CButton>
            Type 3
            <CButton color="dark" variant="outline" disabled>
              <CIcon icon="cil-circlea" class="text-dark" size="sm" />
            </CButton>
          </div>
          <div>
            OnProgress: <CIcon icon="cil-circle" class="text-dark" size="sm" />,
            Done:
            <CIcon icon="cil-check-circle" class="text-success" size="sm" />,
            Delay: <CIcon icon="cil-circle" class="text-danger" size="sm" />
          </div>
        </div>
      </div>
      <div class="overflow-auto">
        <table class="table table-bordered text-center">
          <thead>
            <tr>
              <th rowspan="2">No</th>
              <th rowspan="2">Line</th>
              <th rowspan="2">Pos</th>
              <th rowspan="2">Observer</th>
              <th rowspan="2">Shift</th>
              <th :colspan="containerDate.length">{{ yearMonth }}</th>
            </tr>
            <tr>
              <th v-for="date in containerDate" :key="date" :class="date.bg">
                {{ date.idx }}
              </th>
            </tr>
          </thead>
          <tbody v-if="observationSchedule.length > 0">
            <tr
              v-for="(observation, i) in observationSchedule"
              :key="observation.pos_id"
            >
              <td>{{ i + 1 }}</td>
              <td>{{ observation.line_snm }}</td>
              <td>{{ observation.pos_nm }}</td>
              <td>{{ observation.checkers[0] }}</td>
              <td>{{ observation.group_nm }}</td>
              <td
                v-for="item in containerDate"
                :key="item.idx"
                style="min-width: 63px"
              >
                <template
                  v-for="child in observation.children"
                  :key="child.observation_id"
                >
                  <template v-if="child.idxdate === String(item.idx)">
                    <CButton
                      v-c-tooltip="
                        `
                      <div class='card'>
                        <div class='card-header'>Detail data</div>
                        <div class='card-body'>
                          SOP No:  ${child.job_no} </br>
                          Member: ${child.member_nm}
                        </div>
                      </div>
                      `
                      "
                      v-if="child"
                      :color="`${child.job_type_color}`"
                      html="true"
                      variant="outline"
                      style="position: relative"
                      @click="() => detailSchedule(child)"
                    >
                      <button
                        disabled
                        :v-if="observation.comment_sh"
                        style="
                          position: absolute;
                          margin-left: 20px;
                          background-color: #e0f2fe;
                          border: none;
                          border: 1px solid #7dd3fc;
                          color: #0369a1;
                          border-radius: 6px;
                        "
                      >
                        1
                      </button>
                      <CIcon
                        v-if="child.actual_check_dt"
                        icon="cil-check-circle"
                        class="text-success"
                        size="md"
                      />
                      <CIcon
                        v-else-if="+currentDate <= +child.idxdate"
                        icon="cil-circle"
                        class="text-dark"
                        size="md"
                      />

                      <CIcon
                        v-else
                        icon="cil-circle"
                        class="text-danger"
                        size="md"
                      />
                    </CButton>
                  </template>
                </template>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td :colspan="3 + containerDate.length + 1">
                <b class="text-danger">Tidak Ada Data</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
  
  <script>
import moment from 'moment'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_OBSERVATION_SCHEDULE } from '@/store/modules/observation.module'
import { mapGetters } from 'vuex'
import Filter from '@/components/Filter.vue'

export default {
  name: 'STW Dashboard',
  data() {
    return {
      selectedMonth: null,
      selectedLine: '0',
      containerDate: [],
      schedules: [],
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
  computed: {
    ...mapGetters(['getLinesOpts', 'observationSchedule']),
  },
  watch: {
    selectedLine: function () {
      if (this.selectedLine != '0') this.getObsSchedule()
    },
    selectedMonth: function () {
      if (this.selectedMonth) {
        this.generateDate()
        let idx = this.idxMonth.indexOf(this.selectedMonth.split('-')[1])
        this.yearMonth = `${this.monthStr[idx]} ${
          this.selectedMonth.split('-')[0]
        }`
        this.getObsSchedule()
      }
    },
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
    async getObsSchedule() {
      let objQuery = {
        line: this.selectedLine,
        month: this.selectedMonth.split('-')[1],
        year: this.selectedMonth.split('-')[0],
      }
      if (this.selectedLine != '0') objQuery.line = this.selectedLine
      await this.$store.dispatch(GET_OBSERVATION_SCHEDULE, objQuery)
    },
    detailSchedule(obser) {
      console.log(obser.observation_id)
      this.$router.push(`/observation/${obser.observation_id}`)
    },
  },
  mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    this.getLines()
  },
  updated() {
    if (this.$route.query.line) {
      this.selectedLine = this.$route.query.line
    }
  },
  components: {
    Filter,
  },
}
</script>
  