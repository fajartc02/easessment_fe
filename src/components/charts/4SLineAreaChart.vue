<template>
  <apexchart type="area" :options="options" :series="series"></apexchart>
</template>

<script>
export default {
  name: '4SLineAreaChart',
  props: {
    title: {
      type: String,
      required: true
    },
    series: {
      type: Array,
      default: () => [
        {
          name: 'Time 4S',
          data: [2664, 5308, 5308, 5308, 5308, 5308, 2664, 5308, 5308, 5308, 5308, 5308]
        }
      ]
    },
    labels: {
      type: Array,
      default: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  },
  computed: {
    options() {
      return {
        chart: {
          height: 350,
          type: 'area'
        },
        dataLabels: {
          enabled: true
        },
        labels: this.labels,
        stroke: {
          curve: 'smooth'
        },
        yaxis: {
          title: {
            text: this.title || 'Time 4S'
          }
        },
      }
    }
  }
}
</script>
