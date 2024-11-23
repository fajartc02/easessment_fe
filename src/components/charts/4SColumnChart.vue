<template>
  <apexchart type="bar" :options="options" :series="series"></apexchart>
</template>

<script>
export default {
  name: '4SColumnChart',
  data() {
    return {
      options: {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        yaxis: {
          title: {
            text: 'Total Time'
          }
        },
        fill: {
          opacity: 1
        },
      },
      series: [{
        name: 'Daily',
        data: [44, 55, 57, 56, 61, 58, 44, 55, 57, 56, 61, 58]
      }, {
        name: 'Weekly',
        data: [44, 55, 57, 56, 61, 58, 44, 55, 57, 56, 61, 58]
      },
      {
        name: 'Monthly',
        data: [44, 55, 57, 56, 61, 58, 44, 55, 57, 56, 61, 58]
      }],
    }
  },
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
