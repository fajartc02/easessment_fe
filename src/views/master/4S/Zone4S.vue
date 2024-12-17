<template>
  <div class="d-flex flex-row justify-content-between mb-2">
    <div class="flex-column">
      <h4>Master Zone 4S</h4>
    </div>
    <div class="flex-column">
      <button class="btn btn-primary" @click="() => { isAddModal = true }">Add Zone</button>
      <CModal backdrop="static" :visible="isAddModal" @close="() => {
        isAddModal = false
        this.newZone = {
          line_id: null,
          zone_nm: null
        }
      }">
        <CModalHeader>
          <CModalTitle>Add Zone</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div class="row">
            <div class="col">
              <label>Line</label>
              <select class="form-select" v-model="newZone.line_id">
                <option v-for="(line, index) in getLinesOptsWithoutAll" :key="index" :value="line.id">
                  {{ line.text }}
                </option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <label>Zone</label>
              <input class="form-control" type="text" v-model="newZone.zone_nm">
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <button class="btn btn-sm btn-primary" @click="storeNewZone">
            <template v-if="isLoading">
              <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
              Loading...
            </template>
            <template v-else>
              Submit
            </template>
          </button>
        </CModalFooter>
      </CModal>
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
      </div>
    </div>
    <div class="card-body">
      <TableZone4s :filter="filter" />
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
        <div class="col"></div>
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
import { GET_ZONES, POST_ZONE } from '@/store/modules/zone.module'

import CustPagination from '@/components/pagination/CustPagination.vue';
import TableZone4s from '@/components/table/TableZone4s.vue'

import FnRequireFullFillInput from '@/functions/FnRequireFullFillInput'
import { toast } from 'vue3-toastify'

export default {
  name: 'Zone4S',
  data() {
    return {
      filter: {
        line_id: -1,
        zone_id: -1,
        limit: 10,
        total_data: 1,
        current_page: 1,
        freq_id: -1,
        isPaginate: true,
      },
      isAddModal: false,
      newZone: {
        line_id: null,
        zone_nm: null,
      },
      isLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'getZone',
      'getLinesOpts',
      'getPagination',
      'getLinesOptsWithoutAll',
    ]),
    getLineName() {
      let line = this.getLinesOptsWithoutAll.find(line => line.id == this.newZone.line_id)
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
        this.$store.dispatch(GET_ZONES, this.filter)
      },
      deep: true
    },
    newZone: {
      handler() {
        if (this.newZone.line_id) {
          this.$store.dispatch(GET_ZONES, this.filter)
        }
      },
      deep: true
    }
  },
  methods: {
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    changesLine() {
      if (this.filter.selectedLine != -1) {
        this.getZones()
      } else {
        this.filter.selectedZone = -1
      }
    },
    async getZones() {
      try {
        this.$store.dispatch(GET_ZONES, this.filter)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async storeNewZone() {
      try {
        this.isLoading = true
        const isInputFullFill = FnRequireFullFillInput(this.newZone)
        if (isInputFullFill) {
          await this.$store.dispatch(POST_ZONE, this.newZone)
          this.isLoading = false
          this.isAddModal = false
          this.newZone = {
            line_id: null,
            zone_nm: null,
          }
          toast.success('Berhasil menambah Zone', {
            autoClose: 1000
          })
          await this.getZones()
        } else {
          toast.info('Lengkapi input terlebih dahulu', {
            autoClose: 1000
          })
          this.isLoading = false
        }
      } catch (error) {
        this.isLoading = false
        alert(error.response.data.message)
        // if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    handlePageChange(page) {
      this.filter.current_page = page;
      this.$store.dispatch(GET_ZONES, this.filter)
    },
  },
  async mounted() {
    if (localStorage.getItem('line_id')) {
      this.filter.line_id = localStorage.getItem('line_id')
    }
    this.filter.current_page = this.getPagination.current_page
    this.filter.limit = this.getPagination.limit
    this.filter.total_data = this.getPagination.total_data ? this.getPagination.total_data : 1
    this.isLoading = true
    await this.getLines();
    await this.getZones();
    this.isLoading = false
  },
  components: {
    TableZone4s,
    CustPagination
  }
}
</script>
@/functions/FnRequireFullFillInput
