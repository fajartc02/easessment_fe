<template>
  <div>
    <div class="card mb-3">
      <Filter filter-type="henkaten" />
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5>Henkaten List</h5>
        <button
          class="btn btn-info text-white"
          @click="addHenkatenModal = true"
        >
          Add henkaten
        </button>
      </div>
      <div>
        <table class="table table-striped text-center">
          <thead>
            <tr>
              <th>No</th>
              <th>Date</th>
              <th>Machine</th>
              <th>PIC</th>
              <th>Perubahan</th>
              <th>Tujuan</th>
              <th>Safety</th>
              <th>Quality</th>
              <th>Actions</th>
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
      :visible="addHenkatenModal"
      @close="addHenkatenModal = false"
    >
      <CModalHeader>
        <CModalTitle>Add henkaten</CModalTitle>
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
        <CButton color="secondary" @click="addHenkatenModal = false">
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
import Filter from '@/components/Filter.vue'
import VueMultiselect from 'vue-multiselect'

export default {
  name: 'Henkaten',
  data() {
    return {
      selectedMonth: null,
      addHenkatenModal: false,
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
  components: { Filter, VueMultiselect },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

  