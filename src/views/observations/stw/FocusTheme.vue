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
              v-model="selectedFilterLineID"
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
        <h5>Fokus Tema</h5>
        <button
          class="btn btn-info text-white"
          @click=";(addFocusThemeModal = true), mapUsersData()"
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
              <th>Line</th>
              <th>Fokus tema</th>
              <th>Pilar</th>
              <th>Evaluasi</th>
              <th>Remark</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="7" class="p-0" style="height: 200px">
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
            <tr
              v-else
              v-for="(focustheme, index) in getFocusTheme"
              :key="focustheme.ft_id"
            >
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ focustheme.line_nm }}</td>
              <td>{{ focustheme.ft_desc }}</td>
              <td>{{ focustheme.ft_pillar }}</td>
              <td>
                <div class="d-flex justify-content-center align-items-center">
                  <FocusThemeIndicatorVue
                    :total="focustheme.ft_evaluation_num"
                  ></FocusThemeIndicatorVue>
                </div>
              </td>
              <td>{{ focustheme.ft_remark }}</td>
              <td>
                <button
                  class="btn btn-warning btn-sm text-white"
                  @click="focusThemeDetailData(index)"
                >
                  Problems
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
      :visible="addFocusThemeModal"
      @close="addFocusThemeModal = false"
      size="lg"
    >
      <CModalHeader>
        <CModalTitle>Add fokus tema</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CAccordion :active-item-key="1" always-open>
          <CAccordionItem :item-key="1">
            <CAccordionHeader> Focus theme input </CAccordionHeader>
            <CAccordionBody>
              <div>
                <div class="mb-2">
                  <label class="mb-1">Fokus tema</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="focusThemeData.ft_desc"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Line</label>
                  <VueMultiselect
                    v-model="focusThemeData.ft_line_id"
                    :options="lineData"
                    placeholder=""
                    :custom-label="customLineFilterOptions"
                  >
                  </VueMultiselect>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Pilar</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="focusThemeData.ft_pillar"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Evaluasi</label>
                  <select
                    class="form-select"
                    v-model="focusThemeData.ft_evaluation_num"
                  >
                    <option selected>Select evaluasi</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Remark</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="focusThemeData.ft_remark"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Kaizen report</label>
                  <input type="file" class="form-control" />
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
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
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
        <CButton color="secondary" @click="addFocusThemeModal = false">
          Close
        </CButton>
        <CButton color="primary" @click="addFocusThemeData"
          >Save changes</CButton
        >
      </CModalFooter>
    </CModal>

    <CModal
      scrollable
      backdrop="static"
      alignment="center"
      :visible="focusThemeDetailModal"
      @close="focusThemeDetailModal = false"
      size="lg"
    >
      <CModalHeader>
        <CModalTitle>Detail fokus tema</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>
          <table class="table table-striped table-bordered">
            <thead>
              <th>No</th>
              <th>Line name</th>
              <th>Finding date</th>
              <th>Finding desc</th>
              <th>CM Desc</th>
              <th>CM Judge</th>
            </thead>
            <tbody>
              <tr
                v-for="(findingDetail, index) in selectedFocusTheme.findings"
                :key="index"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ findingDetail.line_nm }}</td>
                <td>{{ formatTheDate(findingDetail.finding_date) }}</td>
                <td>{{ findingDetail.finding_desc }}</td>
                <td>{{ findingDetail.cm_desc }}</td>
                <td>
                  {{ findingDetail.cm_judge == true ? 'Sudah' : 'Belum' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton
          color="secondary"
          class="text-white"
          @click="
            () => {
              focusThemeDetailModal = false
              this.selectedFocusTheme = null
            }
          "
        >
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>
    
    <script>
import moment from 'moment'
import { GET_LINES } from '@/store/modules/line.module'
import {
  GET_FOCUSTHEME,
  POST_FOCUSTHEME,
} from '@/store/modules/focustheme.module'
import { GET_USERS } from '@/store/modules/user.module'
import { mapGetters } from 'vuex'
import FocusThemeIndicatorVue from '@/components/FocusThemeIndicator.vue'
import VueMultiselect from 'vue-multiselect'
import Swal from 'sweetalert2'
import ApiService from '@/store/api.service'
import Loading from 'vue-loading-overlay'

import Pagination from '@/components/Pagination.vue'

export default {
  name: 'Focus Theme',
  data() {
    return {
      isLoading: false,
      currentPage: 1,
      currentPageLimit: 5,
      selectedMonth: null,
      selectedLine: '-1',
      addFocusThemeModal: false,
      focusThemeDetailModal: false,
      factors: [],
      categories: [],
      lineData: [],
      picData: [],
      selectedFilterStartDate: '',
      selectedFilterEndDate: '',
      selectedFilterLineID: '-1',
      selectedFocusTheme: null,
      focusThemeData: {
        ft_desc: '',
        ft_evaluation_num: 0,
        ft_pillar: '',
        ft_remark: '',
        ft_line_id: '',
      },
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
        cm_judg: false,
        cm_sign_lh_red: null,
        cm_sign_lh_white: null,
        cm_sign_sh: null,
        cm_comments: null,
      },
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts', 'getUsersOpts', 'getFocusTheme']),
  },
  methods: {
    onPageChange(page) {
      if (page == -1) {
        this.currentPage = this.currentPage - 1
        this.getFocusThemes()
      } else {
        this.currentPage = this.currentPage + 1
        this.getFocusThemes()
      }
    },
    onPageChangeLimit(limit) {
      this.currentPageLimit = limit
      this.getFocusThemes()
    },
    formatTheDate(val) {
      const year = val.split('T')[0].split('-')[0]
      const month = val.split('T')[0].split('-')[1]
      const day = val.split('T')[0].split('-')[2]

      return `${year}-${month}-${day}`
    },
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
        if (this.getLines) {
          this.mapLinesData()
        }
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getFocusThemes() {
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
        line_id: this.selectedFilterLineID,
        limit: this.currentPageLimit,
        currentPage: this.currentPage,
      }

      try {
        this.$store.dispatch(GET_FOCUSTHEME, objQuery).then((res) => {
          if (res) {
            this.isLoading = false
          }
        })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        this.isLoading = false
        console.log(error)
      }
    },
    addFocusThemeData() {
      this.findingsData.line_id = '4a411c19-700d-4e1f-aa23-2e49df60e12e'
      this.findingsData.cm_result_factor_id = this.findingsData.factor_id

      let data = {
        ...this.focusThemeData,
        findings: this.findingsData,
      }

      this.addFocusTheme(data)
    },
    async addFocusTheme(data) {
      try {
        await this.$store.dispatch(POST_FOCUSTHEME, data).then(() => {
          Swal.showLoading()
          Swal.fire('Success to add focus theme data', '', 'success')
          this.addFocusThemeModal = false
          this.getFocusThemes()
        })
      } catch (error) {
        console.log(error)
        Swal.fire('Failed', '', 'error')
        this.addFocusThemeModal = false
      }
    },
    focusThemeDetailData(index) {
      this.focusThemeDetailModal = true
      if (this.getFocusTheme) {
        this.selectedFocusTheme = this.getFocusTheme[index]
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
      this.getFocusThemes()
    },
  },
  async mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    this.selectedLine = localStorage.getItem('line_id')
    await this.getLines()
    await this.getFocusThemes()
    await this.getFactors()
    await this.getCategories()
    await this.getUsers()
  },
  components: { FocusThemeIndicatorVue, VueMultiselect, Loading, Pagination },
}
</script>
    