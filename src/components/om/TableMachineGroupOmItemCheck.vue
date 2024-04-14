<template>
  <table class="table table-stripped">
    <thead>
      <tr class="text-center">
        <th>No</th>
        <th>Line</th>
        <th>Machine</th>
        <th>Total Item Check</th>
        <th>Total Duration</th>
        <th colspan="3">Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="getGroupMachineItemChecks && !isLoading">
        <tr v-for="(itemCheck, i) in getGroupMachineItemChecks" :key="i">
          <td class="text-center">
            {{ itemCheck.no }}
          </td>
          <td>
            {{ itemCheck.line_nm }}
          </td>
          <td>
            {{ itemCheck.machine_nm }}
          </td>
          <td class="text-center">
            {{ itemCheck.total_item_check }}
          </td>
          <td class="text-center">
            {{ itemCheck.total_duration_time }}
          </td>
          <td class="text-center">
            <button class="btn btn-sm btn-warning" @click="edit(itemCheck)">Item Check</button>
          </td>
        </tr>
      </template>
      <template v-else-if="isLoading && getItemChecksWithStatusModal?.length != 0">
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
import NoDataTable from '@/components/table/NoDataTable.vue'
import { GET_OM_GROUP_MACHINES_ITEM_CHECKS } from '@/store/modules/omItemChecks.module'
import { mapGetters } from 'vuex'

export default {
  name: "TableMachineGroupOmItemCheck",
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['getGroupMachineItemChecks']),
  },
  methods: {
    async getGroupMachine() {
      try
      {
        this.isLoading = true
        await this.$store.dispatch(GET_OM_GROUP_MACHINES_ITEM_CHECKS, this.filter)
        this.isLoading = false
      } catch (error)
      {
        console.log(error)
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    edit(event) {
      this.$emit('selectedEdit', event)
    }
  },
  props: {
    filter: {
      type: Object,
    },
  },
  components: {
    NoDataTable,
  },
  watch: {
    filter: {
      handler() {
        this.getGroupMachine()
      },
      deep: true
    },
  },
  mounted() {
    this.isLoading = true
    this.getGroupMachine()
  }
}
</script>
