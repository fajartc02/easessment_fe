<template>
  <div>
    <div class="card mb-3">
      <div class="card-header text-center">
        <h6>Grafik Temuan STW</h6>
      </div>
      <div class="card-header align-end overflow-auto">
        <div class="row">
          <div class="col-6"></div>
          <div class="col justify-content-end d-flex">
            <table>
              <tr>
                <td>
                  <div class="card" style="width: 20px;height: 20px;background-color: #84FFCF;"></div>
                </td>
                <td>: Observation</td>
                <td>
                  <div class="card" style="width: 20px;height: 20px;background-color: #008FFB;"></div>
                </td>
                <td>: Member Voice</td>
                <td>
                  <div class="card" style="width: 20px;height: 20px;background-color: #FE4560;"></div>
                </td>
                <td>: Focus Theme</td>
                <td>
                  <div class="card" style="width: 20px;height: 20px;background-color: #FEAF1A;"></div>
                </td>
                <td>: Henkaten</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="card-body px-4">
        <div v-if="cond == 'default'">
          <div class="row">
            <div class="col-12 col-md-2 mr-2" v-if="overallData">
              <apexchart type="donut" :options="defaulOptionsOverall" :series="overallData" height="100%">
              </apexchart>
            </div>
            <div style="height: 300px" class="col-md-10 pt-2 pb-4 d-flex horizontal-scrollable">
              <div v-if="isLoading">
                <loading :active="isLoading" :can-cancel="true" :is-full-page="false" />
              </div>

              <div class="col-2 m-2" v-else v-for="detailGraph in getGraphs" :key="detailGraph.id">
                <div class="w-100 h-100 rounded">
                  <apexchart type="bar" :options="options" :series="detailGraph.chartData" height="100%" @click="(event, chartContext, config) => {
                    $emit('emit-lineID', detailGraph)
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
            <div class="col-12 col-md-2 mr-2" v-if="overallData">
              <apexchart type="donut" :options="defaulOptionsOverall" :series="overallData" height="100%">
              </apexchart>
            </div>
            <div style="height: 300px" class="col-md-10 pt-2 pb-4 d-flex horizontal-scrollable">
              <div v-if="isLoading">
                <loading :active="isLoading" :can-cancel="true" :is-full-page="false" />
              </div>

              <div class="col-2 m-2" v-else v-for="detailGraph in getGraphs" :key="detailGraph.id">
                <div class="w-100 h-100 rounded">
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
  name: 'STWFindingGraph',
  data() {
    return {
      overallData: [],
      overallGraphData: [],
      defaulOptionsOverall: {
        chart: {
          type: 'donut',
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
        grid: {
          show: false,
        },
        title: {
          text: 'Summary Percentage',
        },
        plotOptions: {
          bar: {
            vertical: true,
          },
        },
        labels: ['Problem', 'Closed', 'Remain'],
        yaxis: {
          show: false,
          min: 0,
          max: 100,
        },
        tooltip: {
          y: {
            formatter: (value, { series, seriesIndex, dataPointIndex, w }) => {
              console.log(series, dataPointIndex, w)
              return `${this.overallGraphData[seriesIndex].count} Temuan`
            },
            title: {
              formatter: (seriesName) => {
                return `Total ${seriesName} :`
              },
            },
          },
          fixed: {
            enabled: true,
            offsetX: 100,
          },
        },
        dataLabels: {
          style: {
            fontSize: '20px',
          },
          background: {
            enabled: true,
            foreColor: '#000',
            padding: 4,
            borderRadius: 2,
            borderWidth: 1,
            borderColor: '#fff',
            opacity: 0.9,
            dropShadow: {
              enabled: false,
              top: 1,
              left: 1,
              blur: 1,
              color: '#000',
              opacity: 0.45
            }
          },
          dropShadow: {
            enabled: false,
            top: 1,
            left: 1,
            blur: 1,
            color: '#000',
            opacity: 0.45
          },
          formatter: function (val) {
            return `${Math.round(val)} %`
          },
        },
        legend: {
          show: true,
          position: 'bottom',
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
        dataLabels: {
          background: {
            enabled: true,
            foreColor: '#000',
            padding: 4,
            borderRadius: 2,
            borderWidth: 1,
            borderColor: '#fff',
            opacity: 0.9,
            dropShadow: {
              enabled: false,
              top: 1,
              left: 1,
              blur: 1,
              color: '#000',
              opacity: 0.45
            }
          },
          dropShadow: {
            enabled: false,
            top: 1,
            left: 1,
            blur: 1,
            color: '#000',
            opacity: 0.45
          },
        },
        legend: {
          show: false,
        },
        grid: {
          show: false,
        },
        plotOptions: {
          bar: {
            vertical: true,
          },
        },
        tooltip: {
          y: {
            formatter: (value, { series, seriesIndex, dataPointIndex, w }) => {
              console.log(series, dataPointIndex, w, seriesIndex)
              return `${value} Temuan`
            },
            title: {
              formatter: (seriesName) => {
                return `${seriesName} :`
              },
            },
          },
          fixed: {
            enabled: true,
            offsetX: 100,
          },
        },
        xaxis: {
          categories: ['problem', 'closed', 'remain'],
        },
        yaxis: {
          show: false,
        },
      },
    }
  },
  watch: {
    selectedLine: {
      immediate: true,
      async handler() {
        await this.getOverallGraph()
        await this.getGraph()
      }
    }
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    selectedMonth: {
      type: String,
      default: null
    },
    cond: {
      type: String,
      default: 'default'
    },
    selectedLineID: {
      type: String,
      default: null
    },
    selectedFilterStartDate: {
      type: String,
      default: ''
    },
    selectedFilterEndDate: {
      type: String,
      default: ''
    },
    selectedLine: {
      type: String,
      default: '-1'
    },
    selectedFilterShift: {
      type: String,
      default: '-1'
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

      if (currentSeriesIndex != -1) {
        currentDataPointIndex == 1 ? (cm_judg = true) : null

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
          `/stw/list-temuan?source_category=${source_category}&cm_judg=${cm_judg}&line_id=${this.selectedLineID?.line_id
            ? this.selectedLineID.line_id
            : this.selectedLine
          }`,
        )
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
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async addFilter() {
      await this.getGraph()
      await this.getOverallGraph()
      if (this.selectedLine == '-1') {
        this.$emit('emit-cond', 'default')
      } else if (this.selectedLine !== '-1') {
        this.$emit('emit-cond', 'detail')
      }
    },
    async getGraph() {
      this.$emit('emit-isLoading', true)

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
            this.$emit('emit-isLoading', false)
          }
        })
        .catch((err) => {
          console.log(err)
          this.$emit('emit-isLoading', false)
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
        .then(async (res) => {
          let mapDataOverall = await res.data.data.map(item => {
            return item.data[0]
          })
          this.overallData = mapDataOverall
          this.overallGraphData = res.data.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
  async mounted() {
    if (localStorage.getItem('line_id')) {
      this.$emit('emit-lineID', localStorage.getItem('line_id'))
      this.$emit('emit-line', localStorage.getItem('line_id'))
    } else {
      this.$emit('emit-lineID', -1)
      this.$emit('emit-line', -1)
    }
    await this.getLines()
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]

    this.$emit('emit-selectedMonth', `${year}-${month}`)
    this.$emit('emit-filterStartDate', `${year}-01-01`)
    this.$emit('emit-filterEndDate', `${year}-12-31`)
    await this.getGroup()
    await this.addFilter()
  },
  components: { Loading },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
