<template>
  <apexchart type="area" :options="options" :series="series"></apexchart>
</template>

<script>
export default {
  name: '4SLineAreaChart',
  data() {
    return {
      options: {
        chart: {
          height: 350,
          type: 'area'
        },
        dataLabels: {
          enabled: false
        },
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        stroke: {
          curve: 'smooth'
        },
        yaxis: {
          title: {
            text: this.title || 'Time 4S'
          }
        },
      },
      series: [{
        name: 'Time 4S',
        data: [2664, 5308, 5308, 5308, 5308, 5308, 2664, 5308, 5308, 5308, 5308, 5308]
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
