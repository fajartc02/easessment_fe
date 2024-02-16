<template>
  <div>
    <div class="card mb-3">
      <div class="card-header">
        <div class="row">
          <div class="col">
            <label>Start date</label>
            <input
              type="date"
              class="form-control"
              v-model="selectedFilterStartDate"
              @change="addFilter()"
            />
          </div>
          <div class="col">
            <label>End date</label>
            <input
              type="date"
              class="form-control"
              v-model="selectedFilterEndDate"
              @change="addFilter()"
            />
          </div>
          <div class="col">
            <label>Line</label>
            <VueMultiselect
              v-model="selectedLine"
              :options="lineData"
              @select="addFilter('line')"
              :custom-label="customLineFilterOptions"
            >
            </VueMultiselect>
          </div>
          <div class="col">
            <label>Shift</label>
            <select class="form-select" @select="addFilter('shift')">
              <option selected disabled>Select Shift</option>
              <option value="1">RED</option>
              <option value="2">WHITE</option>
            </select>
          </div>
        </div>
      </div>
      <div class="card-body px-4">
        <div v-if="cond == 1">
          <div class="row">
            <div class="col-md-2 mr-2">
              <apexchart
                type="bar"
                :options="defaultOptions"
                :series="series"
                height="100%"
              ></apexchart>
            </div>
            <div
              style="height: 300px"
              class="col-md-10 pt-2 pb-4 d-flex horizontal-scrollable"
            >
              <div v-if="isLoading">
                <loading
                  v-model:active="isLoading"
                  :can-cancel="true"
                  :is-full-page="false"
                  :on-cancel="onCancel"
                />
              </div>

              <div
                class="col-2 m-2"
                v-else
                v-for="detailGraph in getGraphs"
                :key="detailGraph.id"
              >
                <div class="w-100 h-100 rounded chart-wrapper">
                  <apexchart
                    type="bar"
                    :options="options"
                    :series="detailGraph.chartData"
                    height="100%"
                  ></apexchart>
                </div>
                <div class="text-center mt-1">{{ detailGraph.line_nm }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="row">
            <div
              style="height: 300px"
              class="col-md-12 pt-2 pb-4 d-flex horizontal-scrollable"
            >
              <div v-if="isLoading">
                <loading
                  v-model:active="isLoading"
                  :can-cancel="true"
                  :is-full-page="false"
                  :on-cancel="onCancel"
                />
              </div>

              <div
                class="col-2 m-2"
                v-else
                v-for="detailGraph in getGraphs"
                :key="detailGraph.id"
              >
                <div class="w-100 h-100 rounded chart-wrapper">
                  <apexchart
                    type="bar"
                    :options="options"
                    :series="detailGraph.chartData"
                    height="100%"
                  ></apexchart>
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
import { mapGetters } from 'vuex'
import Loading from 'vue-loading-overlay'
import VueMultiselect from 'vue-multiselect'

export default {
  name: 'Main Dashboard',
  data() {
    return {
      selectedMonth: null,
      lineData: [],
      cond: 1,
      isLoading: false,
      selectedFilterStartDate: '2024-02-01',
      selectedFilterEndDate: '2024-02-29',
      selectedLine: '-1',
      selectedFilterShift: null,
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
            dataPointSelection: () => {
              console.log(123)
            },
          },
        },
        plotOptions: {
          bar: {
            vertical: true,
            borderRadius: 10,
          },
        },
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
          events: {
            dataPointSelection: (event, chartContext, config) => {
              console.log(event, chartContext, config)
            },
          },
        },
        legend: {
          show: false,
        },
        plotOptions: {
          bar: {
            vertical: true,
            borderRadius: 10,
          },
        },
        xaxis: {
          categories: ['Prob', 'Close', 'Remain'],
        },
      },
      series: [
        {
          data: [
            {
              x: 'Overal Precentage',
              y: 6653,
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts', 'getGraphs']),
  },
  methods: {
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES).then((res) => {
          if (res) {
            this.mapLinesData()
          }
        })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    mapLinesData() {
      this.getLinesOpts?.map((item) => {
        this.lineData.push({ line_id: item.id, line_name: item.text })
      })
    },
    customLineFilterOptions({ line_name }) {
      return `${line_name}`
    },
    addFilter() {
      this.getGraph()
      this.cond = 2
    },
    async getGraph() {
      this.isLoading = true

      let objQuery = {
        start_date: this.selectedFilterStartDate,
        end_date: this.selectedFilterEndDate,
        line_id: this.selectedLine.line_id,
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
  },
  async mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    await this.getLines()
    await this.getGraph()
  },
  components: { Loading, VueMultiselect },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
