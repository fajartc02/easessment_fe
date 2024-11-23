<template>
  <div class="container-fluid">
    <div class="card p-2">
      <div class="row">
        <div class="col-lg-6 col-12">
          <label class="form-label">Line</label>
          <VueMultiselect label="text" v-model="filter.line" :options="getLinesOpts || []" placeholder="Select Line" />
        </div>
        <div class="col-lg-6 col-12">
          <label class="form-label">Shift</label>
          <VueMultiselect label="text" v-model="filter.group" :options="getGroupsOpts || []"
            placeholder="Select Shift" />
        </div>
      </div>
    </div>
    <div class="mt-1">
      <div class="row">
        <div class="col-lg-6 col-12 p-1">
          <div class="card">
            <g4SLineAreaChart :title="'Sum of Time By Month'" />
          </div>
        </div>
        <div class="col-lg-6 col-12 p-1">
          <div class="card">
            <g4SColumnChart />
          </div>
        </div>

        <div class="col-lg-6 col-12 p-1">
          <div class="card">
            <g4SLineAreaChart :title="'Count of No Kanban By Month'" />
          </div>
        </div>
        <div class="col-lg-6 col-12 p-1">
          <div class="card">
            <g4SColumnChart />
          </div>
        </div>
        <div class="col-lg-6 col-12 p-1">
          <div class="card">
            <g4SLineAreaChart :title="'Total Item Check By Month'" />
          </div>
        </div>
        <div class="col-lg-6 col-12 p-1">
          <div class="card">
            <g4SColumnChart />
          </div>
        </div>
      </div>
    </div>
    <!-- bar chart -->
    <div class="mt-1">
      <div class="row">



      </div>
    </div>
  </div>
</template>
<script>
import { GET_GROUP } from '@/store/modules/group.module';
import { GET_LINES } from '@/store/modules/line.module';
import VueMultiselect from 'vue-multiselect'
import { mapGetters } from 'vuex';
import g4SLineAreaChart from '@/components/charts/4SLineAreaChart.vue';
import g4SColumnChart from '@/components/charts/4SColumnChart.vue';
export default {
  name: 'HistoryTime4s',
  data() {
    return {
      filter: {
        line: {
          id: "-1",
          text: 'All'
        },
        group: {
          id: "-1",
          text: 'All'
        },
      }
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts', 'getGroupsOpts']),
    getFilter() {
      return {
        line_id: this.filter.line.id,
        group_id: this.filter.group.id,
      }
    }
  },
  methods: {
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES).then((lines) => {
          console.log('lines: ', lines)
        })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getGroup() {
      try {
        this.$store.dispatch(GET_GROUP)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
  },
  components: { VueMultiselect, g4SLineAreaChart, g4SColumnChart },
  mounted() {
    this.getLines()
    this.getGroup()
  },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
