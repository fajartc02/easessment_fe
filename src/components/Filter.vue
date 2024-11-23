<template>
  <div>
    <div v-if="filterType == 'default'" class="card-header">
      <div class="row">
        <div class="col">
          <label>Start date</label>
          <input type="date" class="form-control" />
        </div>
        <div class="col">
          <label>End date</label>
          <input type="date" class="form-control" />
        </div>
        <div class="col">
          <label>Line</label>
          <VueMultiselect v-model="selectedLineData" :options="lineData" placeholder="" @select="addFilter('line')"
            :custom-label="customLineFilterOptions">
          </VueMultiselect>
        </div>
        <div class="col">
          <label>Shift</label>
          <select class="form-select" aria-label="Default select example">
            <option selected disabled>Select Shift</option>
            <option value="1">RED</option>
            <option value="2">WHITE</option>
          </select>
        </div>
      </div>
    </div>
    <div v-if="filterType == 'stw-dashboard'" class="card-header">
      <div class="row">
        <div class="col">
          <label>Start date</label>
          <input type="date" class="form-control" @change="addFilter('stwDashboard')" />
        </div>
        <div class="col">
          <label>End date</label>
          <input type="date" class="form-control" @change="addFilter('endDate')" />
        </div>
        <div class="col">
          <label>Line</label>
          <VueMultiselect v-model="selectedLineData" :options="lineData" placeholder="" @select="addFilter('line')"
            :custom-label="customLineFilterOptions">
          </VueMultiselect>
        </div>
      </div>
    </div>
    <div v-if="filterType == 'list-temuan'" class="card-header">
      <div class="row">
        <div class="col">
          <label>Start date</label>
          <input type="date" class="form-control" />
        </div>
        <div class="col">
          <label>End date</label>
          <input type="date" class="form-control" />
        </div>
        <div class="col">
          <label>Line</label>
          <VueMultiselect v-model="selectedLineData" :options="lineData" placeholder="" @select="addFilter('line')"
            :custom-label="customLineFilterOptions">
          </VueMultiselect>
        </div>
        <div class="col">
          <label>Category</label>
          <select class="form-select" id="">
            <option selected>All</option>
            <option value="H">Henkaten</option>
            <option value="MV">Member Voice</option>
            <option value="Obs">Observation</option>
            <option value="FT">Focus theme</option>
          </select>
        </div>
        <div class="col">
          <label>Status</label>
          <select class="form-select" id="">
            <option>All</option>
            <option value="true">Sudah</option>
            <option value="false">Belum</option>
          </select>
        </div>
      </div>
    </div>
    <div v-if="
      filterType == 'member-voice' ||
      filterType == 'focus-theme' ||
      filterType == 'henkaten'
    " class="card-header">
      <div class="row">
        <div class="col">
          <label>Start date</label>
          <input type="date" class="form-control" />
        </div>
        <div class="col">
          <label>End date</label>
          <input type="date" class="form-control" />
        </div>
        <div class="col">
          <label>Line</label>
          <VueMultiselect v-model="selectedLineData" :options="lineData" placeholder="" @select="addFilter('line')"
            :custom-label="customLineFilterOptions">
          </VueMultiselect>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import moment from 'moment'
import { GET_LINES } from '@/store/modules/line.module'
import { mapGetters } from 'vuex'
import VueMultiselect from 'vue-multiselect'

export default {
  name: 'Filter',
  data() {
    return {
      selectedMonth: null,
      selectedLine: '-1',
      lineData: [],
      selectedLineData: null,
    }
  },
  props: {
    filterType: String,
  },
  computed: {
    ...mapGetters(['getLinesOpts']),
  },
  methods: {
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES).then((res) => {
          if (res) {
            this.mapLinesData()
          }
        })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    mapLinesData() {
      this.getLinesOpts?.map((item) => {
        this.lineData.push({ line_id: item.id, line_name: item.text })
      })
    },
    addFilter(filterFrom) {
      console.log(filterFrom)
      this.$router.push(
        `${this.$route.path}?line=${this.selectedLineData.line_id} `,
      )
    },
    customLineFilterOptions({ line_name }) {
      return `${line_name}`
    },
  },
  async mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    this.selectedLine = localStorage.getItem('line_id')
    await this.getLines()
  },
  components: { VueMultiselect },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
