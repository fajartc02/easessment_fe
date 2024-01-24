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
      <div class="card-body">
        <div class="row">
          <div class="col-2">1</div>
          <div class="col-6">2</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

import { GET_LINES } from '@/store/modules/line.module'
import { mapGetters } from 'vuex'

export default {
  name: 'Main Dashboard',
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
  components: {},
}
</script>
