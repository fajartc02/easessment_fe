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
    <div v-if="isLoading" class="d-flex justify-content-center align-items-center mt-4 card p-5" style="min-height: 350px;">
      <CSpinner color="primary" />
      <span class="ms-2 text-muted fw-bold">Loading historical 4S charts...</span>
    </div>
    <div v-else class="mt-1">
      <div class="row">
        <div class="col-lg-6 col-12 p-1">
          <div class="card">
            <g4SLineAreaChart :title="'Sum of Time By Month'" :series="graphsData.sum_of_time.line" />
          </div>
        </div>
        <div class="col-lg-6 col-12 p-1">
          <div class="card">
            <g4SColumnChart :title="'Time Breakdown'" :yTitle="'Total Time (m)'" :series="graphsData.sum_of_time.column" />
          </div>
        </div>

        <div class="col-lg-6 col-12 p-1">
          <div class="card">
            <g4SLineAreaChart :title="'Count of No Kanban By Month'" :series="graphsData.count_of_kanban.line" />
          </div>
        </div>
        <div class="col-lg-6 col-12 p-1">
          <div class="card">
            <g4SColumnChart :title="'Kanban Breakdown'" :yTitle="'Total Kanban'" :series="graphsData.count_of_kanban.column" />
          </div>
        </div>
        <div class="col-lg-6 col-12 p-1">
          <div class="card">
            <g4SLineAreaChart :title="'Total Item Check By Month'" :series="graphsData.total_item_check.line" />
          </div>
        </div>
        <div class="col-lg-6 col-12 p-1">
          <div class="card">
            <g4SColumnChart :title="'Item Check Breakdown'" :yTitle="'Total Checks'" :series="graphsData.total_item_check.column" />
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
import VueMultiselect from 'vue-multiselect';
import { mapGetters } from 'vuex';
import ApiService from '@/store/api.service';
import g4SLineAreaChart from '@/components/charts/4SLineAreaChart.vue';
import g4SColumnChart from '@/components/charts/4SColumnChart.vue';

export default {
  name: 'HistoryTime4s',
  data() {
    return {
      isLoading: true,
      filter: {
        line: {
          id: "-1",
          text: 'All'
        },
        group: {
          id: "-1",
          text: 'All'
        },
      },
      graphsData: {
        sum_of_time: {
          line: [],
          column: []
        },
        count_of_kanban: {
          line: [],
          column: []
        },
        total_item_check: {
          line: [],
          column: []
        }
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
  watch: {
    getFilter: {
      handler: 'fetchHistoricalData',
      deep: true
    }
  },
  methods: {
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES).then((lines) => {
          console.log('lines: ', lines)
        })
      } catch (error) {
        if (error.response && error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getGroup() {
      try {
        this.$store.dispatch(GET_GROUP)
      } catch (error) {
        if (error.response && error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async fetchHistoricalData() {
      try {
        this.isLoading = true;
        ApiService.setHeader();
        const line_id = this.filter.line.id;
        const group_id = this.filter.group.id;
        
        const params = {};
        if (line_id && line_id !== "-1") {
          params.line_id = line_id;
        }
        if (group_id && group_id !== "-1") {
          params.group_id = group_id;
        }

        const res = await ApiService.query("operational/4s/historical-time", params);
        if (res && res.data && res.data.status === 200) {
          this.graphsData = res.data.data;
        }
      } catch (error) {
        console.error("Error fetching historical 4S time data:", error);
      } finally {
        this.isLoading = false;
      }
    }
  },
  components: { VueMultiselect, g4SLineAreaChart, g4SColumnChart },
  mounted() {
    this.getLines()
    this.getGroup()
    this.fetchHistoricalData()
  },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
