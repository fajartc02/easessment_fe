<template>
  <div class="d-flex flex-row justify-content-between mb-2">
    <div class="flex-column">
      <h4>Master OM Item Check Kanban</h4>
    </div>
  </div>
  <div class="card">
    <div class="card-header">
      <div class="row">
        <div class="col">
          <label>Line</label>
          <select class="form-select" v-model="filter.line_id" @change="changesLine">
            <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
              {{ line.text }}
            </option>
          </select>
        </div>
        <div class="col">
          <label>Machine</label>
          <select class="form-select" v-model="filter.machine_id">
            <option v-for="(machine, index) in getMachinesOpts" :key="index" :value="machine.id">
              {{ machine.text }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="card-body">
      <TableMachineGroupOmItemCheck :filter="filter" @selectedEdit="onSelectedEdit($event)" />
    </div>
    <div class="card-footer">
      <div class="d-flex justify-content-between">
        <div>
          <div class="input-group mb-3">
            <label class="input-group-text">Limit</label>
            <select class="form-select" v-model="filter.limit">
              <option selected value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        <div v-if="filter.total_data > 1">
          <CustPagination :totalItems="filter.total_data" :items-per-page="filter.limit"
            :current-page="filter.current_page" @page-changed="handlePageChange" />
        </div>
      </div>
    </div>
    <ModalTableOmItemCheck :visible="showTableItemCheck" @visible="onVisibleItemCheckModal($event)"
      @showFormItemCheck="onShowFormItemCheck($event)" />
    <ModalFormOmItemCheck :loadedData="selectedEdit" :visible="showFormItemCheck"
      @visible="onVisibleFormItemCheckModal($event)" />
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_OM_GROUP_MACHINES_ITEM_CHECKS, GET_OM_GROUP_MACHINE_DETAIL, GET_OM_ITEM_CHECKS } from '@/store/modules/omItemChecks.module'
import { GET_MACHINES } from '@/store/modules/machine.module'

import CustPagination from '@/components/pagination/CustPagination.vue';
import TableMachineGroupOmItemCheck from '@/components/om/TableMachineGroupOmItemCheck.vue'
import ModalTableOmItemCheck from '@/components/om/ModalTableOmItemCheck.vue'
import ModalFormOmItemCheck from '@/components/om/ModalFormOmItemCheck.vue'

export default {
  name: 'OmItemCheckKanban',
  data() {
    return {
      filter: {
        line_id: -1,
        machine_id: -1,
        limit: 10,
        total_data: 1,
        current_page: 1,
      },
      showTableItemCheck: false,
      showFormItemCheck: false,
      isLoading: false,
      selectedEdit: null,
    }
  },
  computed: {
    ...mapGetters([
      'getLinesOpts',
      'getMachinesOpts',
      'getGroupMachineItemChecks',
      'getMachineGroupPagination',
      'getGroupMachineDetail',
    ]),
  },
  watch: {
    getMachineGroupPagination: {
      handler() {
        this.filter = {
          ...this.filter,
          limit: this.getMachineGroupPagination.limit,
          total_data: this.getMachineGroupPagination.total_data,
          current_page: this.getMachineGroupPagination.current_page
        }
      },
      deep: true
    },
    filter: {
      handler() {
        this.$store.dispatch(GET_OM_GROUP_MACHINES_ITEM_CHECKS, this.filter)
      },
      deep: true
    },
  },
  methods: {
    async getLines() {
      try
      {
        this.$store.dispatch(GET_LINES)
      } catch (error)
      {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getMachines() {
      try
      {
        this.$store.dispatch(GET_MACHINES, { line_id: this.filter.line_id })
      } catch (error)
      {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    changesLine() {
      if (this.filter.selectedLine != -1)
      {
        this.getMachines()
      } else
      {
        this.filter.selectedMachine = -1
      }
    },
    handlePageChange(page) {
      this.filter.current_page = page;
      this.$store.dispatch(GET_OM_GROUP_MACHINES_ITEM_CHECKS, this.filter)
    },
    onSelectedEdit(event) {
      if (event)
      {
        this.showTableItemCheck = true
        this.$store.dispatch(GET_OM_GROUP_MACHINE_DETAIL, event)
      }
    },
    onVisibleItemCheckModal(event) {
      this.showTableItemCheck = event.visible
      if (event.refresh)
      {
        this.$store.dispatch(GET_OM_GROUP_MACHINES_ITEM_CHECKS, this.filter)
      }
    },
    onShowFormItemCheck(event) {
      this.showFormItemCheck = event.visible
      if (this.showFormItemCheck)
      {
        if (event.data)
        {
          this.selectedEdit = {
            id: event.data.om_item_check_kanban_id,
            line_id: event.data.line_id,
            freq_id: event.data.freq_id,
            machine_id: event.data.machine_id,
            item_check_nm: event.data.item_check_nm,
            location_nm: event.data.location_nm,
            method_nm: event.data.method_nm,
            standart_nm: event.data.standart_nm,
            standart_time: event.data.standart_time,
          }
        }
      }
      else
      {
        this.selectedEdit = null
      }
    },
    onVisibleFormItemCheckModal(event) {
      this.showFormItemCheck = event.visible
      this.selectedEdit = null
      if (event.refresh)
      {
        this.$store.dispatch(GET_OM_ITEM_CHECKS, {
          line_id: this.getGroupMachineDetail.line_id,
          machine_id: this.getGroupMachineDetail.machine_id,
        })
      }
    },
  },
  async mounted() {
    this.filter.current_page = this.getMachineGroupPagination.current_page
    this.filter.limit = this.getMachineGroupPagination.limit
    this.filter.total_data = this.getMachineGroupPagination.total_data
    this.isLoading = true

    this.getLines();
    this.getMachines();
    this.$store.dispatch(GET_OM_GROUP_MACHINES_ITEM_CHECKS, this.filter)
  },
  components: {
    TableMachineGroupOmItemCheck,
    CustPagination,
    ModalTableOmItemCheck,
    ModalFormOmItemCheck
  }
}
</script>
