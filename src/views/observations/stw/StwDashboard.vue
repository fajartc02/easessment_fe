<template>
  <div>
    <div class="card mb-3">
      <StwFilter />
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
import StwFilter from '@/components/StwFilter.vue'

export default {
  name: 'STW Dashboard',
  data() {
    return {
      selectedMonth: null,
      selectedLine: null,
      testWatch: this.$route.params.line,
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
    this.selectedLine = this.$route.params.line
    this.getLines()
    // alert(this.testWatch)
    // this.selectedLine = localStorage.getItem('line_id')
  },
  watch: {
    testWatch() {
      // alert('something changed!')
      // do something with newValue and oldValue.
      // this.selectedLine = this.$route.params.line
    },
  },
  updated() {
    console.log(this.$route.query.line)
  },
  components: {
    TableSchedule,
    StwFilter,
  },
}
</script>
  