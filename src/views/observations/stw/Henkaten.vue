<template>
  <div>
    <div class="card mb-3">
      <div class="card-header">
        <div class="row">
          <div class="col">
            <label>Start date</label>
            <input
              type="date"
              class="form-control"
              v-model="selectedFilterStartDate"
              @change="addFilter()"
            />
          </div>
          <div class="col">
            <label>End date</label>
            <input
              type="date"
              class="form-control"
              v-model="selectedFilterEndDate"
              @change="addFilter()"
            />
          </div>
          <div class="col">
            <label>Line</label>
            <select
              class="form-select"
              v-model="selectedLine"
              @change="addFilter()"
            >
              <option
                v-for="(line, index) in getLinesOpts"
                :key="index"
                :value="line.id"
              >
                {{ line.text }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5>Henkaten List</h5>
        <button
          class="btn btn-info text-white"
          @click="
            () => {
              addHenkatenModal = true
              mapUsersData()
            }
          "
        >
          Add henkaten
        </button>
      </div>
      <div>
        <table class="table table-striped text-center">
          <thead>
            <tr>
              <th>No</th>
              <th>Line</th>
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
            <tr v-if="isLoading">
              <td colspan="10" class="p-0" style="height: 200px">
                <div class="vl-parent p-0" style="height: 100%">
                  <loading
                    v-model:active="isLoading"
                    :can-cancel="true"
                    :is-full-page="false"
                    :on-cancel="onCancel"
                  />
                </div>
              </td>
            </tr>
            <tr v-else v-for="(henkaten, index) in getHenkatens" :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ henkaten.line_nm }}</td>
              <td>{{ formatTheDate(henkaten.henkaten_date) }}</td>
              <td>{{ henkaten.henkaten_location }}</td>
              <td>{{ henkaten.henkaten_pic_nm }}</td>
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
            <tr v-if="getHenkatens?.length < 1">
              <td colspan="50">
                <h3 class="my-2">Data kosong</h3>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- pagination -->
      <Pagination
        :totalPages="10"
        :perPage="10"
        :currentPage="currentPage"
        @changePage="onPageChange"
        @changeLimit="onPageChangeLimit"
      />
    </div>

    <!-- modals -->
    <CModal
      scrollable
      backdrop="static"
      alignment="center"
      :visible="addHenkatenModal"
      @close="addHenkatenModal = false"
      size="lg"
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
                <div class="mb-2">
                  <label class="mb-1">Henkaten location</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="henkatenData.henkaten_location"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Line</label>
                  <VueMultiselect
                    v-model="henkatenData.henkaten_line_id"
                    :options="lineData"
                    :custom-label="customLineFilterOptions"
                  >
                  </VueMultiselect>
                </div>
                <div class="mb-2">
                  <label class="mb-1">PIC</label>
                  <VueMultiselect
                    v-model="henkatenData.henkaten_pic"
                    :options="picData"
                    :custom-label="customPicOptions"
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
                  <select
                    class="form-select"
                    v-model="findingsData.cm_priority"
                  >
                    <option selected>Select priority</option>
                    <option value="P1">P1: Safety & Quality Issue</option>
                    <option value="P2">P2: Productivity Issue</option>
                    <option value="P3">P3: Cost Issue</option>
                  </select>
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
                    :custom-label="customPicOptions"
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
                    disabled
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM End actual date</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="findingsData.cm_end_act_date"
                    disabled
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM Training date</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="findingsData.cm_training_date"
                    disabled
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM Judge</label>
                  <select
                    class="form-select"
                    v-model="findingsData.cm_judg"
                    disabled
                  >
                    <option selected>Select judgement</option>
                    <option value="true">Sudah</option>
                    <option value="false">Belum</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM Sign LH Red</label>
                  <input type="file" class="form-control" disabled />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM Sign LH White</label>
                  <input type="file" class="form-control" disabled />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM Sign SH</label>
                  <input type="file" class="form-control" disabled />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM Comments</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="findingsData.cm_comments"
                    disabled
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
import { mapGetters } from 'vuex'
import { GET_USERS } from '@/store/modules/user.module'
import { GET_HENKATEN, POST_HENKATEN } from '@/store/modules/henkaten.module'
import { GET_LINES } from '@/store/modules/line.module'
import VueMultiselect from 'vue-multiselect'
import Swal from 'sweetalert2'
import ApiService from '@/store/api.service'
import Loading from 'vue-loading-overlay'
import Pagination from '@/components/Pagination.vue'

