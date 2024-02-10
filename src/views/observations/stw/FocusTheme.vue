<template>
  <div>
    <div class="card mb-3">
      <Filter filterType="focus-theme" />
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5>Fokus Tema</h5>
        <button
          class="btn btn-info text-white"
          @click="addFocusThemeModal = true"
        >
          Add fokus tema
        </button>
      </div>
      <div>
        <div class="border-bottom text-center py-2">
          <span>Periode Jan-Mar 2023</span>
        </div>
        <table class="table table-striped text-center">
          <thead>
            <tr>
              <th>No</th>
              <th>Fokus tema</th>
              <th>Pilar</th>
              <th>Evaluasi</th>
              <th>Remark</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>
                <div class="d-flex justify-content-center align-items-center">
                  <FocusThemeIndicatorVue total="3"></FocusThemeIndicatorVue>
                </div>
              </td>
              <td>@mdo</td>
              <td>
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
      :visible="addFocusThemeModal"
      @close="addFocusThemeModal = false"
    >
      <CModalHeader>
        <CModalTitle>Add fokus tema</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>
          <div class="mb-2">
            <label class="mb-1">Fokus tema</label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Pilar</label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Evaluasi</label>
            <select class="form-select">
              <option selected>Select evaluasi</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="mb-1">Remark</label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Kaizen report</label>
            <input type="file" class="form-control" />
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="addFocusThemeModal = false">
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
import { mapGetters } from 'vuex'
import Filter from '@/components/Filter.vue'
import FocusThemeIndicatorVue from '@/components/FocusThemeIndicator.vue'

export default {
  name: 'Focus Theme',
  data() {
    return {
      selectedMonth: null,
      selectedLine: '-1',
      addFocusThemeModal: false,
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts']),
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
  },
  mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    this.selectedLine = localStorage.getItem('line_id')
    this.getLines()
  },
  components: { Filter, FocusThemeIndicatorVue },
}
</script>
    