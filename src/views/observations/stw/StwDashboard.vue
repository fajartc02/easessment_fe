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
      <div class="card-body px-4">
        <div class="card-header">
          <h5>Monthly Schedule</h5>
        </div>
        <div class="card-body">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
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
  components: {},
}
</script>
  