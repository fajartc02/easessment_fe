<template>
  <table class="table table-stripped">
    <thead>
      <tr class="text-center">
        <th>No</th>
        <th>Line</th>
        <th>Zone</th>
        <th>Area</th>
        <th>Kanban No</th>
        <th>Frequency</th>
        <th colspan="3">Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="kanbans?.length > 0">
        <tr v-for="(kanban, i) in kanbans" :key="i">
          <td>
            {{ i + 1 }}
          </td>
          <td>
            {{ kanban.line_nm }}
          </td>
          <td>
            {{ kanban.zone_nm }}
          </td>
          <td>
            {{ kanban.area_nm }}
          </td>
          <td>
            {{ kanban.kanban_no }}
          </td>
          <td>
            {{ kanban.freq_nm }}
          </td>
          <td class="text-center">
            <button class="btn btn-primary" @click="() => { kanban.status = true }">Item
              Check</button>
            <CModal :visible="kanban.status" @close="() => { kanban.status = false }">
              <CModalHeader>
                <CModalTitle>Details Itemcheck Kanban</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <TableKanbanItemCheck4s :kanban_id="kanban.kanban_id" />
              </CModalBody>
            </CModal>
          </td>

          <td class="text-center">
            <button class="btn btn-warning" @click="editKanban(kanban.kanban_id)">Edit</button>
          </td>
          <td class="text-center">
            <button class="btn btn-danger">Delete</button>
          </td>
        </tr>
      </template>
      <template v-else>
        <NoDataTable :colspan="9" />
      </template>
    </tbody>
  </table>
</template>


<script>
import KANBANS_MOCK from '@/mocks/kanban.mock'
import NoDataTable from './NoDataTable.vue'
import TableKanbanItemCheck4s from './TableKanbanItemCheck4s.vue'
import { GET_KANBANS } from '@/store/modules/kanban.module'
import { mapGetters } from 'vuex'

export default {
  name: "TableKanban4s",
  data() {
    return {
      kanbans: [] || KANBANS_MOCK,
      visibleLiveDemo: false,
      setId: null
    }
  },
  computed: {
    ...mapGetters(['getKanbans', 'getKanbansWithStatusModal']),
  },
  methods: {
    async getKanban() {
      try {
        this.$store.dispatch(GET_KANBANS, { line_id: this.selectedLine, zone_id: this.selectedZone })
      } catch (error) {
        console.log(error)
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    async editKanban(kanban_id) {
      try {
        console.log(kanban_id);
      } catch (error) {
        console.log(error)
        if (error.response.status == 401) this.$router.push('/login')
      }
    }
  },
  props: {
    selectedLine: {
      type: String,
      default: -1
    },
    selectedZone: {
      type: String,
      default: -1
    }
  },
  components: {
    NoDataTable,
    TableKanbanItemCheck4s
  },
  watch: {
    selectedLine() {
      this.getKanban()
    },
    selectedZone() {
      this.getKanban()
    },
    getKanbans() {
      console.log(this.getKanbansWithStatusModal);
      this.kanbans = this.getKanbansWithStatusModal
    }
  },
  mounted() {
    this.getKanban()
  }
}
</script>
