 
<template>
  <div>
    <div class="card mb-3">
      <Filter filter-type="member-voice" />
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5>Member Voice List</h5>
        <button
          class="btn btn-info text-white"
          @click="
            () => {
              addMemberVoiceModal = true
            }
          "
        >
          Add member voice
        </button>
      </div>
      <div>
        <table class="table table-bordered table-stripped">
          <thead class="text-center">
            <tr>
              <th rowspan="3">No</th>
              <th rowspan="3">Tanggal</th>
              <th rowspan="3">Lokasi</th>
              <th rowspan="3">Problem</th>
              <th rowspan="3">No Proses</th>
              <th rowspan="3">Kategori</th>
              <th rowspan="3">Penanggulangan</th>
              <th rowspan="3">Evaluasi Hasil</th>
              <th colspan="24">Waktu Pelaksanaan</th>
              <th rowspan="3">PIC</th>
            </tr>
            <tr>
              <th colspan="4">Jan</th>
              <th colspan="4">Feb</th>
              <th colspan="4">Mar</th>
              <th colspan="4">Apr</th>
              <th colspan="4">Mei</th>
              <th colspan="4">Jun</th>
            </tr>
            <tr>
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>

    <!-- modals -->
    <CModal
      scrollable
      backdrop="static"
      alignment="center"
      :visible="addMemberVoiceModal"
      @close="
        () => {
          addMemberVoiceModal = false
        }
      "
    >
      <CModalHeader>
        <CModalTitle>Add member voice</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>
          <div class="mb-2">
            <label class="mb-1">Tanggal temuan</label>
            <input type="date" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Lokasi</label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Problem</label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">No Proses</label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Category </label>
            <select class="form-select">
              <option selected>Select category</option>
              <option value="safety">Safety</option>
              <option value="kesulitan kerja">Kesulitan kerja</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="mb-1">Faktor </label>
            <select class="form-select">
              <option selected>Select factor</option>
              <option value="man">Man</option>
              <option value="machine">Machine</option>
              <option value="materials">Materials</option>
              <option value="method">Method</option>
              <option value="environment">Environment</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="mb-1">Penanggulangan</label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Eval hasil</label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Plan tgl penganggulangan</label>
            <input type="date" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Aktual tgl penganggulangan</label>
            <input type="date" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">PIC</label>
            <VueMultiselect v-model="selectedPIC" :options="picData">
            </VueMultiselect>
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton
          color="secondary"
          @click="
            () => {
              addMemberVoiceModal = false
            }
          "
        >
          Close
        </CButton>
        <CButton color="primary">Save changes</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>
    
    <script>
import moment from 'moment'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_USERS } from '@/store/modules/user.module'
import { mapGetters } from 'vuex'
import Filter from '@/components/Filter.vue'
import VueMultiselect from 'vue-multiselect'

export default {
  name: 'Member Voice',
  data() {
    return {
      selectedMonth: null,
      selectedLine: '-1',
      addMemberVoiceModal: false,
      picData: [],
      selectedPIC: null,
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts', 'getUsersOpts']),
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
    async getUsers() {
      try {
        this.$store.dispatch(GET_USERS)
        if (this.getUsersOpts) {
          this.mapUsersData()
        }
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    mapUsersData() {
      this.getUsersOpts?.map((item) => {
        this.picData.push(item.text)
      })
    },
  },
  mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    this.selectedLine = localStorage.getItem('line_id')
    this.getLines()
    this.getUsers()
  },
  components: { Filter, VueMultiselect },
}
</script>
    

<style src="vue-multiselect/dist/vue-multiselect.css"></style>