export default {
  name: 'Henkaten',
  data() {
    return {
      isLoading: false,
      currentPage: 1,
      currentPageLimit: 5,
      selectedMonth: null,
      addHenkatenModal: false,
      selectedLineID: '',
      picData: [],
      lineData: [],
      factors: [],
      categories: [],
      selectedPIC: null,
      selectedFilterStartDate: '',
      selectedFilterEndDate: '',
      selectedFilterLineID: '-1',
      henkatenData: {
        henkaten_date: '',
        henkaten_location: '',
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
        finding_date: ' ',
        finding_location: '',
        finding_desc: '',
        cm_desc: '',
        cm_priority: 0,
        category_id: '',
        factor_id: '',
        cm_pic_id: '',
        cm_str_plan_date: '',
        cm_end_plan_date: '',
        cm_result_factor_id: '',
        cm_str_act_date: '',
        cm_end_act_date: '',
        cm_training_date: '',
        cm_judg: false,
        cm_sign_lh_red: null,
        cm_sign_lh_white: null,
        cm_sign_sh: null,
        cm_comments: null,
      },
    }
  },
  computed: {
    ...mapGetters(['getUsersOpts', 'getHenkatens', 'getLinesOpts']),
  },
  methods: {
    onPageChange(page) {
      if (page == -1) {
        this.currentPage = this.currentPage - 1
        this.getHenkaten()
      } else {
        this.currentPage = this.currentPage + 1
        this.getHenkaten()
      }
    },
    onPageChangeLimit(limit) {
      this.currentPageLimit = limit
      this.getHenkaten()
    },
    formatTheDate(val) {
      const year = val.split('T')[0].split('-')[0]
      const month = val.split('T')[0].split('-')[1]
      const day = val.split('T')[0].split('-')[2]

      return `${year}-${month}-${day}`
    },
    initData() {
      if (this.getHenkatens) {
        this.selectedLineID = this.getHenkatens[0]?.henkaten_line_id
      }
    },
    addHenkatenData() {
      this.findingsData.cm_result_factor_id = this.findingsData.factor_id

      let data = {
        ...this.henkatenData,
        findings: this.findingsData,
      }
      this.addHenkaten(data)
    },
    async getHenkaten() {
      this.isLoading = true

      let objQuery = {
        start_date:
          this.selectedFilterStartDate !== ''
            ? this.selectedFilterStartDate
            : this.selectedMonth + '-01',
        end_date:
          this.selectedFilterEndDate !== ''
            ? this.selectedFilterEndDate
            : this.selectedMonth + '-29',
        line_id: this.selectedLine,
        limit: this.currentPageLimit,
        currentPage: this.currentPage,
      }

      try {
        this.$store.dispatch(GET_HENKATEN, objQuery).then((res) => {
          if (res) {
            this.isLoading = false
          }
        })
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
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
        if (this.getLinesOpts) {
          this.mapLinesData()
        }
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
    mapLinesData() {
      this.getLinesOpts?.map((item) => {
        this.lineData.push({ line_id: item.id, line_name: item.text })
      })
    },
    mapUsersData() {
      this.getUsersOpts?.map((item) => {
        this.picData.push({ pic_id: item.id, pic_name: item.text })
      })
    },
    customLineFilterOptions({ line_name }) {
      return `${line_name}`
    },
    customPicOptions({ pic_name }) {
      return `${pic_name}`
    },
    addFilter() {
      this.getHenkaten()
    },
  },
  async mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    this.selectedLine = localStorage.getItem('line_id')
    this.selectedFilterStartDate = `${year}-${month}-01`
    this.selectedFilterEndDate = `${year}-12-31`
    await this.getLines()
    await this.getUsers()
    await this.getCategories()
    await this.getFactors()
    await this.getHenkaten()
    this.initData()
  },
  updated() {
    this.mapLinesData()
    this.mapUsersData()
  },
  components: { VueMultiselect, Loading, Pagination },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

  