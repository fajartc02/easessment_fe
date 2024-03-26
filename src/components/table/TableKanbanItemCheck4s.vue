<template>
  <table class="table table-stripped">
    <thead>
      <tr class="text-center">
        <th>No</th>
        <th>Kanban No</th>
        <th>Item Check</th>
        <th>Standard Time</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="itemchecks">
        <tr v-for="(itemcheck, i) in itemchecks" :key="i">
          <td>{{ i + 1 }}</td>
          <td>{{ itemcheck.kanban_no }}</td>
          <td>{{ itemcheck.item_check_nm }}</td>
          <td>{{ itemcheck.standart_time }}</td>
        </tr>
      </template>
      <template v-else>
        <NoDataTable :colspan="4" />
      </template>
    </tbody>
  </table>
</template>


<script>
import ITEMCHECK_KANBAN from '@/mocks/ITEMCHECK_KANBAN.mock'
import NoDataTable from '@/components/table/NoDataTable.vue'
import { GET_ITEMCHECKS } from '@/store/modules/itemchecks.module'
import { mapGetters } from 'vuex'

export default {
  name: "TableKanbanItemCheck4s",
  data() {
    return {
      itemchecks: [] || ITEMCHECK_KANBAN
    }
  },
  computed: {
    ...mapGetters(['getItemchecks'])
  },
  methods: {
    async getKanbanItemCheck() {
      try {
        this.$store.dispatch(GET_ITEMCHECKS, { kanban_id: this.kanban_id })
      } catch (error) {
        console.log(error)
        if (error.response.status == 401) this.$router.push('/login')
      }
    }
  },
  watch: {
    kanban_id: {
      immediate: true,
      handler: function () {
        this.getKanbanItemCheck();
      }
    },
    getItemchecks: {
      immediate: true,
      handler: function () {
        console.log();
        this.itemchecks = this.getItemchecks
      }
    }
  },
  props: {
    kanban_id: {
      type: String,
      default: -1
    }
  },
  components: {
    NoDataTable
  }
}
</script>
