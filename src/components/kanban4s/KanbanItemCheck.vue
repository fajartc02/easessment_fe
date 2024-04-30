<template>
  <div class="card" v-if="getKanbanDetail && !isLoading">
    <div class="card-body p-0">
      <div class="row">
        <div class="col">
          <table class="table table-bordered">
            <thead class="text-light bg-dark">
              <tr>
                <th colspan="3">
                  4S Kanban {{ getKanbanDetail.line_nm }} PRODUCTION
                </th>
                <th>
                  {{ getKanbanDetail.freq_nm }}
                </th>
              </tr>
              <tr>
                <th>
                  No Kanban
                </th>
                <th>
                  Area Check
                </th>
                <th>
                  Waktu 4S (min)
                </th>
                <th>
                  Zone
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ getKanbanDetail.kanban_no }}</td>
                <td>{{ getKanbanDetail.area_nm }}</td>
                <td>{{ totalItemCheckTime }}</td>
                <td>{{ getKanbanDetail.zone_nm }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <table class="table table-bordered">
            <thead class="text-light bg-dark">
              <tr>
                <th>No</th>
                <th>Itemcheck</th>
                <th>Method</th>
                <th>Control Point</th>
                <th>Standard Time</th>
                <th>Ilustrations</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="getItemchecks">
                <tr v-for="itemcheck in getItemchecks" :key="itemcheck.item_check_kanban_id">
                  <td>{{ itemcheck.no }}</td>
                  <td>{{ itemcheck.item_check_nm }}</td>
                  <td>{{ itemcheck.method }}</td>
                  <td>{{ itemcheck.control_point }}</td>
                  <td>{{ +itemcheck.standart_time }}</td>
                  <td>
                    <div class="row" v-if="itemcheck.ilustration_imgs">
                      <div v-for="img in itemcheck.ilustration_imgs" class="col" :key="img.path">
                        <img :src="img.img" width="100">
                      </div>
                    </div>
                    <div v-else>
                      <span class="text-danger">No Ilustrations</span>
                    </div>
                  </td>
                </tr>
              </template>
              <template v-else>
                <NoDataTable :colspan="6" />
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
    Loading...
  </div>
</template>


<script>
import ITEMCHECK_KANBAN from '@/mocks/ITEMCHECK_KANBAN.mock'
import NoDataTable from '@/components/table/NoDataTable.vue'
import { GET_ITEMCHECKS } from '@/store/modules/itemchecks.module'
import { mapGetters } from 'vuex'
import { GET_KANBAN_DETAIL } from '@/store/modules/kanban.module'

export default {
  name: "KanbanItemCheck",
  data() {
    return {
      itemchecks: [] || ITEMCHECK_KANBAN,
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters(['getItemchecks', 'getKanbanDetail']),
    totalItemCheckTime() {
      let total = 0
      if (this.getItemchecks) {
        this.getItemchecks.forEach(itemcheck => {
          total += +itemcheck.standart_time
        })
      }
      return total
    }
  },
  methods: {
    async getKanbanItemCheck() {
      try {
        this.isLoading = true
        await this.$store.dispatch(GET_ITEMCHECKS, { kanban_id: this.kanban_id })
        this.isLoading = false
      } catch (error) {
        console.log(error)
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    async ActionKanbanDetail() {
      try {
        this.isLoading = true
        await this.$store.dispatch(GET_KANBAN_DETAIL, { id: this.kanban_id })
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        if (error.response.status == 401) this.$router.push('/login')
      }
    }
  },
  watch: {
    kanban_id: {
      immediate: true,
      handler: function () {
        this.getKanbanItemCheck();
        this.ActionKanbanDetail()
      }
    },
    getItemchecks: {
      immediate: true,
      handler: function () {
        this.itemchecks = this.getItemchecks
      }
    },
  },
  props: {
    kanban_id: {
      type: String,
      default: -1
    },
  },
  components: {
    NoDataTable
  }
}
</script>

<style scoped>
table {
  border-collapse: collapse;
}

td {
  text-align: center;
  /* Horizontal alignment */
  vertical-align: middle;
  /* Vertical alignment */
}
</style>
