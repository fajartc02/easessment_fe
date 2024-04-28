<template>
  <div class="row mt-3 px-3">
    <div class="col">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="row">
            <div class="col">
              <h6>Achievements STW</h6>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <h2>{{ achievementsSTW.done }}/{{ achievementsSTW.total }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="row">
            <div class="col">
              <h6>Achievements 4S</h6>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <h2>{{ achievements4S.done }}/{{ achievements4S.total }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="row">
            <div class="col">
              <h6>Achievements OM</h6>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <h2>{{ achievementsOM.done }}/{{ achievementsOM.total }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CardStatusSchedules",
  data() {

  },
  props: {
    achievementsSTW: {
      type: Object,
      default: () => {
        return {
          total: 0,
          done: 0
        }
      }
    },
    achievements4S: {
      type: Object,
      default: () => {
        return {
          total: 0,
          done: 0
        }
      }
    },
    achievementsOM: {
      type: Object,
      default: () => {
        return {
          total: 0,
          done: 0
        }
      }
    }
  }
}
</script>
<style></style>
