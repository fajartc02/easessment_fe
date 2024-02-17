<template>
  <div>
    <div class="card mb-3">
      <!-- filter -->
      <div class="card-header">
        <div class="row">
          <div class="col">
            <label>Start date</label>
            <input type="date" class="form-control" v-model="selectedFilterStartDate" @change="addFilter()" />
          </div>
          <div class="col">
            <label>End date</label>
            <input type="date" class="form-control" v-model="selectedFilterEndDate" @change="addFilter()" />
          </div>
          <div class="col">
            <label>Line</label>
            <select class="form-select" v-model="selectedLine" @change="addFilter('line')">
              <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
                {{ line.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Shift</label>
            <select class="form-select" v-model="selectedFilterShift" @change="addFilter('shift')">
              <option v-for="(group, index) in getGroupsOpts" :key="index" :value="group.id">
                {{ group.text }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <!-- end filter -->
      <div class="card-body px-4">
        <div v-if="cond == 'default'">
          <div class="row">
            <div class="col-md-2 mr-2" v-if="overallGraphData">
              <apexchart type="bar" :options="defaultOptions" :series="overallGraphData" height="100%"></apexchart>
            </div>
            <div style="height: 300px" class="col-md-10 pt-2 pb-4 d-flex horizontal-scrollable">
              <div v-if="isLoading">
                <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false" :on-cancel="onCancel" />
              </div>

              <div class="col-2 m-2" v-else v-for="detailGraph in getGraphs" :key="detailGraph.id">
                <div class="w-100 h-100 rounded chart-wrapper">
                  <apexchart type="bar" :options="options" :series="detailGraph.chartData" height="100%" @click="(event, chartContext, config) => {
                    selectedLineID = detailGraph
                    clickHandler(event, chartContext, config)
                  }
                    "></apexchart>
                </div>
                <div class="text-center mt-1">{{ detailGraph.line_nm }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="cond == 'detail'">
          <div class="row">
            <div class="col-md-2 mr-2" v-if="overallGraphData">
              <apexchart type="bar" :options="defaultOptions" :series="overallGraphData" height="100%"></apexchart>
            </div>
            <div style="height: 300px" class="col-md-10 pt-2 pb-4 d-flex horizontal-scrollable">
              <div v-if="isLoading">
                <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false" :on-cancel="onCancel" />
              </div>

              <div class="col-2 m-2" v-else v-for="detailGraph in getGraphs" :key="detailGraph.id">
                <div class="w-100 h-100 rounded chart-wrapper">
                  <apexchart type="bar" :options="options" :series="detailGraph.chartData" height="100%"
                    @click="clickHandler"></apexchart>
                </div>
                <div class="text-center mt-1">{{ detailGraph.month }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_GRAPH } from '@/store/modules/graph.module'
import { GET_GROUP } from '@/store/modules/group.module'
import { mapGetters } from 'vuex'
import Loading from 'vue-loading-overlay'
import ApiService from '@/store/api.service'

export default {
  name: 'Main Dashboard',
  data() {
    return {
      selectedMonth: null,
      lineData: [],
      cond: 'default',
      isLoading: false,
      selectedLineID: null,
      selectedFilterStartDate: '',
      selectedFilterEndDate: '',
      selectedLine: '-1',
      selectedFilterShift: '-1',
      yearNow: '',
      overallGraphData: [
        {
          name: '',
          data: [0],
        },
      ],
      defaultOptions: {
        chart: {
          type: 'bar',
          stacked: true,
          width: '100%',
          height: '100%',
          toolbar: {
            show: false,
          },
          events: {
            dataPointSelection: function (event, chartContext, config) {
              console.log(chartContext, config, event)
            },
          },
        },
        plotOptions: {
          bar: {
            vertical: true,
          },
        },
        xaxis: {
          categories: ['Overall graph'],
        },
        yaxis: {
          min: 0,
          max: 100,
          title: {
            text: '%',
          },
        },
        tooltip: {
          y: {
            formatter: undefined,
            title: {
              formatter: (seriesName, index) => {
                console.log(seriesName);
                return `<p> Total ${seriesName} : ${this.overallGraphData[index.seriesIndex].count
                  } </p>`
              },
            },
          },
        },
        legend: {
          show: false,
        },
        colors: ['#b91c1c', '#15803d', '#a16207'],
      },
      options: {
        chart: {
          type: 'bar',
          stacked: true,
          width: '100%',
          height: '100%',
          toolbar: {
            show: false,
          },
        },
        legend: {
          show: false,
        },
        plotOptions: {
          bar: {
            vertical: true,
          },
        },
        xaxis: {
          categories: ['problem', 'closed', 'remain'],
        },
        dataLabels: {
          enabled: [true, true, true],
        },
      },
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts', 'getGraphs', 'getGroupsOpts']),
  },
  methods: {
    clickHandler(event, chartContext, config) {
      console.log(event)
      console.log(chartContext)
      console.log(config)

      const currentSeriesIndex = config.seriesIndex
      const currentDataPointIndex = config.dataPointIndex
      let cm_judg = false
      let source_category

      currentDataPointIndex == 1 ? cm_judg = true : null

      switch (currentSeriesIndex) {
        case 0:
          source_category = 'MV'
          break
        case 1:
          source_category = 'Obs'
          break
        case 2:
          source_category = 'H'
          break
        case 3:
          source_category = 'FT'
          break
        default:
          break
      }

      this.$router.push(
        `/stw/list-temuan?source_category=${source_category}&cm_judg=${cm_judg}&line_id=${this.selectedLineID?.line_id ? this.selectedLineID.line_id : this.selectedLine}`,
      )

      // kalau seriesIndex == 0 = cm_judg = false
      // kalau seriesIndex == 1 = cm_judg = true
      // kalau seriesIndex == 2 = cm_judg = false

      // kalau dataPointIndex == 0 = source_category = "MV"
      // kalau dataPointIndex == 1 = source_category = "Obs"
      // kalau dataPointIndex == 2 = source_category = "H"
      // kalau dataPointIndex == 3 = source_category = "FT"
    },
    async getGroup() {
      try {
        this.$store.dispatch(GET_GROUP)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    addFilter() {
      this.getGraph()
      this.getOverallGraph()
      if (this.selectedLine == '-1') {
        this.cond = 'default'
      } else if (this.selectedLine !== '-1') {
        this.cond = 'detail'
      }
    },
    async getGraph() {
      this.isLoading = true

      let objQuery = {
        start_date: this.selectedFilterStartDate,
        end_date: this.selectedFilterEndDate,
        line_id: this.selectedLine,
        group_id: this.selectedFilterShift,
      }

      this.$store
        .dispatch(GET_GRAPH, objQuery)
        .then((res) => {
          if (res) {
            this.isLoading = false
          }
        })
        .catch((err) => {
          console.log(err)
          this.isLoading = false
        })
    },
    async getOverallGraph() {
      let objQuery = {
        start_date: this.selectedFilterStartDate,
        end_date: this.selectedFilterEndDate,
        line_id: this.selectedLine,
        group_id: this.selectedFilterShift,
      }

      await ApiService.setHeader()
      await ApiService.query('operational/graph/overall', objQuery)
        .then((res) => {
          this.overallGraphData = res.data.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
  async mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`

    this.selectedFilterStartDate = `${year}-${month}-01`
    this.selectedFilterEndDate = `${year}-12-31`
    await this.getLines()
    await this.getGraph()
    await this.getGroup()
    await this.getOverallGraph()
  },
  components: { Loading },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
