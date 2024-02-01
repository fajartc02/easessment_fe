<template>
  <div class="row">
    <div
      style="height: 300px"
      class="col-md-12 pt-2 pb-4 d-flex horizontal-scrollable"
    >
      <div class="col-2 m-2" v-for="detail in detailData" :key="detail.id">
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
</template>
    
  <script>
export default {
  name: 'MainDashboardChartDetail',
  data() {
    return {
      defaultOptions: {
        chart: {
          type: 'bar',
          stacked: true,
          width: '100%',
          height: '100%',
          toolbar: {
            show: false,
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
      detailData: [
        {
          id: 1,
          line: 'Apr 23',
          chartData: [
            {
              name: 'Member Voice',
              data: [44, 55, 41],
            },
            {
              name: 'Observation',
              data: [44, 55, 41],
            },
            {
              name: 'Fokus Tema',
              data: [44, 55, 41],
            },
            {
              name: 'Henkaten',
              data: [44, 55, 41],
            },
          ],
        },
      ],
    }
  },
}
</script>
    