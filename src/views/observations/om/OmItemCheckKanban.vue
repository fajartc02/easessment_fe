<template>
  <div class="d-flex flex-row justify-content-between mb-2">
    <div class="flex-column">
      <h4>Master OM Item Check Kanban</h4>
    </div>
    <div class="flex-column">
      <button class="btn btn-primary" @click="() => { isAddModal = true }">Add Item Check</button>
      <FormOmItemCheckKanban :visible="isAddModal" @visible="isAddModal = $event" />
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
          <label>Frequency</label>
          <select class="form-select" v-model="filter.freq_id">
            <option v-for="(freq, index) in getFreqsOpts" :key="index" :value="freq.id">
              {{ freq.text }}
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
      <TableOmItemCheckKanban :filter="filter" />
    </div>
    <div class="card-footer">
      <div class="row">
        <div class="col-xl-3">
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
        <div class="col">

        </div>
        <div class="col-xl-3" v-if="filter.total_data > 1">
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
      isAddModal: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'getLinesOpts',
      'getFreqsOpts',
      'getMachinesOpts',
      'getLinesOptsWithoutAll',
      'getFreqsOptsWithoutAll',
      'getMachinesOptsWithoutAll',
      'getPagination',
    ]),
    getLineName() {
      let line = this.getLinesOptsWithoutAll.find(line => line.id == this.newItemCheck.line_id)
      return line.text
    }
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
    ['filter.line_id']: function () {
      // this.changesLine()

    },
    newItemCheck: {
      handler() {
        if (this.newItemCheck.line_id)
        {
          this.$store.dispatch(GET_MACHINES, { line_id: this.newItemCheck.line_id })
        }
      },
      deep: true
    },
    isAddModal: function (newVal, oldVal){
      console.log('parent Prop changed: ', newVal, ' | was: ', oldVal)
    }
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
  },
  async mounted() {
    this.filter.current_page = this.getPagination.current_page
    this.filter.limit = this.getPagination.limit
    this.filter.total_data = this.getPagination.total_data
    this.isLoading = true
    await this.getLines();
    await this.getMachines();
    await this.fetchFreqs();
    await this.$store.dispatch(GET_OM_ITEM_CHECKS, this.filter)
  },
  components: {
    TableOmItemCheckKanban,
    CustPagination,
    FormOmItemCheckKanban
  }
}
</script>
