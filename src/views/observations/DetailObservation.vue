<template>
  <div class="card">
    <div class="card-body" v-if="observation">
      <CInputGroup class="mb-3">
        <CInputGroupText>Line</CInputGroupText>
        <CFormInput :value="observation.line_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Machine</CInputGroupText>
        <CFormInput :value="observation.machine_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Pos</CInputGroupText>
        <CFormInput :value="observation.pos_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Job No.</CInputGroupText>
        <CFormInput :value="observation.job_no" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Job name</CInputGroupText>
        <CFormInput :value="observation.job_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Job Type</CInputGroupText>
        <CFormInput :value="observation.job_type_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Member</CInputGroupText>
        <CFormInput :value="observation.member_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Plan Date</CInputGroupText>
        <CFormInput :value="observation.plan_check_dt" disabled />
      </CInputGroup>
    </div>
  </div>
  <div class="card mt-1">
    <div class="card-header overflow-auto">
      <div class="row">
        <div class="col-9">
          <b>Data Observasi</b>
        </div>
        <div class="d-flex col-3 text-right justify-content-around">
          <CButton
            variant="ghost"
            color="info"
            @click="
              () => {
                demoTSK = true
              }
            "
            >{{ tskLabel }}</CButton
          >
          <CModal
            size="xl"
            :visible="demoTSK"
            @close="
              () => {
                demoTSK = false
              }
            "
          >
            <CModalHeader>
              <CModalTitle v-if="observation.job_type_nm">{{
                tskLabel
              }}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <vue-pdf-embed v-if="tskFile" :source="tskFile" />
              <h2 v-else>TIDAK ADA {{ tskLabel }}</h2>
              <!-- <img style="width: 100%;" src="@/assets/{{}}.png"/> -->
            </CModalBody>
          </CModal>
          <CButton
            variant="ghost"
            color="info"
            @click="
              () => {
                demoTSKK = true
              }
            "
            >{{ tskkLabel }}</CButton
          >
          <CModal
            size="xl"
            :visible="demoTSKK"
            @close="
              () => {
                demoTSKK = false
              }
            "
          >
            <CModalHeader>
              <CModalTitle>{{ tskkLabel }}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <vue-pdf-embed v-if="tskkFile" :source="tskkFile" />
              <h2 v-else>TIDAK ADA {{ tskkLabel }}</h2>
              <!-- <img style="width: 100%;" src="@/assets/{{}}.png"/> -->
            </CModalBody>
          </CModal>
          <CButton
            variant="ghost"
            color="info"
            @click="
              () => {
                demoSOP = true
              }
            "
            >SOP</CButton
          >
          <CModal
            size="xl"
            :visible="demoSOP"
            @close="
              () => {
                demoSOP = false
              }
            "
          >
            <CModalHeader>
              <CModalTitle>SOP</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <vue-pdf-embed v-if="sopFile" :source="sopFile" />
              <h2 v-else>TIDAK ADA SOP</h2>
            </CModalBody>
          </CModal>
        </div>
      </div>
    </div>
    <div class="card-body overflow-auto">
      <CInputGroup class="mb-3">
        <CInputGroupText>Actual Date</CInputGroupText>
        <input
          :disabled="isCheck"
          class="form-control"
          type="date"
          v-model="form.actual_check_dt"
        />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Shift</CInputGroupText>
        <CFormSelect :disabled="isCheck" v-model="form.group_id">
          <option>Select Shift</option>
          <option v-for="judg in groups" :key="judg.id" :value="judg.id">
            {{ judg.group_nm }}
          </option>
        </CFormSelect>
      </CInputGroup>
      <table class="table table-responsive" style="border: 1px solid black">
        <tr>
          <th class="text-center">No</th>
          <th class="p-2">Cateogry</th>
          <th class="p-2">Judgment</th>
          <th class="text-center">Factor</th>
          <th class="text-center">Findings</th>
        </tr>
        <tr v-for="(item, i) in categories" :key="i">
          <td class="text-center">{{ i + 1 }}</td>
          <td class="p-2">{{ item.category_nm }}</td>
          <td>
            <div
              v-if="
                item.job_type_nm !== 'Type 3' &&
                item.category_nm == 'Standarize Work'
              "
            >
              <div class="d-flex">
                <input
                  type="number"
                  v-model="item.stw_ct1"
                  class="form-control text-center"
                  style="width: 70px"
                  placeholder="CT1"
                />
                <input
                  type="number"
                  v-model="item.stw_ct2"
                  class="form-control text-center mx-2"
                  style="width: 70px"
                  placeholder="CT2"
                />
                <input
                  type="number"
                  v-model="item.stw_ct3"
                  class="form-control text-center"
                  style="width: 70px"
                  placeholder="CT3"
                />
                <input
                  type="number"
                  v-model="item.stw_ct4"
                  class="form-control text-center mx-2"
                  style="width: 70px"
                  placeholder="CT4"
                />
                <input
                  type="number"
                  v-model="item.stw_ct5"
                  class="form-control text-center"
                  style="width: 70px; margin-right: 10px"
                  placeholder="CT5"
                  @keyup="getCategories()"
                />
                <div class="mx-1 d-flex flex-column">
                  <span class="badge bg-secondary"
                    >Avg: {{ judgementAverage }}</span
                  >
                  <span class="badge bg-secondary mt-1"
                    >Prc: {{ judgementPrecentage }} %</span
                  >
                </div>
              </div>
            </div>
            <CFormSelect v-else :disabled="isCheck" v-model="item.judgment_id">
              <option>Select Judgment</option>
              <option v-for="judg in judgments" :key="judg.id" :value="judg.id">
                {{ judg.text }}
              </option>
            </CFormSelect>
          </td>
          <td>
            <div
              v-if="
                item.judgment_id == '2e247c66-3e9c-44b6-951a-0a26791ad37d' &&
                item.judgment_id
              "
            >
              <CFormSelect :disabled="isCheck" v-model="item.factor_id">
                <option>Select Factor</option>
                <option
                  v-for="factor in factors"
                  :key="factor.text"
                  :value="factor.id"
                >
                  {{ factor.text }}
                </option>
              </CFormSelect>
            </div>
          </td>
          <td
            v-if="
              item.judgment_id == '2e247c66-3e9c-44b6-951a-0a26791ad37d' &&
              item.judgment_id
            "
          >
            <div>
              <div
                v-if="
                  findings.filter((find) => {
                    return find.category_id == item.id
                  }).length > 0
                "
              >
                <button
                  :disabled="isCheck"
                  class="btn btn-info"
                  @click="
                    () => {
                      addFindingsModal = true
                      mapUsersData()
                      editFinding(item.id)
                    }
                  "
                >
                  Edit finding
                </button>
                <button :disabled="isCheck" class="btn btn-warning">
                  Delete finding
                </button>
              </div>
              <button
                v-else
                :disabled="isCheck"
                class="btn btn-info"
                @click="
                  () => {
                    addFindingsModal = true
                    mapUsersData()
                  }
                "
              >
                Add findings
              </button>
            </div>

            <!-- modal -->
            <CModal
              scrollable
              backdrop="static"
              alignment="center"
              :visible="addFindingsModal"
              size="xl"
            >
              <CModalHeader>
                <CModalTitle>Add temuan</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <div>
                  <div class="finding-list mt-3">
                    <h5>Finding data</h5>
                    <div class="mt-2">
                      <div class="mb-2">
                        <label class="mb-1">Tanggal temuan</label>
                        <input
                          type="date"
                          class="form-control"
                          v-model="finding.finding_date"
                        />
                      </div>
                      <div class="mb-2">
                        <label class="mb-1">Pos</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="finding.finding_location"
                        />
                      </div>
                      <div class="mb-2">
                        <label class="mb-1">Finding description</label>
                        <textarea
                          cols="30"
                          rows="5"
                          class="form-control"
                          v-model="finding.finding_desc"
                        ></textarea>
                      </div>
                      <div class="mb-2">
                        <label class="mb-1">CM description</label>
                        <textarea
                          cols="30"
                          rows="5"
                          class="form-control"
                          v-model="finding.cm_desc"
                        ></textarea>
                      </div>
                      <div class="mb-2">
                        <label class="mb-1">Priority</label>
                        <select
                          class="form-select"
                          v-model="finding.cm_priority"
                        >
                          <option selected>Select priority</option>
                          <option value="P1">
                            P1: Safety and Quality Issue
                          </option>
                          <option value="P2">P2: Productivity Issue</option>
                          <option value="P3">P3: Cost Issue</option>
                        </select>
                      </div>

                      <div class="mb-2">
                        <label class="mb-1">PIC </label>
                        <VueMultiselect
                          v-model="selectedPIC"
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
                          v-model="finding.cm_str_plan_date"
                        />
                      </div>
                      <div class="mb-2">
                        <label class="mb-1">CM End Plan Date </label>
                        <input
                          type="date"
                          class="form-control"
                          v-model="finding.cm_end_plan_date"
                        />
                      </div>

                      <hr />

                      <div class="mb-2">
                        <label class="mb-1">CM Start actual date</label>
                        <input
                          type="date"
                          class="form-control"
                          v-model="finding.cm_str_act_date"
                          disabled
                        />
                      </div>
                      <div class="mb-2">
                        <label class="mb-1">CM End actual date</label>
                        <input
                          type="date"
                          class="form-control"
                          v-model="finding.cm_end_act_date"
                          disabled
                        />
                      </div>
                      <div class="mb-2">
                        <label class="mb-1">CM Training date</label>
                        <input
                          type="date"
                          class="form-control"
                          v-model="finding.cm_training_date"
                          disabled
                        />
                      </div>
                      <div class="mb-2">
                        <label class="mb-1">CM Judge</label>
                        <select
                          class="form-select"
                          v-model="finding.cm_judg"
                          disabled
                        >
                          <option>Select judgement</option>
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
                        <label class="mb-1">Kaizen report</label>
                        <input type="file" class="form-control" disabled />
                      </div>
                      <div class="mb-2">
                        <label class="mb-1">CM Comments</label>
                        <input
                          type="text"
                          class="form-control"
                          disabled
                          v-model="finding.cm_comments"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CModalBody>
              <CModalFooter>
                <div
                  v-if="
                    findings.filter((fin) => {
                      return fin.category_id == item.id
                    }).length == 0
                  "
                >
                  <CButton
                    color="primary"
                    class="text-white"
                    @click="addFindingData(item.id, item.factor_id, finding)"
                    >Save finding data</CButton
                  >
                </div>
                <div v-else>
                  <CButton
                    color="primary"
                    class="text-white"
                    @click="updateFindingData(item.id, item.factor_id, finding)"
                    >Update finding data</CButton
                  >
                </div>
                <CButton
                  color="secondary"
                  class="text-white mx-2"
                  @click="addFindingsModal = false"
                >
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>
          </td>
        </tr>
      </table>
      <button
        class="btn btn-primary mr-1"
        :disabled="isCheck"
        @click="postCheckObs()"
      >
        Submit
      </button>
      <button
        class="btn btn-info ml-1"
        :disabled="!isCheck"
        @click="viewReport()"
      >
        View Report
      </button>
    </div>
  </div>

  <!-- modals -->
