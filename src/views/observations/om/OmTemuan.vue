<template>
  <div>
    <div class="card mb-5">
      <div class="card-header">
        <div class="row d-flex align-items-center">
          <div class="col">
            <label>Start date</label>
            <input type="date" class="form-control" v-model="filter.start_date" />
          </div>
          <div class="col">
            <label>End date</label>
            <input type="date" class="form-control" v-model="filter.end_date" />
          </div>
          <div class="col">
            <label>Line</label>
            <select class="form-select" v-model="filter.line_id">
              <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
                {{ line.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Shift / group</label>
            <select class="form-select" v-model="filter.group_id">
              <option v-for="group in getGroupsOpts" :key="group.id" :value="group.id">
                {{ group.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Machine</label>
            <select class="form-select" v-model="filter.machine_id">
              <option v-for="machine in getMachinesOpts" :key="machine.id" :value="machine.id">
                {{ machine.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Freq</label>
            <select class="form-select" v-model="filter.freq_id">
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
      <TableOmFinding @showFormModalOmFinding="onShowFormModalOmFinding()" @refreshDeleted="onRefreshDeleted($event)" />
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
          <div v-if="filter.total_data > 0">
            <CustPagination :totalItems="filter.total_data" :items-per-page="filter.limit"
              :current-page="filter.current_page" @page-changed="handlePageChange" />
          </div>
        </div>
      </div>
      <ModalFormOmFinding :visible="isVisibleFindingModal" :loadedFinding="getOmFindingDetail"
        @modalFormOmFindingListener="onModalFormOmFindingListener($event)" />
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify'
import { GET_GROUP } from '@/store/modules/group.module'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_FREQS } from '@/store/modules/freq.module'
import { GET_MACHINES } from '@/store/modules/machine.module'
import { GET_OM_FINDINGS, GET_OM_FINDINGS_FILTER, GET_OM_FINDING_DETAIL } from '@/store/modules/omFinding.module'
import { mapGetters } from 'vuex'
import moment from 'moment'
import TableOmFinding from '@/components/om/TableOmFinding.vue'
import ModalFormOmFinding from '@/components/om/ModalFormOmFinding.vue'
import CustPagination from '@/components/pagination/CustPagination.vue';

const defaultFilter = {
  start_date: '',
  end_date: '',
  line_id: '-1',
  group_id: '-1',
  freq_id: '-1',
  machine_id: '-1',
  limit: 10,
  total_data: 1,
  current_page: 1,
}

export default {
  name: 'OmTemuan',
  components: {
    TableOmFinding,
    ModalFormOmFinding,
    CustPagination
  },
  data() {
    return {
      isLoading: false,
      filter: defaultFilter,
      isVisibleFindingModal: false,
    }
  },
  computed: {
    ...mapGetters([
      'getLinesOpts',
      'getGroupsOpts',
      'getFreqsOpts',
      'getMachinesOpts',
      'getOmFindings',
      'getOmFindingFilter',
      'getOmFindingDetail'
    ]),
  },
  watch: {
    filter: {
      deep: true,
      handler() {
        this.$store.dispatch(GET_OM_FINDINGS_FILTER, this.filter)
      }
    },
  },
  methods: {
    async getFindings() {
      try
      {
        await this.$store.dispatch(GET_OM_FINDINGS)
      }
      catch (error)
      {
        console.log(error)
        if (error?.response?.status == 401) this.$router.push('/login')
        toast.error(error?.response?.data?.message ?? 'Something Wrong', {
          autoClose: 10000,
        })
      }
    },
    async getLines() {
      try
      {
        this.$store.dispatch(GET_LINES)
      } catch (error)
      {
        console.log(error)
        if (error?.response?.status == 401) this.$router.push('/login')
        toast.error(error?.response?.data?.message ?? 'Something Wrong', {
          autoClose: 10000,
        })
      }
    },
    async getGroup() {
      try
      {
        this.$store.dispatch(GET_GROUP)
      }
      catch (error)
      {
        console.log(error)
        if (error?.response?.status == 401) this.$router.push('/login')
        toast.error(error?.response?.data?.message ?? 'Something Wrong', {
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
        toast.error(error?.response?.data?.message ?? 'Something Wrong', {
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
        toast.error(error?.response?.data?.message ?? 'Something Wrong', {
          autoClose: 10000,
        })
      }
    },
    resetFilter() {
      this.filter = defaultFilter
    },
    handlePageChange(page) {
      this.filter.current_page = page;
      this.getMainSchedules()
    },
    onShowFormModalOmFinding() {
      this.isVisibleFindingModal = true
    },
    // eslint-disable-next-line no-unused-vars
    onModalFormOmFindingListener(event) {
      this.isVisibleFindingModal = false
      this.$store.dispatch(GET_OM_FINDING_DETAIL, null)
      if (event.refresh)
      {
        this.getFindings()
      }
    },
    onRefreshDeleted(event) {
      if (event)
      {
        this.getFindings()
      }
    }
  },
  async mounted() {
    await this.getLines()
    this.getGroup()
    this.getFreq()

    const year = moment().format('YYYY')
    this.filter = {
      ...this.filter,
      start_date: `${year}-01-01`,
      end_date: `${year}-12-30`
    }

    if (localStorage.getItem('line_id'))
    {
      this.filter = {
        ...this.filter,
        line_id: localStorage.getItem('line_id')
      }
    }

    this.getMachines()
  },
}
</script>

<style>
.status-wrapper {
  width: 30px;
  height: 30px;
  background-color: #f0fdf4;
  border-radius: 6px;
}

.check-wrapper {
  width: 30px;
  height: 30px;
  background-color: #e0f2fe;
  border-radius: 100px;
  border: none;
}

.check-wrapper-null {
  width: 30px;
  height: 30px;
  background-color: #f3f4f6;
  border-radius: 100px;
  border: none;
}

.bullet {
  width: 10px;
  height: 10px;
  border: 2px solid black;
  border-radius: 10px;
}

.bullet-filled {
  width: 10px;
  height: 10px;
  background-color: black;
  border: 2px solid black;
  border-radius: 10px;
}

.bullet-cancel {
  width: 10px;
  height: 10px;
  background-color: black;
  border: 2px solid black;
  border-radius: 10px;
}
</style>
