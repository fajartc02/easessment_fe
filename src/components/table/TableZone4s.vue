<template>
  <table class="table table-stripped">
    <thead>
      <tr class="text-center">
        <th>No</th>
        <th>Line</th>
        <th>Zone</th>
        <th>Created By</th>
        <th>Created Date</th>
        <th colspan="3">Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="getZonesWithStatusModal && !isLoading">
        <tr v-for="(zone, i) in getZonesWithStatusModal" :key="i">
          <td>
            {{ zone.no }}
          </td>
          <td>
            {{ zone.line_nm }}
          </td>
          <td>
            {{ zone.zone_nm }}
          </td>
          <td>
            {{ zone.created_by }}
          </td>
          <td>
            {{ zone.created_dt.split(' ')[0] }}
          </td>
          <td class="text-center">
            <button class="btn btn-sm btn-warning" @click="() => { zone.is_edit = true }">Edit</button>
            <CModal backdrop="static" :visible="zone.is_edit" @close="() => { zone.is_edit = false }" clos size="lg">
              <CModalHeader>
                <CModalTitle>Edit Zone</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <div class="row">
                  <div class="col">
                    <div class="input-group">
                      <span class="input-group-text">Line</span>
                      <select class="form-select" v-model="zone.line_id">
                        <option v-for="(line, index) in getLinesOptsWithoutAll" :key="index" :value="line.id">
                          {{ line.text }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="col">
                    <div class="input-group">
                      <span class="input-group-text">Zone</span>
                      <input class="form-control" type="text" v-model="zone.zone_nm">
                    </div>
                  </div>
                </div>
              </CModalBody>
              <CModalFooter>
                <CButton color="primary" @click="ActionEditKanban({ zone })">Save</CButton>
                <CButton color="secondary" @click="() => { zone.is_edit = false }">Close</CButton>
              </CModalFooter>
            </CModal>
          </td>
          <td class="text-center">
            <button class="btn btn-sm btn-danger" @click="ActionDeleteKanban(zone.zone_id)">Delete</button>
          </td>
        </tr>
      </template>
      <template v-else-if="isLoading && getZonesWithStatusModal?.length != 0">
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
import { DELETE_ZONE, GET_ZONES, PUT_ZONE } from '@/store/modules/zone.module'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'
import { toast } from 'vue3-toastify'
import { GET_LINES } from '@/store/modules/line.module'

export default {
  name: "TableKanban4s",
  data() {
    return {
      zones: [],
      visibleLiveDemo: false,
      setId: null,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['getZones', 'getZonesWithStatusModal', 'getLinesOptsWithoutAll']),
  },
  methods: {
    async ActionGetZones() {
      try {
        this.isLoading = true
        await this.$store.dispatch(GET_ZONES, this.filter)
        this.isLoading = false
      } catch (error) {
        toast.error(error.response.data.message)
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    async ActionEditKanban({ zone }) {
      try {
        this.isLoading = true
        let edittedZone = {
          id: zone.zone_id,
          zone_nm: zone.zone_nm,
          line_id: zone.line_id
        }
        await this.$store.dispatch(PUT_ZONE, edittedZone)
        zone.is_edit = false
        this.isLoading = false
      } catch (error) {
        toast.error(error.response.data.message)
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    async ActionDeleteKanban(zone_id) {
      try {
        await Swal.fire({
          title: `Apakah kamu yakin ingin menghapus zone ini?`,
          showCancelButton: true,
          confirmButtonText: "Delete",
        }).then(async (result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.isLoading = true
            this.$store.dispatch(DELETE_ZONE, zone_id)
            await this.ActionGetZones()
            toast.success('Berhasil menghapus zone', {
              autoClose: 1000
            })
          }
        });
      } catch (error) {
        toast.error(error.response.data.message)
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    async getLines() {
      try {
        await this.$store.dispatch(GET_LINES)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
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
        this.ActionGetZones()
      },
      deep: true
    },
    selectedZone() {
      this.ActionGetZones()
    },
    getZones() {
      this.zones = this.getZonesWithStatusModal
    }
  },
  async mounted() {
    this.isLoading = true
    await this.getLines()
    await this.ActionGetZones()
    this.isLoading = false
  }
}
</script>
