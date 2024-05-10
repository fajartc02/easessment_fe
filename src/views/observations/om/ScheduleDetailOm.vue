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
              <button class="btn btn-info btn-sm text-white" @click="updateSchedule()">
                {{ isUpdateActualPic ? 'updating..' : 'update' }}
              </button>
            </CInputGroupText>
          </CInputGroup>
        </div>
      </div>
    </div>
    <div class="mt-3">
      <h4>Item Check</h4>
      <table class="table table-bordered">
        <thead>
          <tr class="text-center">
            <th>No</th>
            <th>Item Check</th>
            <th>Judgement</th>
            <th>Standard Time</th>
            <th>Actual Time</th>
            <th>Actions</th>
            <th>Finding</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center">1</td>
            <td> {{ getOmSubSchedulesDetail?.item_check_nm }} </td>
            <td>
              <CFormSelect v-model="judgment_id">
                <option>Select Judgment</option>
                <option v-for="judg in getJudgments" :key="judg.id" :value="judg.id">
                  {{ judg.text }}
                </option>
              </CFormSelect>
            </td>
            <td class="text-center">
              {{ getOmSubSchedulesDetail?.standart_time }}
            </td>
            <td>
              <CFormInput v-model="actualDuration"
                @keypress="$event.key.match(/^[\d]$/) ? '' : $event.preventDefault()" />
            </td>
            <td class="text-center">
              <button v-if="actualDuration && judgment_id" class="btn btn-success btn-sm text-white"
                @click="updateSchedule()">
                {{ isAddCheckLoading ?
                  'Saving...' : 'Save' }}
              </button>
              <button v-else class="btn btn-info btn-sm text-white" disabled>
                Isi Dahulu
              </button>
            </td>
            <td class="text-center">
              <template v-if="isCanAddFinding">
                <button
                  v-if="getOmSubSchedulesDetail?.finding?.finding_desc == null || getOmSubSchedulesDetail?.finding?.finding_desc == undefined"
                  class=" btn btn-info btn-sm text-white" @click="openFindingModal()">
                  {{ getOmSubSchedulesDetail?.finding ? 'Update finding' : 'Add finding' }}
                </button>
                <span v-else>{{ getOmSubSchedulesDetail.finding.finding_desc }}</span>
              </template>
              <template v-else>
                <span class="text-muted">No Action</span>
              </template>
            </td>
            <td>
              <img v-if="getOmSubSchedulesDetail?.finding?.finding_img"
                :src="getOmSubSchedulesDetail?.finding?.finding_img" alt="image finding" width="200" height="100"
                @click="isVisibleFindingImage = true">
              <span v-else class="text-muted">No image</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="isUpdateActualDate || isUpdateActualPic || isLoadingGetDetail"
      class="position-absolute top-0 bottom-0 left-0 right-0 w-100 h-100"
      style="background-color: rgba(255,255,255,0.7);">
      <div class="d-flex justify-content-center align-items-center h-100">
        <CSpinner aria-hidden="true" />
      </div>
    </div>
    <ModalFormOmFinding :visible="isVisibleFindingModal" :loadedFinding="loadedFinding"
      @modalFormOmFindingListener="onModalFormOmFindingListener($event)" />
    <ModalImage :visible="isVisibleFindingImage" :img="getOmSubSchedulesDetail?.finding?.finding_img"
      @close="isVisibleFindingImage = false" />
  </div>
</template>
<script>
import ApiService from '@/store/api.service'
import { mapGetters } from 'vuex'
import { toast } from 'vue3-toastify'
import { GET_OM_SUB_SCHEDULES_DETAIL } from '@/store/modules/omSchedule.module'
import { GET_USERS } from '@/store/modules/user.module'
import { GET_JUDGMENT } from '@/store/modules/judgment.module'
import ModalFormOmFinding from '@/components/om/ModalFormOmFinding.vue'
import ModalImage from '@/components/ModalImage.vue'
import moment from 'moment'

