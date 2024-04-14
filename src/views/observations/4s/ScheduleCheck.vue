<template>
  <div v-if="isLoading" class="card-body p-0 overflow-x-auto" style="width: 100%; height: 500px">
    <div class="vl-parent p-0" style="width: 100%; height: 100%">
      <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false" :on-cancel="onCancel" />
    </div>
  </div>
  <div v-if="!isLoading">
    <div class="card">
      <div class="row">
        <div class="col">
          <div class="card-body">
            <CInputGroup class="mb-3">
              <CInputGroupText>Line</CInputGroupText>
              <CFormInput :value="getSubSchedulesCheck?.line_nm" disabled />
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>Area</CInputGroupText>
              <CFormInput :value="getSubSchedulesCheck?.area_nm" disabled />
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>Group</CInputGroupText>
              <CFormInput :value="getSubSchedulesCheck?.group_nm" disabled />
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>Plan Date</CInputGroupText>
              <CFormInput :value="getSubSchedulesCheck?.actual_time?.substring(0, 10)" disabled />
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>Plan PIC</CInputGroupText>
              <CFormInput :value="getSubSchedulesCheck?.pic_nm" disabled />
            </CInputGroup>
          </div>
        </div>
        <div class="col">
          <div class="card-body">
            <CInputGroup class="mb-3">
              <CInputGroupText>Zone</CInputGroupText>
              <CFormInput :value="getSubSchedulesCheck?.zone_nm" disabled />
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>No Kanban</CInputGroupText>
              <CFormInput :value="getSubSchedulesCheck?.kanban_no" disabled />
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>Act Date</CInputGroupText>
              <CFormInput v-if="getSubSchedulesCheck?.actual_time"
                :value="getSubSchedulesCheck?.actual_time.substring(0, 10)" disabled />
              <input type="date" class="form-control" v-model="detailActualDate">
              <CInputGroupText>
                <button class="btn btn-info btn-sm text-white" @click="updateScheduleCheckData()"> {{
    isUpdateCheckLoading ? 'updating..' : 'update' }} </button>
              </CInputGroupText>
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>Act PIC</CInputGroupText>
              <CFormInput :value="getSubSchedulesCheck?.actual_pic_nm" disabled />
              <Select2 class="form-control" :options="Users" v-model="detailActualPIC" />
              <CInputGroupText>
                <button class="btn btn-info btn-sm text-white" @click="updateScheduleCheckData()">{{
    isUpdateCheckLoading ? 'updating..' : 'update' }}</button>
              </CInputGroupText>
            </CInputGroup>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-3">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>No</th>
            <th>Item Check</th>
            <th>Judgement</th>
            <th>Time</th>
            <th>Actions</th>
            <th>Finding</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in itemCheks" :key="item">
            <td>{{ index + 1 }}</td>
            <td> {{ item.item_check_nm }} </td>
            <td>
              <CFormSelect v-model="item.judgment_id">
                <option>Select Judgment</option>
                <option v-for="judg in judgments" :key="judg.id" :value="judg.id">
                  {{ judg.text }}
                </option>
              </CFormSelect>
            </td>
            <td>
              <CFormInput v-model="item.actual_time" />
            </td>
            <td>
              <button class="btn btn-info btn-sm text-white"
                @click="saveScheduleCheck(item.judgment_id, item.actual_time, item.item_check_kanban_id)">
                {{ isAddCheckLoading ?
    'Saving...' : 'Save' }}
              </button>
            </td>
            <td>
              <button v-if="item.judgment_id == '2e247c66-3e9c-44b6-951a-0a26791ad37d' && item.findings.length > 0"
                class=" btn btn-info btn-sm text-white"
                @click="openEditFindingModal(item.schedule_item_check_kanban_id, item.findings, 'update')">Update
                finding</button>
              <button v-else-if="item.judgment_id == '2e247c66-3e9c-44b6-951a-0a26791ad37d'"
                class=" btn btn-info btn-sm text-white"
                @click="openAddFindingModal(item.schedule_item_check_kanban_id, 'add')">Add
                finding</button>
            </td>

          </tr>
        </tbody>
      </table>
    </div>

    <!-- modals -->
    <CModal backdrop="static" size="xl" :visible="addFindingModal" @close="() => { addFindingModal = false }"
      aria-labelledby="StaticBackdropExampleLabel">
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">{{ findingActionType }} finding</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="row">
          <div class="col">
            <div class="row" v-if="findingActionType == 'update'">
              <div class="col">
                <div class="mb-2">
                  <label class="mb-1">Line</label>
                  <input type="text" class="form-control" :value="lineName" disabled>
                </div>
              </div>
              <div class="col">
                <div class="mb-2">
                  <label class="mb-1"></label>
                  <VueMultiselect v-model="selectedLineID" :options="lineData" :custom-label="customLineFilterOptions">
                  </VueMultiselect>
                </div>
              </div>
            </div>
            <div class="col" v-else>
              <div class="mb-2">
                <label class="mb-1">Line</label>
                <VueMultiselect v-model="selectedLineID" :options="lineData" :custom-label="customLineFilterOptions">
                </VueMultiselect>
              </div>
            </div>
            <div class="mb-2">
              <label class="mb-1">Freq</label>
              <select class="form-select" v-model="selectedFreqID">
                <option v-for="freq in getFreqs" :key="freq.id" :value="freq.id">
                  {{ freq.freq_nm }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Zone</label>
              <select class="form-select" v-model="selectedZoneID">
                <option v-for="zone in getZones" :key="zone.zone_id" :value="zone.zone_id">
                  {{ zone.zone_nm }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Kanban</label>
              <select class="form-select" v-model="selectedKanbanID">
                <option v-for="kanban in getKanbans" :key="kanban.kanban_id" :value="kanban.kanban_id">
                  {{ kanban.kanban_no }}
                </option>
              </select>
            </div>
            <div class="row" v-if="findingActionType == 'update'">
              <div class="col">
                <div class="mb-2">
                  <label class="mb-1">Finding PIC</label>
                  <input type="text" class="form-control" :value="findingPicName" disabled>
                </div>
              </div>
              <div class="col">
                <div class="mb-2">
                  <label class="mb-1"></label>
                  <VueMultiselect v-model="selectedPIC" :options="picData" :custom-label="customPicOptions">
                  </VueMultiselect>
                </div>
              </div>
            </div>
            <div class="mb-2" v-else>
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
                <option v-for="optChange in optChangeData" :key="optChange" :value="optChange.system_value">
                  {{ optChange.system_value }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Opt Department</label>
              <select class="form-select" v-model="optDepartment">
                <option v-for="optDept in optDeptData" :key="optDept" :value="optDept.system_value">
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

            <div class="row" v-if="findingActionType == 'update'">
              <div class="col">
                <div class="mb-2">
                  <label class="mb-1">Actual PIC</label>
                  <input type="text" class="form-control" :value="actualPicName" disabled>
                </div>
              </div>
              <div class="col">
                <div class="mb-2">
                  <label class="mb-1"></label>
                  <VueMultiselect v-model="actualPIC" :options="picData" :custom-label="customPicOptions">
                  </VueMultiselect>
                </div>
              </div>
            </div>

            <div class="mb-2" v-else>
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
        <CButton color="secondary" @click="() => { addFindingModal = false }">
          Close
        </CButton>
        <CButton v-if="findingActionType == 'add'" color="primary" @click="addFinding()"> {{ findingActionType
          }} finding
          data</CButton>
        <CButton color="primary" v-else @click="updateFinding()"> {{ findingActionType }} finding data</CButton>
      </CModalFooter>
    </CModal>


  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { GET_SCHEDULES_CHECK } from '@/store/modules/schedule4s.module'
import { GET_LINES } from '@/store/modules/filter.module'
import { GET_USERS } from '@/store/modules/user.module'
import ApiService from '@/store/api.service'
import VueMultiselect from 'vue-multiselect'
import { GET_ZONES } from '@/store/modules/zones.module'
import { GET_KANBANS } from '@/store/modules/kanban.module'
import { GET_FREQS } from '@/store/modules/freq.module'
import { GET_SYSTEMS } from '@/store/modules/system.module'
import Loading from 'vue-loading-overlay'

export default {
  name: "Schedule Check",
  components: {
    VueMultiselect, Loading
  },
  data() {
    return {
      isLoading: false,
      isAddCheckLoading: false,
      isUpdateCheckLoading: false,
      itemCheks: null,
      judgments: null,
      addFindingModal: false,
      lineData: [],
      picData: [],
      lineName: null,
      findingPicName: null,
      actualPicName: null,
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
      optDepartment: null,
      cmJudg: null,
      actualPIC: null,
      actualCMDate: null,
      evaluationName: null,
      selectedScheduleItemCheckKanbanID: null,
      optChangeData: null,
      optDeptData: null,
      findingActionType: null,
      selectedFindingID: null,
      // detail
      detailActualPIC: null,
      detailActualDate: null
    }
  },
  computed: {
    ...mapGetters([
      'getSubSchedulesCheck',
      'getUsersOpts',
      'getLinesOpts',
      'getZones',
      'getKanbans',
      'getFreqs',
    ]),
    Users() {
      if (this.getUsersOpts) {
        let container = this.getUsersOpts.map(user => {
          return {
            id: user.id,
            text: `${user.noreg}-${user.text}`
          }
        })
        return container;
      } else {
        return [];
      }
    }
  },
  methods: {
    async getScheduleCheck() {
      this.isLoading = true
      let objQuery = {
        sub_schedule_id: this.$route.params.subScheduleID
      }
      await this.$store.dispatch(GET_SCHEDULES_CHECK, objQuery).then((res) => {
        if (res) {
          this.itemCheks = res.item_check_kanbans
          this.isLoading = false
        }
      })
    },
    async saveScheduleCheck(selectedJudgementID, actualTime, itemCheckKanbanID) {
      this.isAddCheckLoading = true
      ApiService.setHeader()
      const data = {
        "judgment_id": selectedJudgementID,
        "main_schedule_id": this.$route.params.mainScheduleID,
        "item_check_kanban_id": itemCheckKanbanID,
        "actual_time": actualTime,
        "checked_date": moment().toISOString().split('T')[0]
      }
      const judgments = await ApiService.post(`operational/4s/schedule-item-check-kanban/add`, data)
      if (judgments.data.message == 'Success to add 4s schedule item check kanban') {
        alert('Success add data')
        this.isAddCheckLoading = false
        this.selectedScheduleItemCheckKanbanID = judgments.data.data.schedule_item_check_kanban_id
      } else {
        alert('Failed add data')
      }
    },
    openAddFindingModal(scheduleItemCheckKanbanID) {
      if (scheduleItemCheckKanbanID !== null) {
        this.selectedScheduleItemCheckKanbanID = scheduleItemCheckKanbanID
      }
      this.addFindingModal = true
    },
    openEditFindingModal(scheduleItemCheckKanbanID, findings, actionType) {
      this.selectedFindingID = findings[0].finding_id
      if (scheduleItemCheckKanbanID !== null) {
        this.selectedScheduleItemCheckKanbanID = scheduleItemCheckKanbanID
      }
      this.findingActionType = actionType
      const data = findings[0]

      this.selectedLineID = { line_name: data.line_nm, line_id: data.line_id }
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

      this.lineName = data.line_nm
      this.findingPicName = data.finding_pic_nm
      this.actualPicName = data.actual_pic_nm

      this.addFindingModal = true
    },
    async addFinding() {
      ApiService.setHeader()
      const findingData = {
        "schedule_item_check_kanban_id": this.selectedScheduleItemCheckKanbanID,
        "line_id": this.selectedLineID.line_id,
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

      const add = await ApiService.post(`operational/4s/finding/add`, findingData)
      if (add.data.message == 'Success to add 4s finding') {
        alert('Success add data')
        this.addFindingModal = false
        await this.getScheduleCheck()
      } else {
        alert('Failed add data')

      }
    },
    async updateFinding() {
      ApiService.setHeader()
      const findingData = {
        "schedule_item_check_kanban_id": this.selectedScheduleItemCheckKanbanID,
        "line_id": this.selectedLineID.line_id,
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

      const update = await ApiService.put(`operational/4s/finding/edit/${this.selectedFindingID}`, findingData)
      if (update.data.message == 'Success to edit 4s finding') {
        alert('Success edit data')
        this.addFindingModal = false
        await this.getScheduleCheck()
      } else {
        alert('Failed edit data')
      }
    },
    async updateScheduleCheckData() {
      ApiService.setHeader()
      this.isUpdateCheckLoading = true
      const data = {
        actual_date: this.detailActualDate,
        actual_pic_id: this.detailActualPIC
      }
      const updateData = await ApiService.put(`operational/4s/sub-schedule/edit/${this.$route.params.subScheduleID}`, data)
      if (updateData.data.message == 'Success to edit 4s schedule plan') {
        this.detailActualDate = null
        this.detailActualPIC = null
        this.getScheduleCheck()
        this.isUpdateCheckLoading = false
      }
    },
    async getJudgements() {
      ApiService.setHeader()
      const judgments = await ApiService.get(`master/judgments`)
      this.judgments = judgments.data.data
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

    async getZone() {
      try {
        this.$store.dispatch(GET_ZONES)
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
    async getOptChangeSystem() {
      let objQuery = {
        system_type: '4S_OPT_CHANGE'
      }
      try {
        this.$store.dispatch(GET_SYSTEMS, objQuery).then(res => {
          this.optChangeData = res
        })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getOptDeptSystem() {
      let objQuery = {
        system_type: '4S_OPT_DEPT'
      }
      try {
        this.$store.dispatch(GET_SYSTEMS, objQuery).then(res => {
          this.optDeptData = res
        })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
  },
  updated() {
    this.mapLinesData()
    this.mapUsersData()
  },

  async mounted() {
    await this.getScheduleCheck()
    await this.getJudgements()
    await this.getUsers()
    await this.getLines()
    await this.getZone()
    await this.getFreq()
    await this.getKanban()
    await this.getOptChangeSystem()
    await this.getOptDeptSystem()
  }
}
</script>

<style></style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>