<template>
  <div>
    <div class="card mb-3">
      <div class="card-header">
        <div class="row">
          <div class="col-2">
            <label>Start date</label>
            <input type="date" class="form-control" />
          </div>
          <div class="col-2">
            <label>End date</label>
            <input type="date" class="form-control" />
          </div>
          <div class="col-2">
            <label>Shop</label>
            <input type="date" class="form-control" />
          </div>
          <div class="col-2">
            <label>Line</label>
            <input type="date" class="form-control" />
          </div>
          <div class="col-2">
            <label>Shift</label>
            <input type="date" class="form-control" />
          </div>
          <div class="col-2 d-flex justify-content-center align-items-end">
            <button class="btn btn-info w-100 text-white">Search</button>
          </div>
        </div>
      </div>
      <div class="card-body px-4">
        <div class="row">
          <div class="col-md-2 mr-2">
            <apexchart
              type="bar"
              :options="options"
              :series="series"
              height="100%"
              onclick="alert(123)"
            ></apexchart>
          </div>
          <div
            style="height: 300px"
            class="col-md-10 pt-2 pb-4 d-flex horizontal-scrollable"
          >
            <div
              class="col-2 m-2"
              v-for="detail in detailData"
              :key="detail.id"
            >
              <div class="w-100 h-100 rounded chart-wrapper">
                <apexchart
                  type="bar"
                  :options="options"
                  :series="detail.chartData"
                  height="100%"
                ></apexchart>
              </div>
              <div class="text-center mt-1">{{ detail.line }}</div>
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
import { mapGetters } from 'vuex'

export default {
  name: 'Main Dashboard',
  data() {
    return {
      selectedMonth: null,
      selectedLine: '-1',
      options: {
        chart: {
          id: 'vuechart-example',
          type: 'bar',
          stacked: true,
          width: '100%',
          height: '100%',
          events: {
            click: function (chartContext) {
              // The last parameter config contains additional information like `seriesIndex` and `dataPointIndex` for cartesian charts
              console.log(chartContext)
            },
          },
        },
        plotOptions: {
          bar: {
            vertical: true,
          },
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
      detailData: [
        {
          id: 1,
          line: 'Low Pressure',
          chartData: [
            {
              data: [
                {
                  x: 'prob',
                  y: 6653,
                },
                {
                  x: 'close',
                  y: 5000,
                },
                {
                  x: 'remain',
                  y: 3500,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          line: 'Die Casting',
          chartData: [
            {
              data: [
                {
                  x: 'prob',
                  y: 6653,
                },
                {
                  x: 'close',
                  y: 5000,
                },
                {
                  x: 'remain',
                  y: 3500,
                },
              ],
            },
          ],
        },
        {
          id: 3,
          line: 'Cyl. Head',
          chartData: [
            {
              data: [
                {
                  x: 'prob',
                  y: 6653,
                },
                {
                  x: 'close',
                  y: 5000,
                },
                {
                  x: 'remain',
                  y: 3500,
                },
              ],
            },
          ],
        },
        {
          id: 4,
          line: 'Cyl. Block',
          chartData: [
            {
              data: [
                {
                  x: 'prob',
                  y: 6653,
                },
                {
                  x: 'close',
                  y: 5000,
                },
                {
                  x: 'remain',
                  y: 3500,
                },
              ],
            },
          ],
        },
        {
          id: 5,
          line: 'Crank Shaft',
          chartData: [
            {
              data: [
                {
                  x: 'prob',
                  y: 6653,
                },
                {
                  x: 'close',
                  y: 5000,
                },
                {
                  x: 'remain',
                  y: 3500,
                },
              ],
            },
          ],
        },
        {
          id: 6,
          line: 'Assyline',
          chartData: [
            {
              data: [
                {
                  x: 'prob',
                  y: 6653,
                },
                {
                  x: 'close',
                  y: 5000,
                },
                {
                  x: 'remain',
                  y: 3500,
                },
              ],
            },
          ],
        },
      ],
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
  components: {},
}
</script>
