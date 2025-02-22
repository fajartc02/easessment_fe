<template>
  <CModal backdrop="static" alignment="center" :visible="visibleModalConfJudg" @close="cancelJudgmentConf()" size="sm">
    <CModalHeader>
      <CModalTitle>Confirmation</CModalTitle>
    </CModalHeader>
    <CModalBody>
      Apakah kamu yakin ingin melakukan kanban no: <b>{{ selectedJudgContent.kanban_no }}</b> judgment: <b>{{
        selectedJudgContent.judgment }}</b>?
    </CModalBody>
    <CModalFooter>
      <CButton color="primary" class="text-white" @click="judgmentSubmission()" :disabled="isLoading">
        Yes
      </CButton>
      <CButton color="warning" class="text-white" @click="cancelJudgmentConf()">
        Cancel
      </CButton>
    </CModalFooter>
  </CModal>
  <!-- modal check visible NG -->
  <CModal class="w-100" backdrop="static" alignment="center" :visible="visibleModalFindingJudg"
    @close="cancelFindingSubmission()" size="xl">
    <CModalHeader>
      <CModalTitle>Input Finding</CModalTitle>
    </CModalHeader>
    <CModalBody class="w-100">
      <div class="mt-3">
        <table class="table table-bordered">
          <thead>
            <tr class="tr-centered">
              <th>No</th>
              <th style="min-width: 200px;">Item Check</th>
              <th>Method</th>
              <th style="min-width: 200px;">Control Point</th>
              <th>Judgement</th>
              <th>History Standard Time</th>
              <th>Standard Time</th>
              <th>Actual Time</th>
              <th>Actions</th>
              <th>Finding</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in itemCheckKanbans" :key="item" class="align-middle">
              <td class="text-center">{{ index + 1 }}</td>
              <td>{{ item.item_check_nm }}</td>
              <td>{{ item.method }}</td>
              <td>{{ item.control_point }}</td>
              <td>
                <CFormSelect v-model="item.judgment_id">
                  <option>Select</option>
                  <option v-for="judg in judgments" :key="judg.id" :value="judg.id">
                    {{ judg.text }}
                  </option>
                </CFormSelect>
              </td>
              <td>
                {{ item.before_standart_time ?? '-' }}
              </td>
              <td>
                <CFormInput v-if="item.judgment_id !== 'c4f5ff30-1b95-4ad8-8af8-e3e9d90bd942'"
                  v-model="item.standart_time" type="number" />
                <span v-else>
                  {{ item.standart_time }}
                </span>
              </td>
              <td>
                <CFormInput v-model="item.actual_time" type="number" />
              </td>

              <td v-if="item.actual_time" class="text-center">
                <button class="btn btn-success btn-sm text-white"
                  @click="saveScheduleCheck(item.judgment_id, item.actual_time, item.item_check_kanban_id, item.judgment_id !== 'c4f5ff30-1b95-4ad8-8af8-e3e9d90bd942' ? item.standart_time : null)">
                  {{
                    isAddCheckLoading?.isLoading && isAddCheckLoading?.id == item.item_check_kanban_id
                      ? "Saving..."
                      : "Save"
                  }}
                </button>
              </td>
              <td v-else>
                <button class="btn btn-info btn-sm text-white" disabled>
                  Isi Dahulu
                </button>
              </td>
              <td v-if="item.is_abnormal" class="text-center">
                <button v-if="item.findings.length == 0" class=" btn btn-info btn-sm text-white"
                  @click="openAddFindingModal(item.schedule_item_check_kanban_id, null, 'add')">
                  Add Finding
                </button>
                <button v-else class=" btn btn-secondary btn-sm text-white" disabled>
                  Finding Submitted
                </button>
              </td>
              <td v-else class="text-center">
                <span class="text-muted">No Action</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CModalBody>
    <!-- this.$emit('emit-refetch-schedule', true) -->
    <CModalFooter>
      <CButton color="secondary" @click="() => { $emit('emit-refetch-schedule', true) }">
        Close
      </CButton>
    </CModalFooter>
  </CModal>

  <!-- modal FINDING input -->
  <CModal backdrop="static" size="xl" :visible="addFindingModal" @close="() => { addFindingModal = false }"
    aria-labelledby="StaticBackdropExampleLabel">
    <CModalHeader>
      <CModalTitle id="StaticBackdropExampleLabel">{{ isEdit ? "Edit" : "Add" }} Finding</CModalTitle>
    </CModalHeader>
    <CForm @submit="submit" novalidate :validated="isFromFindingValidate">
      <CModalBody>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Line</label>
              <input type="text" :value="selectedJudgContent?.line_nm" class="form-control" disabled>
            </div>
            <div class="mb-2">
              <label class="mb-1">Zone</label>
              <select class="form-select" v-model="selectedJudgContent.zone_id" disabled>
                <option v-for="zone in getZones" :key="zone.zone_id" :value="zone.zone_id">
                  {{ zone.zone_nm }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Freq</label>
              <select class="form-select" v-model="selectedJudgContent.freq_id" disabled>
                <option v-for="freq in getFreqs" :key="freq.id" :value="freq.id">
                  {{ freq.freq_nm }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Kanban</label>
              <input type="text" :value="selectedJudgContent?.kanban_no" class="form-control" disabled>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="mb-2">
              <label class="mb-1">Finding Desc</label>
              <input type="text" class="form-control" v-model="findingDesc" placeholder="Write Finding Desc"
                :required="!isEdit" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Finding Date</label>
              <input type="date" class="form-control" v-model="findingDate" placeholder="Select Finding Date"
                :required="!isEdit" />
            </div>
            <div class="mb-2" :class="{ 'invalid': showErrorFindingPic }">
              <label class="mb-1" style="margin-top: 1.5em;">
                Finding PIC
              </label>
              <treeselect v-model="selectedPIC" :options="picData" class="vue-multi-select">
              </treeselect>
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
              <small v-if="!enabledReduceTime" class="text-info">* Ceklis & isi waktu pengurangan jika ada</small>
              <small v-else class="text-success">* Abaikan jika tidak ingin di ubah</small>
            </div>
            <div class="mb-2" :class="{ 'invalid': showErrorActualPic }">
              <label class="mb-1">PIC Countermeasure</label>
              <treeselect v-model="actualPIC" :options="picData" class="vue-multi-select">
              </treeselect>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Plan Countermeasure Date</label>
              <input type="date" class="form-control" v-model="planCMDate" :required="!isEdit" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Actual Countermeasure Date</label>
              <input type="date" class="form-control" v-model="actualCMDate" :disabled="!isEdit" />
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
          <div class="col-12 col-md-12">
            <div class="mb-2">
              <label class="mb-1">Department Terkait</label>
              <treeselect class="" v-model="optDepartment" :multiple="true" :options="getSystemsOptDept" />
            </div>
          </div>
          <div class="col-12 col-md-12">
            <div class="mb-2">
              <label class="mb-1">Perubahan Standart</label>
              <select class="form-select" v-model="optChanges">
                <option value="null" selected>Select Standart</option>
                <option v-for="optChange in optChangeData" :key="optChange" :value="optChange.system_value">
                  {{ optChange.system_value }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-md-12">
            <label class="mb-1">Evaluation</label>
            <select class="form-select" v-model="evaluationName">
              <option value="null" selected>Select Evaluation</option>
              <option v-for="optEval in optEvaluation" :key="optEval" :value="optEval.system_value">
                {{ optEval.system_value }}
              </option>
            </select>
            <table class="table">
              <tr>
                <th><img src="@/../public/tanoko/0.png" width="50" height="50"></th>
                <th>Order Part</th>
                <th><img src="@/../public/tanoko/1.png" width="50" height="50"></th>
                <th>Countermeasure</th>
                <th><img src="@/../public/tanoko/2.png" width="50" height="50"></th>
                <th>Monitor / Follow</th>
                <th><img src="@/../public/tanoko/3.png" width="50" height="50"></th>
                <th>Finish</th>
              </tr>
            </table>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <label class="mb-1">Finding Image</label>
            <input ref="finding_image" type="file" class="form-control" />
          </div>
        </div>
        <div v-if="!isEdit" class="mb-2 mt-2">
          <label class="mb-1">Kaizen File</label>
          <input ref="kaizen_file" type="file" class="form-control" />
        </div>
        <div class="mb-2 mt-2">
          <label class="mb-1">Status Countermeasure</label>
          <select v-model="cmJudg" class="form-select" disabled>
            <option value="true">Sudah</option>
            <option value="false">Belum</option>
          </select>
        </div>
        <div class="mb-2">
          <label class="mb-1">Yokoten</label>
          <select v-model="timeYokoten" class="form-select" disabled>
            <option value="true">Sudah</option>
            <option value="false" selected>Belum</option>
          </select>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="() => { addFindingModal = false }">
          Close
        </CButton>
        <CButton color="primary" type="submit">
          Add Finding Data
        </CButton>
      </CModalFooter>
    </CForm>
  </CModal>
</template>
<script>
import ApiService from '@/store/api.service';
import { GET_SYSTEMS } from '@/store/modules/system.module';
import { GET_ZONES } from '@/store/modules/zones.module';
import moment from 'moment';
import Swal from 'sweetalert2';
import { toast } from "vue3-toastify";
import { mapGetters } from 'vuex';

import "vue3-treeselect/dist/vue3-treeselect.css";
import Treeselect from "vue3-treeselect";
import { GET_FREQS } from '@/store/modules/freq.module';
import { GET_USERS } from '@/store/modules/user.module';

export default {
  name: 'JudgmentConfirmation',
  data() {
    return {
      visibleModalConfJudg: false,
      visibleModalFindingJudg: false,
      selectedJudgContent: null,
      judgments: null,
      headerForm: {
        actual_date: null,
        actual_pic_id: null
      },
      itemCheckKanbans: null,
      isLoading: false,
      isAddCheckLoading: null,
      addFindingModal: false,

      // finding data
      isFromFindingValidate: false,
      optChangeData: null,
      isDirectUploadKaizen: false,
      selectedFindingID: null,
      selectedPIC: null,
      findingDate: moment().format("YYYY-MM-DD"),
      findingDesc: null,
      planCMDate: moment().format("YYYY-MM-DD"),
      planCMDesc: null,
      timeCM: null,
      timeYokoten: false,
      optChanges: null,
      optDepartment: null,
      cmJudg: false,
      actualPIC: null,
      actualCMDate: null,
      evaluationName: null,
      lineName: null,
      findingPicName: null,
      actualPicName: null,
      enabledReduceTime: false,
    }
  },
  computed: {
    ...mapGetters(['getSubSchedulesCheck', 'getZones', 'getFreqs', 'getSystemsOptDept', 'getUsersOpts', 'getLinesOpts'])
  },
  watch: {
    visible(val) {
      this.visibleModalConfJudg = val
    },
    data(val) {
      this.selectedJudgContent = val
    },
    // itemCheckKanbans: {
    //   handler(val) {
    //     // const isItemCheckKanbansContainNG = val.some((item) => {
    //     //   return (item.judgment_nm === 'NG' && item.findings.length === 0) || item.judgment_nm;
    //     // })
    //     // console.log('isItemCheckKanbansContainNG: ', isItemCheckKanbansContainNG)
    //   },
    //   deep: true
    // }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: null,
    },
  },
  methods: {
    cancelFindingSubmission() {
      this.visibleModalFindingJudg = false
      this.$emit('emit-visible', false)
      this.$emit('emit-data', null)
    },
    resetForm() {
      this.headerForm = {
        actual_date: null,
        actual_pic_id: null
      }
      this.itemCheckKanbans = null
    },
    resetFormFinding() {
      this.isDirectUploadKaizen = false;
      this.selectedFindingID = null;
      this.selectedPIC = null;
      this.findingDate = moment().format("YYYY-MM-DD");
      this.findingDesc = null;
      this.planCMDate = moment().format("YYYY-MM-DD");
      this.planCMDesc = null;
      this.timeCM = null;
      this.timeYokoten = false;
      this.optChanges = null;
      this.optDepartment = null;
      this.cmJudg = false;
      this.actualPIC = null;
      this.actualCMDate = null;
      this.evaluationName = null;
      this.lineName = null;
      this.findingPicName = null;
      this.actualPicName = null;
      this.enabledReduceTime = false;
    },
    openAddFindingModal(scheduleItemCheckKanbanID, findings, actionType) {
      this.resetFormFinding();

      this.findingActionType = actionType;
      if (scheduleItemCheckKanbanID !== null) {
        this.selectedScheduleItemCheckKanbanID = scheduleItemCheckKanbanID;
      }

      this.addFindingModal = true;
    },
    cancelJudgmentConf() {
      this.$emit('emit-visible', false)
      this.$emit('emit-data', null)
    },
    judgmentSubmission() {
      this.$emit('emit-visible', false)
      if (this.selectedJudgContent.judgment === 'OK') {
        this.judgmentOK()
      } else if (this.selectedJudgContent.judgment === 'NG') {
        this.judgmentNG()
      }
      this.isLoading = false
    },
    async judgmentOK() {
      try {
        this.isLoading = true
        // 1. GET judgment master data
        await this.getJudgements()
        // 2. GET sub schedule data api/v1/operational/4s/sub-schedule/04c8072e-c9da-4353-8138-4e80cfab0784
        await this.getScheduleCheck()
        // 3. set actual pic & actual date
        this.headerForm = {
          actual_date: moment(this.selectedJudgContent.date).set('date', this.selectedJudgContent.dateIdx).format('YYYY-MM-DD'),
          actual_pic_id: this.selectedJudgContent.pic_id
        }
        // 4. PUT /v1/operational/4s/sub-schedule/edit/:subschedule_id (params from selectedJudgContent.sub_schedule_id)
        // {
        //   "actual_date": "2025-01-01" (selectedJudgContent.plan_time),
        //   "actual_pic_id": "5ffa52fe-68c1-4f99-8a14-7e6c1038b086" (selectedJudgContent.pic_id)
        // }
        await this.headerFormSubmit()
        // 6. find judgments based on selectedJudgContent.judgment
        // 7. looping item_check_kanbans and set to item_check_kanban_id
        // 8. POST /api/v1/operational/4s/schedule-item-check-kanban/add
        // {
        //   "judgment_id": "c4f5ff30-1b95-4ad8-8af8-e3e9d90bd942" (from master data),
        //   "main_schedule_id": "5fda3527-20a3-4fef-b7e7-f4681f5e986c" (selectedJudgContent.main_schedule_id),
        //   "item_check_kanban_id": "e3dbbab5-bb37-49b7-912d-6ef32f8e8ceb" (from looping data),
        //   "actual_time": "15" (selectedJudgContent.standart_time),
        //   "checked_date": "2025-01-01" (selectedJudgContent.plan_time) FORMAT: YYYY-MM-DD,
        //   "sub_schedule_id": "04c8072e-c9da-4353-8138-4e80cfab0784" (selectedJudgContent.sub_schedule_id),
        //   "standart_time": null (selectedJudgContent.standart_time),
        // }
        await this.itemCheckKanbanSubmit()
        this.$emit('emit-visible', false)
        this.$emit('emit-data', null)
        this.$emit('emit-refetch-schedule', true)
        this.isLoading = false
        Swal.fire('Success', 'Judgment OK', 'success')
        this.resetForm()
      } catch (error) {
        console.log(error)
        this.isLoading = false
        alert('Failed to check')
      }
    },
    async judgmentNG() {
      this.isLoading = true
      // 1. GET judgment master data
      await this.getJudgements()
      // 2. GET sub schedule data api/v1/operational/4s/sub-schedule/04c8072e-c9da-4353-8138-4e80cfab0784
      await this.getScheduleCheck()
      // 3. set actual pic & actual date
      this.headerForm = {
        actual_date: moment(this.selectedJudgContent.date).set('date', this.selectedJudgContent.dateIdx).format('YYYY-MM-DD'),
        actual_pic_id: this.selectedJudgContent.pic_id
      }
      // 4. set itemCheckKanbans set judgment default NG to table
      let mapJudgItemCheck = this.itemCheckKanbans.map(itemCheckKanban => {
        return {
          ...itemCheckKanban,
          judgment_id: null,
          main_schedule_id: this.selectedJudgContent?.main_schedule_id,
          item_check_kanban_id: itemCheckKanban.item_check_kanban_id,
          actual_time: null,
          checked_date: moment(this.selectedJudgContent?.date).set('date', this.selectedJudgContent?.dateIdx).format('YYYY-MM-DD'),
          sub_schedule_id: this.selectedJudgContent?.sub_schedule_id,
          standart_time: itemCheckKanban?.standart_time,
        }
      })
      this.itemCheckKanbans = mapJudgItemCheck

      await this.getOptChangeSystem()
      await this.getOptDeptSystem()
      await this.getFreq()
      await this.getZone()
      await this.getEvaluation()
      await this.getUsers()
      // 4. open modal finding
      this.visibleModalFindingJudg = true

    },
    async saveScheduleCheck(
      selectedJudgementID,
      actualTime,
      itemCheckKanbanID,
      standartTime = 0
    ) {
      console.log(standartTime)
      this.isAddCheckLoading = {
        isLoading: true,
        id: itemCheckKanbanID
      };
      await this.headerFormSubmit()
      ApiService.setHeader();
      const itemCheckKanban = this.itemCheckKanbans.find(item => item.item_check_kanban_id == itemCheckKanbanID)
      const data = {
        judgment_id: selectedJudgementID,
        main_schedule_id: this.selectedJudgContent?.main_schedule_id,
        item_check_kanban_id: itemCheckKanban.item_check_kanban_id,
        actual_time: actualTime,
        checked_date: moment(this.selectedJudgContent?.date).set('date', this.selectedJudgContent?.dateIdx).format('YYYY-MM-DD'),
        sub_schedule_id: this.selectedJudgContent?.sub_schedule_id,
        standart_time: itemCheckKanban?.standart_time,
      };
      const judgments = await ApiService.post(`operational/4s/schedule-item-check-kanban/add`, data);
      if (judgments.data.message == "Success to add 4s schedule item check kanban") {
        toast.success("Success add data", {
          autoClose: 700
        });

        this.isAddCheckLoading = {
          isLoading: false,
          id: itemCheckKanbanID
        };

        this.selectedScheduleItemCheckKanbanID = judgments.data.data.schedule_item_check_kanban_id;
        await this.getScheduleCheck();
      } else {
        alert("Failed add data");
      }
    },
    async submit(event) {
      const findingData = {
        "sub_schedule_id": this.selectedJudgContent?.sub_schedule_id,
        "schedule_item_check_kanban_id": this.selectedScheduleItemCheckKanbanID,
        // "line_id": this.selectedLineID.line_id,
        // "line_id": this.getSubSchedulesCheck?.line_id,
        // "freq_id": this.selectedFreqID,
        // "zone_id": this.selectedZoneID,
        // "kanban_id": this.selectedKanbanID,
        finding_pic_id: this.selectedPIC,
        actual_pic_id: this.actualPIC,
        "finding_date": this.findingDate,
        "finding_desc": this.findingDesc,
        "plan_cm_date": this.planCMDate,
        "plan_cm_desc": this.planCMDesc,
        "time_cm": +this.timeCM,
        "time_yokoten": this.timeYokoten,
        "opt_changes": this.optChanges,
        "opt_depts": this.optDepartment?.length > 0 ? this.optDepartment.join(";") : null,
        "cm_judg": this.cmJudg,
        "actual_cm_date": this.actualCMDate,
        "evaluation_nm": this.evaluationName
      };

      //       {
      //     "sub_schedule_id": "502a08c0-dcd4-408d-8a42-9cfc49dacb11",
      //     "schedule_item_check_kanban_id": "a6b2d2b5-3827-4f90-b692-5024bf1dc922",
      //     "finding_pic_id": "d4c969ce-fa7d-4a2d-a9e8-3b3766170655",
      //     "actual_pic_id": "d4c969ce-fa7d-4a2d-a9e8-3b3766170655",
      //     "finding_date": "2025-02-22",
      //     "finding_desc": "TEST",
      //     "plan_cm_date": "2025-02-22",
      //     "plan_cm_desc": "TES CM",
      //     "time_cm": 0,
      //     "time_yokoten": false,
      //     "opt_changes": "Perubahan Item Check",
      //     "opt_depts": "Kaizen",
      //     "cm_judg": false,
      //     "actual_cm_date": null,
      //     "evaluation_nm": "Order Part"
      // }

      // {
      //     "schedule_item_check_kanban_id": "2e651173-c08c-40e5-ba8c-2ade04c04722",
      //     "finding_date": "2025-02-22",
      //     "finding_desc": "TEST",
      //     "plan_cm_date": "2025-02-22",
      //     "plan_cm_desc": "TEST CM",
      //     "time_cm": 0,
      //     "time_yokoten": false,
      //     "opt_changes": "Perubahan Item Check",
      //     "opt_depts": "Maintenance",
      //     "cm_judg": false,
      //     "actual_cm_date": null,
      //     "evaluation_nm": "Order Part"
      // }

      const saveFn = async (callback) => {
        if (event.currentTarget.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          this.isLoadingSave = true;
          await callback();
          this.isLoadingSave = false;
        }

        this.isFromFindingValidate = true;
      };

      if (this.isEdit) {
        this.showErrorActualPic = !this.actualPIC || this.actualPIC.id == "-1";
        if (this.showErrorActualPic) {
          this.isFromFindingValidate = true;
          return;
        }

        await saveFn(() => this.updateFinding(findingData));
      } else {
        // non core-ui validating

        this.showErrorFindingPic = !this.selectedPIC || this.selectedPIC?.id == "-1";
        if (this.showErrorFindingPic) {
          this.isFromFindingValidate = true;
          return;
        }

        await saveFn(() => this.addFinding(findingData));
      }
    },
    async addFinding(findingData) {
      try {
        ApiService.setHeader();
        const add = await ApiService.post(`operational/4s/finding/add`, findingData);
        if (add.status === 200) {
          const { finding_id } = add.data.data;
          if (!finding_id) {
            throw "Finding id not provide can't add finding image";
          }

          if (this.$refs.finding_image) {
            try {
              const formData = new FormData();
              formData.append("finding_id", finding_id);
              formData.append("dest", "finding4s");
              formData.append("attachment", this.$refs.finding_image.files[0]);

              await ApiService.post(`/operational/4s/finding/upload-image`, formData);
            } catch (e) {
              console.log("error upload finding image", e);
            }
          }

          if (this.$refs.kaizen_file) {
            console.log("uploading finding kaizen");
            await this.uploadKaizen(finding_id);
          }

          toast.success("Success add data", {
            autoClose: 700
          });

          this.addFindingModal = false;
          this.getScheduleCheck();
        } else {
          throw "Failed to add finding";
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.status == 401) this.$router.push("/login");
        toast.error(error?.response?.data?.message ?? error, {
          autoClose: 10000
        });
      }
    },
    async getJudgements() {
      ApiService.setHeader();
      const judgments = await ApiService.get(`master/judgments`);
      this.judgments = judgments?.data?.data;
    },
    async getScheduleCheck() {
      ApiService.setHeader();
      const detailItemCheck = await ApiService.query(`operational/4s/sub-schedule/${this.selectedJudgContent?.sub_schedule_id}`);

      this.itemCheckKanbans = detailItemCheck?.data?.data?.item_check_kanbans
    },
    async getFreq() {
      try {
        this.$store.dispatch(GET_FREQS);
      } catch (error) {
        if (error.response.status == 401) this.$router.push("/login");
        console.log(error);
      }
    },
    async getOptChangeSystem() {
      let objQuery = {
        system_type: "4S_OPT_CHANGE"
      };
      try {
        this.$store.dispatch(GET_SYSTEMS, objQuery).then(res => {
          this.optChangeData = res;
        });
      } catch (error) {
        if (error.response.status == 401) this.$router.push("/login");
        console.log(error);
      }
    },
    async getUsers() {
      try {
        this.$store.dispatch(GET_USERS);
        if (this.getUsersOpts) {
          this.mapUsersData();
        }
      } catch (error) {
        if (error.response.status == 401) this.$router.push("/login");
        console.log(error);
      }
    },
    mapUsersData() {
      this.picData = [];
      this.getUsersOpts?.map((item) => {
        this.picData.push({ id: item.id, label: item.text });
      });
    },
    async getOptDeptSystem() {
      let objQuery = {
        system_type: "4S_OPT_DEPT"
      };
      try {
        this.$store.dispatch(GET_SYSTEMS, objQuery).then(res => {
          this.optDeptData = res;
        });
      } catch (error) {
        if (error.response.status == 401) this.$router.push("/login");
        console.log(error);
      }
    },
    async getEvaluation() {
      let objQuery = {
        system_type: "4S_EVALUATION"
      };
      try {
        this.$store.dispatch(GET_SYSTEMS, objQuery).then(res => {
          this.optEvaluation = res;
        });
      } catch (error) {
        if (error.response.status == 401) this.$router.push("/login");
        console.log(error);
      }
    },
    async getZone() {
      try {
        this.$store.dispatch(GET_ZONES);
      } catch (error) {
        if (error.response.status == 401) this.$router.push("/login");
        console.log(error);
      }
    },
    async headerFormSubmit() {
      try {
        ApiService.setHeader();
        await ApiService.put(`operational/4s/sub-schedule/edit/${this.selectedJudgContent?.sub_schedule_id}`, this.headerForm);
        return true
      } catch (error) {
        alert('Error when Submit Header Form')
        return false
      }
    },
    async itemCheckKanbanSubmit() {
      try {
        for (let i = 0; i < this.itemCheckKanbans.length; i++) {
          const itemCheckKanban = this.itemCheckKanbans[i];
          let objItemCheck = {
            judgment_id: this.judgments.find((judg) => judg.text == this.selectedJudgContent?.judgment)?.id,
            main_schedule_id: this.selectedJudgContent?.main_schedule_id,
            item_check_kanban_id: itemCheckKanban.item_check_kanban_id,
            actual_time: itemCheckKanban?.standart_time,
            checked_date: moment(this.selectedJudgContent?.date).set('date', this.selectedJudgContent?.dateIdx).format('YYYY-MM-DD'),
            sub_schedule_id: this.selectedJudgContent?.sub_schedule_id,
            standart_time: itemCheckKanban?.standart_time,
          }
          ApiService.setHeader();
          await ApiService.post(`operational/4s/schedule-item-check-kanban/add`, objItemCheck);
        }
        return true
      } catch (error) {
        alert('Error when item check kanban submit')
        return false
      }
    },
    async uploadKaizen(finding_id, kaizen_file = null) {
      if (!kaizen_file && !this.$refs.kaizen_file.files.length) {
        return;
      }

      try {
        const formData = new FormData();
        formData.append("finding_id", finding_id);
        formData.append("dest", "4s-finding-kaizen");
        formData.append("kaizen_file", kaizen_file ? kaizen_file : this.$refs.kaizen_file.files[0]);

        await ApiService.post(`/operational/4s/finding/upload-kaizen?dest=4s-finding-kaizen`, formData);
      } catch (e) {
        console.log("uploadKaizen", e);
      }
    },
  },
  components: {
    Treeselect
  }
}
</script>
