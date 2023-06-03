<template>
    <div>
      <div class="row">
          <div class="col-6">
              <CInputGroup class="mb-3">
                  <CInputGroupText>Line</CInputGroupText>
                  <Select2 v-model="selectedLine" class="form-control" :options="lineOpts" @change="myChangeEvent($event)" @select="mySelectEvent($event)" />
              </CInputGroup>
          </div>
          <div class="col-6">
              <CInputGroup class="mb-3">
                  <CInputGroupText>Month</CInputGroupText>
                  <input v-model="selectedMonth" class="form-control" type="month">
              </CInputGroup>
          </div>
      </div>
      <CardSummary :selectedLine="selectedLine" :selectedMonth="selectedMonth"/>
      <TableSchedule :selectedLine="selectedLine" :selectedMonth="selectedMonth"/>
    </div>
</template>

<script>
import moment from 'moment'
import TableSchedule from '@/components/table/TableSchedule.vue'
import CardSummary from '@/components/card/CardSummary.vue'
import ApiService from '@/store/api.service'

export default {
  name: 'Dashboard',
  data() {
    return {
      selectedMonth: null,
      selectedLine: "0",
      lineOpts: [{id: "0", text: 'all'}]
    }
  },
  methods: {
    myChangeEvent(val){
      console.log(val);
    },
    mySelectEvent({id, text}){
      console.log({id, text})
    },
    async getLinesOpts() {
      ApiService.setHeader()
      const lines = await ApiService.get("master/lines", "opts")
      this.lineOpts.push(...lines.data.data)
    }
  },
  mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    this.getLinesOpts()
  },
  components: {
    TableSchedule,
    CardSummary
  },
}
</script>
