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
            <tr v-for="(henkaten, index) in getHenkatens" :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ henkaten.henkaten_date }}</td>
              <td>@</td>
              <td>{{ henkaten.henkaten_pic }}</td>
              <td>{{ henkaten.henkaten_desc }}</td>
              <td>{{ henkaten.henkaten_purpose }}</td>
              <td>{{ henkaten.henkaten_flw_safety }}</td>
              <td>{{ henkaten.henkaten_flw_quality }}</td>
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
      scrollable
      backdrop="static"
      alignment="center"
      :visible="addHenkatenModal"
      @close="addHenkatenModal = false"
    >
      <CModalHeader>
        <CModalTitle>Add henkaten</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CAccordion :active-item-key="1" always-open>
          <CAccordionItem :item-key="1">
            <CAccordionHeader> Henkaten input </CAccordionHeader>
            <CAccordionBody>
              <div>
                <div class="mb-2">
                  <label class="mb-1">Start date</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="henkatenData.henkaten_date"
                  />
                </div>
                <!-- <div class="mb-2">
                  <label class="mb-1">Machine</label>
                  <input type="text" class="form-control" />
                </div> -->
                <div class="mb-2">
                  <label class="mb-1">PIC</label>
                  <VueMultiselect
                    v-model="henkatenData.henkaten_pic"
                    :options="picData"
                  >
                  </VueMultiselect>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Perubahan</label>
                  <textarea
                    type="text"
                    class="form-control"
                    v-model="henkatenData.henkaten_desc"
                  >
                  </textarea>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Tujuan</label>
                  <textarea
                    type="text"
                    class="form-control"
                    v-model="henkatenData.henkaten_purpose"
                  >
                  </textarea>
                </div>
                <span style="font-weight: bold" class="mb-2"
                  >Follow (2 weeks) item</span
                >
                <div class="mb-2">
                  <label class="mb-1">Safety</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="henkatenData.henkaten_flw_safety"
                  />
                </div>
                <div>
                  <label class="mb-1">Quality</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="henkatenData.henkaten_flw_quality"
                  />
                </div>
              </div>
            </CAccordionBody>
          </CAccordionItem>
          <CAccordionItem :item-key="2">
            <CAccordionHeader> Findings input </CAccordionHeader>
            <CAccordionBody>
              <div>
                <div class="mb-2">
                  <label class="mb-1">Tanggal temuan</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="findingsData.finding_date"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Pos</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="findingsData.finding_location"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Finding description</label>
                  <textarea
                    cols="30"
                    rows="5"
                    class="form-control"
                    v-model="findingsData.finding_desc"
                  ></textarea>
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM description</label>
                  <textarea
                    cols="30"
                    rows="5"
                    class="form-control"
                    v-model="findingsData.cm_desc"
                  ></textarea>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Priority</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="findingsData.cm_priority"
                  />
                </div>

                <div class="mb-2">
                  <label class="mb-1">Category </label>
                  <select
                    class="form-select"
                    v-model="findingsData.category_id"
                  >
                    <option selected>Select category</option>
                    <option
                      v-for="category in categories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <div class="mb-2">
                  <label class="mb-1">Faktor </label>
                  <select class="form-select" v-model="findingsData.factor_id">
                    <option disabled>Select Factor</option>
                    <option
                      v-for="factor in factors"
                      :key="factor.text"
                      :value="factor.id"
                    >
                      {{ factor.text }}
                    </option>
                  </select>
                </div>

                <div class="mb-2">
                  <label class="mb-1">PIC </label>
                  <VueMultiselect
                    v-model="findingsData.cm_pic_id"
                    :options="picData"
                  >
                  </VueMultiselect>
                </div>

                <div class="mb-2">
                  <label class="mb-1">CM Start Plan Date </label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="findingsData.cm_str_plan_date"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM End Plan Date </label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="findingsData.cm_end_plan_date"
                  />
                </div>

                <hr />

                <div class="mb-2">
                  <label class="mb-1">CM Start actual date</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="findingsData.cm_str_act_date"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM End actual date</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="findingsData.cm_end_act_date"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM Training date</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="findingsData.cm_training_date"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM Judge</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="findingsData.cm_judg"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM Sign LH Red</label>
                  <input type="file" class="form-control" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM Sign LH White</label>
                  <input type="file" class="form-control" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM Sign SH</label>
                  <input type="file" class="form-control" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM Comments</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="findingsData.cm_comments"
                  />
                </div>
              </div>
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="addHenkatenModal = false">
          Close
        </CButton>
        <CButton color="primary" @click="addHenkatenData">Save changes</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>
  
  <script>
