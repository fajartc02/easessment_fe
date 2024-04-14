<template>
  <table class="table table-stripped">
    <thead>
      <tr class="text-center">
        <th>No</th>
        <th>Item Check</th>
        <th>Location</th>
        <th>Methode</th>
        <th>Standart</th>
        <th>Duration</th>
        <th>Frequency</th>
        <th colspan="3">Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="getItemChecks && !isLoading">
        <tr v-for="(itemCheck, i) in getItemChecks" :key="i">
          <td class="text-center">
            {{ itemCheck.no }}
          </td>
          <td>
            {{ itemCheck.item_check_nm }}
          </td>
          <td>
            {{ itemCheck.location_nm }}
          </td>
          <td>
            {{ itemCheck.method_nm }}
          </td>
          <td>
            {{ itemCheck.standart_nm }}
          </td>
          <td>
            {{ itemCheck.standart_time }}
          </td>
          <td>
            {{ itemCheck.freq_nm }}
          </td>
          <td class="text-center">
            <button class="btn btn-sm btn-warning" @click="edit(itemCheck)">Edit</button>
          </td>
          <td class="text-center">
            <button class="btn btn-sm btn-danger"
              @click="ActionDeleteItemChecks(itemCheck.om_item_check_kanban_id)">Delete</button>
          </td>
        </tr>
      </template>
      <template v-else-if="isLoading && getItemChecks?.length != 0">
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
import { DELETE_OM_ITEM_CHECK, GET_OM_ITEM_CHECKS, GET_OM_GROUP_MACHINES_ITEM_CHECKS } from '@/store/modules/omItemChecks.module'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'

export default {
  name: "TableOmItemCheck",
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['getItemChecks', 'getGroupMachineDetail']),
  },
  watch: {
    getGroupMachineDetail: {
      handler() {
        this.getItemCheck()
      },
      deep: true,
    },
  },
  methods: {
    async getItemCheck() {
      try
      {
        this.isLoading = true
        await this.$store.dispatch(GET_OM_ITEM_CHECKS, { machine_id: this.getGroupMachineDetail.machine_id })
        this.isLoading = false
      } catch (error)
      {
        console.log(error)
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    async ActionDeleteItemChecks(itemCheck_id) {
      try
      {
        await Swal.fire({
          title: `Apakah kamu yakin ingin menghapus Item Check ini?`,
          showCancelButton: true,
          confirmButtonText: "Delete",
        }).then(async (result) => {
          if (result.isConfirmed)
          {
            this.isLoading = true
            this.$store.dispatch(DELETE_OM_ITEM_CHECK, itemCheck_id)
            await this.$store.dispatch(GET_OM_GROUP_MACHINES_ITEM_CHECKS)
            await this.getItemCheck()
          }
        });
      } catch (error)
      {
        console.log(error)
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    edit(event) {
      this.$emit('selectedEdit', event);
    }
  },
  components: {
    NoDataTable,
  },
  mounted() {
    this.isLoading = true
    this.getItemCheck()
  }
}
</script>