export default {
  name: "ScheduleDetailOm",
  components: {
    ModalFormOmFinding,
    ModalImage
  },
  data() {
    return {
      isLoadingGetDetail: false,
      isUpdateActualDate: false,
      isUpdateActualPic: false,
      actualDate: null,
      actualPic: null,
      actualDuration: null,
      judgment_id: null,
      isVisibleFindingModal: false,
      isCanAddFinding: false,
      isVisibleFindingImage: false,
    }
  },
  methods: {
    async getSubScheduleDetail() {
      try {
        this.isLoadingGetDetail = true
        await this.$store.dispatch(GET_OM_SUB_SCHEDULES_DETAIL, this.$route.params.subScheduleID)
        this.isLoadingGetDetail = false
      }
      catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
        toast.error(error.response.data.message, {
          autoClose: 1000,
        })
      }
    },
    async getUsers() {
      try {
        await this.$store.dispatch(GET_USERS)
      } catch (error) {
        console.log(error)
        if (error?.response?.status == 401) this.$router.push('/login')
      }
    },
    async updateSchedule(isActualDate) {
      try {
        if (isActualDate) {
          this.isUpdateActualDate = true
        }
        else {
          this.isUpdateActualPic = true
        }

        const data = {
          actual_date: this.actualDate,
          actual_pic_id: this.actualPic,
          actual_duration: this.actualDuration,
          judgment_id: this.judgment_id
        };

        ApiService.setHeader()
        await ApiService.put(
          `/operational/om/sub-schedule/edit/${this.$route.params.subScheduleID}`,
          data,
        )

        if (isActualDate) {
          this.actualDate = null
          this.isUpdateActualDate = false
        }
        else {
          this.actualPic = null
          this.isUpdateActualPic = false
        }

        toast.success(`Success to edit Actual ${isActualDate ? 'Date' : 'PIC'}`, {
          autoClose: 5000,
        })

        this.getSubScheduleDetail()
      }
      catch (error) {
        console.log('error updateSchedule()', error)
        if (error.response.status == 401) this.$router.push('/login')
        toast.error(error.response.data.message, {
          autoClose: 1000,
        })
      }
    },
    async getJudgment() {
      try {
        this.$store.dispatch(GET_JUDGMENT)
      } catch (error) {
        console.log(error)
        if (error?.response?.status == 401) this.$router.push('/login')
        toast.error(error.response.data.message, {
          autoClose: 10000,
        })
      }
    },
    openFindingModal() {
      this.isVisibleFindingModal = true
    },
    onModalFormOmFindingListener(event) {
      this.isVisibleFindingModal = false
      if (event.refresh) {
        this.getSubScheduleDetail()
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
      'getOmSubSchedulesDetail',
      'getJudgments'
    ]),
    loadedFinding() {
      // should set actual_pic_id = null cause duplicate object
      const result = this.getOmSubSchedulesDetail?.finding ?? {
        ...this.getOmSubSchedulesDetail,
        actual_pic_id: null
      }

      return result
    }
  },
  watch: {
    getOmSubSchedulesDetail: {
      handler() {
        console.log('HERE');
        console.log(this.getOmSubSchedulesDetail);
        // actualPic
        this.actualDate = this.getOmSubSchedulesDetail.actual_date ? moment(this.getOmSubSchedulesDetail.actual_date).format('YYYY-MM-DD') : moment(this.getOmSubSchedulesDetail.plan_time).format('YYYY-MM-DD')
        this.actualPic = this.getOmSubSchedulesDetail.actual_pic_id ? this.getOmSubSchedulesDetail.actual_pic_id : this.getOmSubSchedulesDetail.pic_id
        this.isCanAddFinding = this.getOmSubSchedulesDetail.is_abnormal
        this.judgment_id = this.getOmSubSchedulesDetail.judgment_id
        this.actualDuration = this.getOmSubSchedulesDetail.actual_duration
      }
    },
  },
  async mounted() {
    this.getSubScheduleDetail()
    this.getUsers()
    this.getJudgment()
  }
}
</script>
<style>
.input-group-text {
  font-weight: bold;
}
</style>
