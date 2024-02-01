<template>
  <div>
    <div class="card-header">
      <div class="row">
        <div class="col-2">
          <label>Start date</label>
          <input type="date" class="form-control" />
        </div>
        <div class="col-2">
          <label>End date</label>
          <input type="date" class="form-control" />
        </div>
        <div class="col-2">
          <label>Shop</label>
          <input type="date" class="form-control" />
        </div>
        <div class="col-2">
          <label>Line</label>
          <VueMultiselect
            v-model="selectedLineData"
            :options="lineData"
            placeholder=""
          >
          </VueMultiselect>
        </div>
        <div class="col-2">
          <label>Shift</label>
          <select class="form-select" aria-label="Default select example">
            <option selected>Select Shift</option>
            <option value="1">RED</option>
            <option value="2">WHITE</option>
          </select>
        </div>
        <div class="col-2 d-flex justify-content-center align-items-end">
          <button class="btn btn-info w-100 text-white">Search</button>
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
  name: 'STW Filter',
  data() {
    return {
      selectedMonth: null,
      selectedLine: '-1',
      lineData: [],
      selectedLineData: null,
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts']),
  },
  methods: {
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
        if (this.getLinesOpts) this.mapLinesData()
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    mapLinesData() {
      this.getLinesOpts?.map((item) => {
        this.lineData.push(item.text)
      })
    },
  },
  mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    this.selectedLine = localStorage.getItem('line_id')
    this.getLines()
  },
  components: { VueMultiselect },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
    