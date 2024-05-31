<template>
  <div class="container-fluid p-0">
    <div class="row mb-2">
      <div class="col">
        <label>Line</label>
        <select class="form-select" v-model="filter.line_id">
          <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
            {{ line.text }}
          </option>
        </select>
      </div>
    </div>

    <!-- SUMMARY -->
    <div class="row mx-2 my-3">
      <h5 class="p-0">This Month Summary</h5>
      <div class="col-12 col-md-4 col-lg-4 card position-relative">
        <div class="card-body">
          <h5><u>STW</u></h5>
          <div class="row">
            <div class="col-12 col-md-4 colcol-12 col-md-4 col-lg-4 card p-2" v-for="(item, i) in countSTW" :key="i">
              <h6>{{ Object.keys(item)[0].toUpperCase() }}</h6>
              {{ Object.values(item)[0] }}
            </div>
          </div>
        </div>
        <CustomFullLoading :show="loadingCountSTW" />
      </div>
      <div class="col-12 col-md-4 col-lg-4 card position-relative">
        <div class="card-body">
          <h5><u>4S</u></h5>
          <div class="row">
            <div class="col-12 col-md-4 col-lg-4 card p-2" v-for="(item, i) in Object.keys(count4S)" :key="i">
              <h6>{{ item.toUpperCase() }}</h6>
              {{ count4S[item] }}
            </div>
          </div>
        </div>
        <CustomFullLoading :show="loadingCount4S" />
      </div>
      <div class="col-12 col-md-4 col-lg-4 card position-relative">
        <div class="card-body">
          <h5><u>OM</u></h5>
          <div class="row">
            <div class="col-12 col-md-4 col-lg-4 card p-2" v-for="(item, i) in Object.keys(countOM)" :key="i">
              <h6>{{ item.toUpperCase() }}</h6>
              {{ countOM[item] }}
            </div>
          </div>
        </div>
        <CustomFullLoading :show="loadingCountOM" />
      </div>
    </div>

    <!-- <card-status-schedules :achievementsSTW="getCountTotalSTW" :achievements4S="getCountTotal4S"
        :achievementsOM="getCountTotalOM" /> -->
    <div class="card p-3">
      <div class="card-header">
        <div class="d-flex flex-row justify-content-between align-items-center">
          <template v-if="isMobile">
            <div v-for="(item, i) in dailyOpts" :key="i" class="flex-col">
              <button :class="`btn btn-sm ${item.is_active ? 'btn-primary' : 'btn-outline-primary'} rounded-circle`"
                type="button" @click="getTodayActivities(i)">{{ item.label }} <br> {{ item.date_label.split('-')[0]
                }}</button>
            </div>
          </template>
          <template v-else>
            <div v-for="(item, i) in dailyDesktopOpts" :key="i" class="flex-col">
              <button :class="`btn btn-sm ${item.is_active ? 'btn-primary' : 'btn-outline-primary'} rounded-circle`"
                type="button" @click="getTodayActivities(i)">{{ item.label }} <br>{{ item.date_label }}</button>
            </div>
          </template>
        </div>
      </div>
      <div class="card-header align-start overflow-auto mt-3">
        <div class="row">
          <div class="col">
            <table style="border: none!important;">
              <tr>
                <td>
                  <div class="card" style="width: 20px;height: 20px;background-color: cyan;"></div>
                </td>
                <td>: On Progress</td>
                <td>
                  <div class="card" style="width: 20px;height: 20px;background-color: #01FF4F;"></div>
                </td>
                <td>: Done</td>
                <td>
                  <div class="card" style="width: 20px;height: 20px;background-color: red;"></div>
                </td>
                <td>: Delay</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="card-body">
        <ul>
          <li>STW Activities</li>
        </ul>
        <div class="row">
          <template v-if="dataSTW.length > 0 && !isLoading">
            <div v-for="(item) in dataSTW" :key="item.observation_id" class="col-12 col-md-4 col-lg-4 mt-1">
              <div class="card p-2"
                :style="`border-left: 10px solid ${item.color_status ? item.color_status : 'cyan'};min-height: 100px;`">
                <div class="d-flex flex-row justify-content-between align-items-center">
                  <div class="d-flex flex-column">
                    {{ item.line_snm }} |
                    {{ item.pos_nm }} |
                    {{ item.member_nm }} |
                    <b v-if="item.group_nm == 'RED'" class="text-danger">{{ item.group_nm }}</b>
                    <b v-else class="text-light bg-dark" style="max-width: 70px;">{{ item.group_nm }}</b>
                  </div>
                  <div class="d-flex flex-column">
                    <template v-if="!item.actual_check_dt">
                      <button class="btn btn-sm btn-primary"
                        @click="$router.push(`/observation/${item.observation_id}`)">Check</button>
                    </template>
                    <template v-else>
                      <button class="btn btn-sm btn-success"
                        @click="$router.push(`/observation/${item.observation_id}`)">Details</button>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="isLoading">
            <div class="col-12 col-md-4 col-lg-4">
              <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
              Loading...
            </div>
          </template>
          <template v-else>
            <NoDataContent />
          </template>
        </div>
      </div>
      <div class="card-body">
        <ul>
          <li>4S Activities</li>
        </ul>
        <div class="row">
          <template v-if="data4S.length > 0 && !isLoading">
            <div v-for="(item) in data4S" :key="item.observation_id" class="col-12 col-md-4 col-lg-4">
              <div class="card p-2"
                :style="`border-left: 10px solid ${getColorStatus(item.plan_check_dt, item.actual_check_dt)};min-height: 100px;`">
                <div class="d-flex flex-row justify-content-between align-items-center">
                  <div class="d-flex flex-column">
                    {{ item.line_nm }} |
                    {{ item.area_nm }} |
                    {{ item.group_nm }} |
                    <template v-if="item.pic_nm">{{ item.pic_nm }}</template>
                    <template v-else><i class="text-danger">Pic belum di tentukan</i></template>
                  </div>
                  <div class="d-flex flex-column">
                    <button class="btn btn-sm btn-primary"
                      @click="$router.push(`/4s/schedule-check/${item.main_schedule_id}/${item.sub_schedule_id}`)">Check</button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="isLoading">
            <div class="col-12 col-md-4 col-lg-4">
              <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
              Loading...
            </div>
          </template>
          <template v-else>
            <NoDataContent />
          </template>
        </div>
      </div>
      <div class="card-body">
        <ul>
          <li>OM Activities</li>
        </ul>
        <div class="row">
          <template v-if="dataOM.length > 0 && !isLoading">
            <div v-for="(item) in dataOM" :key="item.observation_id" class="col-12 col-md-4 col-lg-4">
              <div class="card p-2"
                :style="`border-left: 10px solid ${getColorStatus(item.plan_check_dt, item.actual_check_dt)};min-height: 100px;`">
                <div class="d-flex flex-row justify-content-between align-items-center">
                  <div class="d-flex flex-column">
                    {{ item.line_nm }} |
                    {{ item.machine_nm }} |
                    {{ item.item_check_nm }} |
                    {{ item.group_nm }} |
                    <template v-if="item.pic_nm">{{ item.pic_nm }}</template>
                    <template v-else><i class="text-danger">Pic belum di tentukan</i></template>
                  </div>
                  <div class="d-flex flex-column">
                    <button class="btn btn-sm btn-primary"
                      @click="$router.push(`/om/schedule-detail/${item.om_main_schedule_id}/${item.om_sub_schedule_id}`)">Check</button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="isLoading">
            <div class="col-12 col-md-4 col-lg-4">
              <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
              Loading...
            </div>
          </template>
          <template v-else>
            <NoDataContent />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import NoDataContent from '@/components/card/NoDataContent.vue';
