<template>
  <div>
    <div class="card mb-3">
      <StwFilter />
      <div class="card-body px-4">
        <div v-if="cond == 1">
          <MainDashboardChart />
        </div>
        <div v-else>
          <MainDashboardChartDetail />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { GET_LINES } from '@/store/modules/line.module'
import { mapGetters } from 'vuex'
import MainDashboardChart from '@/components/charts/MainDashboardChart.vue'
import MainDashboardChartDetail from '@/components/charts/MainDashboardChartDetail.vue'
import StwFilter from '@/components/StwFilter.vue'

export default {
  name: 'Main Dashboard',
  data() {
    return {
      selectedMonth: null,
      selectedLine: '-1',
      cond: 1,
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts']),
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
  },
  mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    this.selectedLine = localStorage.getItem('line_id')
    this.getLines()
  },
  components: { MainDashboardChart, MainDashboardChartDetail, StwFilter },
}
</script>