import moment from 'moment'
import { GET_USERS } from '@/store/modules/user.module'
import { GET_HENKATEN, POST_HENKATEN } from '@/store/modules/henkaten.module'
import { mapGetters } from 'vuex'
import Filter from '@/components/Filter.vue'
import VueMultiselect from 'vue-multiselect'
import Swal from 'sweetalert2'
import ApiService from '@/store/api.service'

export default {
  name: 'Henkaten',
  data() {
    return {
      isLoading: false,
      selectedMonth: null,
      addHenkatenModal: false,
      selectedLineID: '',
      picData: [],
      factors: [],
      categories: [],
      selectedPIC: null,
      henkatenData: {
        henkaten_date: '',
        henkaten_pic: '',
        henkaten_desc: '',
        henkaten_purpose: '',
        henkaten_flw_safety: '',
        henkaten_flw_quality: '',
        henkaten_line_id: '',
      },
      // findings data
      findingsData: {
        line_id: '',
        finding_date: '2024-02-05',
        finding_location: 'location finding test',
        finding_desc: 'ini adalah temuanku',
        cm_desc: 'temuan akan di perbaiki',
        cm_priority: 0,
        category_id: '',
        factor_id: '',
        cm_pic_id: '',
        cm_str_plan_date: '2024-02-12',
        cm_end_plan_date: '2024-03-02',
        cm_result_factor_id: '',
        cm_str_act_date: '2024-02-02',
        cm_end_act_date: '2024-03-04',
        cm_training_date: '2024-03-06',
        cm_judg: true,
        cm_sign_lh_red: null,
        cm_sign_lh_white: null,
        cm_sign_sh: null,
        cm_comments: null,
      },
    }
  },
  computed: {
    ...mapGetters(['getUsersOpts', 'getHenkatens']),
  },
  methods: {
    initData() {
      this.selectedLineID = this.getHenkatens[0]?.henkaten_line_id
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
    addHenkatenData() {
      this.henkatenData.henkaten_line_id = this.selectedLineID
      this.findingsData.line_id = this.selectedLineID
      this.findingsData.cm_result_factor_id = this.findingsData.factor_id

      let data = {
        ...this.henkatenData,
        findings: this.findingsData,
      }
      this.addHenkaten(data)
    },
    async getHenkaten() {
      this.isLoading = true
      try {
        this.$store.dispatch(GET_HENKATEN)
        this.isLoading = false

        if (this.getHenkatens) {
          this.isLoading = false
        }
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
        this.isLoading = false
      }
    },
    async addHenkaten(data) {
      try {
        await this.$store.dispatch(POST_HENKATEN, data).then(() => {
          Swal.showLoading()
          Swal.fire('Success to add henkaten data', '', 'success')
          this.addHenkatenModal = false
          this.getHenkaten()
        })
      } catch (error) {
        console.log(error)
        Swal.fire('Failed to add henkaten data', '', 'error')
        this.addHenkatenModal = false
      }
    },
    async getFactors() {
      ApiService.setHeader()
      const factors = await ApiService.get(`master/factors`)
      this.factors = factors.data.data
    },
    async getCategories() {
      ApiService.setHeader()
      const categories = await ApiService.get(`master/categories`)
      let category = []
      categories.data.data.map((item) => {
        let cat = {
          name: item.category_nm,
          id: item.id,
        }
        category.push(cat)
      })

      this.categories = category
    },
    mapUsersData() {
      this.getUsersOpts?.map((item) => {
        this.picData.push(item.id)
      })
    },
  },
  async mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    this.selectedLine = localStorage.getItem('line_id')
    await this.getUsers()
    await this.getCategories()
    await this.getFactors()
    await this.getHenkaten()
    this.initData()
  },
  components: { Filter, VueMultiselect },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

  