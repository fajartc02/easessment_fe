<template>
  <div>
    <div class="card mb-3">
      <StwFilter />
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5>List temuan</h5>
        <button
          class="btn btn-info text-white"
          @click="
            () => {
              addTemuanModal = true
            }
          "
        >
          Add list
        </button>
      </div>
      <div style="width: 100%; overflow-x: scroll">
        <table class="table table-striped table-bordered text-center">
          <thead class="text-center">
            <tr>
              <th rowspan="3">No</th>
              <th rowspan="3">Source cat</th>
              <th rowspan="3">Tanggal</th>
              <th rowspan="3">Pos</th>
              <th rowspan="3">Temuan prob</th>
              <th rowspan="3">Rencana perbaikan</th>
              <th rowspan="3">priority</th>
              <th>Stop 6</th>
              <th>Rank WRAS</th>
              <th colspan="3">3 slip</th>
              <th rowspan="2">PCI/ECI</th>
              <th rowspan="2">MT/KZ/ENG</th>
              <th rowspan="3">Schedule PIC</th>
              <th rowspan="2" colspan="4">March</th>
              <th rowspan="2" colspan="4">Apr</th>
              <th rowspan="2" colspan="4">May</th>
              <th rowspan="2" colspan="4">June</th>
              <th rowspan="2" colspan="4">July</th>
              <th rowspan="2" colspan="4">Aug</th>
              <th rowspan="2" colspan="4">Sept</th>
              <th rowspan="3">Actions</th>
            </tr>
            <tr>
              <th colspan="2" rowspan="2">Safety</th>
              <th colspan="">SOP</th>
              <th colspan="">TSKK</th>
              <th colspan="">TSK</th>
            </tr>
            <tr>
              <th>Method</th>
              <th colspan="2">Man</th>
              <th>Material</th>
              <th>Machine</th>
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
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>@mdo</td>
              <td>@mdo</td>
              <td>@mdo</td>
              <td>@mdo</td>
              <td>@mdo</td>
              <td>@mdo</td>
              <td>@mdo</td>
              <td>@mdo</td>
              <td>@mdo</td>
              <td>@mdo</td>
              <td>@mdo</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>@</td>
              <td>
                <button
                  class="btn btn-info btn-sm text-white"
                  @click="detailTemuanModal = true"
                >
                  Detail
                </button>
                <button class="btn btn-danger btn-sm text-white mx-2">
                  Delete
                </button>
                <button class="btn btn-info btn-sm text-white">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- modals -->
    <CModal
      backdrop="static"
      alignment="center"
      :visible="addTemuanModal"
      @close="addTemuanModal = false"
    >
      <CModalHeader>
        <CModalTitle>Add temuan</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>
          <div class="mb-2">
            <label class="mb-1">Start date</label>
            <input type="date" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Machine</label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">PIC</label>
            <VueMultiselect v-model="selectedPIC" :options="picData">
            </VueMultiselect>
          </div>
          <div class="mb-2">
            <label class="mb-1">Perubahan</label>
            <textarea type="text" class="form-control"> </textarea>
          </div>
          <div class="mb-2">
            <label class="mb-1">Tujuan</label>
            <textarea type="text" class="form-control"> </textarea>
          </div>
          <span style="font-weight: bold" class="mb-2"
            >Follow (2 weeks) item</span
          >
          <div class="mb-2">
            <label class="mb-1">Safety</label>
            <input type="text" class="form-control" />
          </div>
          <div>
            <label class="mb-1">Quality</label>
            <input type="text" class="form-control" />
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="addTemuanModal = false">
          Close
        </CButton>
        <CButton color="primary">Save changes</CButton>
      </CModalFooter>
    </CModal>

    <CModal
      backdrop="static"
      alignment="center"
      :visible="detailTemuanModal"
      @close="detailTemuanModal = false"
    >
      <CModalHeader>
        <CModalTitle>Detail temuan</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>
          <div class="mb-2">
            <label class="mb-1">Start date</label>
            <input type="date" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Machine</label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">PIC</label>
            <VueMultiselect v-model="selectedPIC" :options="picData">
            </VueMultiselect>
          </div>
          <div class="mb-2">
            <label class="mb-1">Perubahan</label>
            <textarea type="text" class="form-control"> </textarea>
          </div>
          <div class="mb-2">
            <label class="mb-1">Tujuan</label>
            <textarea type="text" class="form-control"> </textarea>
          </div>
          <span style="font-weight: bold" class="mb-2"
            >Follow (2 weeks) item</span
          >
          <div class="mb-2">
            <label class="mb-1">Safety</label>
            <input type="text" class="form-control" />
          </div>
          <div>
            <label class="mb-1">Quality</label>
            <input type="text" class="form-control" />
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="detailTemuanModal = false">
          Close
        </CButton>
        <CButton color="primary">Save changes</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>
    
    <script>
import moment from 'moment'
import { GET_USERS } from '@/store/modules/user.module'
import { mapGetters } from 'vuex'
import StwFilter from '@/components/StwFilter.vue'
import VueMultiselect from 'vue-multiselect'

export default {
  name: 'List Temuan',
  data() {
    return {
      selectedMonth: null,
      addTemuanModal: false,
      detailTemuanModal: false,
      picData: [],
      selectedPIC: null,
    }
  },
  computed: {
    ...mapGetters(['getUsersOpts']),
  },
  methods: {
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
    this.getUsers()
  },
  components: { StwFilter, VueMultiselect },
}
</script>
  
  <style src="vue-multiselect/dist/vue-multiselect.css"></style>
  
    