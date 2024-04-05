<template>
  <div>
    <div class="card mb-5">
      <div class="card-header">
        <div class="row d-flex align-items-center">
          <div class="col">
            <label>Select month</label>
            <input type="month" class="form-control" v-model="selectedMonth" @change="addFilter()" />
          </div>
          <div class="col">
            <label>Line</label>
            <select class="form-select" v-model="selectedLineID" @change="addFilter()">
              <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
                {{ line.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Shift / group</label>
            <select class="form-select" v-model="selectedGroupID" @change="addFilter()">
              <option v-for="group in getGroups" :key="group.id" :value="group.id">
                {{ group.group_nm }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Zona</label>
            <select class="form-select" v-model="selectedZoneID" @change="addFilter()">
              <option v-for="zone in getZones" :key="zone.zone_id" :value="zone.zone_id">
                {{ zone.zone_nm }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Kanban</label>
            <select class="form-select" v-model="selectedKanbanID" @change="addFilter()">
              <option v-for="kanban in getKanbans" :key="kanban.kanban_id" :value="kanban.kanban_id">
                {{ kanban.kanban_no }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Freq</label>
            <select class="form-select" v-model="selectedFreqID" @change="addFilter()">
              <option v-for="freq in getFreqs" :key="freq.id" :value="freq.id">
                {{ freq.freq_nm }}
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
      <div class="card-header">
        <div class="row">
          <div class="col">
            <div class="d-flex align-items-center">
              <div class="d-flex align-items-center">
                <div class="bullet" style="width: 20px; height: 20px"></div>
                <span class="mx-2">Planning</span>
              </div>
              <div class="d-flex align-items-center">
                <div class="bullet-filled" style="width: 20px; height: 20px"></div>
                <span class="mx-2">Sudah Cleaning</span>
              </div>
              <div class="d-flex align-items-center">
                <div class="bullet-cancel d-flex justify-content-center align-items-center"
                  style="width: 20px; height: 20px">
                  <CIcon icon="cil-x" class="text-danger" size="sm" />
                </div>
                <span class="mx-2">Sudah Cleaning, ada temuan abnormally</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body p-0 overflow-x-auto">
        <table class="table table-bordered" style="width: 100%" v-for="mainSchedule in mainScheduleData"
          :key="mainSchedule.id">
          <thead>
            <tr>
              <th colspan="40" class="text-center">
                4S Schedule Activities [Sub line {{ mainSchedule.group_nm }}]
              </th>
            </tr>
            <tr>
              <th rowspan="2">No</th>
              <th rowspan="2">Zona</th>
              <th rowspan="2">No Kanban</th>
              <th rowspan="2">Area</th>
              <th rowspan="2">Time</th>
              <th rowspan="2">PIC</th>
              <th rowspan="2">Freq</th>
              <th :colspan="getDateThisMonth" class="text-center">{{ getMonthStr }}</th>
              <th :colspan="getDateThisMonth" rowspan="2" class="text-center">Actions</th>
            </tr>
            <tr>
              <td v-for="n in getDateThisMonth" :key="n">{{ n }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="10" class="p-0" style="height: 200px">
                <div class="vl-parent p-0" style="height: 100%">
                  <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false" :on-cancel="onCancel" />
                </div>
              </td>
            </tr>
            <tr v-else v-for="(data, scheduleIndex) in subScheduleData" :key="scheduleIndex">
              <td>{{ scheduleIndex + 1 }}</td>
              <td style="min-width: 100px" v-if="data.zone_id != subScheduleData[scheduleIndex - 1]?.zone_id"
                :rowspan="data.row_span_zone">
                {{ data.zone_nm }}</td>
              <td style="min-width: 120px">{{ data.kanban_no }}</td>
              <td style="min-width: 200px">{{ data.area_nm }}</td>
              <td style="min-width: 200px">{{ data.standart_time }}</td>
              <td style="min-width: 100px" :rowspan="data.row_span_pic">
                {{ data.pic_nm }}
              </td>
              <td v-if="data.freq_id != subScheduleData[scheduleIndex - 1]?.freq_id" :rowspan="data.row_span_freq">
                {{ data.freq_nm }}</td>
              <td v-for="(children, childrenIndex) in data.children" :key="childrenIndex" :style="`${children.is_holiday ? 'background-color: #f9fafb' : ''
              }`">
                <div @click="addScheduleCheck(data.main_schedule_id, data.sub_schedule_id)"
                  v-if="!children.is_holiday && children.status == 'PLANNING'"
                  class="cursor-pointer status-wrapper d-flex align-items-center justify-content-center"
                  style="cursor: pointer;">
                  <div class="bullet"></div>
                </div>
              </td>
              <td>
                <div class="d-flex">
                  <button class="btn btn-info btn-sm mx-2 text-white" @click="openEditModal(data.main_schedule_id)">
                    Edit
                  </button>
                  <button class="btn btn-warning btn-sm text-white">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="subScheduleData">
              <td colspan="7" class="text-center">Sign TL 1</td>
              <td v-for="children in subScheduleData[0].children" :key="children" :style="`${children.is_holiday ? 'background-color: #f9fafb' : ''
              }`">
                <button @click="
              openSignModal(children.tl1_sign_checker_id, 'sign_tl_1')
              " v-if="!children.is_holiday && !children.sign_tl_1"
                  class="check-wrapper-null d-flex align-items-center justify-content-center">
                  <CIcon icon="cil-x" class="text-danger" size="sm" />
                </button>
                <button @click="
              openSignModal(children.tl1_sign_checker_id, 'sign_tl_1')
              " v-else-if="!children.is_holiday && children.sign_tl_1"
                  class="check-wrapper d-flex align-items-center justify-content-center">
                  <CIcon icon="cil-check" class="text-black" size="sm" />
                </button>
              </td>
            </tr>
            <tr v-if="subScheduleData">
              <td colspan="7" class="text-center">Sign TL 2</td>
              <td v-for="children in subScheduleData[0].children" :key="children" :style="`${children.is_holiday ? 'background-color: #f9fafb' : ''
              }`">
                <button @click="
              openSignModal(children.tl2_sign_checker_id, 'sign_tl_2')
              " v-if="!children.is_holiday && !children.sign_tl_2"
                  class="check-wrapper-null d-flex align-items-center justify-content-center">
                  <CIcon icon="cil-x" class="text-danger" size="sm" />
                </button>
                <button @click="
              openSignModal(children.tl2_sign_checker_id, 'sign_tl_2')
              " v-else-if="!children.is_holiday && children.sign_tl_2"
                  class="check-wrapper d-flex align-items-center justify-content-center">
                  <CIcon icon="cil-check" class="text-black" size="md" />
                </button>
              </td>
            </tr>
            <tr v-if="signGLData">
              <td colspan="7" class="text-center">Sign GL</td>
              <td v-for="children in signGLData" :key="children" :style="`${children.is_holiday ? 'background-color: #f9fafb' : ''
              }`" :colspan="children.col_span">
                <button @click="
              openSignModal(children.sign_checker_id, 'sign_gl')
              " v-if="!children.is_holiday && !children.sign"
                  class="check-wrapper-null d-flex align-items-center justify-content-center">
                  <CIcon icon="cil-x" class="text-danger" size="md" />
                </button>
                <button @click="
              openSignModal(children.sign_checker_id, 'sign_gl')
              " v-else-if="!children.is_holiday && children.sign"
                  class="check-wrapper d-flex align-items-center justify-content-center">
                  <CIcon icon="cil-check" class="text-black" size="md" />
                </button>
              </td>
            </tr>
            <tr v-if="signSHData">
              <td colspan="7" class="text-center">Sign SH</td>
              <td v-for="children in signSHData" :key="children" :style="`${children.is_holiday ? 'background-color: #f9fafb' : ''
              }`" :colspan="children.col_span">
                <button @click="
              openSignModal(children.sign_checker_id, 'sign_sh')
              " v-if="!children.is_holiday && !children.sign"
                  class="check-wrapper-null d-flex align-items-center justify-content-center">
                  <CIcon icon="cil-x" class="text-danger" size="md" />
                </button>
                <button @click="
              openSignModal(children.sign_checker_id, 'sign_sh')
              " v-else-if="!children.is_holiday && children.sign"
                  class="check-wrapper d-flex align-items-center justify-content-center">
                  <CIcon icon="cil-check" class="text-black" size="md" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- add sign modal -->
    <CModal backdrop="static" alignment="center" :visible="addSignModal" @close="addSignModal = false" size="lg">
      <CModalHeader>
        <CModalTitle>Add sign </CModalTitle>
      </CModalHeader>
      <CModalBody>

        <input type="image" v-if="selectedSign" :src="selectedSign" style="width: 100%; height: 100%" />

        <div style="height: 150px" v-if="selectedSignType == 'sign_tl_1'">
          <div style="width: 100%; height: 100px; border: 1px solid #eaeaea">
            <vueSignature ref="sign_tl_1" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-3 btn-sm text-white" :disabled="isUploadSignLoading"
              @click="saveSignature('sign_tl_1')">
              {{ isUploadSignLoading ? 'Saving..' : 'Save TL 1' }}
            </button>
            <button class="btn btn-info btn-sm mx-2 my-3 text-white" @click="clearSignature('sign_tl_1')">
              Clear
            </button>
          </div>
        </div>

        <div style="height: 150px" v-else-if="selectedSignType == 'sign_tl_2'">
          <div style="width: 100%; height: 100px; border: 1px solid #eaeaea">
            <vueSignature ref="sign_tl_2" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-3 btn-sm text-white" :disabled="isUploadSignLoading"
              @click="saveSignature('sign_tl_2')">
              {{ isUploadSignLoading ? 'Saving..' : 'Save TL 2' }}
            </button>
            <button class="btn btn-info btn-sm mx-2 my-3 text-white" @click="clearSignature('sign_tl_2')">
              Clear
            </button>
          </div>
        </div>

        <div style="height: 150px" v-else-if="selectedSignType == 'sign_gl'">
          <div style="width: 100%; height: 100px; border: 1px solid #eaeaea">
            <vueSignature ref="sign_gl" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-3 btn-sm text-white" :disabled="isUploadSignLoading"
              @click="saveSignature('sign_gl')">
              {{ isUploadSignLoading ? 'Saving..' : 'Save Sign GL' }}
            </button>
            <button class="btn btn-info btn-sm mx-2 my-3 text-white" @click="clearSignature('sign_gl')">
              Clear
            </button>
          </div>
        </div>

        <div style="height: 150px" v-else-if="selectedSignType == 'sign_sh'">
          <div style="width: 100%; height: 100px; border: 1px solid #eaeaea">
            <vueSignature ref="sign_sh" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-3 btn-sm text-white" :disabled="isUploadSignLoading"
              @click="saveSignature('sign_sh')">
              {{ isUploadSignLoading ? 'Saving..' : 'Save Sign SH' }}
            </button>
            <button class="btn btn-info btn-sm mx-2 my-3 text-white" @click="clearSignature('sign_sh')">
              Clear
            </button>
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" class="text-white" @click="closeSignModal()">
          Close
        </CButton>
      </CModalFooter>
    </CModal>

    <!-- edit modal -->
    <CModal backdrop="static" alignment="center" :visible="editDataModal" @close="editDataModal = false" size="lg">
      <CModalHeader>
        <CModalTitle>Edit data </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="mb-2">
          <label class="mb-1">PIC </label>
          <div class="row">
            <div class="col">
              <input type="text" class="form-control py-2" disabled />
            </div>
            <div class="col">
              <VueMultiselect v-model="selectedPIC" :options="picData" :custom-label="customPicOptions">
              </VueMultiselect>
            </div>
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" class="text-white" @click="editDataModal = false">
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import moment from 'moment'
import Loading from 'vue-loading-overlay'
import {
  GET_SCHEDULES,
  GET_SUB_SCHEDULES,
} from '@/store/modules/schedule4s.module'
import { GET_GROUP } from '@/store/modules/group.module'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_ZONES } from '@/store/modules/zones.module'
import { GET_KANBANS } from '@/store/modules/kanban.module'
import { GET_FREQS } from '@/store/modules/freq.module'
import { GET_USERS } from '@/store/modules/user.module'

import { mapGetters } from 'vuex'
import vueSignature from 'vue-signature'
import ApiService from '@/store/api.service'
import VueMultiselect from 'vue-multiselect'

export default {
  name: 'Main Schedule',
  components: { Loading, vueSignature, VueMultiselect },
  data() {
    return {
      totalDate: 31,
      isLoading: false,
      mainScheduleData: null,
      subScheduleData: null,
      signGLData: null,
      signSHData: null,
      selectedMonth: null,
      selectedLineID: null,
      selectedGroupID: null,
      selectedZoneID: null,
      selectedKanbanID: null,
      selectedFreqID: null,
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
      selectedPIC: null,
    }
  },
  computed: {
    ...mapGetters([
      'getLinesOpts',
      'getGroups',
      'getZones',
      'getKanbans',
      'getFreqs',
      'getUsersOpts',
    ]),
    getDateThisMonth() {
      const year = this.selectedMonth.split('-')[0]
      const month = +this.selectedMonth.split('-')[1] + 1
      return new Date(year, month + 1, 0).getDate();
    },
    getMonthStr() {
      const monthStr = ['January', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
      return monthStr[+this.selectedMonth.split('-')[1] - 1]
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
  },
  methods: {
    addScheduleCheck(mainScheduleID, subScheduleID) {
      this.$router.push(`/4s/schedule-check/${mainScheduleID}/${subScheduleID}`)
    },
    async getSchedules() {
      this.isLoading = true
      let objQuery = {
        month_year_num: this.selectedMonth,
        line_id: this.selectedLineID,
      }
      await this.$store.dispatch(GET_SCHEDULES, objQuery).then((res) => {
        if (res) {
          const data = res.list
          this.mainScheduleData = data
          this.isLoading = false
          console.log(data);
          data.map((item) => {
            this.getSubSchedules(item.main_schedule_id)
          })
        }
      })
    },
    async getSubSchedules(mainScheduleID) {
      this.isLoading = true
      let objQuery = {
        main_schedule_id: mainScheduleID,
        line_id: this.selectedLineID,
        kanban_id: this.selectedKanbanID,
        zone_id: this.selectedZoneID,
        freq_id: this.selectedFreqID,
        month_year_num: this.selectedMonth,
      }
      await this.$store.dispatch(GET_SUB_SCHEDULES, objQuery).then((res) => {
        if (res) {
          this.subScheduleData = res.schedule
          this.signGLData = res.sign_checker_gl
          this.signSHData = res.sign_checker_sh
          // console.log(this.subScheduleData[0])
          this.isLoading = false
        }
      })
    },

    async addFilter() {
      await this.getSchedules()
    },
    resetFilter() {
      ; (this.selectedLineID = null),
        (this.selectedFreqID = null),
        (this.selectedGroupID = null),
        (this.selectedZoneID = null),
        (this.selectedKanbanID = null),
        this.getSchedules()
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
        this.picData.push(item.text)
      })
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

    // sign methods
    openSignModal(signCheckerID, from) {
      this.selectedSignType = from
      this.addSignModal = true
      this.selectedSignCheckerID = signCheckerID
      this.getSignature()
    },
    async closeSignModal() {
      this.addSignModal = false
      this.selectedSignCheckerID = null
      this.selectedSignature = null
      this.selectedSignType = null
      this.selectedSign = null
      await this.getSchedules()
    },
    saveSignature(from) {
      var signFile

      switch (from) {
        case 'sign_tl_1':
          signFile = this.$refs[from].save()
          this.selectedSignature = signFile
          break
        default:
          break
      }
      switch (from) {
        case 'sign_tl_2':
          signFile = this.$refs[from].save()
          this.selectedSignature = signFile
          break
        default:
          break
      }
      switch (from) {
        case 'sign_gl':
          signFile = this.$refs[from].save()
          this.selectedSignature = signFile
          break
        default:
          break
      }
      switch (from) {
        case 'sign_sh':
          signFile = this.$refs[from].save()
          this.selectedSignature = signFile
          break
        default:
          break
      }

      this.uploadSignature()
    },
    clearSignature(from) {
      this.$refs[from].clear()
    },
    async uploadSignature() {
      this.isUploadSignLoading = true
      ApiService.setHeader()
      const upload = await ApiService.put(
        `/operational/4s/sub-schedule/sign/${this.selectedSignCheckerID}`,
        { sign: this.selectedSignature },
      )
      if (upload.data.message == 'success to sign 4s schedule') {
        this.isUploadSignLoading = false
        alert('Sign saved')
        this.closeSignModal()
      }
    },
    async getSignature() {
      this.isUploadSignLoading = true
      ApiService.setHeader()
      const getData = await ApiService.get(
        `/operational/4s/sub-schedule/sign/${this.selectedSignCheckerID}`
      )

      if (getData.data.message == 'Success to get 4s sign checker') {
        this.selectedSign = getData.data.data.sign
        this.isUploadSignLoading = false
      }
    },

    // edit data
    openEditModal(mainScheduleID) {
      this.editDataModal = true
      this.selectedMainScheduleID = mainScheduleID
      this.mapUsersData()
    },
  },

  async mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    await this.getLines()
    if (localStorage.getItem('line_id')) {
      this.selectedLineID = localStorage.getItem('line_id')
    }
    await this.getSchedules()
    await this.getGroup()
    await this.getZone()
    await this.getKanban()
    await this.getFreq()
    await this.getUsers()
  },
}
</script>

<style>
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
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