</template>

<script>
import { GET_OBSERVATION_DETAIL } from '@/store/modules/observation.module'
import { GET_USERS } from '@/store/modules/user.module'
import { mapGetters } from 'vuex'
import VuePdfEmbed from 'vue-pdf-embed'

import ApiService from '@/store/api.service'
import moment from 'moment'
import Swal from 'sweetalert2'
import VueMultiselect from 'vue-multiselect'

export default {
  name: 'DetailSchedule',
  data() {
    return {
      observation: null,
      form: {
        actual_check_dt: moment().toISOString().split('T')[0],
        group_id: null,
      },
      categories: [],
      judgments: [],
      factors: [],
      groups: [],
      resultCheck: [],
      findings: [],
      picData: [],
      isCheck: false,
      demoTSK: false,
      sopFile: null,
      tskFile: null,
      tskkFile: null,
      demoTSKK: false,
      demoSOP: false,
      tskLabel: 'TSK',
      tskkLabel: 'TSKK',
      addFindingsModal: false,
      selectedPIC: null,
      judgementAverage: 0,
      judgementPrecentage: 0,
      judgementID: null,
      judgementVal: {
        stw_ct1: 50,
        stw_ct2: 50,
        stw_ct3: 50,
        stw_ct4: 50,
        stw_ct5: 50,
      },
      finding: {
        finding_date: moment().format('YYYY-MM-DD'),
        finding_location: '',
        finding_desc: '',
        cm_desc: '',
        cm_priority: 0,
        cm_str_plan_date: '',
        cm_end_plan_date: '',
        cm_str_act_date: null,
        cm_end_act_date: null,
        cm_training_date: null,
        cm_pic_id: '',
        cm_judg: false,
        cm_sign_lh_red: null,
        cm_sign_lh_white: null,
        cm_sign_sh: null,
        cm_comments: null,
      },
    }
  },
  watch: {
    observationData: function () {
      if (this.observationData) {
        this.observation = this.observationData[0]
        let resCheckData = this.observationData[1]
        if (resCheckData?.length > 0) this.isCheck = true
        let actualDate = this.observationData[0].actual_check_dt
        this.form.actual_check_dt =
          actualDate != 'Invalid date'
            ? moment(new Date(actualDate)).format('YYYY-MM-DD')
            : moment().toISOString().split('T')[0]
        let actualGroup = this.observationData[0].group_id
        this.form.group_id = actualGroup
        this.sopFile = this.observation.sop
          ? `${process.env.VUE_APP_URL}/file?path=${this.observation.sop}`
          : null
        this.tskFile = this.observation.tsk
          ? `${process.env.VUE_APP_URL}/file?path=${this.observation.tsk}`
          : null
        this.tskkFile = this.observation.tskk
          ? `${process.env.VUE_APP_URL}/file?path=${this.observation.tskk}`
          : null
        this.resultCheck = resCheckData
        this.checkLabelTypeJob(this.observation.job_type_nm)
      }
    },
  },
  computed: {
    ...mapGetters(['observationData', 'getUsersOpts']),
  },
  components: {
    VuePdfEmbed,
    VueMultiselect,
  },
  methods: {
    checkLabelTypeJob(jobType) {
      if (jobType == 'Type 3') {
        ;(this.tskLabel = 'Gentani'), (this.tskkLabel = 'Yamazumi')
      } else {
        ;(this.tskLabel = 'TSK'), (this.tskkLabel = 'TSKK')
      }
    },
    viewReport() {
      this.$router.push(
        `/observation/report/${this.observation.observation_id}`,
      )
    },
    async getDetail() {
      await this.$store.dispatch(GET_OBSERVATION_DETAIL, this.$route.params.id)
    },
    async getJudgments() {
      ApiService.setHeader()
      const judgments = await ApiService.get(`master/judgments`)
      this.judgments = judgments.data.data
    },
    async getFactors() {
      ApiService.setHeader()
      const factors = await ApiService.get(`master/factors`)
      this.factors = factors.data.data
    },
    async getGroups() {
      ApiService.setHeader()
      const groups = await ApiService.get(`master/groups`)
      this.groups = groups.data.data
    },
    resetData() {
      this.finding.finding_date = moment().format('YYYY-MM-DD')
      this.finding.finding_location = ''
      this.finding.finding_desc = ''
      this.finding.cm_desc = ''
      this.finding.cm_priority = null
      this.finding.cm_str_plan_date = ''
      this.finding.cm_end_plan_date = ''
      this.finding.cm_str_act_date = null
      this.finding.cm_end_act_date = null
      this.finding.cm_training_date = null
      this.finding.cm_judg = false
      this.finding.cm_sign_lh_red = null
      this.finding.cm_sign_lh_white = null
      this.finding.cm_sign_sh = null
      this.finding.cm_comments = null
      this.selectedPIC = null
    },
    addFindingData(categoryID, factorID, findings) {
      let data = {
        line_id: this.observation?.line_id,
        category_id: categoryID,
        factor_id: factorID,
        cm_pic_id: this.selectedPIC.pic_id,
        cm_result_factor_id: this.selectedFactor,
        ...findings,
      }

      this.findings.push(data)
      this.addFindingsModal = false
      this.resetData()
    },
    editFinding(categoryID) {
      const data = this.findings.find((obj) => {
        return obj.category_id == categoryID
      })

      console.log(data)

      this.finding = data
    },
    updateFindingData(categoryID, factorID, findings) {
      let data = {
        line_id: this.observation?.line_id,
        category_id: categoryID,
        factor_id: factorID,
        cm_pic_id: this.selectedPIC.pic_id,
        cm_result_factor_id: this.selectedFactor,
        ...findings,
      }

      const index = this.findings.findIndex((object) => {
        return object.category_id === categoryID
      })

      console.log(data)

      console.log(index)
    },
    async getCategories() {
      ApiService.setHeader()
      const OK_ID = 'c4f5ff30-1b95-4ad8-8af8-e3e9d90bd942'
      const NG_ID = '2e247c66-3e9c-44b6-951a-0a26791ad37d'
      const categories = await ApiService.get(`master/categories`)
      const mapCategory = categories.data.data.map((itm, i) => {
        itm.judgment_id = null
        itm.factor_id = null
        itm.stw_ct1 = 0
        itm.stw_ct2 = 0
        itm.stw_ct3 = 0
        itm.stw_ct4 = 0
        itm.stw_ct5 = 0

        let result = this.resultCheck[i]

        if (this.resultCheck?.length > 0) {
          let total =
            result.stw_ct1 +
            result.stw_ct2 +
            result.stw_ct3 +
            result.stw_ct4 +
            result.stw_ct5
          let totalAvg = total / 5

          let totalPrecentage =
            ((Math.max(
              result.stw_ct1,
              result.stw_ct2,
              result.stw_ct3,
              result.stw_ct4,
              result.stw_ct5,
            ) -
              Math.min(
                result.stw_ct1,
                result.stw_ct2,
                result.stw_ct3,
                result.stw_ct4,
                result.stw_ct5,
              )) /
              2 /
              totalAvg) *
            100

          this.judgementAverage = totalAvg
          this.judgementPrecentage = totalPrecentage.toFixed()
          if (
            this.selectedCategoryID == '3ce06d66-fe82-4e0a-a1fd-ce927ec85167'
          ) {
            if (totalPrecentage.toFixed() > 20) {
              this.judgementID = NG_ID
            }
          } else {
            this.judgementID = OK_ID
          }

          itm.judgment_id = result.judgment_id
          itm.factor_id = result.factor_id
          itm.stw_ct1 = result.stw_ct1
          itm.stw_ct2 = result.stw_ct2
          itm.stw_ct3 = result.stw_ct3
          itm.stw_ct4 = result.stw_ct4
          itm.stw_ct5 = result.stw_ct5
        }

        return itm
      })

      this.categories = mapCategory
      console.log(mapCategory)
      await this.getJudgments()
      await this.getFactors()
      await this.getGroups()
    },
    async postCheckObs() {
      try {
        // Swal.showLoading()
        this.resultCheck = []
        for (let i = 0; i < this.categories.length; i++) {
          const element = this.categories[i]
          element.category_id = element.id
          let newObj = {
            category_id: element.category_id,
            judgment_id: element.judgment_id,
            stw_ct1: element.stw_ct1,
            stw_ct2: element.stw_ct2,
            stw_ct3: element.stw_ct3,
            stw_ct4: element.stw_ct4,
            stw_ct5: element.stw_ct5,
          }
          this.resultCheck.push(newObj)
        }

        let formInput = {
          observation_id: this.$route.params.id,
          group_id: this.observation?.group_id,
          actual_check_dt: this.form.actual_check_dt,
          comment_sh: '',
          comment_ammgr: '',
          results_check: this.resultCheck,
          findings: this.findings,
        }
        console.log(formInput)
        // await this.$store
        //   .dispatch(POST_OBSERVATION_CHECK, formInput)
        //   .then(() => {
        //     Swal.showLoading()
        //     Swal.fire('Pengecekan berhasil di submit', '', 'success')
        //     setTimeout(() => {
        //       this.$router.push('/')
        //     }, 1000)
        //   })
      } catch (error) {
        console.log(error)
        Swal.fire('Pengecekan gagal di submit', '', 'error')
      }
    },

    // user functions
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
        this.picData.push({ pic_id: item.id, pic_name: item.text })
      })
    },
    customPicOptions({ pic_name }) {
      return `${pic_name}`
    },
  },
  async mounted() {
    await this.getDetail()
    await this.getCategories()
    await this.getUsers()
    // await this.getFactors()
    // await this.judgments()
  },
}
</script>


<style>
table,
th,
td {
  border: 1px solid !important;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>