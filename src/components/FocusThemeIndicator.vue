<template>
  <div class="d-flex">
    <div v-for="n in 4" :key="n" class="circle-fill mx-1"></div>
  </div>
</template>

<script>
export default {
  name: 'Focus Theme Indicator',
  data() {
    return {
      selectedMonth: null,
      addHenkatenModal: false,
      picData: [],
      selectedPIC: null,
    }
  },
  props: { total: Number },
}
</script>

<style>
</style>