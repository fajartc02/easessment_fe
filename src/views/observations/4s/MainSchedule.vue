<template>
  <div>
    <div
      v-for="mainSchedule in mainScheduleData"
      :key="mainSchedule.id"
      class="card mb-5"
    >
      <div class="card-header">
        <div class="row d-flex align-items-center">
          <div class="col">
            <label>Select month</label>
            <input
              type="month"
              class="form-control"
              v-model="selectedMonth"
              @change="addFilter()"
            />
          </div>
          <div class="col">
            <label>Line</label>
            <select
              class="form-select"
              v-model="mainSchedule.line_id"
              @change="addFilter()"
            >
              <option
                v-for="(line, index) in getLinesOpts"
                :key="index"
                :value="line.id"
              >
                {{ line.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Shift / group</label>
            <select class="form-select" v-model="mainSchedule.group_id">
              <option
                v-for="group in getGroups"
                :key="group.id"
                :value="group.id"
              >
                {{ group.group_nm }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Zona</label>
            <select class="form-select" v-model="mainSchedule.zone_id">
              <option
                v-for="zone in getZones"
                :key="zone.zone_id"
                :value="zone.zone_id"
              >
                {{ zone.zone_nm }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Kanban</label>
            <select class="form-select" v-model="mainSchedule.zone_id">
              <option
                v-for="kanban in getKanbans"
                :key="kanban.kanban_id"
                :value="kanban.kanban_id"
              >
                {{ kanban.kanban_id }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="card-header">
        <div class="row">
          <div class="col">
            <div class="d-flex align-items-center">
              <div class="d-flex align-items-center">
                <div class="bullet" style="width: 20px; height: 20px"></div>
                <span class="mx-2">Planning</span>
              </div>
              <div class="d-flex align-items-center">
                <div
                  class="bullet-filled"
                  style="width: 20px; height: 20px"
                ></div>
                <span class="mx-2">Sudah Cleaning</span>
              </div>
              <div class="d-flex align-items-center">
                <div
                  class="bullet-cancel"
                  style="width: 20px; height: 20px"
                ></div>
                <span class="mx-2">Sudah Cleaning, ada temuan abnormally</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body p-0 overflow-x-auto">
        <table class="table table-bordered" style="width: 100%">
          <thead>
            <tr>
              <th colspan="40" class="text-center">
                4S Schedule Activities [Sub line {{ mainSchedule.group_nm }}]
              </th>
            </tr>
            <tr>
              <th rowspan="2">No</th>
              <th rowspan="2">Zona</th>
              <th rowspan="2">No Kanban</th>
              <th rowspan="2">Area</th>
              <th rowspan="2">Time</th>
              <th rowspan="2">PIC</th>
              <th rowspan="2">Freq</th>
              <th colspan="31" class="text-center">Maret</th>
            </tr>
            <tr>
              <td v-for="n in totalDate" :key="n">{{ n }}</td>
            </tr>
          </thead>
          <tbody>
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
              v-for="(data, scheduleIndex) in subScheduleData"
              :key="scheduleIndex"
            >
              <td>{{ scheduleIndex + 1 }}</td>
              <td style="min-width: 100px">{{ data.zone_nm }}</td>
              <td style="min-width: 120px">{{ data.kanban_no }}</td>
              <td style="min-width: 200px">{{ data.area_nm }}</td>
              <td style="min-width: 200px">{{ data.standart_time }}</td>
              <td style="min-width: 100px" :rowspan="data.row_span_pic">
                {{ data.pic_nm }}
              </td>
              <td>{{ data.freq_nm }}</td>
              <td
                v-for="(children, childrenIndex) in data.children"
                :key="childrenIndex"
                :style="`${
                  children.is_holiday ? 'background-color: #f9fafb' : ''
                }`"
              >
                <div
                  v-if="!children.is_holiday && children.status == 'PLANNING'"
                  class="status-wrapper d-flex align-items-center justify-content-center"
                >
                  <div class="bullet"></div>
                </div>
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
import Loading from 'vue-loading-overlay'
import {
  GET_SCHEDULES,
  GET_SUB_SCHEDULES,
} from '@/store/modules/schedule4s.module'
import { GET_GROUP } from '@/store/modules/group.module'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_ZONES } from '@/store/modules/zones.module'
import { GET_KANBANS } from '@/store/modules/kanban.module'
import { mapGetters } from 'vuex'
export default {
  name: 'Main Schedule',
  components: { Loading },
  data() {
    return {
      totalDate: 31,
      isLoading: false,
      mainScheduleData: null,
      subScheduleData: null,
      selectedMonth: null,
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
  computed: {
    ...mapGetters(['getLinesOpts', 'getGroups', 'getZones', 'getKanbans']),
  },
  watch: {
    selectedMonth: function () {
      if (this.selectedMonth) {
        this.generateDate()
        let idx = this.idxMonth.indexOf(this.selectedMonth.split('-')[1])
        this.yearMonth = `${this.monthStr[idx]} ${
          this.selectedMonth.split('-')[0]
        }`
      }
    },
  },
  methods: {
    async getSchedules() {
      this.isLoading = true
      let objQuery = {
        // main_schedule_id: '29bd729a-0ca3-492c-bba5-c8ca4c9ed4b5',
      }
      await this.$store.dispatch(GET_SCHEDULES, objQuery).then((res) => {
        if (res) {
          this.mainScheduleData = res
          this.isLoading = false

          res.map((item) => {
            this.getSubSchedules(item.main_schedule_id)
          })
        }
      })
    },
    async getSubSchedules(mainScheduleID) {
      this.isLoading = true
      let objQuery = {
        main_schedule_id: mainScheduleID,
      }
      await this.$store.dispatch(GET_SUB_SCHEDULES, objQuery).then((res) => {
        if (res) {
          console.log(res)
          this.subScheduleData = res.schedule
          this.isLoading = false
        }
      })
    },

    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getGroup() {
      try {
        this.$store.dispatch(GET_GROUP)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getZone() {
      try {
        this.$store.dispatch(GET_ZONES)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getKanban() {
      try {
        this.$store.dispatch(GET_KANBANS)
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
    await this.getSchedules()
    await this.getLines()
    await this.getGroup()
    await this.getZone()
    await this.getKanban()
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
  },
  updated() {},
}
</script>

<style>
.status-wrapper {
  width: 30px;
  height: 30px;
  background-color: #f0fdf4;
  border-radius: 6px;
}
.bullet {
  width: 10px;
  height: 10px;
  border: 2px solid black;
  border-radius: 10px;
}
.bullet-filled {
  width: 10px;
  height: 10px;
  background-color: black;
  border: 2px solid black;
  border-radius: 10px;
}
.bullet-cancel {
  width: 10px;
  height: 10px;
  background-color: black;
  border: 2px solid black;
  border-radius: 10px;
}
</style>