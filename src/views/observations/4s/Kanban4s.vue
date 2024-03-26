<template>
  <div class="card">
    <div class="card-header">
      <div class="row">
        <div class="col">
          <label>Line</label>
          <select class="form-select" v-model="filter.selectedLine" @change="changesLine">
            <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
              {{ line.text }}
            </option>
          </select>
        </div>
        <div class="col">
          <label>Zone</label>
          <select class="form-select" v-model="filter.selectedZone" :disabled="filter.selectedLine == -1">
            <option v-for="(zone, index) in getZoneOpts" :key="index" :value="zone.id">
              {{ zone.text }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="card-body">
      <TableKanban4s :selectedLine="filter.selectedLine" :selectedZone="filter.selectedZone" />
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_ZONES } from '@/store/modules/zone.module'
import TableKanban4s from '@/components/table/TableKanban4s.vue'

export default {
  name: 'Kanban4s',
  data() {
    return {
      filter: {
        selectedLine: -1,
        selectedZone: -1
      }
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts', 'getZoneOpts'])
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
    changesLine() {
      if (this.filter.selectedLine != -1) {
        this.getZones()
      } else {
        this.filter.selectedZone = -1
      }
    },
    async getZones() {
      try {
        this.$store.dispatch(GET_ZONES, { line_id: this.filter.selectedLine })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
  },
  async mounted() {
    await this.getLines();
    await this.getZones()
  },
  components: {
    TableKanban4s
  }
}
</script>
