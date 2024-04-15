<template>
  <div class="position-relative">
    <div class="card">
      <div class="row px-3 pt-4">
        <div class="col-md-6">
          <CInputGroup class="mb-3">
            <CInputGroupText>Line</CInputGroupText>
            <CFormInput :value="getOmSubSchedulesDetail?.line_nm" disabled />
          </CInputGroup>
          <CInputGroup class="mb-3">
            <CInputGroupText>Periodic</CInputGroupText>
            <CFormInput :value="getOmSubSchedulesDetail?.freq_nm" disabled />
          </CInputGroup>
        </div>
        <div class="col-md-6">
          <CInputGroup class="mb-3">
            <CInputGroupText>Group</CInputGroupText>
            <CFormInput :value="getOmSubSchedulesDetail?.group_nm" disabled />
          </CInputGroup>
          <CInputGroup class="mb-3">
            <CInputGroupText>Machine</CInputGroupText>
            <CFormInput :value="getOmSubSchedulesDetail?.machine_nm" disabled />
          </CInputGroup>
        </div>
      </div>
      <div class="row px-3">
        <div class="col-md-12">
          <CInputGroup class="mb-3">
            <CInputGroupText>Location</CInputGroupText>
            <CFormInput :value="getOmSubSchedulesDetail?.location_nm" disabled />
          </CInputGroup>
        </div>
      </div>
      <div class="row px-3">
        <div class="col-md-6">
          <CInputGroup class="mb-3">
            <CInputGroupText>Methode</CInputGroupText>
            <CFormInput :value="getOmSubSchedulesDetail?.method_nm" disabled />
          </CInputGroup>
          <CInputGroup class="mb-3">
            <CInputGroupText>Plan Date</CInputGroupText>
            <CFormInput :value="getOmSubSchedulesDetail?.date" disabled />
          </CInputGroup>
        </div>
        <div class="col-md-6">
          <CInputGroup class="mb-3">
            <CInputGroupText>Standart</CInputGroupText>
            <CFormInput :value="getOmSubSchedulesDetail?.standart_nm" disabled />
          </CInputGroup>
          <CInputGroup class="mb-3">
            <CInputGroupText>Plan PIC</CInputGroupText>
            <CFormInput :value="getOmSubSchedulesDetail?.pic_nm" disabled />
          </CInputGroup>
        </div>
      </div>
      <div class="row px-3">
        <div class="col-md-12">
          <CInputGroup class="mb-3">
            <CInputGroupText>Actual Date</CInputGroupText>
            <CFormInput v-if="getOmSubSchedulesDetail?.actual_time"
              :value="getOmSubSchedulesDetail?.actual_time.substring(0, 10)" disabled />
            <input type="date" class="form-control" v-model="actualDate">
            <CInputGroupText>
              <button class="btn btn-info btn-sm text-white" @click="updateSchedule(true)">
                {{ isUpdateActualDate ? 'updating..' : 'update' }}
              </button>
            </CInputGroupText>
          </CInputGroup>
        </div>
        <div class="col-md-12">
          <CInputGroup class="mb-3">
            <CInputGroupText>Actual PIC</CInputGroupText>
            <CFormInput :value="getOmSubSchedulesDetail?.actual_pic_nm" disabled />
            <Select2 class="form-control" placeholder="Select Actual PIC" :options="getUsersOpts" v-model="actualPic" />
            <CInputGroupText>
              <button class="btn btn-info btn-sm text-white" @click="updateSchedule()">{{
                isUpdateActualPic ? 'updating..' : 'update' }}</button>
            </CInputGroupText>
          </CInputGroup>
        </div>
      </div>
    </div>
    <div v-if="isUpdateActualDate || isUpdateActualPic || isLoadingGetDetail"
      class="position-absolute top-0 bottom-0 left-0 right-0 w-100 h-100"
      style="background-color: rgba(255,255,255,0.7);">
      <CSpinner aria-hidden="true" class="me-2" />
    </div>
  </div>
</template>
<script>
import ApiService from '@/store/api.service'
import { mapGetters } from 'vuex'
import { toast } from 'vue3-toastify'
import { GET_OM_SUB_SCHEDULES_DETAIL } from '@/store/modules/omSchedule.module'
import { GET_USERS } from '@/store/modules/user.module'

export default {
  name: "ScheduleDetailOm",
  components: {

  },
  data() {
    return {
      isLoadingGetDetail: false,
      isUpdateActualDate: false,
      isUpdateActualPic: false,
      actualDate: null,
      actualPic: null,
    }
  },
  methods: {
    async getSubScheduleDetail() {
      try
      {
        this.isLoadingGetDetail = true
        await this.$store.dispatch(GET_OM_SUB_SCHEDULES_DETAIL, this.$route.params.subScheduleID)
        this.isLoadingGetDetail = false
      }
      catch (error)
      {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
        toast.error(error.response.data.message, {
          autoClose: 1000,
        })
      }
    },
    async getUsers() {
      try
      {
        await this.$store.dispatch(GET_USERS)
      } catch (error)
      {
        console.log(error)
        if (error?.response?.status == 401) this.$router.push('/login')
      }
    },
    async updateSchedule(isActualDate) {
      try
      {
        if (isActualDate)
        {
          this.isUpdateActualDate = true
        }
        else
        {
          this.isUpdateActualPic = true
        }

        const data = {
          actual_date: this.actualDate,
          actual_pic_id: this.actualPic
        };

        ApiService.setHeader()
        await ApiService.put(
          `/operational/om/sub-schedule/edit/${this.$route.params.subScheduleID}`,
          data,
        )

        if (isActualDate)
        {
          this.isUpdateActualDate = false
        }
        else
        {
          this.isUpdateActualPic = false
        }

        toast.success(`Success to edit Actual ${isActualDate ? 'Date' : 'PIC'}`, {
          autoClose: 5000,
        })

        this.getSubScheduleDetail()
      }
      catch (error)
      {
        console.log('error updateSchedule()', error)
        if (error.response.status == 401) this.$router.push('/login')
        toast.error(error.response.data.message, {
          autoClose: 1000,
        })
      }
    },
    customPicOptions({ text }) {
      return `${text}`
    },
  },
  computed: {
    ...mapGetters([
      'getUsersOpts',
      'getLinesOpts',
      'getGroups',
      'getMachinesOpts',
      'getFreqsOpts',
      'getOmSubSchedulesDetail'
    ]),
  },
  watch: {
    getOmSubSchedulesDetail: {
      handler() {

      }
    },
  },
  async mounted() {
    this.getSubScheduleDetail()
    this.getUsers()
  }
}
</script>
