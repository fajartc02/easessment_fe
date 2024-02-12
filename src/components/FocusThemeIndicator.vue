<template>
  <div class="d-flex">
    <div v-for="n in total" :key="n" class="circle-fill mx-1"></div>
    <div v-for="n in 4 - total" :key="n" class="fill-overlay mx-1"></div>
  </div>
</template>

<script>
export default {
  name: 'Focus Theme Indicator',
  data() {
    return {}
  },
  props: { total: Number },
}
</script>

<style>
</style>