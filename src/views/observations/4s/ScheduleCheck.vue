<template>
  <div class="position-relative">
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
              <input type="date" class="form-control" v-model="detailActualDate" />
              <CInputGroupText>
                <button class="btn btn-info btn-sm text-white" @click="updateScheduleCheckData()">
                  {{ isUpdateCheckLoading ? 'updating..' : 'update' }}
                </button>
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
                <button class="btn btn-info btn-sm text-white" @click="updateScheduleCheckData()">
                  {{ isUpdateCheckLoading ? 'updating..' : 'update' }}
                </button>
              </CInputGroupText>
            </CInputGroup>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <button class="btn btn-primary" @click="modalKanbanDetail = true">
          Lihat Kanban
        </button>
        <CModal backdrop="static" size="xl" :visible="modalKanbanDetail" @close="
          () => {
            modalKanbanDetail = false
          }
        " aria-labelledby="StaticBackdropExampleLabel">
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
          <tr class="tr-centered">
            <th>No</th>
            <th style="min-width: 200px">Item Check</th>
            <th>Method</th>
            <th style="min-width: 200px">Control Point</th>
            <th>Judgement</th>
            <th>History Standard Time</th>
            <th>Standard Time</th>
            <th>Actual Time</th>
            <th>Actions</th>
            <th>Finding</th>
            <th>Image</th>
            <th>Kaizen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in itemCheks" :key="item" class="align-middle">
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
              <CFormInput v-if="
                item.judgment_id !== 'c4f5ff30-1b95-4ad8-8af8-e3e9d90bd942'
              " v-model="item.standart_time" type="number" />
              <span v-else>
                {{ item.standart_time }}
              </span>
            </td>
            <td>
              <CFormInput v-model="item.actual_time" type="number" />
            </td>

            <td v-if="item.actual_time" class="text-center">
              <button class="btn btn-success btn-sm text-white" @click="
                saveScheduleCheck(
                  item.judgment_id,
                  item.actual_time,
                  item.item_check_kanban_id,
                  item.judgment_id !== 'c4f5ff30-1b95-4ad8-8af8-e3e9d90bd942'
                    ? item.standart_time
                    : null,
                )
                ">
                {{
                  isAddCheckLoading?.isLoading &&
                    isAddCheckLoading?.id == item.item_check_kanban_id
                    ? 'Saving...'
                    : 'Save'
                }}
              </button>
            </td>
            <td v-else>
              <button class="btn btn-info btn-sm text-white" disabled>
                Isi Dahulu
              </button>
            </td>
            <td v-if="item.is_abnormal" class="text-center">
              <button class="btn btn-info btn-sm text-white" @click="
                item.findings.length
                  ? openEditFindingModal(
                    item.schedule_item_check_kanban_id,
                    item.findings,
                    'update',
                  )
                  : openAddFindingModal(
                    item.schedule_item_check_kanban_id,
                    null,
                    'add',
                  )
                ">
                {{
                  item.findings.length > 0 ? 'Update Finding' : 'Add Finding'
                }}
              </button>
              <!--            <button v-if="item.findings.length == 0" class=" btn btn-info btn-sm text-white"
                              @click="item.findings.length == 0 ? openEditFindingModal(item.schedule_item_check_kanban_id, item.findings, 'update') : openAddFindingModal(item.schedule_item_check_kanban_id, null, 'add')">
                        {{ item.findings.length > 0 ? "Update Finding" : "Add Finding" }}
                      </button>
                      <template v-else>
                          <span>
                            {{ item.findings[0]?.finding_desc }}
                          </span>
                      </template>-->
            </td>
            <td v-else class="text-center">
              <span class="text-muted">No Action</span>
            </td>
            <td>
              <CModal size="xl" :visible="isVisibleFindingImg" @close="isVisibleFindingImg = false"
                @closed="isVisibleFindingImg = false">
                <CModalBody>
                  <img class="w-100" :src="item.findings[0]?.finding_img" alt="image finding" />
                </CModalBody>
              </CModal>
              <img v-if="item.findings[0]?.finding_img" :src="item.findings[0]?.finding_img" alt="image finding"
                width="200" height="100" @click="isVisibleFindingImg = true" />
              <span v-else class="text-muted">No image</span>
            </td>
            <td class="text-center">
              <template v-if="item.findings[0]">
                <div class="d-flex gap-2">
                  <input :id="item.findings[0].finding_id" type="file" hidden @change="
                    onChangeDirectKaizenFile(
                      $event,
                      item.findings[0].finding_id,
                    )
                    " />
                  <button class="btn btn-info btn-sm text-white" @click="
                    item.findings[0]?.kaizen_file
                      ? onClickDownloadKaizen(item.findings[0]?.kaizen_file)
                      : null
                    " :disabled="!item.findings[0]?.kaizen_file">
                    Download
                  </button>
                  <button class="btn btn-info btn-sm text-white" @click="
                    onClickDirectUploadKaizen(item.findings[0]?.finding_id)
                    ">
                    Upload
                  </button>
                </div>
              </template>
              <span v-else>No Action</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="comment-sh-container">
      <h5>Comments</h5>
      <div class="chat-box">
        <div v-for="(message, index) in chatMessages" :key="index" :class="[
          'chat-message',
          message.noreg === noreg ? 'chat-right' : 'chat-left',
        ]">
          <div class="message-bubble">
            <strong>
              {{ `${message.name} (${message.noreg || 'Unknown Noreg'})` }}
            </strong>
            <p>{{ message.comments }}</p>
            <!--            <span class="timestamp">{{ message.created_at }}</span>-->
          </div>
        </div>
      </div>
      <div class="chat-input mt-2">
        <input type="text" v-model="messageInput" class="form-control" placeholder="Type a message..." />
        <button class="btn btn-primary" @click="sendMessage">Send</button>
      </div>
    </div>

    <!-- modals -->
    <CModal backdrop="static" size="xl" :visible="addFindingModal" @close="
      () => {
        addFindingModal = false
      }
    " aria-labelledby="StaticBackdropExampleLabel">
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">{{ isEdit ? 'Edit' : 'Add' }} Finding</CModalTitle>
      </CModalHeader>
      <CForm @submit="submit" novalidate :validated="isFromFindingValidate">
        <CModalBody>
          <div class="row">
            <div class="col-md-6">
              <div class="mb-2">
                <label class="mb-1">Line</label>
                <input type="text" :value="getSubSchedulesCheck?.line_nm" class="form-control" disabled />
              </div>
              <div class="mb-2">
                <label class="mb-1">Zone</label>
                <select class="form-select" v-model="getSubSchedulesCheck.zone_id" disabled>
                  <option v-for="zone in getZones" :key="zone.zone_id" :value="zone.zone_id">
                    {{ zone.zone_nm }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-2">
                <label class="mb-1">Freq</label>
                <select class="form-select" v-model="getSubSchedulesCheck.freq_id" disabled>
                  <option v-for="freq in getFreqs" :key="freq.id" :value="freq.id">
                    {{ freq.freq_nm }}
                  </option>
                </select>
              </div>
              <div class="mb-2">
                <label class="mb-1">Kanban</label>
                <input type="text" :value="getSubSchedulesCheck?.kanban_no" class="form-control" disabled />
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
              <div class="mb-2" :class="{ invalid: showErrorFindingPic }">
                <label class="mb-1" style="margin-top: 1.5em">
                  Finding PIC
                </label>
                <VueMultiselect v-model="selectedPIC" :options="picData" :custom-label="customPicOptions"
                  class="vue-multi-select" @close="closeSelectFindingPic">
                </VueMultiselect>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-2">
                <label class="mb-1">Reduce Time Countermeasure (Menit)</label>
                <div class="d-flex align-items-center">
                  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" v-model="enabledReduceTime"
                    class="me-2" style="height: 20px; width: 20px" />
                  <input type="text" class="form-control" v-model="timeCM" :disabled="!enabledReduceTime" @keypress="
                    $event.key.match(/^[\d]$/) ? '' : $event.preventDefault()
                    " />
                </div>
                <small v-if="!enabledReduceTime" class="text-info">* Ceklis & isi waktu pengurangan jika ada</small>
                <small v-else class="text-success">* Abaikan jika tidak ingin di ubah</small>
              </div>
              <div class="mb-2" :class="{ invalid: showErrorActualPic }">
                <label class="mb-1">PIC Countermeasure</label>
                <VueMultiselect v-model="actualPIC" :options="picData" :custom-label="customPicOptions"
                  class="vue-multi-select" @close="closeSelectActualPic">
                </VueMultiselect>
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
            <div class="col-12 col-md-12">
              <div class="mb-2">
                <div class="card p-2">
                  <label>Apakah ada perubahan SOP?</label>
                  <CFormSwitch v-model="is_change_sop" />
                </div>
              </div>
            </div>
            <div class="col-12 col-md-12">
              <div class="mb-2">
                <div class="card p-2">
                  <label>PIC Penanggung Jawab <small>*TL UP</small></label>
                  <treeselect v-model="pic_supervisor_id" :options="getUsersTreeselect2" />
                </div>
              </div>
            </div>
            <div class="col-12 col-md-12">
              <div class="mb-2">
                <div class="card p-2">
                  <label>Apakah ada Improvement?</label>
                  <CFormSwitch v-model="is_need_improvement" />
                </div>
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
                  <th>
                    <img src="@/../public/tanoko/0.png" width="50" height="50" />
                  </th>
                  <th>Order Part</th>
                  <th>
                    <img src="@/../public/tanoko/1.png" width="50" height="50" />
                  </th>
                  <th>Countermeasure</th>
                  <th>
                    <img src="@/../public/tanoko/2.png" width="50" height="50" />
                  </th>
                  <th>Monitor / Follow</th>
                  <th>
                    <img src="@/../public/tanoko/3.png" width="50" height="50" />
                  </th>
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
          <CButton color="secondary" @click="
            () => {
              addFindingModal = false
            }
          ">
            Close
          </CButton>
          <CButton color="primary" type="submit">
            {{ isEdit ? 'Update' : 'Add' }} Finding Data
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
    <!-- <ModalForm4sFinding :visiblee="modalFormFinding" :loadedFinding="" /> -->
    <CustomFullLoading :show="isLoading" />
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
// import Loading from 'vue-loading-overlay'
import { toast } from 'vue3-toastify'
import KanbanItemCheck from '@/components/kanban4s/KanbanItemCheck.vue'
// import ModalForm4sFinding from '@/components/4s/ModalForm4sFinding.vue'
import CustomFullLoading from '@/components/CustomFullLoading.vue'

import 'vue3-treeselect/dist/vue3-treeselect.css'
import Treeselect from 'vue3-treeselect'

export default {
  name: 'Schedule Check',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    VueMultiselect,
    // Loading,
    KanbanItemCheck,
    // ModalForm4sFinding,
    Treeselect,
    CustomFullLoading,
  },
  data() {
    return {
      chatMessages: [],
      messageInput: '',
      noreg: localStorage.getItem('noreg'),
      isVisibleFindingImg: false,
      modalKanbanDetail: false,
      isLoading: false,
      isAddCheckLoading: null, // object id, isLoading where id = item_check_kanban_id
      isCAddFinding: null, // object id, isCanAdd where id = item_check_kanban_id
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
      timeYokoten: false,
      optChanges: null,
      optDepartment: null,
      cmJudg: false,
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
      isFromFindingValidate: false,
      showErrorFindingPic: false,
      showErrorActualPic: false,
      planDateSubSchedule: null,
      isDirectUploadKaizen: false,
      is_change_sop: false,
      is_need_improvement: false,
      pic_supervisor_id: null,
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
      'getSystemsOptDept',
      'getUsersTreeselect2'
    ]),
    Users() {
      if (this.getUsersOpts) {
        let container = this.getUsersOpts.map((user) => {
          return {
            id: user.id,
            text: `${user.noreg}-${user.text}`,
          }
        })
        return container
      } else {
        return []
      }
    },
    loadedFinding() {
      // should set actual_pic_id = null cause duplicate object
      const result = this.getSubSchedulesCheck?.finding ?? {
        ...this.getOmSubSchedulesDetail,
        actual_pic_id: null,
      }

      return result
    },
    isEdit() {
      return this.selectedFindingID != null
    },
  },
  watch: {
    getSubSchedulesCheck: {
      handler() {
        console.log('getSubSchedulesCheck', this.getSubSchedulesCheck)
      },
    },
  },
  methods: {
    async getComments() {
      try {
        const response = await ApiService.query(
          `/operational/comments-4s/get`,
          {
            sub_schedule_id: this.$route?.params?.subScheduleID,
          },
        )
        // console.log(response)
        if (!response?.data?.data || response?.data?.data?.length === 0) return
        const noreg = localStorage.getItem('noreg')
        this.chatMessages = await response?.data?.data.map((comment) => {
          return {
            ...comment,
            role: comment.noreg === noreg ? 'user' : 'admin',
            created_at: moment(comment.created_at).format(
              'YYYY-MM-DD HH:mm:ss',
            ), // Format waktu
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    async sendMessage() {
      if (this.messageInput.trim()) {
        const name = localStorage.getItem('name')
        const noreg = localStorage.getItem('noreg')
        const now = moment().format('YYYY-MM-DD HH:mm:ss') // Waktu sekarang
        const newComment = {
          sub_schedule_id: this.$route?.params?.subScheduleID,
          comments: this.messageInput,
          created_dt: now,
          name,
          noreg,
        }

        try {
          await ApiService.post('/operational/comments-4s/add', newComment)
          this.messageInput = ''
          this.getComments()
        } catch (error) {
          console.error('Failed to post comment:', error)
          toast.error('Failed to send comment. Please try again.')
        }
      }
    },
    async getScheduleCheck() {
      this.showErrorActualPic = false
      this.showErrorFindingPic = false
      this.selectedFindingID = null //reset selected finding_id whenever this func triggered
      this.isLoading = true
      let objQuery = {
        sub_schedule_id: this.$route.params.subScheduleID,
      }
      await this.$store.dispatch(GET_SCHEDULES_CHECK, objQuery).then((res) => {
        if (res) {
          this.detailActualPIC = res.actual_pic_id
            ? res.actual_pic_id
            : res.pic_id
          this.detailActualDate = res.actual_time
            ? res.actual_time
            : res.plan_time
          this.gettingKanbanID = res.kanban_id
          this.itemCheks = res.item_check_kanbans
          this.isLoading = false
          this.planDateSubSchedule = res.plan_time
        }
      })
    },
    async saveScheduleCheck(
      selectedJudgementID,
      actualTime,
      itemCheckKanbanID,
      standartTime,
    ) {
      this.isAddCheckLoading = {
        isLoading: true,
        id: itemCheckKanbanID,
      }

      ApiService.setHeader()
      const data = {
        judgment_id: selectedJudgementID,
        main_schedule_id: this.$route.params.mainScheduleID,
        item_check_kanban_id: itemCheckKanbanID,
        actual_time: actualTime,
        //"checked_date": moment().toISOString().split('T')[0],
        checked_date: this.planDateSubSchedule,
        sub_schedule_id: this.$route.params.subScheduleID,
        standart_time: standartTime,
      }
      const judgments = await ApiService.post(
        `operational/4s/schedule-item-check-kanban/add`,
        data,
      )
      if (
        judgments.data.message == 'Success to add 4s schedule item check kanban'
      ) {
        toast.success('Success add data', {
          autoClose: 700,
        })

        this.isAddCheckLoading = {
          isLoading: false,
          id: itemCheckKanbanID,
        }

        this.selectedScheduleItemCheckKanbanID =
          judgments.data.data.schedule_item_check_kanban_id
        await this.getScheduleCheck()
      } else {
        alert('Failed add data')
      }
    },
    openAddFindingModal(scheduleItemCheckKanbanID, findings, actionType) {
      this.resetForm()

      this.findingActionType = actionType
      if (scheduleItemCheckKanbanID !== null) {
        this.selectedScheduleItemCheckKanbanID = scheduleItemCheckKanbanID
      }

      this.addFindingModal = true
    },
    openEditFindingModal(scheduleItemCheckKanbanID, findings, actionType) {
      if (this.$refs.finding_image) {
        this.$refs.finding_image.value = ''
      }

      if (this.$refs.kaizen_file) {
        this.$refs.kaizen_file.value = ''
      }

      this.selectedFindingID = findings[0]?.finding_id
      if (scheduleItemCheckKanbanID !== null) {
        this.selectedScheduleItemCheckKanbanID = scheduleItemCheckKanbanID
      }
      this.findingActionType = actionType
      const data = findings[0]
      console.log('clicked finding', data)

      this.selectedLineID = { line_name: data?.line_nm, line_id: data?.line_id }
      this.selectedFreqID = data?.freq_id
      this.selectedZoneID = data?.zone_id
      this.selectedKanbanID = data?.kanban_id

      this.selectedPIC =
        data?.finding_pic_id != null
          ? {
            pic_name: data?.finding_pic_nm,
            pic_id: data?.finding_pic_id,
          }
          : null
      this.findingDate = data?.finding_date
      this.findingDesc = data?.finding_desc
      this.planCMDate = data?.plan_cm_date
      this.planCMDesc = data?.plan_cm_desc
      this.timeCM = data?.time_cm
      this.timeYokoten = data?.time_yokoten ? data?.time_yokoten : false
      this.optChanges = data?.opt_changes
      this.optDepartment =
        data?.opt_depts != null ? data?.opt_depts.split(';') : null
      this.cmJudg = data?.cm_judg ? data?.cm_judg : false
      this.actualPIC =
        data?.actual_pic_id != null
          ? {
            pic_name: data.actual_pic_nm,
            pic_id: data.actual_pic_id,
          }
          : null
      this.actualCMDate = data?.actual_cm_date?.substring(0, 10)
      this.evaluationName = data?.evaluation_nm
      this.lineName = data?.line_nm
      this.findingPicName = data?.finding_pic_nm
      this.actualPicName = data?.actual_pic_nm
      this.pic_supervisor_id = data?.pic_supervisor_uuid

      this.addFindingModal = true
      if (data?.time_cm) {
        this.enabledReduceTime = true
      } else {
        this.enabledReduceTime = false
      }
    },
    async submit(event) {
      const findingData = {
        sub_schedule_id: this.$route.params.subScheduleID,
        schedule_item_check_kanban_id: this.selectedScheduleItemCheckKanbanID,
        // "line_id": this.selectedLineID.line_id,
        // "freq_id": this.selectedFreqID,
        // "zone_id": this.selectedZoneID,
        // "kanban_id": this.selectedKanbanID,
        // line_id: this.getSubSchedulesCheck?.line_id,
        // group_id: this.getSubSchedulesCheck?.group_id,
        // zone_id: this.getSubSchedulesCheck?.zone_id,
        // freq_id: this.getSubSchedulesCheck?.freq_id,
        // kanban_id: this.getSubSchedulesCheck?.kanban_id,
        finding_pic_id:
          this.selectedPIC && this.selectedPIC.pic_id != '-1'
            ? this.selectedPIC.pic_id
            : null,
        actual_pic_id:
          this.actualPIC && this.actualPIC.pic_id != '-1'
            ? this.actualPIC.pic_id
            : null,
        finding_date: this.findingDate,
        finding_desc: this.findingDesc,
        plan_cm_date: this.planCMDate,
        plan_cm_desc: this.planCMDesc,
        time_cm: +this.timeCM,
        time_yokoten: this.timeYokoten,
        opt_changes: this.optChanges,
        opt_depts:
          this.optDepartment?.length > 0 ? this.optDepartment.join(';') : null,
        cm_judg: this.cmJudg,
        actual_cm_date: this.actualCMDate,
        evaluation_nm: this.evaluationName,
        is_need_improvement: this.is_need_improvement,
        is_change_sop: this.is_change_sop,
        pic_supervisor_id: this.pic_supervisor_id
      }

      const saveFn = async (callback) => {
        if (event.currentTarget.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        } else {
          this.isLoadingSave = true
          await callback()
          this.isLoadingSave = false
        }

        this.isFromFindingValidate = true
      }

      if (this.isEdit) {
        this.showErrorActualPic = !this.actualPIC || this.actualPIC.id == '-1'
        if (this.showErrorActualPic) {
          this.isFromFindingValidate = true
          return
        }

        await saveFn(() => this.updateFinding(findingData))
      } else {
        // non core-ui validating

        this.showErrorFindingPic =
          !this.selectedPIC || this.selectedPIC?.id == '-1'
        if (this.showErrorFindingPic) {
          this.isFromFindingValidate = true
          return
        }

        await saveFn(() => this.addFinding(findingData))
      }
    },
    async addFinding(findingData) {
      try {
        ApiService.setHeader()
        const add = await ApiService.post(
          `operational/4s/finding/add`,
          findingData,
        )
        if (add.status === 200) {
          const { finding_id } = add.data.data
          if (!finding_id) {
            throw "Finding id not provide can't add finding image"
          }

          if (this.$refs.finding_image) {
            try {
              const formData = new FormData()
              formData.append('finding_id', finding_id)
              formData.append('dest', 'finding4s')
              formData.append('attachment', this.$refs.finding_image.files[0])

              await ApiService.post(
                `/operational/4s/finding/upload-image`,
                formData,
              )
            } catch (e) {
              console.log('error upload finding image', e)
            }
          }

          if (this.$refs.kaizen_file) {
            console.log('uploading finding kaizen')
            await this.uploadKaizen(finding_id)
          }

          toast.success('Success add data', {
            autoClose: 700,
          })

          this.addFindingModal = false
          await this.getScheduleCheck()
        } else {
          throw 'Failed to add finding'
        }
      } catch (error) {
        console.log(error)
        if (error?.response?.status == 401) this.$router.push('/login')
        toast.error(error?.response?.data?.message ?? error, {
          autoClose: 10000,
        })
      }
    },
    async updateFinding(findingData) {
      ApiService.setHeader()
      const update = await ApiService.put(
        `operational/4s/finding/edit/${this.selectedFindingID}`,
        findingData,
      )
      console.log('====================================')
      console.log('updateFinding4s', update)
      console.log('====================================')
      if (update.data.message == 'Success to edit 4s finding') {
        toast.success('Success edit data', {
          autoClose: 700,
        })

        await this.uploadFindingImage(this.selectedFindingID)

        this.addFindingModal = false
        await this.getScheduleCheck()
      } else {
        toast.error('Failed', {
          autoClose: 700,
        })
      }
    },
    async updateScheduleCheckData() {
      ApiService.setHeader()
      this.isUpdateCheckLoading = true
      const data = {
        actual_date: this.detailActualDate,
        actual_pic_id: this.detailActualPIC,
      }
      const updateData = await ApiService.put(
        `operational/4s/sub-schedule/edit/${this.$route.params.subScheduleID}`,
        data,
      )
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
      this.lineData = []
      this.getLinesOpts?.map((item) => {
        this.lineData.push({ line_id: item.id, line_name: item.text })
      })
    },
    mapUsersData() {
      this.picData = []
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
        system_type: '4S_OPT_CHANGE',
      }
      try {
        this.$store.dispatch(GET_SYSTEMS, objQuery).then((res) => {
          this.optChangeData = res
        })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getOptDeptSystem() {
      let objQuery = {
        system_type: '4S_OPT_DEPT',
      }
      try {
        this.$store.dispatch(GET_SYSTEMS, objQuery).then((res) => {
          this.optDeptData = res
        })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getEvaluation() {
      let objQuery = {
        system_type: '4S_EVALUATION',
      }
      try {
        this.$store.dispatch(GET_SYSTEMS, objQuery).then((res) => {
          this.optEvaluation = res
        })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    closeSelectFindingPic() {
      this.showErrorFindingPic =
        !this.selectedPIC || this.selectedPIC?.id == '-1'
    },
    closeSelectActualPic() {
      this.showErrorActualPic = !this.actualPIC || this.actualPIC?.id == '-1'
    },
    resetForm() {
      this.isDirectUploadKaizen = false
      this.selectedFindingID = null
      this.selectedPIC = null
      this.findingDate = moment().format('YYYY-MM-DD')
      this.findingDesc = null
      this.planCMDate = moment().format('YYYY-MM-DD')
      this.planCMDesc = null
      this.timeCM = null
      this.timeYokoten = false
      this.optChanges = null
      this.optDepartment = null
      this.cmJudg = false
      this.actualPIC = null
      this.actualCMDate = null
      this.evaluationName = null
      this.lineName = null
      this.findingPicName = null
      this.actualPicName = null
      this.enabledReduceTime = false
      this.pic_supervisor_id = null
    },
    async uploadKaizen(finding_id, kaizen_file = null) {
      if (!kaizen_file && !this.$refs.kaizen_file.files.length) {
        return
      }

      try {
        const formData = new FormData()
        formData.append('finding_id', finding_id)
        formData.append('dest', '4s-finding-kaizen')
        formData.append(
          'kaizen_file',
          kaizen_file ? kaizen_file : this.$refs.kaizen_file.files[0],
        )

        await ApiService.post(
          `/operational/4s/finding/upload-kaizen?dest=4s-finding-kaizen`,
          formData,
        )
      } catch (e) {
        console.log('uploadKaizen', e)
      }
    },
    async uploadFindingImage(finding_id, findingImage = null) {
      if (this.$refs.finding_image) {
        try {
          const formData = new FormData()
          formData.append('finding_id', finding_id)
          formData.append('dest', 'finding4s')
          formData.append(
            'attachment',
            findingImage ? findingImage : this.$refs.finding_image.files[0],
          )

          await ApiService.post(
            `/operational/4s/finding/upload-image`,
            formData,
          )
        } catch (e) {
          console.log('error upload finding image', e)
        }
      }
    },
    onClickDownloadKaizen(file) {
      window.open(file, '_blank').focus()
    },
    // eslint-disable-next-line no-unused-vars
    onClickDirectUploadKaizen(finding_id) {
      document.getElementById(finding_id).click()
    },
    async onChangeDirectKaizenFile(event, finding_id) {
      this.isLoading = true
      await this.uploadKaizen(finding_id, event.target.files[0])
      this.isLoading = false
      this.getScheduleCheck()
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
    await this.getComments()

    this.selectedFreqID = this.getSubSchedulesCheck?.freq_id
    this.selectedZoneID = this.getSubSchedulesCheck?.zone_id
    this.selectedKanbanID = this.getSubSchedulesCheck?.kanban_id
  },
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

.multiselect--disabled>.multiselect__tags,
.multiselect--disabled>.multiselect__tags>.multiselect__single,
.multiselect--disabled>.multiselect__select {
  background: #d8dbe0 !important;
}

.invalid .multiselect__tags {
  border-color: #f04124 !important;
}

.chat-card {
  width: 100%;
  margin-top: 10px;
  padding: 20px;
}

.comment-sh-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-box {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.chat-message {
  display: flex;
  margin: 10px 0;
  width: 100%;
}

.chat-left .message-bubble {
  background-color: #e9ecef;
  color: #333;
  margin-right: auto;
  border-radius: 15px 15px 15px 5px;
  padding: 10px;
  max-width: 80%;
}

.chat-right .message-bubble {
  background-color: #daf8cb;
  color: #333;
  margin-left: auto;
  border-radius: 15px 15px 5px 15px;
  padding: 10px;
  max-width: 80%;
}

.message-bubble {
  position: relative;
}

.timestamp {
  font-size: 0.8em;
  color: #888;
  margin-top: 5px;
  display: block;
  text-align: right;
}

.chat-input {
  display: flex;
  align-items: center;
  padding-top: 10px;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ddd;
}

.chat-input button {
  margin-left: 15px;
  padding: 8px 15px;
  border-radius: 20px;
}
</style>
