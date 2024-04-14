<template>
  <div>
    <div class="card mb-3">
      <!-- filter -->
      <div class="card-header mb-3">
        <div class="row">
          <div class="col">
            <label>Start date</label>
            <input type="date" class="form-control" v-model="selectedFilterStartDate" @change="addFilter()" />
          </div>
          <div class="col">
            <label>End date</label>
            <input type="date" class="form-control" v-model="selectedFilterEndDate" @change="addFilter()" />
          </div>
          <div class="col">
            <label>Line</label>
            <select class="form-select" v-model="selectedLine" @change="addFilter('line')">
              <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id"
                :selected="line.id == this.selectedLineID">
                {{ line.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Shift</label>
            <select class="form-select" v-model="selectedFilterShift" @change="addFilter('shift')">
              <option v-for="(group, index) in getGroupsOpts" :key="index" :value="group.id">
                {{ group.text }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <!-- end filter -->
      <STWFindingGraph :selectedLineID="selectedLineID" @emit-lineID="(payload) => { selectedLineID = payload }"
        :selectedFilterStartDate="selectedFilterStartDate"
        @emit-filterStartDate="(payload) => { selectedFilterStartDate = payload }"
        :selectedFilterEndDate="selectedFilterEndDate"
        @emit-filterEndDate="(payload) => { selectedFilterEndDate = payload }" :selectedLine="selectedLine"
        @emit-line="(payload) => { selectedLine = payload }" :selectedFilterShift="selectedFilterShift"
        :selectedMonth="selectedMonth" @emit-selectedMonth="(payload) => { selectedMonth = payload }" :cond="cond"
        @emit-cond="(payload) => { cond = payload }" :isLoading="isLoading"
        @emit-isLoading="(payload) => { isLoading = payload }" />

      <SFindingGraph :selectedLineID="selectedLineID" @emit-lineID="(payload) => { selectedLineID = payload }"
        :selectedFilterStartDate="selectedFilterStartDate"
        @emit-filterStartDate="(payload) => { selectedFilterStartDate = payload }"
        :selectedFilterEndDate="selectedFilterEndDate"
        @emit-filterEndDate="(payload) => { selectedFilterEndDate = payload }" :selectedLine="selectedLine"
        @emit-line="(payload) => { selectedLine = payload }" :selectedFilterShift="selectedFilterShift"
        :selectedMonth="selectedMonth" @emit-selectedMonth="(payload) => { selectedMonth = payload }" :cond="cond"
        @emit-cond="(payload) => { cond = payload }" :isLoading="isLoading"
        @emit-isLoading="(payload) => { isLoading = payload }" />
    </div>
  </div>
</template>

<script>
// import moment from 'moment'
import { GET_LINES } from '@/store/modules/line.module'
// import { GET_GRAPH } from '@/store/modules/graph.module'
import { GET_GROUP } from '@/store/modules/group.module'
import { mapGetters } from 'vuex'

// import ApiService from '@/store/api.service'

import STWFindingGraph from '@/components/graph/STWFindingGraph.vue'
import SFindingGraph from '@/components/graph/4SFindingGraph.vue'


export default {
  name: 'Main Dashboard',
  data() {
    return {
      selectedMonth: null,
      lineData: [],
      cond: 'default',
      isLoading: false,
      selectedLineID: null,
      selectedFilterStartDate: '',
      selectedFilterEndDate: '',
      selectedLine: '-1',
      selectedFilterShift: '-1',
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts', 'getGraphs', 'getGroupsOpts']),
  },
  methods: {

    async getGroup() {
      try {
        this.$store.dispatch(GET_GROUP)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async addFilter() {
      // await this.getGraph()
      // await this.getOverallGraph()
      if (this.selectedLine == '-1') {
        this.cond = 'default'
      } else if (this.selectedLine !== '-1') {
        this.cond = 'detail'
      }
    },
  },
  async mounted() {
    if (localStorage.getItem('line_id')) {
      this.selectedLineID = localStorage.getItem('line_id')
      this.selectedLine = localStorage.getItem('line_id')
    } else {
      this.selectedLineID = -1
      this.selectedLine = -1
    }
    await this.getLines()
    // const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    // const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    // this.selectedMonth = `${year}-${month}`

    // this.selectedFilterStartDate = `${year}-01-01`
    // this.selectedFilterEndDate = `${year}-12-31`
    await this.getGroup()
    // await this.addFilter()
    // await this.getGraph()
    // await this.getOverallGraph()
  },
  components: { STWFindingGraph, SFindingGraph },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
