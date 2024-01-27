<template>
  <div>
    <div class="card mb-3">
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
            <input type="date" class="form-control" />
          </div>
          <div class="col-2">
            <label>Shift</label>
            <input type="date" class="form-control" />
          </div>
          <div class="col-2 d-flex justify-content-center align-items-end">
            <button class="btn btn-info w-100 text-white">Search</button>
          </div>
        </div>
      </div>
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5 class="">Schedule Observation</h5>
        <button class="btn btn-info">Add schedule</button>
      </div>
      <div class="card-body">
        <TableSchedule
          :selectedLine="selectedLine"
          :selectedMonth="selectedMonth"
        />
      </div>
    </div>
  </div>
</template>
  
  <script>
import moment from 'moment'
import TableSchedule from '@/components/table/TableSchedule.vue'
import { GET_LINES } from '@/store/modules/line.module'
import { mapGetters } from 'vuex'

export default {
  name: 'STW Dashboard',
  data() {
    return {
      selectedMonth: null,
      selectedLine: '-1',
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts']),
  },
  methods: {
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
  },
  mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    this.selectedLine = localStorage.getItem('line_id')
    this.getLines()
  },
  components: {
    TableSchedule,
  },
}
</script>
  