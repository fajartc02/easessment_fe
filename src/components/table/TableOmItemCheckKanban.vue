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
      <template v-if="getItemChecksWithStatusModal && !isLoading">
        <tr v-for="(itemCheck, i) in getItemChecksWithStatusModal" :key="i">
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
          <!-- <td class="text-center">
            <button class="btn btn-sm btn-danger"
              @click="ActionDeleteItemChecks(itemCheck.om_item_check_kanban_id)">Delete</button>
          </td> -->
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
import NoDataTable from './NoDataTable.vue'
import { DELETE_OM_ITEM_CHECK, GET_OM_GROUP_MACHINES_ITEM_CHECK } from '../../store/modules/omItemChecks.module'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'

export default {
  name: "TableOmItemCheckKanban",
  data() {
    return {
      itemChecks: [],
      visibleLiveDemo: false,
      setId: null,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['getItemChecks', 'getItemChecksWithStatusModal']),
  },
  methods: {
    async getItemCheck() {
      try
      {
        this.isLoading = true
        await this.$store.dispatch(GET_OM_GROUP_MACHINES_ITEM_CHECK, this.filter)
        this.isLoading = false
      } catch (error)
      {
        console.log(error)
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    async editItemChecks(itemCheck_id) {
      try
      {
        console.log(itemCheck_id);

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
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed)
          {
            this.isLoading = true
            this.$store.dispatch(DELETE_OM_ITEM_CHECK, itemCheck_id)
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
        this.getItemCheck()
      },
      deep: true
    },
    selectedZone() {
      this.getItemCheck()
    },
    getItemChecks() {
      this.itemChecks = this.getItemChecksWithStatusModal
    }
  },
  mounted() {
    this.isLoading = true
    this.getItemCheck()
  }
}
</script>
