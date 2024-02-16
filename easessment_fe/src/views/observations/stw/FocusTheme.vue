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
              <th>Fokus tema</th>
              <th>Pilar</th>
              <th>Evaluasi</th>
              <th>Remark</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(focustheme, index) in getFocusTheme"
              :key="focustheme.ft_id"
            >
              <th scope="row">{{ index + 1 }}</th>
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
      :visible="addFocusThemeModal"
      @close="addFocusThemeModal = false"
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
        <CButton color="secondary" @click="addFocusThemeModal = false">
          Close
        </CButton>
        <CButton color="primary" @click="addFocusThemeData"
          >Save changes</CButton
        >
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
import Filter from '@/components/Filter.vue'
import FocusThemeIndicatorVue from '@/components/FocusThemeIndicator.vue'
import VueMultiselect from 'vue-multiselect'
import Swal from 'sweetalert2'
import ApiService from '@/store/api.service'

export default {
  name: 'Focus Theme',
  data() {
    return {
      isLoading: false,
      selectedMonth: null,
      selectedLine: '-1',
      addFocusThemeModal: false,
      factors: [],
      categories: [],
      picData: [],
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
        cm_judg: true,
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
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getFocusThemes() {
      this.isLoading = true
      try {
        this.$store.dispatch(GET_FOCUSTHEME)
        this.isLoading = false
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        this.isLoading = false
        console.log(error)
      }
    },
    addFocusThemeData() {
      this.focusThemeData.ft_line_id = '4a411c19-700d-4e1f-aa23-2e49df60e12e'
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
        Swal.fire('Pengecekan gagal di submit', '', 'error')
        this.addFocusThemeModal = false
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
    await this.getLines()
    await this.getFocusThemes()
    await this.getFactors()
    await this.getCategories()
    await this.getUsers()
  },
  components: { Filter, FocusThemeIndicatorVue, VueMultiselect },
}
</script>
    