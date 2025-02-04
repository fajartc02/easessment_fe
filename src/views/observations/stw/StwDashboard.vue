<template>
  <div>
    <div class="card mb-3">
      <!-- filter -->
      <div class="card-header">
        <div class="row">
          <div class="col">
            <label>Select month</label>
            <input type="month" class="form-control" v-model="selectedMonth" @change="addFilter()" />
          </div>
          <div class="col">
            <label>Line</label>
            <select class="form-select" v-model="selectedLine" @change="addFilter()">
              <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
                {{ line.text }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <!-- end filter -->

      <div class="card-header d-flex justify-content-between align-items-center">
        <h6>Schedule Observation</h6>
        <div class="d-flex align-items-center">
          <div class="d-flex" style="margin-right: 20px">
            <div>
              Type 1 & 2:
              <CButton color="dark rounded-circle" variant="outline" disabled>
                <CIcon icon="cil-circlea" class="text-dark" size="sm" />
              </CButton>
            </div>
            <div class="mx-2">
              Type 3:
              <CButton color="dark" variant="outline" disabled>
                <CIcon icon="cil-circlea" class="text-dark" size="sm" />
              </CButton>
            </div>
            <div>
              Pengecekan 2 TL:
              <CButton color="dark" variant="outline" disabled style="
                  margin-left: 5px;
                  width: 35px;
                  height: 35px;
                  transform: rotate(45deg);
                ">
                <CIcon icon="cil-circlea" class="text-dark" size="sm" />
              </CButton>
            </div>
          </div>
          <div>
            OnProgress:
            <CIcon icon="cil-circle" class="text-dark" size="sm" />
            Done:
            <CIcon icon="cil-check-circle" class="text-success" size="sm" />
            Delay:
            <CIcon icon="cil-circle" class="text-danger" size="sm" />
            Is Finding:
            <CIcon icon="cil-bell" class="text-warning" size="sm" />
          </div>
        </div>
      </div>

      <!-- white shift -->
      <div class="card">
        <div class="card-header">
          <h6>White Shift</h6>
        </div>
        <div class="card-body">
          <div class="tableFixHead">
            <table class="table table-bordered text-center table-stripped">
              <thead>
                <tr>
                  <th id="fixCol-head-1" rowspan="2">No</th>
                  <th id="fixCol-head-2" rowspan="2">Line</th>
                  <th id="fixCol-head-3" rowspan="2">Pos</th>
                  <th id="fixCol-head-4" rowspan="2">Observer</th>
                  <th id="fixCol-head-5" rowspan="2">Shift</th>
                  <th :colspan="containerDate.length">{{ yearMonth }}</th>
                </tr>
                <tr>
                  <th v-for="date in containerDate" :key="date" :class="date.bg">
                    {{ date.idx }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                  <td colspan="40" class="p-0" style="height: 200px">
                    <div class="vl-parent p-0" style="height: 100%">
                      <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false"
                        :on-cancel="onCancel" />
                    </div>
                  </td>
                </tr>
                <tr v-else v-for="(observation, i) in observationSchedule" :key="observation.pos_id">
                  <td id="fixCol-1">{{ i + 1 }}</td>
                  <td id="fixCol-2">{{ observation.line_snm }}</td>
                  <td id="fixCol-3">{{ observation.pos_nm }}</td>
                  <td id="fixCol-4">
                    <CBadge v-for="observer in observation.checkers" :key="observer" color="secondary">{{ observer }}
                    </CBadge>
                  </td>
                  <td id="fixCol-5">{{ observation.group_nm }}</td>
                  <td v-for="item in containerDate" :key="item.idx" style="min-width: 63px">
                    <template v-for="child in observation.children" :key="child.observation_id">
                      <template v-if="child.idxdate === String(item.idx)">
                        <TooltipStwSchedule :child="child" :customTooltipStyle="customTooltipStyle" :observation="child"
                          :currentDate="currentDate" @detail-schedule="detailSchedule" />

                      </template>
                    </template>
                  </td>
                </tr>
                <tr v-if="observationSchedule?.length < 1">
                  <td colspan="50">
                    <h3 class="my-2">Data kosong</h3>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <hr />

      <!-- Red shift table -->
      <div class="card">
        <div class="card-header">
          <h6>Red Shift</h6>
        </div>
        <div class="card-body">
          <div class="tableFixHead">
            <table class="table table-bordered text-center">
              <thead>
                <tr>
                  <th id="fixCol-head-1" rowspan="2">No</th>
                  <th id="fixCol-head-2" rowspan="2">Line</th>
                  <th id="fixCol-head-3" rowspan="2">Pos</th>
                  <th id="fixCol-head-4" rowspan="2">Observer</th>
                  <th id="fixCol-head-5" rowspan="2">Shift</th>
                  <th :colspan="containerDate.length">{{ yearMonth }}</th>
                </tr>
                <tr>
                  <th v-for="date in containerDate" :key="date" :class="date.bg">
                    {{ date.idx }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isRedShiftLoading">
                  <td colspan="40" class="p-0" style="height: 200px">
                    <div class="vl-parent p-0" style="height: 100%">
                      <loading v-model:active="isRedShiftLoading" :can-cancel="true" :is-full-page="false"
                        :on-cancel="onCancel" />
                    </div>
                  </td>
                </tr>

                <tr v-for="(observationRedShift, i) in observationScheduleRedShift" :key="observationRedShift.pos_id">
                  <td id="fixCol-1">{{ i + 1 }}</td>
                  <td id="fixCol-2">{{ observationRedShift.line_snm }}</td>
                  <td id="fixCol-3">{{ observationRedShift.pos_nm }}</td>
                  <td id="fixCol-4">
                    <CBadge v-for="observer in observationRedShift.checkers" :key="observer" color="secondary">{{
                      observer }}
                    </CBadge>
                  </td>
                  <td id="fixCol-5">{{ observationRedShift.group_nm }}</td>
                  <td v-for="item in containerDate" :key="item.idx" style="min-width: 63px">
                    <template v-for="child in observationRedShift.children" :key="child.observation_id">

                      <template v-if="child.idxdate === String(item.idx)">
                        <TooltipStwSchedule :child="child" :customTooltipStyle="customTooltipStyle" :observation="child"
                          :currentDate="currentDate" @detail-schedule="detailSchedule" />

                      </template>
                    </template>
                  </td>
                </tr>
                <tr v-if="observationScheduleRedShift?.length < 1">
                  <td colspan="50">
                    <h3 class="my-2">Data kosong</h3>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- Yamazumi -->
    <!-- <div class="card">
      <div class="card-body">
        <Yamazumi />
      </div>
    </div> -->
  </div>
</template>

<script>
import moment from 'moment'
import { GET_LINES } from '@/store/modules/line.module'
import {
  GET_OBSERVATION_SCHEDULE,
  GET_OBSERVATION_SCHEDULE_RED_SHIFT,
} from '@/store/modules/observation.module'
import { mapGetters } from 'vuex'
import Loading from 'vue-loading-overlay'
// import Yamazumi from '@/components/yamazumi/Yamazumi.vue'
import TooltipStwSchedule from '@/components/TooltipSchedule/TooltipStwSchedule.vue'

export default {
  name: 'STW Dashboard',
  data() {
    return {
      customTooltipStyle: {
        width: '100%',
      },
      isLoading: false,
      isRedShiftLoading: false,
      currentPage: 1,
      currentPageLimit: 100,
      selectedMonth: null,
      selectedFilterStartDate: '',
      selectedFilterEndDate: '',
      selectedLine: '',
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
      whiteShiftID: 'cb7e9c37-b39c-49b4-b34d-b0a8f9f462df',
      redShiftID: '36ad3451-e2fe-4b50-84b0-2d6ca942ae1e',
      currentDate: `${new Date().getDate()}`,
    }
  },
  computed: {
    ...mapGetters([
      'getLinesOpts',
      'observationSchedule',
      'observationScheduleRedShift',
    ]),
  },
  watch: {
    selectedLine: function () {
      if (this.selectedLine != '0') this.getObsSchedule()
    },
    selectedMonth: function () {
      if (this.selectedMonth) {
        this.generateDate()
        let idx = this.idxMonth.indexOf(this.selectedMonth.split('-')[1])
        this.yearMonth = `${this.monthStr[idx]} ${this.selectedMonth.split('-')[0]
          }`
        this.getObsSchedule()
        this.getObsScheduleRedShift()
      }
    },
  },
  methods: {
    onPageChange(page) {
      if (page == -1) {
        this.currentPage = this.currentPage - 1
        this.getObsSchedule()
      } else {
        this.currentPage = this.currentPage + 1
        this.getObsSchedule()
      }
    },
    onPageChangeLimit(limit) {
      this.currentPageLimit = limit
      this.getObsSchedule()
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
    async getObsSchedule() {
      this.isLoading = true
      let objQuery = {
        line: this.selectedLine,
        month: this.selectedMonth.split('-')[1],
        year: this.selectedMonth.split('-')[0],
        limit: this.currentPageLimit,
        currentPage: this.currentPage,
        group_id: this.whiteShiftID,
      }
      if (this.selectedLine != '0') objQuery.line = this.selectedLine
      await this.$store
        .dispatch(GET_OBSERVATION_SCHEDULE, objQuery)
        .then((res) => {
          if (res) {
            this.isLoading = false
          }
        })
    },
    async getObsScheduleRedShift() {
      this.isRedShiftLoading = true
      let objQuery = {
        line: this.selectedLine,
        month: this.selectedMonth.split('-')[1],
        year: this.selectedMonth.split('-')[0],
        limit: this.currentPageLimit,
        currentPage: this.currentPage,
        group_id: this.redShiftID,
      }
      if (this.selectedLine != '0') objQuery.line = this.selectedLine
      await this.$store
        .dispatch(GET_OBSERVATION_SCHEDULE_RED_SHIFT, objQuery)
        .then((res) => {
          if (res) {
            this.isRedShiftLoading = false
          }
        })
    },
    detailSchedule(obser) {
      this.$router.push(`/observation/${obser.observation_id}`)
    },
    addFilter() {
      this.getObsSchedule()
      this.getObsScheduleRedShift()
    },
  },
  async mounted() {
    await this.getLines()
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    this.selectedLine = localStorage.getItem('line_id')

    await this.getObsSchedule()
    await this.getObsScheduleRedShift()
  },
  updated() {
    if (this.$route.query.line) {
      this.selectedLine = this.$route.query.line
    }
  },
  components: {
    Loading,
    // Yamazumi,
    TooltipStwSchedule,
  },
}
</script>

<style scoped>
.fixed-td {
  position: absolute;
}

.tableFixHead {
  overflow: auto;
  height: 35vh;
}

.tableFixHead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
}

#fixCol-head-1 {
  position: sticky;
  width: 38px;
  top: 0px;
  left: 0px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-2 {
  position: sticky;
  top: 0px;
  left: 37px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-3 {
  position: sticky;
  min-width: 121px;
  top: 0px;
  left: 85px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-4 {
  position: sticky;
  top: 0px;
  left: 200px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-5 {
  position: sticky;
  top: 0px;
  left: 290px;
  z-index: 3;
  background-color: white;
}


#fixCol-1 {
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 2;
  background-color: white;
}

#fixCol-2 {
  position: sticky;
  top: 0px;
  left: 37px;
  z-index: 2;
  background-color: white;
}

#fixCol-3 {
  position: sticky;
  top: 0px;
  left: 85px;
  z-index: 2;
  background-color: white;
}

#fixCol-4 {
  position: sticky;
  top: 0px;
  left: 200px;
  z-index: 2;
  background-color: white;
}

#fixCol-5 {
  position: sticky;
  top: 0px;
  left: 290px;
  z-index: 2;
  background-color: white;
}
</style>
