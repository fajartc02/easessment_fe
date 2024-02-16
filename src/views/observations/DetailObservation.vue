<template>
  <div class="card">
    <div class="card-body" style="height: 400px" v-if="isDetailDataLoading">
      <loading
        v-model:active="isDetailDataLoading"
        :can-cancel="true"
        :is-full-page="false"
        :on-cancel="onCancel"
      />
    </div>
    <div class="card-body" v-else>
      <CInputGroup class="mb-3">
        <CInputGroupText>Line</CInputGroupText>
        <CFormInput :value="observation?.line_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Machine</CInputGroupText>
        <CFormInput :value="observation?.machine_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Pos</CInputGroupText>
        <CFormInput :value="observation?.pos_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Job No.</CInputGroupText>
        <CFormInput :value="observation?.job_no" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Job name</CInputGroupText>
        <CFormInput :value="observation?.job_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Job Type</CInputGroupText>
        <CFormInput :value="observation?.job_type_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Member</CInputGroupText>
        <CFormInput :value="observation?.member_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Plan Date</CInputGroupText>
        <CFormInput :value="observation?.plan_check_dt" disabled />
      </CInputGroup>
    </div>
  </div>
  <div class="card mt-2">
    <div class="card-header overflow-auto">
      <div class="d-flex justify-content-between align-items-center">
        <h5>Data Observasi</h5>

        <div class="d-flex">
          <CButton color="info" class="text-white" @click="demoTSK = true">{{
            tskLabel
          }}</CButton>
          <CModal size="xl" :visible="demoTSK" @close="demoTSK = false">
            <CModalHeader>
              <CModalTitle v-if="observation.job_type_nm">{{
                tskLabel
              }}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <vue-pdf-embed v-if="tskFile" :source="tskFile" />
              <h2 v-else>Tidak ada {{ tskLabel }}</h2>
              <!-- <img style="width: 100%;" src="@/assets/{{}}.png"/> -->
            </CModalBody>
          </CModal>
          <CButton
            color="info"
            class="text-white mx-2"
            @click="demoTSKK = true"
            >{{ tskkLabel }}</CButton
          >
          <CModal size="xl" :visible="demoTSKK" @close="demoTSKK = false">
            <CModalHeader>
              <CModalTitle>{{ tskkLabel }}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <vue-pdf-embed v-if="tskkFile" :source="tskkFile" />
              <h2 v-else>Tidak ada {{ tskkLabel }}</h2>
              <!-- <img style="width: 100%;" src="@/assets/{{}}.png"/> -->
            </CModalBody>
          </CModal>
          <CButton color="info" class="text-white" @click="demoSOP = true"
            >SOP</CButton
          >
          <CModal size="xl" :visible="demoSOP" @close="demoSOP = false">
            <CModalHeader>
              <CModalTitle>SOP</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <vue-pdf-embed v-if="sopFile" :source="sopFile" />
              <h2 v-else>Tidak ada SOP</h2>
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

      <!-- view only component -->
      <table
        v-if="observationData && observationData[1]?.length > 1"
        class="table table-responsive"
        style="border: 1px solid black"
      >
        <tr>
          <th class="text-center">No</th>
          <th class="p-2">Cateogry</th>
          <th class="p-2">Judgment (CT1, CT2, CT3, CT4, CT5)</th>
          <th class="text-center">Factor</th>
          <th class="text-center">Findings</th>
        </tr>
        <tr v-for="(item, i) in categories" :key="i">
          <td class="text-center" style="width: 40px">{{ i + 1 }}</td>
          <td class="p-2" style="width: 150px">{{ item.category_nm }}</td>
          <td class="p-2">
            <select
              class="form-select"
              v-if="item.category_nm !== 'Standarize Work'"
              v-model="item.judgment_id"
              disabled
            >
              <option selected disabled>Select Judgment</option>
              <option v-for="judg in judgments" :key="judg.id" :value="judg.id">
                {{ judg.text }}
              </option>
            </select>
          </td>
          <td>
            <div
              v-if="
                judgementPrecentage > 20 &&
                selectedCategoryToAddJudgement == item.id
              "
              class="mx-2"
            >
              <select class="form-select" v-model="selectedFactor">
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
          </td>
          <td>
            <div>
              <button
                class="btn btn-info btn-sm text-white"
                @click="
                  () => {
                    viewAllFindingsModal = true
                    getDetailData(item.id)
                  }
                "
              >
                View all findings
              </button>
            </div>
          </td>
        </tr>
      </table>
      <table
        v-else
        class="table table-responsive"
        style="border: 1px solid black"
      >
        <tr>
          <th class="text-center">No</th>
          <th class="p-2">Cateogry</th>
          <th class="p-2">Judgment (CT1, CT2, CT3, CT4, CT5)</th>
          <th class="text-center">Factor</th>
          <th class="text-center">Findings</th>
        </tr>
        <tr v-for="(item, i) in categories" :key="i">
          <td class="text-center" style="width: 40px">{{ i + 1 }}</td>
          <td class="p-2" style="width: 150px">{{ item.category_nm }}</td>
          <td style="width: 600px" class="p-2">
            <div
              v-if="item.category_nm !== 'Standarize Work'"
              class="btn-group"
              role="group"
              aria-label="First group"
            >
              <button
                v-for="judg in judgments"
                :key="judg.id"
                type="button"
                class="btn btn-secondary btn-judgement"
                @click="showFactorAndFindings(item.id, judg.id, judg.text)"
                :style="`${
                  selectedJudgeID == judg.id && selectedCategoryID == item.id
                    ? 'background-color: black; color: white'
                    : ''
                }  `"
              >
                {{ judg.text }}
              </button>
            </div>
            <div
              v-if="
                item.job_type_nm !== 'Type 3' &&
                item.category_nm == 'Standarize Work'
              "
            >
              <div v-if="selectedCategoryToAddJudgement !== item.id">
                <button
                  class="btn btn-info text-white"
                  @click="selectedCategoryToAddJudgement = item.id"
                >
                  Show judgement
                </button>
              </div>
              <div
                v-if="selectedCategoryToAddJudgement == item.id"
                class="d-flex"
              >
                <input
                  type="text"
                  v-model="judgementVal.stw_ct1"
                  class="form-control text-center"
                  style="width: 50px"
                  placeholder="stw_ct1"
                />
                <input
                  type="text"
                  v-model="judgementVal.stw_ct2"
                  class="form-control text-center mx-2"
                  style="width: 50px"
                  placeholder="stw_ct2"
                />
                <input
                  type="text"
                  v-model="judgementVal.stw_ct3"
                  class="form-control text-center"
                  style="width: 50px"
                  placeholder="stw_ct3"
                />
                <input
                  type="text"
                  v-model="judgementVal.stw_ct4"
                  class="form-control text-center mx-2"
                  style="width: 50px"
                  placeholder="stw_ct4"
                />
                <input
                  type="text"
                  v-model="judgementVal.stw_ct5"
                  class="form-control text-center"
                  style="width: 50px; margin-right: 10px"
                  placeholder="stw_ct5"
                />
                <button
                  @click="calculateJudgementAverageAndPrecentage(item.id)"
                  class="btn btn-info text-white btn-sm mx-1"
                >
                  Calculate
                </button>
                <button
                  class="btn btn-warning text-white btn-sm"
                  @click="resetData"
                >
                  Cancel
                </button>
                <div class="mx-1">
                  <span class="badge bg-secondary"
                    >Average: {{ judgementAverage }}</span
                  >
                  <span class="badge bg-secondary"
                    >Precentage: {{ judgementPrecentage }} %</span
                  >
                </div>
              </div>
            </div>
          </td>
          <td style="width: 300px">
            <div
              v-if="judgementPrecentage > 20 && selectedCategoryID == item.id"
              class="mx-2"
            >
              <select class="form-select" v-model="selectedFactor">
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
            <div
              v-else-if="
                selectedCategoryID == item.id && selectedJudgeName == 'NG'
              "
              class="mx-2"
            >
              <select class="form-select" v-model="selectedFactor">
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
          </td>
          <td>
            <div
              v-if="judgementPrecentage > 20 && selectedCategoryID == item.id"
            >
              <div class="card">
                <button
                  class="btn btn-info text-white"
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
            </div>
            <div
              v-else-if="
                selectedCategoryID == item.id && selectedJudgeName == 'NG'
              "
            >
              <div>
                <button
                  class="btn btn-info text-white"
                  @click="addFindingsModal = true"
                >
                  Add findings
                </button>
              </div>
            </div>
          </td>
        </tr>
      </table>

      <button
        class="btn btn-primary text-white"
        :disabled="observationsData.findings.length < 1"
        @click="postCheckObs()"
      >
        Submit
      </button>
      <button
        class="btn btn-info mx-2 text-white"
        :disabled="!isCheck"
        @click="viewReport()"
      >
        View Report
      </button>
    </div>
  </div>

  <!-- Modals -->
  <CModal
    scrollable
    backdrop="static"
    alignment="center"
    :visible="addFindingsModal"
    @close="addFindingsModal = false"
  >
    <CModalHeader>
      <CModalTitle>Add temuan</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div>
        <div class="mb-2">
          <label class="mb-1">Tanggal temuan</label>
          <input type="date" class="form-control" v-model="finding_date" />
        </div>
        <div class="mb-2">
          <label class="mb-1">Pos</label>
          <input type="text" class="form-control" v-model="finding_location" />
        </div>
        <div class="mb-2">
          <label class="mb-1">Finding description</label>
          <textarea
            cols="30"
            rows="5"
            class="form-control"
            v-model="finding_desc"
          ></textarea>
        </div>
        <div class="mb-2">
          <label class="mb-1">CM description</label>
          <textarea
            cols="30"
            rows="5"
            class="form-control"
            v-model="cm_desc"
          ></textarea>
        </div>
        <div class="mb-2">
          <label class="mb-1">Priority</label>
          <select class="form-select" v-model="cm_priority">
            <option selected>Select priority</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
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
          <input type="date" class="form-control" v-model="cm_str_plan_date" />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM End Plan Date </label>
          <input type="date" class="form-control" v-model="cm_end_plan_date" />
        </div>

        <hr />

        <div class="mb-2">
          <label class="mb-1">CM Start actual date</label>
          <input
            type="date"
            class="form-control"
            v-model="cm_str_act_date"
            disabled
          />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM End actual date</label>
          <input
            type="date"
            class="form-control"
            v-model="cm_end_act_date"
            disabled
          />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM Training date</label>
          <input
            type="date"
            class="form-control"
            v-model="cm_training_date"
            disabled
          />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM Judge</label>
          <select class="form-select" v-model="cm_judg" disabled>
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
          <label class="mb-1">CM Comments</label>
          <input
            type="text"
            class="form-control"
            disabled
            v-model="cm_comments"
          />
        </div>
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton
        color="secondary"
        class="text-white mx-2"
        @click="addFindingsModal = false"
      >
        Cancel
      </CButton>
      <CButton color="primary" class="text-white" @click="addFindingsData"
        >Save finding data</CButton
      >
    </CModalFooter>
  </CModal>
  <CModal
    size="lg"
    scrollable
    backdrop="static"
    alignment="center"
    :visible="viewAllFindingsModal"
    @close="viewAllFindingsModal = false"
  >
    <CModalHeader>
      <CModalTitle>Finding list</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div>
        <table class="table table-bordered table-striped">
          <thead>
            <th>No</th>
            <th>Category</th>
            <th>STW CT1</th>
            <th>STW CT2</th>
            <th>STW CT3</th>
            <th>STW CT4</th>
            <th>STW CT5</th>
            <th>Findings detail</th>
          </thead>
          <tbody>
            <tr
              v-for="(detail, findIndex) in selectedDetailData"
              :key="findIndex"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ detail.category_nm }}</td>
              <td>{{ detail.stw_ct1 }}</td>
              <td>{{ detail.stw_ct2 }}</td>
              <td>{{ detail.stw_ct3 }}</td>
              <td>{{ detail.stw_ct4 }}</td>
              <td>{{ detail.stw_ct5 }}</td>
              <td>
                <button
                  class="btn btn-info btn-sm text-white"
                  :disabled="detail.findings.length < 1"
                  @click="
                    () => {
                      viewFindingDetailModal = true
                      this.selectedFindingDetailIndex = findIndex
                    }
                  "
                >
                  Show detail ({{ detail.findings.length }})
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton
        color="secondary"
        class="text-white mx-2"
        @click="viewAllFindingsModal = false"
      >
        Cancel
      </CButton>
    </CModalFooter>
  </CModal>
  <CModal
    size="lg"
    scrollable
    backdrop="static"
    alignment="center"
    :visible="viewFindingDetailModal"
    @close="viewFindingDetailModal = false"
  >
    <CModalHeader>
      <CModalTitle>Finding detail</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div>
        <table class="table table-bordered table-striped">
          <thead>
            <th>No</th>
            <th>Line name</th>
          </thead>
          <tbody>
            <tr
              v-for="(fn, findingIndex) in selectedDetailData[
                selectedFindingDetailIndex
              ]"
              :key="findingIndex"
            >
              <td>{{ findingIndex }}</td>
              <td>{{ fn?.line_nm }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton
        color="secondary"
        class="text-white mx-2"
        @click="viewFindingDetailModal = false"
      >
        Cancel
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import {
  GET_OBSERVATION_DETAIL,
  POST_OBSERVATION_CHECK,
} from '@/store/modules/observation.module'
import { GET_USERS } from '@/store/modules/user.module'
import { mapGetters } from 'vuex'
import VuePdfEmbed from 'vue-pdf-embed'
import ApiService from '@/store/api.service'
import moment from 'moment'
import Swal from 'sweetalert2'
import VueMultiselect from 'vue-multiselect'
import Loading from 'vue-loading-overlay'

export default {
  name: 'DetailSchedule',
  data() {
    return {
      isDetailDataLoading: false,
      selectedLine: this.observation?.line_id,
      picData: [],
      selectedPIC: null,
      observation: null,
      selectedCategoryID: null,
      selectedJudgeID: null,
      selectedJudgeName: null,
      selectedDetailData: null,
      selectedFindingDetailIndex: null,
      form: {
        actual_check_dt: moment().toISOString().split('T')[0],
        group_id: null,
      },
      categories: [],
      judgments: [],
      factors: [],
      groups: [],
      resultCheck: [],
      isCheck: false,
      demoTSK: false,
      sopFile: null,
      tskFile: null,
      tskkFile: null,
      demoTSKK: false,
      demoSOP: false,
      tskLabel: 'TSK',
      tskkLabel: 'TSKK',
      selectedCategoryToAddJudgement: null,
      selectedFactor: null,
      judgementID: '',
      judgementVal: {
        stw_ct1: 50,
        stw_ct2: 30,
        stw_ct3: 54,
        stw_ct4: 90,
        stw_ct5: 60,
      },
      judgementAverage: 0,
      judgementPrecentage: 0,
      addFindingsModal: false,
      viewAllFindingsModal: false,
      viewFindingDetailModal: false,
      // findings data
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
      cm_judg: false,
      cm_sign_lh_red: null,
      cm_sign_lh_white: null,
      cm_sign_sh: null,
      cm_comments: null,
      // end findings data
      observationsData: {
        observation_id: this.$route.params.id,
        // actual_check_dt: this.observation?.actual_check_dt,
        // comment_sh: this.observation?.comment_sh,
        // comment_ammgr: this.observation?.comment_ammgr,
        actual_check_dt: '',
        group_id: this.observation?.group_id,
        comment_sh: 'kosong',
        comment_ammgr: 'kosong',
        results_check: [],
        findings: [],
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
        this.observationsData.actual_check_dt =
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
    Loading,
  },
  methods: {
    resetData() {
      this.selectedCategoryToAddJudgement = null
      this.selectedCategoryID = null
      this.selectedJudgeID = null
      this.selectedJudgeName = null
      this.selectedFactor = null
      this.judgementVal.stw_ct1 = 0
      this.judgementVal.stw_ct2 = 0
      this.judgementVal.stw_ct3 = 0
      this.judgementVal.stw_ct4 = 0
      this.judgementVal.stw_ct5 = 0
    },
    initData() {
      this.observationsData.observation_id = this.$route.params.id
      this.observationsData.group_id = this.observation?.group_id
    },
    calculateJudgementAverageAndPrecentage(categoryID) {
      const OK_ID = 'c4f5ff30-1b95-4ad8-8af8-e3e9d90bd942'
      const NG_ID = '2e247c66-3e9c-44b6-951a-0a26791ad37d'
      const stw_ct1 = +this.judgementVal.stw_ct1
      const stw_ct2 = +this.judgementVal.stw_ct2
      const stw_ct3 = +this.judgementVal.stw_ct3
      const stw_ct4 = +this.judgementVal.stw_ct4
      const stw_ct5 = +this.judgementVal.stw_ct5
      this.selectedCategoryID = categoryID

      let total = stw_ct1 + stw_ct2 + stw_ct3 + stw_ct4 + stw_ct5
      let totalAvg = total / 5

      let totalPrecentage =
        ((Math.max(stw_ct1, stw_ct2, stw_ct3, stw_ct4, stw_ct5) -
          Math.min(stw_ct1, stw_ct2, stw_ct3, stw_ct4, stw_ct5)) /
          2 /
          totalAvg) *
        100

      this.judgementAverage = totalAvg
      this.judgementPrecentage = totalPrecentage.toFixed()

      if (this.selectedCategoryID == '3ce06d66-fe82-4e0a-a1fd-ce927ec85167') {
        if (totalPrecentage.toFixed() > 20) {
          this.judgementID = NG_ID
        }
      } else {
        this.judgementID = OK_ID
      }

      // add judgement data
      let resultCheckData = {
        category_id: this.selectedCategoryID,
        judgment_id: this.judgementID,
        stw_ct1: stw_ct1,
        stw_ct2: stw_ct2,
        stw_ct3: stw_ct3,
        stw_ct4: stw_ct4,
        stw_ct5: stw_ct5,
      }

      this.observationsData.results_check.push(resultCheckData)
    },
    addFindingsData() {
      let data = {
        line_id: this.observation?.line_id,
        finding_date: this.finding_date,
        finding_location: this.finding_location,
        finding_desc: this.finding_desc,
        cm_desc: this.cm_desc,
        cm_priority: +this.cm_priority,
        category_id: this.selectedCategoryToAddJudgement,
        factor_id: this.selectedFactor,
        cm_pic_id: this.selectedPIC.pic_id,
        cm_str_plan_date: this.cm_str_plan_date,
        cm_end_plan_date: this.cm_end_plan_date,
        cm_result_factor_id: this.selectedFactor,
        // additionals
        cm_str_act_date: this.cm_str_act_date,
        cm_end_act_date: this.cm_end_act_date,
        cm_training_date: this.cm_training_date,
        cm_judg: this.cm_judg,
        cm_sign_lh_red: null,
        cm_sign_lh_white: null,
        cm_sign_sh: null,
        cm_comments: this.cm_comments,
      }

      this.observationsData.findings.push(data)

      alert('Finding saved')
      this.resetData()
      this.addFindingsModal = false
    },
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
      this.isDetailDataLoading = true

      await this.$store
        .dispatch(GET_OBSERVATION_DETAIL, this.$route.params.id)
        .then((res) => {
          if (res) {
            this.isDetailDataLoading = false
            this.finding_location = this.observationData[0]?.pos_nm
          }
        })
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
    async getCategories() {
      ApiService.setHeader()
      const categories = await ApiService.get(`master/categories`)
      const mapCategory = categories.data.data.map((itm, i) => {
        itm.judgment_id = null
        itm.factor_id = null
        itm.findings = null
        if (this.resultCheck?.length > 0) {
          let result = this.resultCheck[i]
          itm.judgment_id = result.judgment_id
          itm.factor_id = result.factor_id
          itm.findings = result.findings
        }
        return itm
      })
      this.categories = mapCategory
      await this.getJudgments()
      await this.getFactors()
      await this.getGroups()
    },
    async postCheckObs() {
      try {
        Swal.showLoading()
        // this.resultCheck = []
        // for (let i = 0; i < this.categories.length; i++) {
        //   const element = this.categories[i]
        //   element.category_id = element.id
        //   let newObj = {
        //     category_id: element.category_id,
        //     factor_id: element.factor_id,
        //     judgment_id: element.judgment_id,
        //     findings: element.findings,
        //   }
        //   this.resultCheck.push(newObj)
        // }

        // let formInput = {
        //   observation_id: this.$route.params.id,
        //   actual_check_dt: this.form.actual_check_dt,
        //   results_check: this.resultCheck,
        //   group_id: this.form.group_id,
        // }
        // console.log(formInput)
        await this.$store
          .dispatch(POST_OBSERVATION_CHECK, this.observationsData)
          .then(() => {
            Swal.showLoading()
            Swal.fire('Pengecekan berhasil di submit', '', 'success')
            setTimeout(() => {
              this.$router.push('/')
            }, 1000)
          })
      } catch (error) {
        console.log(error)
        Swal.fire('Pengecekan gagal di submit', '', 'error')
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
        this.picData.push({ pic_id: item.id, pic_name: item.text })
      })
    },
    customPicOptions({ pic_name }) {
      return `${pic_name}`
    },
    getDetailData(catID) {
      console.log(catID)
      const data = this.observationData[1].filter((obj) => {
        return obj.category_id == catID
      })

      this.selectedDetailData = data
      setTimeout(() => {
        console.log(this.selectedDetailData)
      }, 500)
    },
    showFactorAndFindings(cateID, judgID, judgName) {
      this.selectedCategoryID = cateID
      this.selectedJudgeID = judgID
      this.selectedJudgeName = judgName

      const stw_ct1 = +this.judgementVal.stw_ct1
      const stw_ct2 = +this.judgementVal.stw_ct2
      const stw_ct3 = +this.judgementVal.stw_ct3
      const stw_ct4 = +this.judgementVal.stw_ct4
      const stw_ct5 = +this.judgementVal.stw_ct5

      if (this.selectedJudgeID && this.selectedJudgeName !== 'NG') {
        setTimeout(() => {
          alert('Data saved')
        }, 500)
      }

      let resultCheckData = {
        category_id: this.selectedCategoryID,
        judgment_id: this.selectedJudgeID,
        stw_ct1: stw_ct1,
        stw_ct2: stw_ct2,
        stw_ct3: stw_ct3,
        stw_ct4: stw_ct4,
        stw_ct5: stw_ct5,
      }

      this.observationsData.results_check.push(resultCheckData)

      console.log(cateID + ' ' + judgID + ' ' + judgName)
    },
  },
  async mounted() {
    await this.getDetail()
    await this.getCategories()
    await this.getUsers()
    this.initData()
  },
}
</script>


<style>
table,
th,
td {
  border: 1px solid !important;
}

.btn-judgement {
  background-color: #f1f5f9;
}
.btn-judgement:hover {
  background-color: #cbd5e1;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>