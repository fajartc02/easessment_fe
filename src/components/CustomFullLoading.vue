<template>
  <div v-if="show" class="position-absolute top-0 bottom-0 left-0 right-0 w-100 h-100 overlay"
    style="background-color: rgba(255,255,255,0.7);">
    <div class="d-flex justify-content-center align-items-center h-100">
      <CSpinner aria-hidden="true" />
    </div>
  </div>
</template>
<script>
export default {
  name: "CustomFullLoading",
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {

  },
  mounted() {

  },
  computed: {

  },
  watch: {

  },
  methods: {

  }
}
</script>


<style scoped>
.overlay {
  background-color: azure;
  opacity: 0.7;
  width: 100%;
  height: 100%;
  z-index: 10;
}
</style>
