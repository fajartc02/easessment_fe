<template>
  <table class="table table-stripped">
    <thead>
      <tr class="text-center">
        <th>No</th>
        <th>Line</th>
        <th>Zone</th>
        <th>Area</th>
        <th>Ilustrations</th>
        <th>Kanban No</th>
        <th>Frequency</th>
        <th colspan="3">Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="getKanbansWithStatusModal?.length > 0">
        <tr v-for="(kanban, i) in getKanbansWithStatusModal" :key="i">
          <td>
            {{ kanban.no }}
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
        <tr>
          <td v-for="image in kanban.kanban_imgs" :key="image.index">
            <img :src="image.img" width="100">
          </td>
        </tr>

        </td>
        <td>
          {{ kanban.kanban_no }}
        </td>
        <td>
          {{ kanban.freq_nm }}
        </td>
        <td class="text-center">
          <button class="btn btn-sm btn-primary" @click="() => { kanban.status = true }">Item
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
          <button class="btn btn-sm btn-warning" @click="editKanban(kanban.kanban_id)">Edit</button>
        </td>
        <td class="text-center">
          <button class="btn btn-sm btn-danger">Delete</button>
        </td>
        </tr>
      </template>
      <template v-else-if="isLoading && !getKanbansWithStatusModal">
        <tr>
          <td class="text-center" colspan="9">
            <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
            Loading...
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
      setId: null,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['getKanbans', 'getKanbansWithStatusModal']),
  },
  methods: {
    async getKanban() {
      try {
        this.isLoading = true
        await this.$store.dispatch(GET_KANBANS, this.filter)
        this.isLoading = false
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
    filter: {
      type: Object,
    },
  },
  components: {
    NoDataTable,
    TableKanbanItemCheck4s
  },
  watch: {
    filter: {
      handler() {
        this.getKanban()
      },
      deep: true
    },
    selectedZone() {
      this.getKanban()
    },
    getKanbans() {
      this.kanbans = this.getKanbansWithStatusModal
    }
  },
  mounted() {
    this.getKanban()
  }
}
</script>