import { toast } from 'vue3-toastify';
import ApiService from '@/store/api.service';
import { mapGetters } from 'vuex';
import { GET_LINES } from '@/store/modules/line.module';
import CustomFullLoading from '@/components/CustomFullLoading.vue';
// import CardStatusSchedules from '@/components/card/CardStatusSchedules.vue';

export default {
  name: "TodayActivity",
  data() {
    return {
      isLoading: false,
      dailyOpts: [
        {
          label: 'S',
          is_active: false,
          date: null,
          date_label: null
        },
        {
          label: 'S',
          is_active: false,
          date: null,
          date_label: null
        },
        {
          label: 'R',
          is_active: false,
          date: null,
          date_label: null
        },
        {
          label: 'K',
          is_active: false,
          date: null,
          date_label: null
        },
        {
          label: 'J',
          is_active: false,
          date: null,
          date_label: null
        },
        {
          label: 'S',
          is_active: false,
          date: null,
          date_label: null
        },
        {
          label: 'M',
          is_active: false,
          date: null,
          date_label: null
        }
      ],
      dailyDesktopOpts: [
        {
          label: 'Senin',
          is_active: false,
          date: null,
          date_label: null
        },
        {
          label: 'Selasa',
          is_active: false,
          date: null,
          date_label: null
        },
        {
          label: 'Rabu',
          is_active: false,
          date: null,
          date_label: null
        },
        {
          label: 'Kamis',
          is_active: false,
          date: null,
          date_label: null
        },
        {
          label: 'Jumat',
          is_active: false,
          date: null,
          date_label: null
        },
        {
          label: 'Sabtu',
          is_active: false,
          date: null,
          date_label: null
        },
        {
          label: 'Minggu',
          is_active: false,
          date: null,
          date_label: null
        }
      ],
      containerDateOfThisWeek: [],
      windowWidth: window.innerWidth,
      filter: {
        line_id: localStorage.getItem('line_id') ?? -1,
        date: null
      },
      isMobile: false,
      dataSTW: [],
      data4S: [],
      dataOM: [],
      countSTW: [
        {
          delay: 0
        },
        {
          progress: 0
        },
        {
          done: 0
        }
      ],
      count4S: {
        delay: 0,
        progress: 0,
        done: 0
      },
      countOM: {
        delay: 0,
        progress: 0,
        done: 0
      },
      loadingCountSTW: true,
      loadingCount4S: true,
      loadingCountOM: true,
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts']),
    getCountTotalSTW() {
      return {
        total: this.dataSTW.length,
        done: this.dataSTW.filter(item => item.actual_check_dt).length
      }
    },
    getCountTotal4S() {
      return {
        total: this.data4S.length,
        done: this.data4S.filter(item => item.actual_check_dt).length
      }
    },
    getCountTotalOM() {
      return {
        total: this.dataOM.length,
        done: this.dataOM.filter(item => item.actual_check_dt).length
      }
    },
  },
  watch: {
    windowWidth() {
      console.log(this.windowWidth);
      if (this.windowWidth < 500) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    },
    filter: {
      async handler() {
        await this.getSTWData()
        await this.get4SData()
        await this.getOMData()
        await this.totalSTW()
        await this.total4S()
        await this.totalOM()
      },
      deep: true
    }
  },
  methods: {
    getColorStatus(planDate, actualDate) {
      let isDelay = moment(planDate).diff(moment(), 'days') < 0
      if (!actualDate && isDelay) {
        return '#FF0000'
      } else if (!isDelay && actualDate) {
        return '#01FF4F'
      } else {
        return '#01FFFF'
      }
    },
    async ActionGetLines() {
      try {
        await this.$store.dispatch(GET_LINES);
      } catch (error) {
        toast.error(error.response.data.message)
      }
    },
    generateDateOfThisWeek() {
      let thisDay = moment().startOf('week');
      if (moment().isoWeekday() == 7) {
        thisDay = moment().startOf('week').subtract(1, 'weeks');
      }
      let today = moment().format('YYYY-MM-DD');
      for (let i = 0; i < 7; i++) {
        var date = thisDay.add(1, 'days').format('YYYY-MM-DD');
        this.dailyOpts[i].date = date
        this.dailyDesktopOpts[i].date = date
        this.dailyOpts[i].date_label = moment(date).format('DD-MM')
        this.dailyDesktopOpts[i].date_label = moment(date).format('DD-MM')
        if (today == date) {
          this.dailyOpts[i].is_active = true
          this.dailyDesktopOpts[i].is_active = true
          this.filter.date = date
        }
      }
    },
    getTodayActivities(idxSelected) {
      const mapDay = this.dailyOpts.map((item, i) => {
        if (idxSelected == i) {
          this.dailyDesktopOpts[i].is_active = true
          item.is_active = true
          this.filter.date = item.date
        } else {
          this.dailyDesktopOpts[i].is_active = false
          item.is_active = false
        }
        return item
      })
      this.dailyOpts = mapDay
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    async getSTWData() {
      try {
        this.isLoading = true
        ApiService.setHeader()
        let { data } = await ApiService.query(`/operational/observation/schedule/today`, this.filter)

        this.dataSTW = data.data ?? []
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        toast.error(error.response.data.message)
      }
    },
    async get4SData() {
      try {
        this.isLoading = true
        let { data } = await ApiService.query(`/operational/4s/sub-schedule/today`, this.filter)
        // /operational/4s/sub-schedule/today?date=2024-04-23
        console.log(data);
        this.data4S = data.data ?? []
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        toast.error(error.response.data.message)
      }
    },
    async getOMData() {
      try {
        this.isLoading = true
        let { data } = await ApiService.query(`/operational/om/sub-schedule/today`, this.filter)
        // /operational/4s/sub-schedule/today?date=2024-04-23
        console.log(data);
        this.dataOM = data.data ?? []
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        toast.error(error.response.data.message)
      }
    },
    async totalSTW() {
      try {
        let { data } = await ApiService.query(`/operational/observation/schedule/count`, { line_id: this.filter.line_id, month: moment(this.filter.date).format('M'), year: moment(this.filter.date).format('YYYY') })
        this.countSTW = data.data
      } catch (error) {
        toast.error(error.response.data.message)
      }
      this.loadingCountSTW = false
    },
    async total4S() {
      try {
        let { data } = await ApiService.query(`/operational/4s/sub-schedule/count`, { line_id: this.filter.line_id, month: moment(this.filter.date).format('M'), year: moment(this.filter.date).format('YYYY') })
        this.count4S = data.data
      } catch (error) {
        toast.error(error.response.data.message)
      }
      this.loadingCount4S = false
    },
    async totalOM() {
      try {
        let { data } = await ApiService.query(`/operational/om/sub-schedule/count`, { line_id: this.filter.line_id, month: moment(this.filter.date).format('M'), year: moment(this.filter.date).format('YYYY') })
        this.countOM = data.data
      } catch (error) {
        toast.error(error.response.data.message)
      }
      this.loadingCountOM = false
    }
  },
  async mounted() {
    this.isLoading = true
    this.onResize()
    this.generateDateOfThisWeek()
    this.ActionGetLines()

    // no need to await for lazy load
    this.getSTWData()
    this.get4SData()
    this.getOMData()

    this.totalSTW()
    this.total4S()
    this.totalOM()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize);
  },
  components: {
    NoDataContent,
    CustomFullLoading,
    // CardStatusSchedules
  }
}
</script>
<style></style>
