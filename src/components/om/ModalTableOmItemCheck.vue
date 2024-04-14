<template>
  <CModal backdrop="static" :visible="visible" @close="cancel()" size="lg">
    <CModalHeader>
      <CModalTitle>OM Item Check Kanban</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="d-flex flex-column">
        <div class="d-flex justify-content-end">
          <button class="btn btn-primary" @click="onAddNew()">Add Item Check</button>
        </div>
        <hr />
      </div>
      <div class="row">
        <div class="col">
          <label>Line</label>
          <CFormInput v-model="getGroupMachineDetail.line_nm" :disabled="true" />
        </div>
        <div class="col">
          <label>Machine</label>
          <CFormInput v-model="getGroupMachineDetail.machine_nm" :disabled="true" />
        </div>
        <div class="col">
          <label>Freqs</label>
          <select class="form-select" v-model="filter.freq_id">
            <option v-for="(freq, index) in getFreqsOpts" :key="index" :value="freq.id">
              {{ freq.text }}
            </option>
          </select>
        </div>
      </div>
      <hr />
      <TableOmItemCheck @selectedEdit="onSelectedEdit($event)" />
    </CModalBody>
    <hr />
    <div class="px-3">
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
  </CModal>
</template>


<script>
import TableOmItemCheck from '@/components/om/TableOmItemCheck.vue'
import CustPagination from '@/components/pagination/CustPagination.vue';
import { mapGetters } from 'vuex'
import { GET_OM_ITEM_CHECKS } from '@/store/modules/omItemChecks.module'

export default {
  name: "ModalTableOmItemCheck",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      filter: {
        line_id: -1,
        freq_id: -1,
        machine_id: -1,
        limit: 10,
        total_data: 1,
        current_page: 1,
      },
    }
  },
  computed: {
    ...mapGetters(['getGroupMachineDetail', 'getFreqsOpts', 'getPagination']),
  },
  watch: {
    getPagination: {
      handler() {
        this.filter = this.remapFilter()
      },
      deep: true
    },
    filter: {
      handler() {
        this.$store.dispatch(GET_OM_ITEM_CHECKS, this.remapFilter())
      },
      deep: true
    },
  },
  methods: {
    handlePageChange(page) {
      this.filter.current_page = page;
      this.$store.dispatch(GET_OM_ITEM_CHECKS, this.remapFilter())
    },
    remapFilter() {
      return {
        ...this.filter,
        line_id: this.getGroupMachineDetail.line_id,
        machine_id: this.getGroupMachineDetail.machine_id,
        limit: this.getPagination.limit,
        total_data: this.getPagination.total_data,
        current_page: this.getPagination.current_page
      }
    },
    onAddNew() {
      this.$emit('showFormItemCheck', {
        data: null,
        visible: true
      });
    },
    onSelectedEdit(event) {
      this.$emit('showFormItemCheck', {
        data: event,
        visible: true
      });
    },
    cancel() {
      this.$emit('visible', {
        visible: false,
        refresh: false
      });
    }
  },
  components: {
    TableOmItemCheck,
    CustPagination
  },
}
</script>

<style scoped></style>
