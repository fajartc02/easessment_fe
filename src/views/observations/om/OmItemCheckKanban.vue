<template>
  <div class="d-flex flex-row justify-content-between mb-2">
    <div class="flex-column">
      <h4>Master OM Item Check Kanban</h4>
    </div>
    <div class="flex-column">
      <button class="btn btn-primary" @click="() => { showFormModal = true }">Add Item Check</button>
      <FormOmItemCheckKanban :loadedData="selectedEdit" :visible="showFormModal"
        @visible="onVisibleFormDialog($event)" />
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
      <TableOmItemCheckKanban :filter="filter" @selectedEdit="onSelectedEdit($event)" />
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
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_OM_ITEM_CHECKS } from '@/store/modules/omItemChecks.module'
import { GET_FREQS } from '@/store/modules/freq.module'
import { GET_MACHINES } from '@/store/modules/machine.module'

import CustPagination from '@/components/pagination/CustPagination.vue';
import TableOmItemCheckKanban from '@/components/table/TableOmItemCheckKanban.vue'

//import FnRequireFullFillInput from '@/functions/FnRequireFullFillInput'

import FormOmItemCheckKanban from './FormOmItemCheckKanban.vue'

export default {
  name: 'OmItemCheckKanban',
  data() {
    return {
      filter: {
        line_id: -1,
        freq_id: -1,
        machine_id: -1,
        limit: 10,
        total_data: 1,
        current_page: 1,
      },
      showFormModal: false,
      isLoading: false,
      selectedEdit: null,
    }
  },
  computed: {
    ...mapGetters([
      'getLinesOpts',
      'getFreqsOpts',
      'getMachinesOpts',
      'getItemChecksWithStatusModal',
      'getPagination',
    ]),
  },
  watch: {
    getPagination: {
      handler() {
        this.filter = {
          ...this.filter,
          limit: this.getPagination.limit,
          total_data: this.getPagination.total_data,
          current_page: this.getPagination.current_page
        }
      },
      deep: true
    },
    filter: {
      handler() {
        this.$store.dispatch(GET_OM_ITEM_CHECKS, this.filter)
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
    async fetchFreqs() {
      try
      {
        this.$store.dispatch(GET_FREQS)
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
      this.$store.dispatch(GET_OM_ITEM_CHECKS, this.filter)
    },
    onSelectedEdit(event) {
      if (event)
      {
        this.selectedEdit = {
          id: event.om_item_check_kanban_id,
          line_id: event.line_id,
          freq_id: event.freq_id,
          machine_id: event.machine_id,
          item_check_nm: event.item_check_nm,
          location_nm: event.location_nm,
          method_nm: event.method_nm,
          standart_nm: event.standart_nm,
          standart_time: event.standart_time,
        }
        this.showFormModal = true
      }
    },
    onVisibleFormDialog(event) {
      this.showFormModal = event.visible
      if (event.refresh)
      {
        this.$store.dispatch(GET_OM_ITEM_CHECKS, this.filter)
      }
    }
  },
  async mounted() {
    this.filter.current_page = this.getPagination.current_page
    this.filter.limit = this.getPagination.limit
    this.filter.total_data = this.getPagination.total_data
    this.isLoading = true

    this.getLines();
    this.fetchFreqs();
    this.getMachines();
    this.$store.dispatch(GET_OM_ITEM_CHECKS, this.filter)
  },
  components: {
    TableOmItemCheckKanban,
    CustPagination,
    FormOmItemCheckKanban
  }
}
</script>
