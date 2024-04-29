<template>
  <div v-if="isLoading" class="card-body p-0 overflow-x-auto" style="width: 100%; height: 500px">
    <div class="vl-parent p-0" style="width: 100%; height: 100%">
      <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false" :on-cancel="onCancel" />
    </div>
  </div>
  <div v-if="!isLoading">
    <div class="card">
      <div class="row">
        <div class="col-lg-6 col-md-6 col-12">
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
              <CFormInput :value="getSubSchedulesCheck?.plan_time?.substring(0, 10)" disabled />
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>Act Date</CInputGroupText>
              <CFormInput v-if="getSubSchedulesCheck?.actual_time"
                :value="getSubSchedulesCheck?.actual_time?.substring(0, 10)" disabled />
              <input type="date" class="form-control" v-model="detailActualDate">
              <CInputGroupText>
                <button class="btn btn-info btn-sm text-white" @click="updateScheduleCheckData()"> {{
    isUpdateCheckLoading ? 'updating..' : 'update' }} </button>
              </CInputGroupText>
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
              <CInputGroupText>Plan PIC</CInputGroupText>
              <CFormInput :value="getSubSchedulesCheck?.pic_nm" disabled />
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>Act PIC</CInputGroupText>
              <CFormInput :value="getSubSchedulesCheck?.actual_pic_nm" disabled />
              <Select2 class="form-control" :options="getUsersOpts" v-model="detailActualPIC" />
              <CInputGroupText>
                <button class="btn btn-info btn-sm text-white" @click="updateScheduleCheckData()">{{
    isUpdateCheckLoading ? 'updating..' : 'update' }}</button>
              </CInputGroupText>
            </CInputGroup>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <button class="btn btn-primary" @click="modalKanbanDetail = true">Lihat Kanban</button>
        <CModal backdrop="static" size="xl" :visible="modalKanbanDetail" @close="() => { modalKanbanDetail = false }"
          aria-labelledby="StaticBackdropExampleLabel">
          <CModalHeader>
            <CModalTitle>Kanban Check</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <KanbanItemCheck :kanban_id="gettingKanbanID" />
          </CModalBody>
        </CModal>
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
                @click="openAddFindingModal(item.schedule_item_check_kanban_id, null, 'add')">Add
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
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Line</label>
              <input type="text" :value="getSubSchedulesCheck?.line_nm" class="form-control" disabled>
            </div>
            <div class="mb-2">
              <label class="mb-1">Zone</label>
              <select class="form-select" v-model="selectedZoneID" disabled>
                <option v-for="zone in getZones" :key="zone.zone_id" :value="zone.zone_id">
                  {{ zone.zone_nm }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Freq</label>
              <select class="form-select" v-model="selectedFreqID" disabled>
                <option v-for="freq in getFreqs" :key="freq.id" :value="freq.id">
                  {{ freq.freq_nm }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Kanban</label>
              <select class="form-select" v-model="selectedKanbanID" disabled>
                <option v-for="kanban in getKanbans" :key="kanban.kanban_id" :value="kanban.kanban_id">
                  {{ kanban.kanban_no }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="mb-2">
              <label class="mb-1">Finding Desc</label>
              <input type="text" class="form-control" v-model="findingDesc" placeholder="Write Finding Desc" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Finding Date</label>
              <input type="date" class="form-control" v-model="findingDate" placeholder="Select Finding Date" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Finding PIC</label>
              <VueMultiselect v-model="selectedPIC" :options="picData" :custom-label="customPicOptions"
                class="vue-multi-select">
              </VueMultiselect>
            </div>

          </div>
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Reduce Time Countermeasure (Menit)</label>
              <div class="d-flex align-items-center">
                <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" v-model="enabledReduceTime"
                  class="me-2" style="height: 20px; width: 20px;">
                <input type="text" class="form-control" v-model="timeCM" :disabled="!enabledReduceTime"
                  @keypress="$event.key.match(/^[\d]$/) ? '' : $event.preventDefault()" />
              </div>
            </div>
            <div class="mb-2">
              <label class="mb-1">Actual PIC</label>
              <VueMultiselect v-model="actualPIC" :disabled="findingActionType == 'update'" :options="picData"
                :custom-label="customPicOptions" class="vue-multi-select">
              </VueMultiselect>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Plan Countermeasure Date</label>
              <input type="date" class="form-control" v-model="planCMDate" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Actual Countermeasure Date</label>
              <input type="date" class="form-control" v-model="actualCMDate"
                :disabled="findingActionType == 'update'" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="mb-2">
              <label class="mb-1">Plan Countermeasure Desc</label>
              <input type="text" class="form-control" v-model="planCMDesc"
                placeholder="Write Plan Countermeasure Desc" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Yokoten</label>
              <select v-model="timeYokoten" class="form-select">
                <option value="null" selected>Select Yokoten</option>
                <option value="true">Sudah</option>
                <option value="false" selected>Belum</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Department Terkait</label>
              <select class="form-select" v-model="optDepartment">
                <option value="null" selected>Select Department Terkait</option>
                <option v-for="optDept in optDeptData" :key="optDept" :value="optDept.system_value">
                  {{ optDept.system_value }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Perubahan Standart</label>
              <select class="form-select" v-model="optChanges">
                <option value="null" selected>Select Standart</option>
                <option v-for="optChange in optChangeData" :key="optChange" :value="optChange.system_value">
                  {{ optChange.system_value }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Status Countermeasure</label>
              <select v-model="cmJudg" class="form-select" :disabled="findingActionType == 'update'">
                <option value="null" selected>Select Status Countermeasure</option>
                <option value="true">Sudah</option>
                <option value="false">Belum</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="mb-2">
              <label class="mb-1">Evaluation</label>
              <select class="form-select" v-model="evaluationName" :disabled="findingActionType == 'update'">
                <option value="null" selected>Select Evaluation</option>
                <option v-for="optEval in optEvaluation" :key="optEval" :value="optEval.system_value">
                  {{ optEval.system_value }}
                </option>
              </select>
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

    <!-- <ModalForm4sFinding :visiblee="modalFormFinding" :loadedFinding="" /> -->
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
import { toast } from 'vue3-toastify'
import KanbanItemCheck from '@/components/kanban4s/KanbanItemCheck.vue'
import ModalForm4sFinding from '@/components/4s/ModalForm4sFinding.vue'

export default {
  name: "Schedule Check",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    VueMultiselect, Loading, KanbanItemCheck, ModalForm4sFinding
  },
  data() {
    return {
      modalKanbanDetail: false,
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
      findingDate: moment().format('YYYY-MM-DD'),
      findingDesc: null,
      planCMDate: moment().format('YYYY-MM-DD'),
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
      optEvaluation: null,
      optDeptData: null,
      findingActionType: null,
      selectedFindingID: null,
      // detail
      detailActualPIC: null,
      detailActualDate: null,
      gettingKanbanID: null,
      enabledReduceTime: false,
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
    },
    loadedFinding() {
      // should set actual_pic_id = null cause duplicate object
      const result = this.getSubSchedulesCheck?.finding ?? {
        ...this.getOmSubSchedulesDetail,
        actual_pic_id: null
      }

      return result
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
          this.gettingKanbanID = res.kanban_id
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
        toast.success('Success add data', {
          autoClose: 700
        })
        this.isAddCheckLoading = false
        this.selectedScheduleItemCheckKanbanID = judgments.data.data.schedule_item_check_kanban_id
      } else {
        alert('Failed add data')
      }
    },
    openAddFindingModal(scheduleItemCheckKanbanID, findings, actionType) {
      this.findingActionType = actionType
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
      this.actualCMDate = data?.actual_cm_date?.substring(0, 10)
      this.evaluationName = data.evaluation_nm

      this.lineName = data.line_nm
      this.findingPicName = data.finding_pic_nm
      this.actualPicName = data.actual_pic_nm

      this.addFindingModal = true
      if (data.time_cm) {
        this.enabledReduceTime = true
      } else {
        this.enabledReduceTime = false
      }
    },
    async addFinding() {
      ApiService.setHeader()
      const findingData = {
        "sub_schedule_id": this.$route.params.subScheduleID,
        "schedule_item_check_kanban_id": this.selectedScheduleItemCheckKanbanID,
        // "line_id": this.selectedLineID.line_id,
        // "line_id": this.getSubSchedulesCheck?.line_id,
        // "freq_id": this.selectedFreqID,
        // "zone_id": this.selectedZoneID,
        // "kanban_id": this.selectedKanbanID,
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
        toast.success('Success add data', {
          autoClose: 700
        })
        this.addFindingModal = false
        await this.getScheduleCheck()
      } else {
        toast.error('Failed', {
          autoClose: 700
        })
      }
    },
    async updateFinding() {
      ApiService.setHeader()
      const findingData = {
        "sub_schedule_id": this.$route.params.subScheduleID,
        "schedule_item_check_kanban_id": this.selectedScheduleItemCheckKanbanID,
        // "line_id": this.selectedLineID.line_id,
        // "freq_id": this.selectedFreqID,
        // "zone_id": this.selectedZoneID,
        // "kanban_id": this.selectedKanbanID,
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
        toast.success('Success edit data', {
          autoClose: 700
        })
        this.addFindingModal = false
        await this.getScheduleCheck()
      } else {
        toast.error('Failed', {
          autoClose: 700
        })
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
    async getEvaluation() {
      let objQuery = {
        system_type: '4S_EVALUATION'
      }
      try {
        this.$store.dispatch(GET_SYSTEMS, objQuery).then(res => {
          this.optEvaluation = res
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
    await this.getEvaluation()

    this.selectedFreqID = this.getSubSchedulesCheck?.freq_id
    this.selectedZoneID = this.getSubSchedulesCheck?.zone_id
    this.selectedKanbanID = this.getSubSchedulesCheck?.kanban_id
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style>
.h-10 {
  height: 10px !important;
}

.vue-multi-select {
  width: auto !important;
  flex: 1 1 auto !important;
}
</style>
