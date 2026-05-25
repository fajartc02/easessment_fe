<template>
  <apexchart type="bar" :options="options" :series="series"></apexchart>
</template>

<script>
export default {
  name: '4SColumnChart',
  props: {
    title: {
      type: String,
      default: ''
    },
    yTitle: {
      type: String,
      default: 'Total'
    },
    series: {
      type: Array,
      default: () => [
        {
          name: 'Daily',
          data: [44, 55, 57, 56, 61, 58, 44, 55, 57, 56, 61, 58]
        },
        {
          name: 'Weekly',
          data: [44, 55, 57, 56, 61, 58, 44, 55, 57, 56, 61, 58]
        },
        {
          name: 'Monthly',
          data: [44, 55, 57, 56, 61, 58, 44, 55, 57, 56, 61, 58]
        }
      ]
    },
    categories: {
      type: Array,
      default: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  },
  computed: {
    options() {
      return {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded',
            dataLabels: {
              position: 'top', // place data labels on top of bars
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ["#304758"]
          }
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: this.categories,
        },
        yaxis: {
          title: {
            text: this.yTitle
          }
        },
        fill: {
          opacity: 1
        },
      }
    }
  }
}
</script>
