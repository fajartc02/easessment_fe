<template>
  <div>
    <div class="card mb-5">
      <div class="card-header">
        <div class="row d-flex align-items-center">
          <div class="col">
            <label>Select month</label>
            <input type="month" class="form-control" v-model="selectedMonth" />
          </div>
          <div class="col">
            <label>Line</label>
            <select class="form-select" v-model="selectedLineID">
              <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
                {{ line.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Machine</label>
            <select class="form-select" v-model="selectedMachineObj" :disabled="!selectedLineID">
              <option v-for="machine in getMachinesOpts" :key="machine.id" :value="machine">
                {{ machine.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Freq</label>
            <select class="form-select" v-model="selectedFreqID">
              <option v-for="freq in getFreqsOpts" :key="freq.id" :value="freq.id">
                {{ freq.text }}
              </option>
            </select>
          </div>
          <div class="col-sm-1">
            <button class="mt-4 btn btn-info text-white" @click="resetFilter()">
              Reset
            </button>
          </div>
        </div>
      </div>
      <div class="card-header">
        <div class="row">
          <div class="col">
            <div class="d-flex align-items-center">
              <div class="d-flex align-items-center">
                <div class="bullet" style="width: 20px; height: 20px"></div>
                <span class="mx-2">Planning</span>
              </div>
              <div class="d-flex align-items-center">
                <div class="bullet-filled" style="width: 20px; height: 20px"></div>
                <span class="mx-2">Sudah Di Check</span>
              </div>
              <div class="d-flex align-items-center">
                <div class="bullet-cancel d-flex justify-content-center align-items-center"
                  style="width: 20px; height: 20px">
                  <CIcon icon="cil-x" class="text-danger" />
                </div>
                <span class="mx-2">Ada Temuan Abnormally</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScheduleDatesOmItemCheck :yearMonth="selectedMonth"
        @refreshMainSchedule="onRefreshMainSchedule()" @showEditDateModal="isVisibleEditDateModal = true"
        @showEditPicModal="isVisibleEditPicModal = true" @showSignModal="onShowSignModal($event)" />
      <div class="card-footer">
        <div class="d-flex justify-content-between">
          <div>
            <div class="input-group mb-3">
              <label class="input-group-text">Limit</label>
              <select class="form-select" v-model="filter.limit">
                <option value="2">2</option>
                <option selected value="4">4</option>
                <option value="8">8</option>
                <option value="10">10</option>
              </select>
            </div>
          </div>
          <div v-if="filter.total_data > 0">
            <CustPagination :totalItems="filter.total_data" :items-per-page="filter.limit"
              :current-page="filter.current_page" @page-changed="handlePageChange" />
          </div>
        </div>
      </div>
      <ModalOmSignSchedule :visible="isVisibleSignModal" :signCheckerData="selectedSignChecker"
        @modalSignListener="onModalSignListener($event)" />
      <ModalOmEditDateSchedule :visible="isVisibleEditDateModal"
        @modalEditDateListener="onModalEditDateListener($event)" />
      <ModalOmEditPicSchedule :visible="isVisibleEditPicModal" @modalEditPicListener="onModalEditPicListener($event)" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { GET_GROUP } from '@/store/modules/group.module'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_FREQS } from '@/store/modules/freq.module'
import { GET_MACHINES } from '@/store/modules/machine.module'
import {
  GET_OM_MAIN_SCHEDULES,
  GET_OM_SUB_SCHEDULES_FILTER
} from '@/store/modules/omSchedule.module'
import { mapGetters } from 'vuex'
import { toast } from 'vue3-toastify'
import ScheduleDatesOmItemCheck from '@/components/om/ScheduleDatesOmItemCheck.vue'
import CustPagination from '@/components/pagination/CustPagination.vue';
import ModalOmSignSchedule from '@/components/om/ModalOmSignSchedule.vue'
import ModalOmEditDateSchedule from '@/components/om/ModalOmEditDateSchedule.vue'
import ModalOmEditPicSchedule from '@/components/om/ModalOmEditPicSchedule.vue'

const defaultFilter = {
  line_id: null,
  freq_id: null,
  machine_id: null,
  machine_nm: null,
  group_id: null,
  yearMonth: null,
  limit: 4,
  total_data: 1,
  current_page: 1,
}

export default {
  name: 'Main Schedule',
  components: {
    ScheduleDatesOmItemCheck,
    CustPagination,
    ModalOmSignSchedule,
    ModalOmEditDateSchedule,
    ModalOmEditPicSchedule
  },
  data() {
    return {
      selectedMonth: null,
      selectedLineID: null,
      selectedGroupID: "-1",
      selectedMachineObj: { id: '-1', text: 'All' },
      selectedFreqID: "-1",
      selectedSignChecker: null,
      filter: defaultFilter,
      isVisibleSignModal: false,
      isVisibleEditDateModal: false,
      isVisibleEditPicModal: false,
      isCompleteFirstLoadMainSchedule: false,
    }
  },
  computed: {
    ...mapGetters([
      'getLinesOpts',
      'getGroups',
      'getMachinesOpts',
      'getFreqsOpts',
      'getPagination',
      'getOmMainSchedules',
      'getOmSubSchedules',
    ]),
    subScheduleFilter() {
      return {
        freq_id: this.selectedFreqID,
        machine: this.selectedMachineObj,
      }
    },
  },
  watch: {
    selectedGroupID: function () {
      this.filter.group_id = this.selectedGroupID
    },
    selectedLineID: async function () {
      this.filter = {
        ...this.filter,
        line_id: this.selectedLineID
      }
      if (this.isCompleteFirstLoadMainSchedule)
      {
        this.getMainSchedules()
      }
    },
    selectedFreqID: function () {
      this.filter = {
        ...this.filter,
        freq_id: this.selectedFreqID
      }
    },
    selectedMachineObj: function () {
      this.filter = {
        ...this.filter,
        machine_id: this.selectedMachineObj.id,
        machine_nm: this.selectedMachineObj.text
      }
    },
    selectedMonth: function () {
      this.filter = {
        ...this.filter,
        yearMonth: this.selectedMonth
      }
      if (this.isCompleteFirstLoadMainSchedule)
      {
        this.getMainSchedules()
      }
    },
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
    subScheduleFilter(newVal, oldVal) {
      if (
        (newVal.freq_id != null && newVal.freq_id != oldVal.freq_id)
        || (newVal.machine != null && newVal.machine.id != oldVal.machine.id)
      )
      {
        this.$store.dispatch(GET_OM_SUB_SCHEDULES_FILTER, newVal)
      }
      else
      {
        this.$store.dispatch(GET_OM_SUB_SCHEDULES_FILTER, false)
      }
    },
  },
  methods: {
    resetFilter() {
      this.selectedLineID = "-1"
      this.selectedFreqID = "-1"
      this.selectedGroupID = "-1"
      this.selectedMachineObj = { id: '-1', text: 'All' }
      this.filter = defaultFilter
    },
    async getLines() {
      try
      {
        this.$store.dispatch(GET_LINES)
      } catch (error)
      {
        console.log(error)
        if (error?.response?.status == 401) this.$router.push('/login')
        toast.error(error.response.data.message, {
          autoClose: 10000,
        })
      }
    },
    async getGroup() {
      try
      {
        this.$store.dispatch(GET_GROUP)
      } catch (error)
      {
        console.log(error)
        if (error?.response?.status == 401) this.$router.push('/login')
        toast.error(error.response.data.message, {
          autoClose: 10000,
        })
      }
    },
    async getFreq() {
      try
      {
        this.$store.dispatch(GET_FREQS)
      } catch (error)
      {
        console.log(error)
        if (error?.response?.status == 401) this.$router.push('/login')
        toast.error(error.response.data.message, {
          autoClose: 10000,
        })
      }
    },
    async getMachines() {
      try
      {
        this.$store.dispatch(GET_MACHINES, { line_id: this.filter.line_id })
      } catch (error)
      {
        console.log(error)
        if (error?.response?.status == 401) this.$router.push('/login')
        toast.error(error.response.data.message, {
          autoClose: 10000,
        })
      }
    },
    async getMainSchedules() {
      try
      {
        let objQuery = {
          month_year_num: this.filter.yearMonth,
          line_id: this.filter.line_id,
          current_page: this.filter.current_page,
          limit: this.filter.limit
        }
        await this.$store.dispatch(GET_OM_MAIN_SCHEDULES, objQuery)
      }
      catch (error)
      {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
        toast.error(error.response.data.message, {
          autoClose: 10000,
        })
      }
    },
    async onModalEditDateListener(event) {
      this.isVisibleEditDateModal = false
      if (event.refresh)
      {
        this.getMainSchedules()
      }
    },
    onModalEditPicListener(event) {
      this.isVisibleEditPicModal = false
      if (event.refresh)
      {
        this.getMainSchedules()
      }
    },
    onModalSignListener(event) {
      this.isVisibleSignModal = false
      this.selectedSignChecker = null
      if (event.refresh)
      {
        this.getMainSchedules()
      }
    },
    onShowSignModal(event) {
      this.isVisibleSignModal = true
      this.selectedSignChecker = event
    },
    handlePageChange(page) {
      this.filter.current_page = page;
      this.getMainSchedules()
    },
    onRefreshMainSchedule() {
      //this.$router.go(0)
      this.getMainSchedules()
    },
  },

  async mounted() {
    await this.getLines()
    this.getGroup()
    this.getFreq()
    this.getMachines()

    const date = moment().format('YYYY-MM-DD').split('-')
    this.selectedMonth = `${date[0]}-${date[1]}`

    if (localStorage.getItem('line_id'))
    {
      this.selectedLineID = localStorage.getItem('line_id')
    }

    this.filter.yearMonth = this.selectedMonth
    this.filter.line_id = this.selectedLineID

    this.getMainSchedules()
      .then(() => {
        this.isCompleteFirstLoadMainSchedule = true
      })
  },
}
</script>
<style></style>
