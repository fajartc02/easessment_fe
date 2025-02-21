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
</template>
<script>
import ApiService from '@/store/api.service';
import moment from 'moment';
import Swal from 'sweetalert2';

export default {
  name: 'JudgmentConfirmation',
  data() {
    return {
      visibleModalConfJudg: false,
      selectedJudgContent: null,
      judgments: null,
      headerForm: {
        actual_date: null,
        actual_pic_id: null
      },
      itemCheckKanbans: null,
      isLoading: false
    }
  },
  watch: {
    visible(val) {
      this.visibleModalConfJudg = val
    },
    data(val) {
      this.selectedJudgContent = val
    }
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
    cancelJudgmentConf() {
      this.$emit('emit-visible', false)
      this.$emit('emit-data', null)
    },
    judgmentSubmission() {
      console.log('MASUK', this.selectedJudgContent)
      if (this.selectedJudgContent.judgment === 'OK') {
        this.judgmentOK()
      } else if (this.selectedJudgContent.judgment === 'NG') {
        this.judgmentNG()
      }
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
      } catch (error) {
        console.log(error)
        this.isLoading = false
        alert('Failed to check')
      }
    },
    judgmentNG() {

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
        console.log(this.itemCheckKanbans)
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
    }
  }
}
</script>
