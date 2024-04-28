<template>
  <CModal backdrop="static" size="xl" :visible="visible" @close="closeModal()"
    aria-labelledby="StaticBackdropExampleLabel">
    <CModalHeader>
      <CModalTitle id="StaticBackdropExampleLabel">{{ title }}</CModalTitle>
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
              <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" v-model="enabledReduceTime" class="me-2"
                style="height: 20px; width: 20px;">
              <input type="text" class="form-control" v-model="timeCM" :disabled="!enabledReduceTime"
                @keypress="$event.key.match(/^[\d]$/) ? '' : $event.preventDefault()" />
            </div>
          </div>
          <div class="mb-2">
            <label class="mb-1">Actual PIC</label>
            <VueMultiselect v-model="actualPIC" :options="picData" :custom-label="customPicOptions"
              class="vue-multi-select">
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
            <input type="date" class="form-control" v-model="actualCMDate" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="mb-2">
            <label class="mb-1">Plan Countermeasure Desc</label>
            <input type="text" class="form-control" v-model="planCMDesc" placeholder="Write Plan Countermeasure Desc" />
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
            <select v-model="cmJudg" class="form-select">
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
            <select class="form-select" v-model="evaluationName">
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
</template>
<script>
import { toast } from 'vue3-toastify'
import ApiService from '@/store/api.service'
import VueMultiselect from 'vue-multiselect'

export default {
  name: "ModalForm4sFinding",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loadedFinding: {
      type: Object,
    }
  },
  components: {
    VueMultiselect
  },
  data() {
    return {
      isLoadingSave: false,
    }
  },
  methods: {
    closeModal(refresh) {
      if (!this.isLoadingSave)
      {
        this.$emit('modalForm4sFindingListener', {
          visible: false,
          refresh: refresh
        })
      }
    },
    async addFinding() {
      ApiService.setHeader()
      const findingData = {
        "schedule_item_check_kanban_id": this.selectedScheduleItemCheckKanbanID,
        // "line_id": this.selectedLineID.line_id,
        "line_id": this.getSubSchedulesCheck?.line_id,
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

      console.log(findingData)

      const add = await ApiService.post(`operational/4s/finding/add`, findingData)
      if (add.data.message == 'Success to add 4s finding')
      {
        toast.success('Success add data', {
          autoClose: 700
        })
        this.addFindingModal = false
        await this.getScheduleCheck()
      } else
      {
        toast.error('Failed', {
          autoClose: 700
        })
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
      if (update.data.message == 'Success to edit 4s finding')
      {
        toast.success('Success edit data', {
          autoClose: 700
        })
        this.addFindingModal = false
        await this.getScheduleCheck()
      } else
      {
        toast.error('Failed', {
          autoClose: 700
        })
      }
    },
  },
  computed: {
    title() {
      return this.loadedFinding?.finding_id ? "Edit 4S Finding" : "Add 4S Finding"
    }
  },
  watch: {

  },
  mounted() {

  }
}
</script>
