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
            <select class="form-select" v-model="selectedMachineID" :disabled="!selectedLineID">
              <option v-for="machine in getMachinesOpts" :key="machine.id" :value="machine.id">
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
                  <CIcon icon="cil-x" class="text-danger" size="sm" />
                </div>
                <span class="mx-2">Ada Temuan Abnormally</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScheduleDatesOmItemCheck :filter="filter" :refresh="isRefreshSchedule"
        @showEditDateModal="isVisibleEditDateModal = true" @showEditPicModal="isVisibleEditPicModal = true" />
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
      <ModalOmSignSchedule :visible="isVisibleSignModal" @modalSignListener="onModalSignListener($event)" />
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
import { mapGetters } from 'vuex'
import ScheduleDatesOmItemCheck from '@/components/om/ScheduleDatesOmItemCheck.vue'
import CustPagination from '@/components/pagination/CustPagination.vue';
import ModalOmSignSchedule from '@/components/om/ModalOmSignSchedule.vue'
import ModalOmEditDateSchedule from '@/components/om/ModalOmEditDateSchedule.vue'
import ModalOmEditPicSchedule from '@/components/om/ModalOmEditPicSchedule.vue'

const defaultFilter = {
  line_id: null,
  freq_id: null,
  machine_id: null,
  group_id: null,
  yearMonth: null,
  limit: 10,
  total_data: 1,
  current_page: 1,
}

export default {
  name: 'Main Schedule',
  components: {
    //Loading,
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
      selectedMachineID: "-1",
      selectedFreqID: "-1",
      filter: defaultFilter,
      isVisibleSignModal: false,
      isVisibleEditDateModal: false,
      isVisibleEditPicModal: false,
      isRefreshSchedule: false
    }
  },
  computed: {
    ...mapGetters([
      'getLinesOpts',
      'getGroups',
      'getMachinesOpts',
      'getFreqsOpts',
      'getPagination',
    ]),
  },
  watch: {
    selectedGroupID: function () {
      this.filter.group_id = this.selectedGroupID
    },
    selectedLineID: function () {
      this.filter.line_id = this.selectedLineID
    },
    selectedFreqID: function () {
      this.filter.freq_id = this.selectedFreqID == "-1" ? null : this.selectedFreqID
    },
    selectedMachineID: function () {
      this.filter.machine_id = this.selectedMachineID == "-1" ? null : this.selectedMachineID
    },
    selectedMonth: function () {
      this.filter.yearMonth = this.selectedMonth
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
  },
  methods: {
    resetFilter() {
      this.selectedLineID = "-1"
      this.selectedFreqID = "-1"
      this.selectedGroupID = "-1"
      this.selectedMachineID = "-1"
      this.filter = defaultFilter
    },
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
    async getGroup() {
      try
      {
        this.$store.dispatch(GET_GROUP)
      } catch (error)
      {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getFreq() {
      try
      {
        this.$store.dispatch(GET_FREQS)
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
    async onModalEditDateListener(event) {
      this.isVisibleEditDateModal = event.visible
      this.isRefreshSchedule = event.refresh
    },
    onModalEditPicListener(event) {
      this.isVisibleEditPicModal = event.visible
      this.isRefreshSchedule = event.refresh
    },
    onModalSignListener(event) {
      this.isVisibleSignModal = event.visible
      this.isRefreshSchedule = event.refresh
    }
  },

  async mounted() {
    this.newSubScheduleData = []
    const year = moment().format('YYYY-MM-DD').split('-')[0]
    const month = moment().format('YYYY-MM-DD').split('-')[1]
    this.selectedMonth = `${year}-${month}`

    this.getLines()
    this.getGroup()
    this.getFreq()
    this.getMachines()

    if (localStorage.getItem('line_id'))
    {
      this.selectedLineID = localStorage.getItem('line_id')
    }

    this.filter.yearMonth = this.selectedMonth
    this.filter.line_id = this.selectedLineID
  },
}
</script>
<style></style>
