<template>
  <CModal backdrop="static" alignment="center" :visible="visible" @close="closeModal()" size="lg">
    <CModalHeader>
      <CModalTitle>Change Date</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="mb-2">
        <label class="mb-1">Date </label>
        <div class="row">
          <div class="col">
            <input type="text" class="form-control py-2" :value="selectedBeforeDate" disabled />
          </div>
          <div class="col">
            <input type="date" class="form-control" v-model="updateDate">
          </div>
        </div>
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" class="text-white" @click="closeModal()">
        Close
      </CButton>
      <CButton color="info" class="text-white" @click="changeDate()">
        {{ isLoading ? 'Saving..' : 'Save' }}
      </CButton>
    </CModalFooter>
  </CModal>
</template>
<script>
import ApiService from '@/store/api.service'
import { mapGetters } from 'vuex'
import { toast } from 'vue3-toastify'

export default {
  name: 'ModalOmEditDateSchedule',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      selectedSubScheduleId: null,
      selectedBeforeDate: null,
      updateDate: null,
    }
  },
  async mounted() { },
  watch: {
    getOmSelectedChildren: {
      handler() {
        this.selectedSubScheduleId = this.getOmSelectedChildren.om_sub_schedule_id
        this.selectedBeforeDate = this.getOmSelectedChildren.date
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'getOmSelectedChildren',
    ]),
  },
  methods: {
    async changeDate() {
      this.isLoading = true
      try
      {
        ApiService.setHeader()
        const data = {
          plan_date: this.updateDate,
          before_plan_date: this.selectedBeforeDate
        };

        await ApiService.put(
          `/operational/om/sub-schedule/edit/${this.selectedSubScheduleId}`,
          data,
        )

        toast.success('Success to edit om schedule plan', {
          autoClose: 1000,
        })

        this.isLoading = false
        this.closeModal(true)
      }
      catch (error)
      {
        this.isLoading = false
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
        toast.error(error.response.data.message, {
          autoClose: 1000,
        })
      }
    },
    closeModal(refresh = false) {
      this.updateDate = null
      if (!this.isLoading){
        this.$emit('modalEditDateListener', {
          visible: false,
          refresh: refresh
        })
      }
    }
  },
}
</script>
