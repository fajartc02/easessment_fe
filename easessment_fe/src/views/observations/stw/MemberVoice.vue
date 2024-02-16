 
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
              mapUsersData()
            }
          "
        >
          Add member voice
        </button>
      </div>
      <div style="width: 100%; overflow-x: scroll">
        <table class="table table-bordered overflow-auto table-stripped">
          <thead class="text-center">
            <tr>
              <th rowspan="3">No</th>
              <th rowspan="3">Line name</th>
              <th rowspan="3">Tanggal</th>
              <th rowspan="3">Lokasi</th>
              <th rowspan="3">Problem</th>
              <th rowspan="3">No Proses</th>
              <th rowspan="3">Kategori</th>
              <th rowspan="3">Penanggulangan</th>
              <th rowspan="3">Evaluasi Hasil</th>
              <th colspan="24">Waktu Pelaksanaan</th>
              <th rowspan="3">PIC</th>
              <th rowspan="3">Actions</th>
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
          <tbody>
            <tr
              v-for="(membervoice, index) in getMemberVoice"
              :key="membervoice.mv_id"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ membervoice.line_nm }}</td>
              <td>{{ formatTheDate(membervoice.mv_date_finding)  }}</td>
              <td>{{ membervoice.mv_location }}</td>
              <td>{{ membervoice.mv_problem }}</td>
              <td>{{ membervoice.mv_process_no }}</td>
              <td>{{ membervoice.mv_category }}</td>
              <td>{{ membervoice.mv_countermeasure }}</td>
              <td>{{ membervoice.mv_evaluation }}</td>
              <td v-for="n in num" :key="n" width="40px">
                <div
                  v-if="
                    (n >= membervoice.w_mv_plan_date) &
                    (n <= membervoice.w_mv_actual_date)
                  "
                  style="
                    width: 100%;
                    height: 20px;
                    border-radius: 4px;
                    background-color: coral;
                  "
                ></div>
              </td>
              <td>{{ membervoice.mv_pic_nm }}</td>
              <td>
                <button
                  class="btn btn-info btn-sm text-white w-full my-1"
                >
                  Detail
                </button>
                <button class="btn btn-danger btn-sm text-white">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- modals -->
    <CModal
      scrollable
      size="lg"
      backdrop="static"
      alignment="center"
      :visible="addMemberVoiceModal"
      @close="addMemberVoiceModal = false"
    >
      <CModalHeader>
        <CModalTitle>Add member voice</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CAccordion :active-item-key="1" always-open>
          <CAccordionItem :item-key="1">
            <CAccordionHeader> Member voice input </CAccordionHeader>
            <CAccordionBody>
              <div>
                <div class="mb-2">
                  <label class="mb-1">Tanggal temuan</label>
                  <input
                    type="date"
                    v-model="memberVoiceData.mv_date_finding"
                    class="form-control"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Lokasi</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="memberVoiceData.mv_location"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Problem</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="memberVoiceData.mv_problem"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">No Proses</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="memberVoiceData.mv_process_no"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Category </label>
                  <select
                    class="form-select"
                    v-model="memberVoiceData.mv_category"
                  >
                    <option selected>Select category</option>
                    <option value="safety">Safety</option>
                    <option value="kesulitan kerja">Kesulitan kerja</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Faktor </label>
                  <select
                    class="form-select"
                    v-model="memberVoiceData.mv_factor_id"
                  >
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
                  <label class="mb-1">Penanggulangan</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="memberVoiceData.mv_countermeasure"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Eval hasil</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="memberVoiceData.mv_evaluation"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Plan tgl penganggulangan</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="memberVoiceData.mv_plan_date"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Aktual tgl penganggulangan</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="memberVoiceData.mv_actual_date"
                  />
                </div>
                <div class="mb-2">
                  <label class="mb-1">PIC</label>
                  <VueMultiselect
                    v-model="memberVoiceData.mv_pic_id"
                    :options="picData"
                  >
                  </VueMultiselect>
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
        <CButton color="secondary" @click="addMemberVoiceModal = false">
          Close
        </CButton>
        <CButton color="primary" @click="addMemberVoiceData"
          >Save changes</CButton
        >
      </CModalFooter>
    </CModal>
  </div>
</template>
    
    <script>
import moment from 'moment'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_USERS } from '@/store/modules/user.module'
import {
  GET_MEMBERVOICE,
  POST_MEMBERVOICE,
} from '@/store/modules/membervoice.module'
import { mapGetters } from 'vuex'
import Filter from '@/components/Filter.vue'
import VueMultiselect from 'vue-multiselect'
import Swal from 'sweetalert2'
import ApiService from '@/store/api.service'

export default {
  name: 'Member Voice',
  data() {
    return {
      isLoading: false,
      num: 24,
      selectedMonth: null,
      selectedLine: '-1',
      addMemberVoiceModal: false,
      picData: [],
      selectedPIC: null,
      selectedFactor: null,
      selectedLineID: null,
      factors: [],
      categories: [],
      memberVoiceData: {
        mv_date_finding: '',
        mv_location: '',
        mv_problem: '',
        mv_process_no: '',
        mv_category: '',
        mv_factor_id: '',
        mv_countermeasure: '',
        mv_evaluation: '',
        mv_plan_date: '',
        mv_actual_date: '',
        mv_pic_id: '',
        line_id: '',
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
      memberVoiceDataReadyToUpload: {},
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts', 'getUsersOpts', 'getMemberVoice']),
  },
  methods: {
    initData() {
      this.selectedLineID = this.getMemberVoice[0]?.line_id
    },
    addMemberVoiceData() {
      this.memberVoiceData.line_id = this.selectedLineID
      this.findingsData.line_id = this.selectedLineID
      this.findingsData.cm_result_factor_id = this.findingsData.factor_id

      let data = {
        ...this.memberVoiceData,
        findings: this.findingsData,
      }
      this.addMemberVoice(data)
    },
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
    async getMemberVoices() {
      this.isLoading = true
      try {
        this.$store.dispatch(GET_MEMBERVOICE)
        this.isLoading = false

        if (this.getMemberVoice) {
          this.isLoading = false
        }
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
        this.isLoading = false
      }
    },
    async addMemberVoice(data) {
      try {
        await this.$store.dispatch(POST_MEMBERVOICE, data).then(() => {
          Swal.showLoading()
          Swal.fire('Pengecekan berhasil di submit', '', 'success')
          this.addMemberVoiceModal = false
          this.getMemberVoices()
        })
      } catch (error) {
        console.log(error)
        Swal.fire('Pengecekan gagal di submit', '', 'error')
        this.addMemberVoiceModal = false
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
    formatTheDate(val){
      const year = val.split('T')[0].split('-')[0];
      const month = val.split('T')[0].split('-')[1];
      const day = val.split('T')[0].split('-')[2];

      return `${year}-${month}-${day}`
    }
  },
  async mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    this.selectedLine = localStorage.getItem('line_id')
    await this.getLines()
    await this.getUsers()
    await this.getMemberVoices()
    await this.getFactors()
    await this.getCategories()
    this.initData()
  },
  updated() {
    if (this.getMemberVoice) {
      this.isLoading = false
    }
  },
  components: { Filter, VueMultiselect },
}
</script>
    

<style src="vue-multiselect/dist/vue-multiselect.css"></style>