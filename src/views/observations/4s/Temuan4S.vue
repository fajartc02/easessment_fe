<template>
  <div>
    <div class="card mb-5">
      <div class="card-header">
        <div class="row d-flex align-items-center">
          <div class="col">
            <label>Line</label>
            <select class="form-select" v-model="selectedLineIDFilter" @change="addFilter()">
              <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
                {{ line.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Shift / group</label>
            <select class="form-select" v-model="selectedGroupIDFilter" @change="addFilter()">
              <option v-for="group in getGroupsOpts" :key="group.id" :value="group.id">
                {{ group.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Zona</label>
            <VueMultiselect v-model="selectedZoneIDFilter" :options="getZoneOpts" :customLabel="customLabel"
              @select="addFilter()">
            </VueMultiselect>
          </div>
          <div class="col">
            <label>Kanban</label>
            <VueMultiselect v-model="selectedKanbanIDFilter" :options="getKanbansOpts"
              :custom-label="customKanbanFilterOptions" @select="addFilter()">
            </VueMultiselect>
          </div>
          <div class="col">
            <label>Freq</label>
            <select class="form-select" v-model="selectedFreqIDFilter" @change="addFilter()">
              <option v-for="freq in getFreqsOpts" :key="freq.id" :value="freq.id">
                {{ freq.text }}
              </option>
            </select>
          </div>
          <div class="col-sm-1">
            <button class="mt-4 btn btn-info text-white" @click="resetFilter()">
              Reset
            </button>
          </div>
        </div>
      </div>
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5>List temuan</h5>
        <div class="d-flex align-items-center justify-content-center">
          <table class="table">
            <tr>
              <th><img src="@/../public/tanoko/0.png" width="20" height="20"></th>
              <th>Order Part</th>
              <th><img src="@/../public/tanoko/1.png" width="20" height="20"></th>
              <th>Countermeasure</th>
              <th><img src="@/../public/tanoko/2.png" width="20" height="20"></th>
              <th>Monitor / Follow</th>
              <th><img src="@/../public/tanoko/3.png" width="20" height="20"></th>
              <th>Finish</th>
            </tr>
          </table>
        </div>
        <div class="d-flex align-items-center">
          <div class="mx-2 d-flex align-items-center">
            <div class="d-flex align-items-center">
              <div style="
                  background-color: transparent;
                  width: 20px;
                  height: 20px;
                  border: 2px dotted black;
                "></div>
              <span class="mx-2">Plan</span>
            </div>
            <div class="d-flex align-items-center">
              <div style="
                  background-color: transparent;
                  width: 20px;
                  height: 20px;
                  border: 2px solid black;
                "></div>
              <span class="mx-2">Actual</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="tableFixHead">
          <table class="table table-hover">
            <thead class="text-center">
              <tr>
                <th id="fixCol-head-1" rowspan="2">No</th>
                <th id="fixCol-head-2" rowspan="2">Line</th>
                <th id="fixCol-head-3" rowspan="2">Zone</th>
                <th id="fixCol-head-4" rowspan="2">No Kanban</th>
                <th id="fixCol-head-5" rowspan="2">Freq 4S</th>
                <th id="fixCol-head-6" rowspan="2">Problem</th>
                <th colspan="2">Reduce Time</th>
                <th :colspan="changeOpts.length">Perubahan</th>
                <th :colspan="deptOpts.length">Departement Terkait</th>
                <th colspan="4">Jan</th>
                <th colspan="4">Feb</th>
                <th colspan="4">March</th>
                <th colspan="4">Apr</th>
                <th colspan="4">May</th>
                <th colspan="4">June</th>
                <th colspan="4">July</th>
                <th colspan="4">Aug</th>
                <th colspan="4">Sept</th>
                <th colspan="4">Oct</th>
                <th colspan="4">Nov</th>
                <th colspan="4">Dec</th>
                <th rowspan="2">Evaluasi</th>
                <th rowspan="2" colspan="2">Actions</th>
              </tr>
              <tr>
                <th>Waktu 4S (mnt)</th>
                <th>Yokoten (mnt)</th>
                <th v-for="optChange in changeOpts" :key="optChange">
                  {{ optChange.system_value }}
                </th>
                <th v-for="dept in deptOpts" :key="dept">
                  {{ dept.system_value }}
                </th>
                <th width="100">I</th>
                <th width="100">II</th>
                <th width="100">III</th>
                <th class="week">IV</th>
                <th width="100">I</th>
                <th width="100">II</th>
                <th width="100">III</th>
                <th class="week">IV</th>
                <th width="100">I</th>
                <th width="100">II</th>
                <th width="100">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="10" class="p-0" style="height: 200px">
                  <div class="vl-parent p-0" style="height: 100%">
                    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false"
                      :on-cancel="onCancel" />
                  </div>
                </td>
              </tr>

              <tr v-else-if="!isLoading && findingList?.length > 0" v-for=" (finding, findingIndex) in findingList"
                :key="finding">
                <td id="fixCol-1">{{ findingIndex + 1 }}</td>
                <td id="fixCol-2">{{ finding.line_nm }}</td>
                <td id="fixCol-3">{{ finding.zone_nm }}</td>
                <td id="fixCol-4">{{ finding.kanban_no }}</td>
                <td id="fixCol-5">{{ finding.freq_nm }}</td>
                <td id="fixCol-6">{{ finding.finding_desc }}</td>
                <td class="text-center">
                  {{ finding.time_cm }}
                </td>
                <td class="text-center">
                  <CIcon v-if="finding.time_yokoten" icon="cil-check" size="sm" />
                </td>
                <td class="text-center" v-for="(optChange, i) in changeOpts" :key="optChange">
                  <CIcon v-if="optChange.system_value.includes(finding.opt_changes.split('; ')[i])" icon="cil-check"
                    size="sm" />
                </td>
                <td class="text-center" v-for="(dept, i) in deptOpts" :key="dept">
                  <CIcon v-if="dept.system_value.includes(finding.opt_depts.split('; ')[i])" icon="cil-check"
                    size="sm" />
                </td>
                <td v-for="item in totalDate" :key="item.idx" style="min-width: 30px">
                  <div v-if="item == finding.week_plan"
                    style="width: 20px; height: 20px; border: 2px dotted #64748b; background-color: #bbf7d0">
                  </div>

                  <div v-if="item == finding.week_actual" class="mt-2"
                    style="width: 20px; height: 20px; border: 2px solid #64748b; background-color: #bbf7d0">
                  </div>
                </td>
                <td class="text-center">
                  <img :src="getImage(finding.evaluation_nm)" :alt="getImage(finding.evaluation_nm)" width="50"
                    height="50">
                </td>
                <td>
                  <div class="d-flex">
                    <button class="btn btn-info btn-sm text-white mx-2"
                      @click="openEditFindingModal(finding, findingIndex)">Edit</button>
                    <button class="btn btn-warning btn-sm text-white"
                      @click="deleteFinding(finding.finding_id)">Delete</button>
                  </div>
                </td>
              </tr>

              <tr v-else>
                <td colspan="80">
                  <div class="alert alert-danger w-full" role="alert">
                    Data not found!
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
      <Pagination :totalPages="10" :perPage="10" :currentPage="currentPage" @changePage="onPageChange"
        :totalPage="totalPage" @changeLimit="onPageChangeLimit" />
    </div>

    <!-- edit modal -->
    <CModal backdrop="static" size="xl" :visible="editFindingModal" @close="() => { editFindingModal = false }"
      aria-labelledby="StaticBackdropExampleLabel">
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">Add finding</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="row">
          <div class="col">
            <div class="mb-2">
              <label class="mb-1">Line</label>
              <VueMultiselect v-model="selectedLineID" :options="getLinesOpts" optionLabel="text" optionValue="id"
                :customLabel="customLabel">
              </VueMultiselect>
            </div>
            <div class="mb-2">
              <label class="mb-1">Freq</label>
              <select class="form-select" v-model="selectedFreqID">
                <option v-for="freq in getFreqsOpts" :key="freq.id" :value="freq.id">
                  {{ freq.text }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Zone</label>
              <select class="form-select" v-model="selectedZoneID">
                <option v-for="zone in getZoneOpts" :key="zone.id" :value="zone.id">
                  {{ zone.text }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Kanban</label>
              <select class="form-select" v-model="selectedKanbanID">
                <option v-for="kanban in getKanbansOpts" :key="kanban.id" :value="kanban.id">
                  {{ kanban.text }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Finding PIC</label>
              <VueMultiselect v-model="selectedPIC" :options="picData" :custom-label="customPicOptions">
              </VueMultiselect>
            </div>
            <div class="mb-2">
              <label class="mb-1">Finding Date</label>
              <input type="date" class="form-control" v-model="findingDate" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Finding Desc</label>
              <input type="text" class="form-control" v-model="findingDesc" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Plan CM Date</label>
              <input type="date" class="form-control" v-model="planCMDate" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Plan CM Desc</label>
              <input type="text" class="form-control" v-model="planCMDesc" />
            </div>
          </div>
          <div class="col">
            <div class="mb-2">
              <label class="mb-1">Time CM</label>
              <input type="text" class="form-control" v-model="timeCM" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Time Yokoten</label>
              <select v-model="timeYokoten" class="form-select">
                <option value="true">Sudah</option>
                <option value="false">Belum</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Opt Changes</label>
              <select class="form-select" v-model="optChanges">
                <option v-for="optChange in changeOpts" :key="optChange">
                  {{ optChange.system_value }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Opt Department</label>
              <select class="form-select" v-model="optDepartment">
                <option v-for="optDept in deptOpts" :key="optDept">
                  {{ optDept.system_value }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">CM Judg</label>
              <select v-model="cmJudg" class="form-select">
                <option value="true">Sudah</option>
                <option value="false">Belum</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Actual PIC</label>
              <VueMultiselect v-model="actualPIC" :options="picData" :custom-label="customPicOptions">
              </VueMultiselect>
            </div>
            <div class="mb-2">
              <label class="mb-1">Actual CM Date</label>
              <input type="date" class="form-control" v-model="actualCMDate" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Evaluation Name</label>
              <input type="text" class="form-control" v-model="evaluationName" />
            </div>
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="() => { editFindingModal = false }">
          Close
        </CButton>
        <CButton color="primary" @click="updateFinding()"> {{ isUpdateFindingLoading ? 'Updating...' : `Update
          finding data` }} </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import moment from 'moment'
import Loading from 'vue-loading-overlay'
import { GET_GROUP } from '@/store/modules/group.module'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_ZONES } from '@/store/modules/zones.module'
import { GET_KANBANS } from '@/store/modules/kanban.module'
import { GET_FREQS } from '@/store/modules/freq.module'
import { GET_USERS } from '@/store/modules/user.module'

import { mapGetters } from 'vuex'
import ApiService from '@/store/api.service'

import VueMultiselect from 'vue-multiselect'
import { GET_4S_FINDINGS } from '@/store/modules/finding.module'
import Swal from 'sweetalert2'
import { toast } from 'vue3-toastify'
import Pagination from '@/components/Pagination.vue'


export default {
  name: 'Temuan4S',
  components: { Loading, VueMultiselect, Pagination },
  data() {
    return {
      changeOpts: [],
      deptOpts: [],
      evaluationOpts: [],
      totalDate: 48,
      isLoading: false,
      isUpdateFindingLoading: false,
      mainScheduleData: null,
      subScheduleData: null,
      signGLData: null,
      signSHData: null,
      selectedMonth: null,
      selectedLineIDFilter: null,
      selectedGroupIDFilter: -1,
      selectedZoneIDFilter: {
        id: "-1",
        text: 'All'
      },
      selectedKanbanIDFilter: {
        id: "-1",
        text: 'All'
      },
      selectedFreqIDFilter: -1,
      idxMonth: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
      ],
      monthStr: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ],
      option: {
        penColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(255,255,255)',
      },
      isUploadSignLoading: false,
      selectedSignature: null,
      selectedSignCheckerID: null,
      selectedSignType: null,
      selectedSign: null,
      addSignModal: false,
      editDataModal: false,
      selectedMainScheduleID: null,
      picData: [],
      lineData: [],
      editFindingModal: false,

      // finding
      findingList: [],
      scheduleItemCheckKanbanID: null,
      selectedLineID: null,
      selectedFreqID: null,
      selectedKanbanID: null,
      selectedZoneID: null,
      selectedPIC: null,
      findingDate: null,
      findingDesc: null,
      planCMDate: null,
      planCMDesc: null,
      timeCM: null,
      timeYokoten: null,
      optChanges: null,
      optChange: null,
      optDepartment: null,
      optDept: null,
      cmJudg: null,
      actualPIC: null,
      actualCMDate: null,
      evaluationName: null,
      selectedScheduleItemCheckKanbanID: null,
      selectedFindingID: null,
      currentPage: 0,
      totalPage: 0,
      currentPageLimit: 5,
    }
  },
  computed: {
    ...mapGetters([
      'getLinesOpts',
      'getGroupsOpts',
      'getZoneOpts',
      'getKanbansOpts',
      'getFreqsOpts',
      'getUsersOpts',
      'get4sFindings'
    ]),
    zoneGetID() {
      return this.selectedZoneIDFilter.id
    },
    kanbanGetID() {
      return this.selectedKanbanID.id
    }
  },
  watch: {
    selectedMonth: function () {
      if (this.selectedMonth) {
        this.generateDate()
        let idx = this.idxMonth.indexOf(this.selectedMonth.split('-')[1])
        this.yearMonth = `${this.monthStr[idx]} ${this.selectedMonth.split('-')[0]
          }`
      }
    },
    zoneGetID: function () {
      this.getFindings()
    }
  },
  methods: {
    customLabel(value) {
      return `${value.text}`
    },
    onPageChange(page, type) {
      if (type == 'prev') {
        this.currentPage = this.currentPage - 1
        this.getFindingsFunc()
      }

      if (type == 'next') {
        this.currentPage = this.currentPage + 1
        this.getFindingsFunc()
      }

      if (type == 'fromnumber') {
        this.currentPage = page
        this.getFindingsFunc()
      }
    },
    onPageChangeLimit(limit) {
      this.currentPageLimit = limit
      this.getFindings()
    },
    getImage(eval_nm) {
      return `./tanoko/${this.evaluationOpts.findIndex(x => x.system_value == eval_nm) + '.png'}`
    },
    async getSystem() {
      try {
        ApiService.setHeader()
        const changeOpts = await ApiService.get(`master/systems/get/4S_OPT_CHANGE`)
        const depts = await ApiService.get('master/systems/get/4S_OPT_DEPT')
        let evaluation = await ApiService.get('master/systems/get/4S_EVALUATION')
        // console.log(changeOpts);
        this.changeOpts = changeOpts.data.data
        this.deptOpts = depts.data.data
        this.evaluationOpts = evaluation.data.data
      } catch (error) {
        toast.error(error.response.data.message, {
          autoClose: 1000,
        })
      }
    },
    addScheduleCheck(mainScheduleID, subScheduleID) {
      this.$router.push(`/4s/schedule-check/${mainScheduleID}/${subScheduleID}`)
    },
    async getFindings() {
      let objQuery = {
        line_id: this.selectedLineIDFilter,
        kanban_id: this.selectedKanbanIDFilter.id,
        zone_id: this.zoneGetID,
        freq_id: this.selectedFreqIDFilter,
      }
      await this.$store.dispatch(GET_4S_FINDINGS, objQuery).then((res) => {
        this.findingList = res.list
        this.totalPage = res.total_page
        this.currentPage = res.current_page
      })
    },
    openEditFindingModal(finding) {
      const data = finding
      this.selectedFindingID = finding.finding_id
      this.scheduleItemCheckKanbanID = data.schedule_item_check_kanban_id
      this.selectedLineID = { text: data.line_nm, id: data.line_id }
      this.selectedFreqID = data.freq_id
      this.selectedZoneID = data.zone_id
      this.selectedKanbanID = data.kanban_id
      this.selectedPIC = { pic_name: data.finding_pic_nm, pic_id: data.finding_pic_id }
      this.findingDate = data.finding_date
      this.findingDesc = data.finding_desc
      this.planCMDate = data.plan_cm_date
      this.planCMDesc = data.plan_cm_desc
      this.timeCM = data.time_cm
      this.timeYokoten = data.time_yokoten
      this.optChanges = data.opt_changes
      this.optDepartment = data.opt_depts
      this.cmJudg = data.cm_judg
      this.actualPIC = { pic_name: data.actual_pic_nm, pic_id: data.actual_pic_id }
      this.actualCMDate = data.actual_cm_date
      this.evaluationName = data.evaluation_nm

      this.editFindingModal = true
    },

    async updateFinding() {
      ApiService.setHeader()
      this.isUpdateFindingLoading = true
      const findingData = {
        "schedule_item_check_kanban_id": this.scheduleItemCheckKanbanID,
        "line_id": this.selectedLineID.id,
        "freq_id": this.selectedFreqID,
        "zone_id": this.selectedZoneID,
        "kanban_id": this.selectedKanbanID,
        "finding_pic_id": this.selectedPIC.pic_id,
        "finding_date": this.findingDate,
        "finding_desc": this.findingDesc,
        "plan_cm_date": this.planCMDate,
        "plan_cm_desc": this.planCMDesc,
        "time_cm": +this.timeCM,
        "time_yokoten": this.timeYokoten,
        "opt_changes": this.optChanges,
        "opt_depts": this.optDepartment,
        "cm_judg": this.cmJudg,
        "actual_pic_id": this.actualPIC.pic_id,
        "actual_cm_date": this.actualCMDate,
        "evaluation_nm": this.evaluationName
      }

      const add = await ApiService.put(`operational/4s/finding/edit/${this.selectedFindingID}`, findingData)
      if (add.data.message == 'Success to edit 4s finding') {
        alert('Success update data')
        this.editFindingModal = false
        this.isUpdateFindingLoading = false
        await this.getFindings()
      } else {
        alert('Failed update data')
        this.isUpdateFindingLoading = false
        this.editFindingModal = false
      }
    },

    async deleteFinding(findingID) {
      Swal.fire({
        title: 'Are you sure to delete this Finding?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sure',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          ApiService.setHeader()
          const deleteData = ApiService.delete(`operational/4s/finding/delete/${findingID}`)

          if (deleteData) {
            Swal.fire('Data deleted!', '', 'success')
            this.getFindings()
          } else {
            Swal.fire('Error', '', 'warning')
          }
        } else if (result.isDenied) {
          Swal.fire('Canceled', '', 'info')
        }
      })

    },

    async addFilter() {
      await this.getFindings()
      await this.getZone()
    },
    resetFilter() {
      ; (this.selectedLineIDFilter = -1),
        (this.selectedFreqIDFilter = -1),
        (this.selectedGroupIDFilter = -1),
        (this.selectedZoneIDFilter = {
          id: "-1",
          text: 'All'
        }),
        (this.selectedKanbanIDFilter = {
          id: "-1",
          text: 'All'
        }),
        this.getFindings()
    },

    async getUsers() {
      try {
        await this.$store.dispatch(GET_USERS)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    customPicOptions({ pic_name }) {
      return `${pic_name}`
    },
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getGroup() {
      try {
        this.$store.dispatch(GET_GROUP)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getZone() {
      try {
        this.$store.dispatch(GET_ZONES, { line_id: this.selectedLineIDFilter })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getKanban() {
      try {
        this.$store.dispatch(GET_KANBANS)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getFreq() {
      try {
        this.$store.dispatch(GET_FREQS)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    generateDate() {
      let year = new Date(this.selectedMonth).getFullYear()
      let month = new Date(this.selectedMonth).getMonth() + 1
      let selectedMonth = new Date(`${year}-${month}`)
      var lastDay = new Date(year, month, 0)
      let container = []
      this.containerDate = []
      for (let i = 1; i <= lastDay.getDate(); i++) {
        let setDt = new Date(selectedMonth).setDate(i)
        let newDate = new Date(setDt)
        container.push(newDate.getDate())
        let dateObj = {
          bg: ``,
          date: newDate,
          idx: `${i}`,
        }
        if (newDate.getDay() === 0 || newDate.getDay() === 6)
          dateObj.bg = `bg-secondary`
        this.containerDate.push(dateObj)
      }
    },
    customKanbanFilterOptions({ text }) {
      return `${text}`
    },

  },

  async mounted() {
    this.isLoading = true
    await this.getSystem()
    await this.getLines()
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    if (localStorage.getItem('line_id')) {
      this.selectedLineIDFilter = localStorage.getItem('line_id')
    }
    await this.getGroup()
    await this.getZone()
    this.selectedZoneIDFilter = {
      id: "-1",
      text: 'All'
    }
    await this.getKanban()
    await this.getFreq()
    await this.getUsers()
    await this.getFindings()
    this.isLoading = false
  },
}
</script>

<style scoped>
.status-wrapper {
  width: 30px;
  height: 30px;
  background-color: #f0fdf4;
  border-radius: 6px;
}

.check-wrapper {
  width: 30px;
  height: 30px;
  background-color: #e0f2fe;
  border-radius: 100px;
  border: none;
}

.check-wrapper-null {
  width: 30px;
  height: 30px;
  background-color: #f3f4f6;
  border-radius: 100px;
  border: none;
}

.bullet {
  width: 10px;
  height: 10px;
  border: 2px solid black;
  border-radius: 10px;
}

.bullet-filled {
  width: 10px;
  height: 10px;
  background-color: black;
  border: 2px solid black;
  border-radius: 10px;
}

.bullet-cancel {
  width: 10px;
  height: 10px;
  background-color: black;
  border: 2px solid black;
  border-radius: 10px;
}

.fixed-td {
  position: absolute;
}

.tableFixHead {
  overflow: auto;
  height: 100%;
}


.tableFixHead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
}

#fixCol-head-1 {
  position: sticky;
  width: 38px;
  top: 0px;
  left: 0px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-2 {
  position: sticky;
  top: 0px;
  left: 37px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-3 {
  position: sticky;
  min-width: 121px;
  top: 0px;
  left: 105px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-4 {
  position: sticky;
  top: 0px;
  left: 220px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-5 {
  position: sticky;
  top: 0px;
  left: 270px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-6 {
  position: sticky;
  top: 0px;
  left: 340px;
  z-index: 3;
  background-color: white;
}

#fixCol-1 {
  position: sticky;
  width: 38px;
  top: 0px;
  left: 0px;
  z-index: 3;
  background-color: white;
}

#fixCol-2 {
  position: sticky;
  top: 0px;
  left: 37px;
  z-index: 3;
  background-color: white;
}

#fixCol-3 {
  position: sticky;
  min-width: 121px;
  top: 0px;
  left: 105px;
  z-index: 3;
  background-color: white;
}

#fixCol-4 {
  position: sticky;
  top: 0px;
  left: 220px;
  z-index: 3;
  background-color: white;
}

#fixCol-5 {
  position: sticky;
  top: 0px;
  left: 270px;
  z-index: 3;
  background-color: white;
}

#fixCol-6 {
  position: sticky;
  top: 0px;
  left: 340px;
  z-index: 3;
  background-color: white;
}


/* highlight on hover */
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
